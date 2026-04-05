import { useEffect, useState } from 'react'
import { Trash } from 'lucide-react'
import api from '../services/api'
import { toast } from 'sonner'

const TaskList = ({ tasks, setTasks, onChanged }) => {
  const [editingDescId, setEditingDescId] = useState(null)
  const [tempDesc, setTempDesc] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const currentUser = JSON.parse(sessionStorage.getItem("user"))

  const formatDate = (date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const statusColor = {
    "Chưa Làm": "bg-gray-100 text-gray-700 border-gray-200",
    "Đang Làm": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Hoàn Thành": "bg-green-100 text-green-700 border-green-200"
  }

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskOnServer(taskId, { status: newStatus })
  }

  const startEditDesc = (task) => {
    if (task.completedAt || currentUser?.id !== task.createdBy?._id) {
      return
    }

    setEditingDescId(task._id)
    setTempDesc(task.description)
  }

  const saveDesc = (taskId) => {
    updateTaskOnServer(taskId, { description: tempDesc })
    setEditingDescId(null)
  }

  const handleKeyDown = (e, taskId) => {
    if (e.key === 'Enter') {
      saveDesc(taskId)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteId}`)
      setDeleteId(null)
      toast.success('Xoá task thành công')

      onChanged?.()
    } catch (error) {
      console.error(error)
      toast.error('Xoá thất bại')
    }
  }
  
  const updateTaskOnServer = async (id, payload) => {
    try {
      const res = await api.patch(`/tasks/${id}`, payload)
      const updatedTask = res.data.data

      setTasks(prev =>
        prev.map(task => (task._id === id ? updatedTask : task))
      )
    } catch (error) {
      console.error(error)
      toast.error('Cập nhật thất bại')
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {tasks.map((task) => {
        const isCompleted = !!task.completedAt
        const isOwner = currentUser?.id === task.createdBy?._id

        return (
          <div key={task._id} className={`p-5 rounded-2xl border border-gray-100 backdrop-blur-sm
            shadow-sm hover:shadow-md transition-all duration-200
            ${isCompleted ? 'opacity-60 bg-gray-50' : 'bg-white/80'}`}
          >
            <div className="flex flex-col gap-3">
              {/* Title */}
              <div className="flex items-start justify-between w-full gap-3">
                <h3 className={`font-semibold text-lg text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
                  {task.title}
                </h3>

                {currentUser?.id === task.createdBy?._id && (
                  <button onClick={() => setDeleteId(task._id)} className="text-red-400 hover:text-red-500 transition-colors p-1
                    rounded-lg hover:bg-red-50" title="Delete task">
                    <Trash size={18} />
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-wrap justify-end gap-2">
                {isOwner ? (
                  ['Chưa Làm', 'Đang Làm', 'Hoàn Thành'].map((statusOption) => (
                    <label key={statusOption} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name={`status-${task._id}`} value={statusOption} checked={task.status === statusOption}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)} disabled={isCompleted}
                        className="w-4 h-4 text-indigo-500 focus:ring-indigo-400 border-gray-300"
                      />
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${statusColor[statusOption]}`}>
                        {statusOption}
                      </span>
                    </label>
                  ))
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${statusColor[task.status]}`}>
                    {task.status}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 text-gray-600 text-sm">
              {editingDescId === task._id ? (
                <input type="text" value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} onBlur={() => saveDesc(task._id)}
                  onKeyDown={(e) => handleKeyDown(e, task._id)}
                  className="w-full px-3 py-1.5 border border-indigo-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition" autoFocus
                />
              ) : (
                <div onClick={() => isOwner && startEditDesc(task)} className={`flex items-start gap-1 group
                  ${
                    !isOwner || isCompleted
                      ? 'pointer-events-none text-gray-400'
                      : 'cursor-pointer hover:text-indigo-600'
                  }`}
                >
                  <span className="text-gray-400 group-hover:text-indigo-400">✏️</span>
                  <p className="break-words">{task.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">
                  👤
                </span>
                <span>Tạo bởi: {task.createdBy?.fullname}</span>
              </div>

              <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                <span>Thành viên:</span>
                {task.members?.length > 0 ? (
                  task.members.map((member) => (
                    <span key={member._id} className="px-2 py-0.5 rounded-full bg-gray-100">
                      {member.fullname}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Không có</span>
                )}
              </div>

              <p>
                Ngày tạo: {formatDate(task.createdAt)}
                {task.completedAt && ` - Ngày hoàn thành: ${formatDate(task.completedAt)}`}
              </p>
            </div>
          </div>
        )
      })}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in-95">
            
            <h2 className="text-lg font-semibold text-gray-800">
              Xoá Task?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Hành động này không thể hoàn tác. Bạn có chắc muốn xoá task này không?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Huỷ
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm"
              >
                Xoá
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList