import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoginPage from "@/pages/login/Login"
import Dashboard from "@/pages/dashboard/Dashboard" // Dashboard 컴포넌트 import

function MainApp() {
  // 로그인 상태를 관리하는 상태 변수
  const { isLoggedIn } = useAuth()

  // 로그인 상태가 아니면 로그인 페이지 표시
  if (!isLoggedIn) {
    return <LoginPage />
  }

  // 로그인 상태면 Dashboard 표시
  return <Dashboard />
}

function App() {
  return (
      <AuthProvider>
        <MainApp />
      </AuthProvider>
  )
}

export default App