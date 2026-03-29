import Header from '@components/Header'
import AddTask from '@components/AddTask'
import Search from '@components/Search'
import Pagination from '@components/Pagination'
import TaskList from '@components/TaskList'
import Footer from '@components/Footer'
import StatusAndFilters from '@components/StatusAndFilters'

const TaskPage = () => {
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
        }}
      />

      {/* Content */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl mx-auto space-x-6">
          {/* Header */}
          <Header />

          {/* Add Task */}
          <AddTask />

          {/* Search */}
          <Search />

          {/* Status And Filter */}
          <StatusAndFilters />

          {/* Task List */}
          <TaskList />

          {/* Pagination */}
          <Pagination />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default TaskPage