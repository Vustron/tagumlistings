// utils
import {
  findAccountByParams,
  getAccountsFromDB,
  handleErrorResponse,
} from "@/server/helpers"
import { NextResponse } from "next/server"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function getAccountController(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const databaseKey = "accounts"
    const accounts: UserData[] = await getAccountsFromDB(databaseKey)

    const { account, response } = await findAccountByParams(accounts, "id", id)
    if (response) return response

    return NextResponse.json(account, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
