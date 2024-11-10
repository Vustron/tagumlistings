// utils
import {
  doc,
  getDoc,
  getDocs,
  writeBatch,
  collection,
} from "firebase/firestore"
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { deleteObject, ref } from "firebase/storage"
import { requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// configs
import { firestore, firebaseStorage } from "@/lib/config/firebase"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { DocumentData, QuerySnapshot } from "firebase/firestore"
import type { NextRequest } from "next/server"
import type { Property } from "@/lib/types"

export async function deletePropertiesController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { ids } = await requestBodyHandler<{ ids: string[] }>(request)

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 })
    }

    const batch = writeBatch(firestore)
    const imageDeletePromises: Promise<void>[] = []

    for (const id of ids) {
      const propertyRef = doc(firestore, "properties", id)
      const propertySnap = await getDoc(propertyRef)

      if (propertySnap.exists()) {
        const propertyData = propertySnap.data() as Property

        if (propertyData.propertyPics && propertyData.propertyPics.length > 0) {
          for (const pic of propertyData.propertyPics) {
            if (pic.url) {
              const imageRef = ref(firebaseStorage, pic.url)
              imageDeletePromises.push(deleteObject(imageRef))
            }
          }
        }

        batch.delete(propertyRef)
      }
    }

    await Promise.all([batch.commit(), ...imageDeletePromises])

    const propertiesCollection = collection(firestore, "properties")
    const querySnapshot: QuerySnapshot<DocumentData> =
      await getDocs(propertiesCollection)
    const remainingProperties: Property[] = []

    for (const doc of querySnapshot.docs) {
      remainingProperties.push({ id: doc.id, ...doc.data() } as Property)
    }

    return NextResponse.json(
      {
        properties: remainingProperties,
      },
      { status: 200 },
    )
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
