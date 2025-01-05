import { Route, Routes } from "react-router-dom"
import UserInvite from "./components/UserInvite"
import MessageWindow from "./components/MessagesWindow"


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserInvite/>} />
      <Route path="/chat" element={<MessageWindow/>} />
    </Routes>
  )
}

export default App