import {
  BellPlus,
  BookMarked,
  CircleDollarSign,
  MapPinHouse,
} from "lucide-react"

export const dashboardItems = [
  {
    id: "1",
    title: "Total Properties",
    amount: "120",
    percentageChange: "+5.01% from last month",
    icon: <MapPinHouse className="size-4 text-muted-foreground" />,
  },
  {
    id: "2",
    title: "Reserved",
    amount: "20",
    percentageChange: "+5 this week",
    icon: <BookMarked className="size-4 text-muted-foreground" />,
  },
  {
    id: "3",
    title: "Sold",
    amount: "42",
    percentageChange: "+10 from last month",
    icon: <CircleDollarSign className="size-4 text-muted-foreground" />,
  },
  {
    id: "4",
    title: "Appointments",
    amount: "+69",
    percentageChange: "+4 since last hour",
    icon: <BellPlus className="size-4 text-muted-foreground" />,
  },
]

export const appointmentsData = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatarSrc: "/avatars/01.png",
    avatarFallback: "OM",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatarSrc: "/avatars/02.png",
    avatarFallback: "JL",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatarSrc: "/avatars/03.png",
    avatarFallback: "IN",
  },
  {
    id: "4",
    name: "William Kim",
    email: "will@email.com",
    avatarSrc: "/avatars/04.png",
    avatarFallback: "WK",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatarSrc: "/avatars/05.png",
    avatarFallback: "SD",
  },
]
