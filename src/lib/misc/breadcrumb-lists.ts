interface BreadcrumbItemProps {
  label: string
  href?: string
}

// dashboard
export const dashboardItems: BreadcrumbItemProps[] = [{ label: "Dashboard" }]

// account
export const accountItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Account" },
]

// users
export const usersItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users" },
]

// user
export const userItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/users" },
  { label: "User" },
]

// appointments
export const appointmentsItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Appointments" },
]

// appointment
export const appointmentItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Appointments", href: "/appointments" },
  { label: "Appointment" },
]

// payments
export const paymentsItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Payments" },
]

// payment
export const paymentItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Payment", href: "/payments" },
  { label: "Payment" },
]

// add payment
export const addPaymentItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Payment", href: "/payments" },
  { label: "Add Payment" },
]

// properties
export const propertiesItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties" },
]

// addProperties
export const addPropertiesItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/properties" },
  { label: "Add Property" },
]

// property
export const propertyItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/properties" },
  { label: "Property" },
]

// messages
export const messagesItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Messages" },
]
