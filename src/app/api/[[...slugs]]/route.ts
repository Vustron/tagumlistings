// utils
import { handleRequest } from "@/server/helpers"

// types
import type { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request, "GET")
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request, "POST")
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request, "PATCH")
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request, "DELETE")
}
