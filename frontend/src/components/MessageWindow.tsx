import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Send } from "lucide-react";

const socket = io("http://localhost:3001");

type User = { id: string; name: string };
type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export default function MessageWindow() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!username) {
      // Redirect back to home if username is missing
      navigate("/");
      return;
    }

    // Join chat with the provided username
    socket.emit("join", username);

    // Listen for updated user list
    const handleUserList = (userList: User[]) => {
      setUsers(userList.filter((user) => user.name !== username)); // Exclude self
    };
    socket.on("userList", handleUserList);

    // Listen for incoming messages
    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("receiveMessage", handleMessage);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("userList", handleUserList);
      socket.off("receiveMessage", handleMessage);
    };
  }, [username, navigate]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "" && selectedUser) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: username,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Emit message to the backend
      socket.emit("sendMessage", {
        to: selectedUser.name,
        from: username,
        content: inputMessage,
      });

      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-700 text-white">
      {/* Sidebar */}
      <div className="bg-gray-800 w-64">
        <h2 className="text-xl font-semibold p-4">Users</h2>
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {users.map((user) => (
            <div
              key={user.id}
              className={`cursor-pointer p-3 ${selectedUser?.id === user.id ? "bg-gray-600" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-900 p-4">
          <h2 className="text-xl">{selectedUser?.name || "Select a user to chat"}</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === username ? "text-right" : "text-left"}`}>
              <div className={`inline-block p-2 rounded-lg ${message.sender === username ? "bg-blue-500" : "bg-gray-800"}`}>
                <p>{message.content}</p>
                <span className="text-xs block">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 p-2 rounded bg-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="ml-2 bg-blue-600 p-2 rounded hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
