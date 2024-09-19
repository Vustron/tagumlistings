// types
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { User } from "@/app/(admin)/_components/data/users"

export type Payments = {
  id: string
  property: Property
  user: User
  appointment: string // TODO: add appointment type
  amount: string
  paid_date: string
}

export const payments: Payments[] = [
  {
    id: "1",
    property: {
      id: "prop1",
      category: "Apartment",
      location: "New York",
      status: "Available",
      user_id: "user1",
      appointment_id: "apt1",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-02T14:30:00Z",
    },
    user: {
      id: 1,
      name: "John Doe",
      username: "johnd",
      email: "john@example.com",
      role: "tenant",
      created_at: "2023-12-01T09:00:00Z",
      updated_at: "2024-01-15T11:20:00Z",
    },
    appointment: "2024-02-15T13:00:00Z",
    amount: "1500.00",
    paid_date: "2024-02-10T09:30:00Z",
  },
  {
    id: "2",
    property: {
      id: "prop2",
      category: "House",
      location: "Los Angeles",
      status: "Rented",
      user_id: "user2",
      appointment_id: "apt2",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-05T11:00:00Z",
      updated_at: "2024-01-06T16:45:00Z",
    },
    user: {
      id: 2,
      name: "Jane Smith",
      username: "janes",
      email: "jane@example.com",
      role: "landlord",
      created_at: "2023-12-10T10:30:00Z",
      updated_at: "2024-01-20T13:15:00Z",
    },
    appointment: "2024-02-20T14:30:00Z",
    amount: "2000.00",
    paid_date: "2024-02-18T10:00:00Z",
  },
  {
    id: "3",
    property: {
      id: "prop3",
      category: "Condo",
      location: "Chicago",
      status: "Available",
      user_id: "user3",
      appointment_id: null,
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-10T09:30:00Z",
      updated_at: "2024-01-11T15:20:00Z",
    },
    user: {
      id: 3,
      name: "Bob Johnson",
      username: "bobj",
      email: "bob@example.com",
      role: "tenant",
      created_at: "2023-12-15T11:45:00Z",
      updated_at: "2024-01-25T14:10:00Z",
    },
    appointment: "2024-02-25T10:00:00Z",
    amount: "1800.00",
    paid_date: "2024-02-22T11:30:00Z",
  },
  {
    id: "4",
    property: {
      id: "prop4",
      category: "Apartment",
      location: "Miami",
      status: "Rented",
      user_id: "user4",
      appointment_id: "apt4",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-15T13:00:00Z",
      updated_at: "2024-01-16T17:30:00Z",
    },
    user: {
      id: 4,
      name: "Alice Brown",
      username: "aliceb",
      email: "alice@example.com",
      role: "landlord",
      created_at: "2023-12-20T14:00:00Z",
      updated_at: "2024-01-30T16:45:00Z",
    },
    appointment: "2024-03-01T15:30:00Z",
    amount: "1700.00",
    paid_date: "2024-02-28T09:00:00Z",
  },
  {
    id: "5",
    property: {
      id: "prop5",
      category: "House",
      location: "Seattle",
      status: "Available",
      user_id: "user5",
      appointment_id: null,
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-20T10:30:00Z",
      updated_at: "2024-01-21T14:15:00Z",
    },
    user: {
      id: 5,
      name: "Charlie Wilson",
      username: "charliew",
      email: "charlie@example.com",
      role: "tenant",
      created_at: "2023-12-25T16:30:00Z",
      updated_at: "2024-02-05T11:20:00Z",
    },
    appointment: "2024-03-05T11:00:00Z",
    amount: "2200.00",
    paid_date: "2024-03-01T10:30:00Z",
  },
  {
    id: "6",
    property: {
      id: "prop6",
      category: "Condo",
      location: "Boston",
      status: "Rented",
      user_id: "user6",
      appointment_id: "apt6",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-25T14:45:00Z",
      updated_at: "2024-01-26T18:00:00Z",
    },
    user: {
      id: 6,
      name: "Diana Miller",
      username: "dianam",
      email: "diana@example.com",
      role: "landlord",
      created_at: "2024-01-01T09:15:00Z",
      updated_at: "2024-02-10T13:30:00Z",
    },
    appointment: "2024-03-10T14:00:00Z",
    amount: "1900.00",
    paid_date: "2024-03-05T11:45:00Z",
  },
  {
    id: "7",
    property: {
      id: "prop7",
      category: "Apartment",
      location: "San Francisco",
      status: "Available",
      user_id: "user7",
      appointment_id: null,
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-01-30T11:30:00Z",
      updated_at: "2024-01-31T15:45:00Z",
    },
    user: {
      id: 7,
      name: "Ethan Davis",
      username: "ethand",
      email: "ethan@example.com",
      role: "tenant",
      created_at: "2024-01-05T10:45:00Z",
      updated_at: "2024-02-15T14:20:00Z",
    },
    appointment: "2024-03-15T16:30:00Z",
    amount: "2100.00",
    paid_date: "2024-03-10T09:15:00Z",
  },
  {
    id: "8",
    property: {
      id: "prop8",
      category: "House",
      location: "Denver",
      status: "Rented",
      user_id: "user8",
      appointment_id: "apt8",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-02-05T13:15:00Z",
      updated_at: "2024-02-06T17:30:00Z",
    },
    user: {
      id: 8,
      name: "Fiona Taylor",
      username: "fionat",
      email: "fiona@example.com",
      role: "landlord",
      created_at: "2024-01-10T12:00:00Z",
      updated_at: "2024-02-20T15:45:00Z",
    },
    appointment: "2024-03-20T11:30:00Z",
    amount: "2300.00",
    paid_date: "2024-03-15T10:00:00Z",
  },
  {
    id: "9",
    property: {
      id: "prop9",
      category: "Condo",
      location: "Austin",
      status: "Available",
      user_id: "user9",
      appointment_id: null,
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-02-10T09:45:00Z",
      updated_at: "2024-02-11T14:00:00Z",
    },
    user: {
      id: 9,
      name: "George Robinson",
      username: "georger",
      email: "george@example.com",
      role: "tenant",
      created_at: "2024-01-15T13:30:00Z",
      updated_at: "2024-02-25T16:15:00Z",
    },
    appointment: "2024-03-25T13:00:00Z",
    amount: "1600.00",
    paid_date: "2024-03-20T11:30:00Z",
  },
  {
    id: "10",
    property: {
      id: "prop10",
      category: "Apartment",
      location: "Washington D.C.",
      status: "Rented",
      user_id: "user10",
      appointment_id: "apt10",
      propertyPics: [{ url: "pic1.jpg" }],
      created_at: "2024-02-15T12:00:00Z",
      updated_at: "2024-02-16T16:15:00Z",
    },
    user: {
      id: 10,
      name: "Hannah Lee",
      username: "hannahl",
      email: "hannah@example.com",
      role: "landlord",
      created_at: "2024-01-20T15:00:00Z",
      updated_at: "2024-03-01T10:30:00Z",
    },
    appointment: "2024-03-30T15:00:00Z",
    amount: "2000.00",
    paid_date: "2024-03-25T09:45:00Z",
  },
]
