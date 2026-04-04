import { useState } from "react";
import { User, Lock, Phone, Mail, Eye, EyeOff } from "lucide-react";
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
    fullname: ""
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  // Validate
  const validate = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập"
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ và tên"
    }

    return newErrors
  };

  //Xử lý thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    
    if(name === 'phone') {
      newValue = value.replace(/\D/g, '')
    }

    setFormData({ ...formData, [name]: newValue })
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  //Xử lý Submit
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors)
      return
    }

    try {
      await api.post("/auth/sign-up", formData)

      toast.success("Đăng ký thành công")
      navigate("/sign-in")
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Đăng ký thất bại"
      })
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
            linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
            `,
        }} />

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng ký</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type="text" name="username" value={formData.username} onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.username ? "border-red-500" : "border-gray-200"}
                  bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                  placeholder="Nhập Tài Khoản..."
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Nhập Mật Khẩu..." className={`w-full pl-10 pr-10 py-2.5 rounded-xl border
                    ${errors.password ? "border-red-500" : "border-gray-200"} bg-white/70 focus:outline-none focus:ring-2
                    focus:ring-indigo-400 focus:border-transparent transition-all`}
                />

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Fullname */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.fullname ? "border-red-500" : "border-gray-200"}
                  bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                  placeholder="Nhập họ và tên..."
                />
              </div>
              {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                    if (allowedKeys.includes(e.key)) return;
                    // Chỉ cho phép số (0-9)
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputMode="numeric" placeholder="Nhập Số Điện Thoại..." 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.phone ? "border-red-500" : "border-gray-200"}
                  bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Nhập Email..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-200"}
                  bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}

            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5
              rounded-xl transition-all shadow-md hover:shadow-lg">
              Đăng ký
            </button>

            <p className="text-center text-gray-500 text-sm">
              Đã có tài khoản?{" "}

              <a href="/sign-in" className="text-indigo-500 hover:underline font-medium">
                Đăng nhập
              </a>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SignUp;
