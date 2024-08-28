"use client"

// components
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, Menu, SendHorizontal, X } from "lucide-react"

// hooks
import { useEffect, useState } from "react"

// utils
import { clients } from "@/app/(admin)/messages/constants"

// types
import type { Client } from "@/app/(admin)/messages/constants"
import type React from "react"

const MessagesClient = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSendMessage = (): void => {
    if (message.trim() && selectedClient) {
      // In a real app, you'd send this message to your backend
      console.log(`Sending message to ${selectedClient.name}: ${message}`)
      setMessage("")
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <Card className="rounded-lg border-none mt-6 h-[calc(100vh-100px)]">
      <CardContent className="p-0 h-full">
        <div className="flex h-full bg-background">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "w-full md:w-1/3" : "w-0 md:w-16"
            } border-r border-border transition-all duration-300 ease-in-out flex flex-col ${
              isMobile && !isSidebarOpen ? "hidden" : "absolute md:relative"
            } z-10 bg-background h-full`}
          >
            <div className="p-2 flex justify-between items-center">
              <Button
                onClick={toggleSidebar}
                className="w-12 h-12 flex justify-center items-center bg-green-500 hover:bg-green-400"
              >
                {isSidebarOpen ? (
                  isMobile ? (
                    <X className="text-white" size={32} />
                  ) : (
                    <Menu className="text-white" size={32} />
                  )
                ) : (
                  <ArrowRight className="text-white" size={32} />
                )}
              </Button>
              {isSidebarOpen && (
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 flex-grow"
                />
              )}
            </div>
            <ScrollArea className="flex-grow">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`hover:bg-green-400 hover:text-white flex items-center p-2 cursor-pointer hover:bg-accent rounded-md ${
                    selectedClient?.id === client.id
                      ? "bg-accent text-white"
                      : ""
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                  onClick={() => {
                    setSelectedClient(client)
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                >
                  <Avatar className="w-10 h-10 border flex-shrink-0 bg-white">
                    <div className="font-semibold flex items-center justify-center w-full h-full text-black truncate">
                      {getInitials(client.name)}
                    </div>
                  </Avatar>
                  {isSidebarOpen && (
                    <span className="ml-3 truncate">{client.name}</span>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Main content */}
          <div className="flex-grow flex flex-col">
            {selectedClient ? (
              <>
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedClient.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
                  </div>
                  {isMobile && (
                    <Button
                      onClick={toggleSidebar}
                      className="md:hidden w-12 h-12 flex justify-center items-center bg-green-500 hover:bg-green-400"
                    >
                      <Menu className="text-white" size={32} />
                    </Button>
                  )}
                </div>
                <ScrollArea className="flex-grow p-4 bg-accent/10">
                  {selectedClient.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                        msg.senderId === selectedClient.id
                          ? "dark:bg-green-400 bg-green-500 dark:text-white text-primary-foreground"
                          : "bg-blue-400 dark:bg-secondary text-white ml-auto"
                      }`}
                    >
                      {msg.content}
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-4 border-t border-border flex">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow mr-2"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-green-600 text-white hover:bg-green-400"
                  >
                    <SendHorizontal size={24} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a client to start messaging
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MessagesClient
