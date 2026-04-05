import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { toast } from "sonner"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const Information = () => {
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    username: ""
  })

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})
  const [initialUser, setInitialUser] = useState(null)
  const navigate = useNavigate()

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const isChanged = initialUser && (
    user.fullname !== initialUser.fullname ||
    user.phone !== initialUser.phone
  )

  useEffect(() => {
    const stored = sessionStorage.getItem("user")
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setInitialUser(parsed)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    let newValue = value
    if (name === "phone") {
      newValue = value.replace(/\D/g, "")
    }

    setUser(prev => ({ ...prev, [name]: newValue }))
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!user.fullname.trim()) {
      newErrors.fullname = "Họ và Tên không được để trống"
    }

    if (!user.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      const res = await api.patch("/users/update-profile", {
        fullname: user.fullname,
        phone: user.phone
      })

      sessionStorage.setItem("user", JSON.stringify(res.data.data))
      setInitialUser(res.data.data)

      toast.success("Cập nhật thành công")
      setErrors({})
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại")
    } finally {
      setLoading(false)
    }
  }

  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setPasswordErrors({})
    setShowOld(false)
    setShowNew(false)
    setShowConfirm(false)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetPasswordForm()
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target

    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))

    setPasswordErrors(prev => {
      const next = { ...prev }
      delete next[name]

      if (name === "newPassword" || name === "confirmPassword") {
        delete next.confirmPassword
      }

      return next
    })
  }

  const validatePassword = () => {
    const err = {}

    if (!passwordData.oldPassword.trim()) {
      err.oldPassword = "Không được để trống"
    }

    if (!passwordData.newPassword.trim()) {
      err.newPassword = "Không được để trống"
    } else if (passwordData.newPassword.length < 6) {
      err.newPassword = "Mật khẩu phải ít nhất 6 ký tự"
    }

    if (!passwordData.confirmPassword.trim()) {
      err.confirmPassword = "Không được để trống"
    }

    if (
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      err.confirmPassword = "Mật khẩu không khớp"
    }

    if (
      passwordData.oldPassword &&
      passwordData.newPassword &&
      passwordData.oldPassword === passwordData.newPassword
    ) {
      err.newPassword = "Không được nhập giống mật khẩu cũ"
    }

    return err
  }
  
  const handleChangePassword = async (e) => {
    e.preventDefault()

    const err = validatePassword()

    if (Object.keys(err).length > 0) {
      setPasswordErrors(err)
      return
    }

    try {
      await api.patch("/users/change-password", passwordData)

      toast.success("Đổi mật khẩu thành công")
      handleCloseModal()
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi")
    }
  }

  const inputStyle = "w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"

  return (
    <div className="min-h-screen w-full relative">
      <div className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
            linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
          <button onClick={() => navigate("/tasks")} className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60
          hover:bg-white shadow-sm text-sm text-indigo-600 transition cursor-pointer">
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Thông tin cá nhân
          </h2>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="text-sm text-gray-500">Tên tài khoản</label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-xl text-gray-500">
                {user.username}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Họ và tên</label>
              <input type="text" name="fullname" value={user.fullname} onChange={handleChange} className={inputStyle} />
              <div className="min-h-5">
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                onKeyDown={(e) => {
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
                  if (allowedKeys.includes(e.key)) return
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                inputMode="numeric"
                className={inputStyle}
              />
              <div className="min-h-5">
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-xl text-gray-500">
                {user.email}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isChanged}
              className={`w-full py-2.5 rounded-xl font-medium transition ${
                loading || !isChanged
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
                      </form>

          <div className="mt-6 text-right">
            <button onClick={() => setShowModal(true)} className="text-indigo-500 hover:underline text-sm cursor-pointer">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />

          <div className="relative bg-white p-6 rounded-2xl w-full max-w-sm z-10 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Đổi mật khẩu
            </h3>

            <form className="space-y-3" onSubmit={handleChangePassword}>
              <div>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Mật khẩu cũ..."
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={`${inputStyle} ${passwordErrors.oldPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="min-h-5">
                  {passwordErrors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    placeholder="Mật khẩu mới..."
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`${inputStyle} ${passwordErrors.newPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="min-h-5">
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu..."
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`${inputStyle} ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="min-h-5">
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button className="w-full bg-indigo-500 text-white py-2.5 rounded-xl">
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Information