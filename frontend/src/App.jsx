import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import TaskPage from "./pages/taskPage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { Toaster } from 'sonner'

function App() {
  const ProtectedRoute = ({ children }) => {
    const isAuth = sessionStorage.getItem('token');

    if (!isAuth) {
      return <Navigate to="/sign-in" />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    const isAuth = sessionStorage.getItem('token');

    if (isAuth) {
      return <Navigate to="/tasks" />;
    }

    return children;
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            sessionStorage.getItem('token')
              ? <Navigate to={"/tasks"} replace />
              : <Navigate to={"/sign-in"} replace />
          } />
          
          <Route path="/sign-in" element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } />

          <Route path="/sign-up" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />

          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
