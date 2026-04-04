import { useMemo } from 'react'
import { Filter, ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon } from 'lucide-react'

const StatusAndFilters = ({ 
  tasks = [],
  filterStatus,
  setFilterStatus,
  sortField,
  sortOrder,
  handleSort = () => {},
  handleReset = () => {}
}) => { 
  const statusCount = useMemo(() => ({
    all: tasks.length,
    "Chưa Làm": tasks.filter(t => t.status === "Chưa Làm").length,
    "Đang Làm": tasks.filter(t => t.status === "Đang Làm").length,
    "Hoàn Thành": tasks.filter(t => t.status === "Hoàn Thành").length,
  }), [tasks])

  const isDirty = filterStatus !== 'all' || sortField !== ''

  return (
    <div className="space-y-4">
      {/* Status */}  
      <div className="space-y-2">
        <p className="text-xs font-semibold text-block-400 uppercase tracking-wider">
          Trạng thái
        </p>

        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
          bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all">
            <span>Tất cả</span>

            <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full 
              text-xs font-semibold bg-gray-200 text-gray-700">
              {statusCount.all}
            </span>
          </button>

          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 transition-all">
            <span>Chưa Làm</span>

            <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full
              text-xs font-semibold bg-red-100 text-red-600">
              {statusCount["Chưa Làm"]}
            </span>
          </button>

          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            bg-yellow-50 border border-yellow-100 text-yellow-700 hover:bg-yellow-100 transition-all">
            <span>Đang Làm</span>

            <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full
              text-xs font-semibold bg-yellow-100 text-yellow-600">
              {statusCount["Đang Làm"]}
            </span>
          </button>

          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 border
            border-green-100 text-green-700 hover:bg-green-100 transition-all">
            <span>Hoàn Thành</span>

            <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full text-xs font-semibold
              bg-green-100 text-green-600">
              {statusCount["Hoàn Thành"]}
            </span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-black-400 uppercase tracking-wider">
          Bộ lọc
        </p>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleReset}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${isDirty
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700'
            }`}>
            <Filter size={14} />
            <span>Làm Mới</span>
          </button>

          <button onClick={() => handleSort('title')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${sortField === 'title'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            }`}>
            <Filter size={14} />
            <span className="flex items-center gap-1">
              Tên Task
              {sortField === 'title' &&
                (sortOrder === 'desc'
                  ? <ArrowDownNarrowWideIcon size={14} />
                  : <ArrowUpNarrowWideIcon size={14} />
                )
              }
            </span>
          </button>

          <button onClick={() => handleSort('createdAt')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${sortField === 'createdAt'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            }`}>
            <Filter size={14} />
            
            <span className="flex items-center gap-1">
              Thời Gian
              {sortField === 'createdAt' &&
                (sortOrder === 'desc'
                  ? <ArrowDownNarrowWideIcon size={14} />
                  : <ArrowUpNarrowWideIcon size={14} />
                )
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatusAndFilters