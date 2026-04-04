import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import api from "../services/api"

const Menu = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const stored = sessionStorage.getItem("user")

    if (!token) {
      navigate("/sign-in")
      return
    }

    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = async () => {
    try {
      await api.get("/auth/sign-out")
    } catch (e) {}

    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")

    navigate("/sign-in")
  }

  return (
    <nav className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-gray-700">
        <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
          👤
        </span>
        <span className="font-medium">
          {user?.fullname || "Unknown"}
        </span>
      </div>

      <button onClick={handleLogout} className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
        <LogOut size={18} />
        <span>Đăng xuất</span>
      </button>
    </nav>
  )
}

export default Menu
