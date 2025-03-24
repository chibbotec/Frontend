import { AuthProvider, useAuth } from '@/context/AuthContext'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from "@/pages/login/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
import Study from "@/pages/dashboard/techInterview/Study"
import Questions from "@/pages/dashboard/techInterview/Question" // 질문 관리 컴포넌트 (구현 필요)

// 개발 모드 확인 (환경 변수 또는 하드코딩으로 설정)
const SKIP_LOGIN = true; // 개발 시 true, 배포 시 false로 변경

// 인증 필요한 라우트를 위한 래퍼 컴포넌트
const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  // 개발 모드에서는 로그인 검사 건너뛰기
  if (SKIP_LOGIN) {
    return <Outlet />;
  }

  // 로그인되지 않았으면 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 되어있으면 자식 컴포넌트 렌더링
  return <Outlet />;
};

// 메인 라우팅 컴포넌트
function AppRoutes() {
  return (
      <Router>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={SKIP_LOGIN ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

          {/* 인증 필요한 라우트 - 개발 모드에서는 인증 검사 건너뛰기 */}
          <Route element={<ProtectedRoute />}>
            {/* 대시보드 라우트 - 자식 라우트들을 포함 */}
            <Route path="/" element={<Dashboard />}>
              {/* 대시보드 인덱스 */}
              <Route index element={<div>대시보드 홈</div>} />

              {/* 스페이스별 라우트 */}
              <Route path="space/:spaceId">
                <Route index element={<div>스페이스 홈</div>} />
                <Route path="study" element={<Study />} />
                <Route path="questions" element={<Questions />} />
              </Route>
            </Route>

            {/* 기본 리다이렉트 */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
  );
}

function App() {
  return (
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
  );
}

export default App;