// utils
import { getDocs, collection, query, where, orderBy } from "firebase/firestore"
import { convertTimestampToDateString } from "@/lib/utils"
import { handleErrorResponse } from "@/lib/helpers"
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
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 9
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

    // Fetch all properties to get total count
    const propertiesSnapshot = await getDocs(propertiesQuery)
    const totalCount = propertiesSnapshot.docs.length

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

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
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
