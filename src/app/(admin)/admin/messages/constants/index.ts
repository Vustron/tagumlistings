export type Client = {
  id: string
  name: string
  email: string
  messages: {
    id: string
    content: string
    senderId: string
    timestamp: number
  }[]
}

export const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    messages: [
      {
        id: "1",
        content: "Hello, I have a question about my account.",
        timestamp: Date.now() - 3600000,
        senderId: "1",
      },
      {
        id: "2",
        content: "Hi John, I'd be happy to help. What's your question?",
        timestamp: Date.now() - 3540000,
        senderId: "admin",
      },
      {
        id: "3",
        content:
          "I can't seem to update my billing information. Can you assist?",
        timestamp: Date.now() - 3480000,
        senderId: "1",
      },
      {
        id: "4",
        content:
          "Of course! I can guide you through the process. First, can you tell me which part you're having trouble with?",
        timestamp: Date.now() - 3420000,
        senderId: "admin",
      },
      {
        id: "5",
        content:
          "When I try to save my new credit card details, I get an error message.",
        timestamp: Date.now() - 3360000,
        senderId: "1",
      },
      {
        id: "6",
        content:
          "I see. Can you provide the exact error message you're seeing?",
        timestamp: Date.now() - 3300000,
        senderId: "admin",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    messages: [
      {
        id: "7",
        content: "Hi, I'm having issues with my recent order #12345.",
        timestamp: Date.now() - 7200000,
        senderId: "2",
      },
      {
        id: "8",
        content:
          "Hello Jane, I'm sorry to hear that. Can you please provide more details about the issue?",
        timestamp: Date.now() - 7140000,
        senderId: "admin",
      },
      {
        id: "9",
        content: "The package arrived, but one item is missing.",
        timestamp: Date.now() - 7080000,
        senderId: "2",
      },
      {
        id: "10",
        content:
          "I apologize for the inconvenience. Let me check your order details. Which item is missing?",
        timestamp: Date.now() - 7020000,
        senderId: "admin",
      },
      {
        id: "11",
        content: "The red t-shirt in size medium is not in the package.",
        timestamp: Date.now() - 6960000,
        senderId: "2",
      },
      {
        id: "12",
        content:
          "Thank you for the information. I'll look into this right away and get back to you with a solution.",
        timestamp: Date.now() - 6900000,
        senderId: "admin",
      },
    ],
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    messages: [
      {
        id: "13",
        content: "Good morning! I'm interested in upgrading my subscription.",
        timestamp: Date.now() - 86400000,
        senderId: "3",
      },
      {
        id: "14",
        content:
          "Good morning Alice! That's great to hear. Which plan are you currently on, and which one are you considering?",
        timestamp: Date.now() - 86340000,
        senderId: "admin",
      },
      {
        id: "15",
        content:
          "I'm on the basic plan, and I'm thinking about the premium plan.",
        timestamp: Date.now() - 86280000,
        senderId: "3",
      },
      {
        id: "16",
        content:
          "Excellent choice! The premium plan offers several additional features. Would you like me to go over the benefits?",
        timestamp: Date.now() - 86220000,
        senderId: "admin",
      },
      {
        id: "17",
        content:
          "Yes, please. I'm particularly interested in the advanced reporting features.",
        timestamp: Date.now() - 86160000,
        senderId: "3",
      },
      {
        id: "18",
        content:
          "Of course! The premium plan includes real-time analytics, custom report builders, and data export options. Let me explain each in detail...",
        timestamp: Date.now() - 86100000,
        senderId: "admin",
      },
    ],
  },
]
