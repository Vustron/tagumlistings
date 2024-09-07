export type Property = {
  id: string
  category: string
  location: string
  status: string
  user_id: string
  appointment_id: string | null
  propertyPics?: string[] | null
  created_at?: string
  updated_at?: string
}

export const properties: Property[] = [
  {
    id: "1",
    category: "Residential",
    location: "123 Main St, Anytown, USA",
    status: "sold",
    user_id: "user123",
    appointment_id: null,
    propertyPics: ["/images/image1.jpg", "/images/image2.jpg"],
    created_at: "2023-06-01T10:00:00Z",
    updated_at: "2023-06-01T10:00:00Z",
  },
  {
    id: "2",
    category: "Commercial",
    location: "456 Business Ave, Metropolis, USA",
    status: "sold",
    user_id: "user456",
    appointment_id: "appt789",
    propertyPics: ["/images/image3.jpg", "/images/image4.jpg"],
    created_at: "2023-06-02T11:30:00Z",
    updated_at: "2023-06-03T09:15:00Z",
  },
  {
    id: "3",
    category: "Industrial",
    location: "789 Factory Rd, Industrial Park, USA",
    status: "sold",
    user_id: "user789",
    appointment_id: null,
    propertyPics: ["/images/image1.jpg", "/images/image2.jpg"],
    created_at: "2023-06-03T14:45:00Z",
    updated_at: "2023-06-05T16:20:00Z",
  },
  {
    id: "4",
    category: "Residential",
    location: "101 Oak St, Suburbia, USA",
    status: "reserved",
    user_id: "user234",
    appointment_id: "appt567",
    propertyPics: ["/images/image3.jpg", "/images/image4.jpg"],
    created_at: "2023-06-04T09:00:00Z",
    updated_at: "2023-06-04T09:00:00Z",
  },
  {
    id: "5",
    category: "Commercial",
    location: "202 Retail Blvd, Shopping District, USA",
    status: "reserved",
    user_id: "user567",
    appointment_id: null,
    propertyPics: ["/images/image1.jpg", "/images/image2.jpg"],
    created_at: "2023-06-05T13:20:00Z",
    updated_at: "2023-06-06T10:10:00Z",
  },
  {
    id: "6",
    category: "Residential",
    location: "303 Pine Ave, Woodland, USA",
    status: "reserved",
    user_id: "user890",
    appointment_id: "appt234",
    propertyPics: ["/images/image3.jpg", "/images/image4.jpg"],
    created_at: "2023-06-06T16:45:00Z",
    updated_at: "2023-06-07T11:30:00Z",
  },
  {
    id: "7",
    category: "Commercial",
    location: "404 Tech Lane, Silicon Valley, USA",
    status: "reserved",
    user_id: "user345",
    appointment_id: null,
    propertyPics: ["/images/image1.jpg", "/images/image2.jpg"],
    created_at: "2023-06-07T08:15:00Z",
    updated_at: "2023-06-07T08:15:00Z",
  },
  {
    id: "8",
    category: "Industrial",
    location: "505 Logistics Way, Port City, USA",
    status: "reserved",
    user_id: "user678",
    appointment_id: "appt901",
    propertyPics: ["/images/image3.jpg", "/images/image4.jpg"],
    created_at: "2023-06-08T11:00:00Z",
    updated_at: "2023-06-09T14:20:00Z",
  },
  {
    id: "9",
    category: "Residential",
    location: "606 Beach Rd, Coastal Town, USA",
    status: "sold",
    user_id: "user901",
    appointment_id: null,
    propertyPics: ["/images/image1.jpg", "/images/image2.jpg"],
    created_at: "2023-06-09T15:30:00Z",
    updated_at: "2023-06-09T15:30:00Z",
  },
  {
    id: "10",
    category: "Commercial",
    location: "707 Restaurant Row, Foodie City, USA",
    status: "sold",
    user_id: "user012",
    appointment_id: "appt345",
    propertyPics: ["/images/image3.jpg", "/images/image4.jpg"],
    created_at: "2023-06-10T12:00:00Z",
    updated_at: "2023-06-12T09:45:00Z",
  },
]
