'use client'

import { useState } from 'react'
import { Send, Menu } from 'lucide-react'

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

type Contact = {
  id: number
  name: string
  avatar: string
  lastMessage: string
}

const initialMessages: Message[] = [
  { id: 1, sender: 'Alice', content: 'Hey, how are you?', timestamp: '10:00 AM' },
  { id: 2, sender: 'You', content: 'I\'m good, thanks! How about you?', timestamp: '10:05 AM' },
  { id: 3, sender: 'Alice', content: 'Doing well! Did you finish the project?', timestamp: '10:10 AM' },
]

const contacts: Contact[] = [
  { id: 1, name: 'Alice', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Did you finish the project?' },
  { id: 2, name: 'Bob', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'See you tomorrow!' },
  { id: 3, name: 'Charlie', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thanks for your help!' },
]

export default function MessageWindow() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'You',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-700 text-white">
      {/* Sidebar */}
      <div className={`bg-[#1f1f1f] w-64 flex-shrink-0  ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 ">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-5rem)] ">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 my-2  cursor-pointer hover:bg-gray-900 ${selectedContact.id === contact.id ? 'bg-gray-800' : 'bg-slate-700'}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="ml-3">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col text-white">
        {/* Chat Header */}
        <div className="bg-[#5c5c5c] p-4 flex items-center">
          <button 
            className="md:hidden mr-2 p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="ml-3 text-xl font-semibold">{selectedContact.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-xs ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-800'}`}>
                <p>{message.content}</p>
                <span className="text-xs mt-1 opacity-75 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-[#484848]  p-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 mr-2 p-2  bg-slate-500  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

