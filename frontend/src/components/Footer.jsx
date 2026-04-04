import React from 'react'
import { Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="space-y-2 py-6 text-sm text-gray-500">
      <div className="flex justify-center items-center">
        <Sparkles size={14} className="text-indigo-500" />
        <span>Tiếp tục xây dựng. Không ngừng phát triển..</span>
        <Sparkles size={14} className="text-indigo-500" />
      </div>
    </footer>
  )
}

export default Footer