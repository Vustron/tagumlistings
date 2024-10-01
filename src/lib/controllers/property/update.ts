// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { UpdatePropertyValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { Property } from "@/lib/types"

export async function updatePropertyController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updatePropertyBody =
      await requestBodyHandler<UpdatePropertyValues>(request)

    const { id, category, location, status, propertyPics } = updatePropertyBody

    const requiredFields: (keyof typeof updatePropertyBody)[] = [
      "id",
      "category",
      "location",
      "status",
      "propertyPics",
    ]

    const errorResponse = checkRequiredFields(
      updatePropertyBody,
      requiredFields,
    )

    if (errorResponse) return errorResponse

    const propertyRef = doc(firestore, "properties", id!)
    await updateDoc(propertyRef, {
      category,
      location,
      status,
      propertyPics,
      updatedAt: serverTimestamp(),
    })

    const updatedPropertySnapshot = await getDoc(propertyRef)
    const updatedProperty = updatedPropertySnapshot.data() as Property

    return NextResponse.json(updatedProperty, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
