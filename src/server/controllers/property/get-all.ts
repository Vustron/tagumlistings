// utils
import { convertTimestampToDateString } from "@/lib/utils"
import { getDocs, collection } from "firebase/firestore"
import { handleErrorResponse } from "@/server/helpers"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { NextRequest } from "next/server"

export async function getPropertiesController(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")
    const locationQuery = searchParams.get("query")?.toLowerCase()

    const propertiesCollection = collection(firestore, "properties")

    // Fetch all properties first
    const propertiesSnapshot = await getDocs(propertiesCollection)

    // Filter properties based on the query
    let filteredDocs = propertiesSnapshot.docs
    if (locationQuery) {
      filteredDocs = propertiesSnapshot.docs.filter((doc) => {
        const data = doc.data()
        const location = data.location?.toLowerCase() || ""

        // Check if the location contains the query string
        return location.includes(locationQuery)
      })
    }

    const totalCount = filteredDocs.length

    // If no pagination parameters, return all filtered properties
    if (!page && !limit) {
      const properties = filteredDocs.map((doc) => {
        const data = doc.data() as { [key: string]: any }
        return {
          id: doc.id,
          ...(typeof data === "object" && data !== null ? data : {}),
          created_at: data.created_at
            ? convertTimestampToDateString(data.created_at)
            : null,
          updated_at: data.updated_at
            ? convertTimestampToDateString(data.updated_at)
            : null,
        }
      })

      return NextResponse.json({ properties }, { status: 200 })
    }

    // Calculate pagination
    const pageNumber = Number(page) || 1
    const limitNumber = Number(limit) || 9
    const startIndex = (pageNumber - 1) * limitNumber
    const endIndex = startIndex + limitNumber

    // Map and paginate properties
    const properties = filteredDocs
      .map((doc) => {
        const data = doc.data() as { [key: string]: any }
        return {
          id: doc.id,
          ...(typeof data === "object" && data !== null ? data : {}),
          created_at: data.created_at
            ? convertTimestampToDateString(data.created_at)
            : null,
          updated_at: data.updated_at
            ? convertTimestampToDateString(data.updated_at)
            : null,
        }
      })
      .slice(startIndex, endIndex)

    // Return paginated data with metadata
    return NextResponse.json(
      {
        properties,
        pagination: {
          total: totalCount,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
