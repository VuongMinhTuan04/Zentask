const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
        <img src="404-Not-Found.png" className="max-w-full w-[40rem]" />
        <a href="/" 
            className="inline-block px-6 py-3 mt-6 font-medium text-white 
            transition shadow-md rounded-2xl bg-indigo-500 hover:bg-indigo-700"
        >
            Return To Task
        </a>
    </div>
  )
}

export default NotFound