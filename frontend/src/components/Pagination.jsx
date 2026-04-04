import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button onClick={() => onPageChange(1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600
      hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}>
        <ChevronsLeft size={18} />
      </button>

      <button onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600
      hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}>
        <ChevronLeft size={18} />
      </button>

      {/* Các nút số trang */}
      {pages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`
            min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all
            ${
              currentPage === page
                ? 'bg-indigo-500 text-white shadow-md'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Nút Next */}
      <button onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600
      hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}>
        <ChevronRight size={18} />
      </button>

      {/* Nút Last */}
      <button onClick={() => onPageChange(totalPages)}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600
      hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}>
        <ChevronsRight size={18} />
      </button>
    </div>
  )
}

export default Pagination