import Header from '@components/Header'
import AddTask from '@components/AddTask'
import Pagination from '@components/Pagination'
import TaskList from '@components/TaskList'
import Footer from '@components/Footer'
import StatusAndFilters from '@components/StatusAndFilters'
import Menu from '@components/Menu'

import { useEffect, useState } from 'react'
import api from '../services/api'

const TaskPage = () => {
  const [tasks, setTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 5

  const fetchTasks = async (page = currentPage) => {
    try {
      const url = `/tasks/pagination?page=${page}&limit=${limit}${
        sortField ? `&sort=${sortField}&order=${sortOrder}` : ''
      }`

      const res = await api.get(url)
      setTasks(res.data.data)
      setTotalPages(res.data.totalPages)
      setCurrentPage(res.data.page)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [currentPage, sortField, sortOrder])

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter(t => t.status === filterStatus)

  const handleSort = (field) => {
    setCurrentPage(1)

    if (sortField === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleReset = () => {
    setFilterStatus('all')
    setSortField('')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const handleAddSuccess = () => {
    setCurrentPage(1)
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
        }}
      />

      {/* Content */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Menu */}
          <Menu />

          {/* Header */}
          <Header />

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100/80">
            {/* Add Task */}
            <AddTask onSuccess={() => fetchTasks(1)} />

            {/* Status And Filter */}
            <StatusAndFilters
              tasks={tasks}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
              handleReset={handleReset}
            />
          </div>

          {/* Task List */}
          <TaskList tasks={tasks} setTasks={setTasks} onChanged={() => fetchTasks()} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Footer */}
          <Footer />
        </div>
      </div>

    </div>
  )
}

export default TaskPage