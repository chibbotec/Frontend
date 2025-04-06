import { AuthProvider, useAuth } from '@/context/AuthContext'
import { SpaceProvider } from '@/context/SpaceContext' // SpaceProvider 추가
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'; // sonner의 Toaster 컴포넌트 추가
import LoginPage from "@/pages/login/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
import Study from "@/pages/dashboard/techInterview/Study"
import Questions from "@/pages/dashboard/techInterview/Question"
import NotesList from "@/pages/dashboard/techInterview/Note-list"
import NotesCreate from "@/pages/dashboard/techInterview/Note-create"
import ProblemsList from "@/pages/dashboard/codingtest/Problem-list.tsx"
import ProblemsPresent from "@/pages/dashboard/codingtest/Problem-present.tsx"
import Problem from "@/pages/dashboard/codingtest/Problem"
import ProblemSubmit from "@/pages/dashboard/codingtest/Problem-submit"
import GitHubCallback from "@/pages/login/GitHubCallback";
import SpaceSetting from "@/pages/dashboard/settings/Space-setting";

// 개발 모드 확인 (환경 변수 또는 하드코딩으로 설정)
const SKIP_LOGIN = false; // 개발 시 true, 배포 시 false로 변경

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

function AppRoutes() {
  return (
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={SKIP_LOGIN ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

        {/* 소셜 로그인 콜백 라우트 - 보호된 라우트 밖으로 이동 */}
        <Route path="/auth/callback/github" element={<GitHubCallback />} />

        {/* 인증 필요한 라우트 - 개발 모드에서는 인증 검사 건너뛰기 */}
        <Route element={<ProtectedRoute />}>
          {/* 대시보드 라우트 - 자식 라우트들을 포함 */}
          <Route path="/" element={<Dashboard />}>
            {/* 대시보드 인덱스 */}
            <Route index element={<div>대시보드 홈</div>} />

            {/* 스페이스별 라우트 */}
            <Route path="space/:spaceId">
              <Route index element={<div>스페이스 홈</div>} />

              {/* 기술 면접 */}
              <Route path="study" element={<Study />} />
              <Route path="questions" element={<Questions />} />
              <Route path="notes" element={<NotesList />} />
              <Route path="create-notes/new" element={<NotesCreate />} />
              <Route path="create-notes/:noteId" element={<NotesCreate />} />

              {/* 코딩 테스트 */}
              <Route path="problemList" element={<ProblemsList />} />
              <Route path="problemPresent" element={<ProblemsPresent />} />
              <Route path="create-problem" element={<Problem />} />
              <Route path="edit-problem/:problemId" element={<Problem />} />
              <Route path="submit-problem/:problemId" element={<ProblemSubmit />} />

              {/* 설정 라우트 */}
              <Route path="settings" element={<SpaceSetting />} />
            </Route>
          </Route>

          {/* 기본 리다이렉트 */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}

function App() {
  return (
      <Router>
        <AuthProvider>
          <SpaceProvider>
            <Toaster position="bottom-right" richColors closeButton />
            <AppRoutes />
          </SpaceProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;