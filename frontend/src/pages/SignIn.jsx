import { useState } from "react"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập"
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    }

    return newErrors
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post("/auth/sign-in", formData)

      const token = res.data?.token
      const user = res.data?.user
      
      if (!token) {
        throw new Error("Không có token từ backend")
      }

      sessionStorage.setItem("token", token)
      sessionStorage.setItem("user", JSON.stringify(user))

      navigate("/tasks/")
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || err.message || "Đăng nhập thất bại",
      });
    }
  };

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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Đăng nhập
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type="text" name="username" value={formData.username} onChange={handleChange}
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

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Nhập mật khẩu..."
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                />
                
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}

            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl
              transition-all shadow-md hover:shadow-lg">
              Đăng nhập
            </button>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <Link to="/forgot-password" className="text-indigo-500 hover:underline font-medium">
                Quên mật khẩu?
              </Link>

              <p>
                Chưa có tài khoản?{" "}
                <Link to="/sign-up" className="text-indigo-500 hover:underline font-medium">
                  Đăng ký
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default SignIn