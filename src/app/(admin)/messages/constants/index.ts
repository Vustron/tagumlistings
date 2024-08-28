type Message = {
  id: string
  content: string
  timestamp: Date
  senderId: string
}

export type Client = {
  id: string
  name: string
  email: string
  messages: Message[]
}

export const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com", // Client email
    messages: [
      { id: "1", content: "Hello", timestamp: new Date(), senderId: "1" },
      {
        id: "2",
        content: "How are you?",
        timestamp: new Date(),
        senderId: "1",
      },
      {
        id: "3",
        content: "I am fine, thank you!",
        timestamp: new Date(),
        senderId: "admin",
      }, // Admin reply
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com", // Client email
    messages: [
      { id: "4", content: "Hi there", timestamp: new Date(), senderId: "2" },
      {
        id: "5",
        content: "Can you help me?",
        timestamp: new Date(),
        senderId: "2",
      },
      {
        id: "6",
        content: "Sure, what do you need help with?",
        timestamp: new Date(),
        senderId: "admin",
      }, // Admin reply
    ],
  },
  // Add more clients as needed
]
