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
  { label: "Users", href: "/admin/users" },
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
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Appointment" },
]

// records
export const recordsItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Records" },
]

// record
export const recordItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Records", href: "/admin/records" },
  { label: "Record" },
]

// add payment
export const addPaymentItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
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
  { label: "Properties", href: "/admin/properties" },
  { label: "Add Property" },
]

// property
export const propertyItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Property" },
]

// messages
export const messagesItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Messages" },
]

// reports
export const reportItems: BreadcrumbItemProps[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Reports" },
]
