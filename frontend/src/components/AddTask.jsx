import { useState, useRef, useEffect } from 'react'
import { Plus, X, Search } from 'lucide-react'
import api from '../services/api'
import { toast } from 'sonner'

const AddTask = ({ onSuccess }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [memberInput, setMemberInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  const normalize = (str) => str.trim().toLowerCase()

  const mergeUniqueMembers = (prev, users) => {
    const map = new Map(prev.map((u) => [u._id, u]))
    users.forEach((u) => map.set(u._id, u))
    return Array.from(map.values())
  }

  const resolveUserByToken = async (token) => {
    const q = token.trim()
    if (!q) return null

    const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`)
    const list = res.data?.data || []

    if (list.length === 0) return null

    const exact = list.find(
      (u) =>
        normalize(u.fullname) === normalize(q) ||
        normalize(u.username) === normalize(q)
    )

    return exact || list[0]
  }

  const addUsersFromTokens = async (tokens) => {
    const resolved = []

    for (const token of tokens) {
      const user = await resolveUserByToken(token)
      if (user) resolved.push(user)
    }

    if (resolved.length > 0) {
      setSelectedMembers((prev) => mergeUniqueMembers(prev, resolved))
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMemberChange = async (e) => {
    const value = e.target.value

    clearTimeout(debounceRef.current)

    if (value.includes(',')) {
      const parts = value.split(',')
      const completedTokens = parts.slice(0, -1).map((t) => t.trim()).filter(Boolean)
      const tail = parts[parts.length - 1]

      if (completedTokens.length > 0) {
        await addUsersFromTokens(completedTokens)
      }

      setMemberInput(tail)
      setSearchResults([])
      return
    }

    setMemberInput(value)

    if (!value.trim()) {
      setSearchResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true)
        const res = await api.get(`/users/search?q=${encodeURIComponent(value)}`)

        const filtered = (res.data?.data || []).filter(
          (u) => !selectedMembers.some((m) => m._id === u._id)
        )

        setSearchResults(filtered)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const addMember = (user) => {
    setSelectedMembers((prev) => mergeUniqueMembers(prev, [user]))
    setMemberInput('')
    setSearchResults([])
  }

  const removeMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== userId))
  }

  const handleMemberKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const tokens = memberInput.split(',').map((t) => t.trim()).filter(Boolean)
      if (tokens.length > 0) {
        await addUsersFromTokens(tokens)
        setMemberInput('')
        setSearchResults([])
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const pendingTokens = memberInput.split(',').map((t) => t.trim()).filter(Boolean)
      let resolvedPending = []

      for (const token of pendingTokens) {
        const user = await resolveUserByToken(token)
        if (user) resolvedPending.push(user)
      }

      const finalMembers = mergeUniqueMembers(selectedMembers, resolvedPending)

      await api.post('/tasks/create', {
        title,
        description,
        members: finalMembers.map((m) => m._id),
      })

      toast.success('Thêm task thành công')
      setTitle('')
      setDescription('')
      setSelectedMembers([])
      setMemberInput('')
      setSearchResults([])

      onSuccess?.()
    } catch (err) {
      const message = err.response?.data?.message

      if (message === 'Title already exists') {
        toast.error('Tên task không được trùng lặp')
      } else if (message === 'Title is required') {
        toast.error('Vui lòng nhập tên task')
      } else {
        toast.error(message || 'Có lỗi xảy ra')
      }
    }
  }

  return (
    <div className="my-5">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <input type="text" placeholder="Tên Task..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
              bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>

          <div className="relative flex-1">
            <input type="text" placeholder="Mô tả (không bắt buộc)..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200
            bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="relative flex-1" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <input type="text" placeholder="Thêm thành viên... (Thêm thành viên dùng dấu phẩy)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none
              focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
              value={memberInput} onChange={handleMemberChange} onKeyDown={handleMemberKeyDown}
            />

            {(searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl
                border border-gray-200 shadow-lg z-50 overflow-hidden">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Đang tìm...</div>
                ) : (
                  searchResults.map((user) => (
                    <button key={user._id} type="button" onClick={() => addMember(user)}
                      className="w-full px-4 py-2.5 text-left hover:bg-indigo-50
                        transition-colors flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center
                        justify-center text-indigo-600 text-xs font-semibold flex-shrink-0">
                        {user.fullname.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.fullname}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-500 text-white
              rounded-xl font-medium hover:bg-indigo-600 hover:shadow-md transition-all whitespace-nowrap cursor-pointer">
            <Plus size={16} />
            <span>Thêm</span>
          </button>
        </div>

        {/* Selected Members Tags */}
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {selectedMembers.map((member) => (
              <span key={member._id} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700
                  rounded-full text-xs font-medium border border-indigo-100">
                {member.fullname}
                <button type="button" onClick={() => removeMember(member._id)}
                  className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default AddTask