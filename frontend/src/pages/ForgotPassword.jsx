import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import api from "../services/api"
import { toast } from "sonner"

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [step, setStep] = useState("username")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateUsername = () => {
    const err = {}

    if (!username.trim()) {
      err.username = "Vui lòng nhập tài khoản"
    }

    return err
  }

  const validatePassword = () => {
    const err = {};

    if (!newPassword.trim()) {
      err.newPassword = "Vui lòng nhập mật khẩu mới"
    } else if (newPassword.length < 6) {
      err.newPassword = "Mật khẩu phải ít nhất 6 ký tự"
    }

    if (!confirmPassword.trim()) {
      err.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (newPassword !== confirmPassword) {
      err.confirmPassword = "Mật khẩu không khớp"
    }

    return err
  }

  const handleCheckUsername = async (e) => {
    e.preventDefault()

    const newErrors = validateUsername()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      await api.patch("/auth/forgot-password", { username })

      setErrors({})
      setStep("password")
    } catch (err) {
      toast.error(err.response?.data?.message || "Tài khoản không tồn tại")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    const newErrors = validatePassword()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      await api.patch("/auth/forgot-password", {
        username,
        password: newPassword,
      })

      toast.success("Đổi mật khẩu thành công")
      navigate("/sign-in")
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
            linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}/>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Quên Mật Khẩu
          </h2>

          {step === "username" ? (
            <form onSubmit={handleCheckUsername} className="space-y-4">
              <div>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors((prev) => ({ ...prev, username: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.username ? "border-red-500" : "border-gray-200"
                    } bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                    placeholder="Nhập tài khoản..."
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {loading ? "Đang kiểm tra..." : "Tiếp tục"}
              </button>

              <p className="text-center text-gray-500 text-sm">
                <Link to="/sign-in" className="text-indigo-500 hover:underline">
                  Quay lại đăng nhập
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <div className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600">
                  {username}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                      errors.newPassword ? "border-red-500" : "border-gray-200"
                    } bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                    placeholder="Mật khẩu mới..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    } bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                    placeholder="Xác nhận mật khẩu..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {loading ? "Đang đổi..." : "Đổi mật khẩu"}
              </button>

              <button
                type="button"
                onClick={() => setStep("username")}
                className="w-full text-sm text-gray-500 hover:underline"
              >
                Quay lại nhập username
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  )
}

export default ForgotPassword