// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { NextResponse } from "next/server"

// configs
import { firestore, firebaseStorage } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { DocumentData, QuerySnapshot } from "firebase/firestore"
import type { NextRequest } from "next/server"
import type { Property } from "@/lib/types"

export async function deletePropertyController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const propertyRef = doc(firestore, "properties", id)
    const propertySnapshot = await getDoc(propertyRef)

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const propertyData = propertySnapshot.data() as Property

    if (propertyData.propertyPics && propertyData.propertyPics.length > 0) {
      for (const pic of propertyData.propertyPics) {
        const imageRef = ref(firebaseStorage, pic.url)
        await deleteObject(imageRef).catch((error) => {
          console.error("Failed to delete image:", pic.url, error)
        })
      }
    }

    await deleteDoc(propertyRef)

    const propertiesCollection = collection(firestore, "properties")
    const querySnapshot: QuerySnapshot<DocumentData> =
      await getDocs(propertiesCollection)
    const remainingProperties: Property[] = []

    for (const doc of querySnapshot.docs) {
      remainingProperties.push({ id: doc.id, ...doc.data() } as Property)
    }

    return NextResponse.json("Deleted Successfully", { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
