import { getDocs, collection, query, where, orderBy } from "firebase/firestore"
import { convertTimestampToDateString } from "@/lib/utils"
import { handleErrorResponse } from "@/lib/helpers"
import { NextResponse } from "next/server"
import { firestore } from "@/lib/config/firebase"
import { getSession } from "@/lib/actions/session/get"
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
    const locationQuery = searchParams.get("query")

    const propertiesCollection = collection(firestore, "properties")

    let propertiesQuery: any = propertiesCollection

    // Handle filtering and ordering based on provided query parameters
    if (locationQuery) {
      propertiesQuery = query(
        propertiesCollection,
        where("location", ">=", locationQuery),
        where("location", "<=", `${locationQuery}\uf8ff`),
        orderBy("location"),
      )
    }

    // Fetch all properties
    const propertiesSnapshot = await getDocs(propertiesQuery)
    const totalCount = propertiesSnapshot.docs.length

    // If no pagination or query parameters, return all properties
    if (!page && !limit && !locationQuery) {
      const properties = propertiesSnapshot.docs.map((doc) => {
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
    const properties = propertiesSnapshot.docs
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
