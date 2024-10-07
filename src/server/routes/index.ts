// imagekit controllers
import { imagekitAuthController } from "@/server/controllers/imagekit/auth"

// account controllers
import { deleteAccountsController } from "@/server/controllers/account/bulk-delete"
import { registerAccountController } from "@/server/controllers/account/register"
import { updateAccountController } from "@/server/controllers/account/update"
import { deleteAccountController } from "@/server/controllers/account/delete"
import { getAccountsController } from "@/server/controllers/account/get-all"
import { loginAccountController } from "@/server/controllers/account/login"
import { getAccountController } from "@/server/controllers/account/get"

// property controllers
import { deletePropertiesController } from "@/server/controllers/property/bulk-delete"
import { createPropertyController } from "@/server/controllers/property/create"
import { updatePropertyController } from "@/server/controllers/property/update"
import { getPropertiesController } from "@/server/controllers/property/get-all"
import { deletePropertyController } from "@/server/controllers/property/delete"
import { getPropertyController } from "@/server/controllers/property/get"

// appointment controllers
import { getAppointmentDatesController } from "@/server/controllers/appointment/get-dates"
import { deleteAppointmentDatesController } from "@/server/controllers/appointment/delete-date"
import { saveAppointmentDateController } from "@/server/controllers/appointment/save"
import { createAppointmentController } from "@/server/controllers/appointment/create"
import { getAppointmentsController } from "@/server/controllers/appointment/get-all"
import { deleteAppointmentController } from "@/server/controllers/appointment/delete"
import { updateAppointmentController } from "@/server/controllers/appointment/update"
import { getAppointmentController } from "@/server/controllers/appointment/get"

// payment controllers
import { deletePaymentsController } from "@/server/controllers/payment/bulk-delete"
import { createPaymentController } from "@/server/controllers/payment/create"
import { deletePaymentController } from "@/server/controllers/payment/delete"
import { updatePaymentController } from "@/server/controllers/payment/update"
import { getPaymentsController } from "@/server/controllers/payment/get-all"
import { getPaymentController } from "@/server/controllers/payment/get"

// types
import type { NextRequest, NextResponse } from "next/server"

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

export const routes: Record<HttpMethod, Route[]> = {
  GET: [
    { path: "/api/v1/auth/imagekit", handler: imagekitAuthController },
    { path: "/api/v1/auth/get", handler: getAccountController },
    { path: "/api/v1/auth/get-all", handler: getAccountsController },
    { path: "/api/v1/property/get-all", handler: getPropertiesController },
    { path: "/api/v1/property/get", handler: getPropertyController },
    {
      path: "/api/v1/appointment/get-all",
      handler: getAppointmentsController,
    },
    {
      path: "/api/v1/appointment/get-dates",
      handler: getAppointmentDatesController,
    },
    {
      path: "/api/v1/appointment/get",
      handler: getAppointmentController,
    },
    {
      path: "/api/v1/payment/get-all",
      handler: getPaymentsController,
    },
    {
      path: "/api/v1/payment/get",
      handler: getPaymentController,
    },
  ],
  POST: [
    { path: "/api/v1/auth/register", handler: registerAccountController },
    { path: "/api/v1/auth/login", handler: loginAccountController },
    { path: "/api/v1/auth/bulk-delete", handler: deleteAccountsController },
    { path: "/api/v1/property/create", handler: createPropertyController },
    {
      path: "/api/v1/property/bulk-delete",
      handler: deletePropertiesController,
    },
    {
      path: "/api/v1/appointment/create",
      handler: createAppointmentController,
    },
    {
      path: "/api/v1/appointment/save-date",
      handler: saveAppointmentDateController,
    },
    {
      path: "/api/v1/payment/create",
      handler: createPaymentController,
    },
    {
      path: "/api/v1/payment/bulk-delete",
      handler: deletePaymentsController,
    },
  ],
  PATCH: [
    { path: "/api/v1/auth/update", handler: updateAccountController },
    { path: "/api/v1/property/update", handler: updatePropertyController },
    {
      path: "/api/v1/appointments/update",
      handler: updateAppointmentController,
    },
    {
      path: "/api/v1/payment/update",
      handler: updatePaymentController,
    },
  ],
  DELETE: [
    { path: "/api/v1/auth/delete", handler: deleteAccountController },
    { path: "/api/v1/property/delete", handler: deletePropertyController },
    {
      path: "/api/v1/appointments/delete-date",
      handler: deleteAppointmentDatesController,
    },
    {
      path: "/api/v1/appointments/delete",
      handler: deleteAppointmentController,
    },
    {
      path: "/api/v1/payment/delete",
      handler: deletePaymentController,
    },
  ],
}
