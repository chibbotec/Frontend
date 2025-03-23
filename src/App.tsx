import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoginPage from "@/pages/login/Login"
import Dashboard from "@/pages/dashboard/Dashboard"

// 개발 모드 설정 - true로 설정하면 로그인 화면 없이 바로 대시보드로 이동
const SKIP_LOGIN = true;

function MainApp() {
  const { isLoggedIn } = useAuth()

  // 개발 모드에서는 로그인 검사 건너뛰기
  if (SKIP_LOGIN) {
    return <Dashboard />
  }

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