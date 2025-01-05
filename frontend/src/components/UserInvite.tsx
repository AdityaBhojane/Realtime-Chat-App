import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserInvite() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (username.trim() !== "") {
      // Navigate to /chat and pass the username
      navigate("/chat", { state: { username } });
    } else {
      alert("Please enter a username!");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to Chat App</h1>
      <input
        type="text"
        placeholder="Enter your username"
        className="p-2 border-2 rounded-lg w-64 mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={handleStartChat}
      >
        Start Chat
      </button>
    </div>
  );
}
