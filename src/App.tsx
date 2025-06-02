import { AuthProvider, useAuth } from '@/context/AuthContext'
import { SpaceProvider } from '@/context/SpaceContext'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from "@/pages/login/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
import MainPage from "@/pages/MainPage";

// 이력서 & 포트폴리오 관련 컴포넌트
import PortfolioList from "@/pages/dashboard/resume/portfolio/Portfolio-list.tsx"
import Portfolio from "@/pages/dashboard/resume/portfolio/Portfolio-create.tsx";
import PortfolioDetail from "@/pages/dashboard/resume/portfolio/Portfolio-detail";
import ResumeList from "@/pages/dashboard/resume/resume/Resume-list.tsx";
import Resume from "@/pages/dashboard/resume/resume/Resume-create.tsx";
import ResumeDetail from "@/pages/dashboard/resume/resume/Resume-detail.tsx";
import DescriptionList from "@/pages/dashboard/resume/schedule-job/Description-list.tsx";
// import ResumeShare from "@/pages/dashboard/resume/Resume-share";
// import Schedule from "@/pages/dashboard/resume/Schedule";

// 기술 면접 관련 컴포넌트
import Questions from "@/pages/dashboard/techInterview/qna/Question"
import StudyDetail from "@/pages/dashboard/techInterview/qna/Study-detail"
import Contest from "@/pages/dashboard/techInterview/contest/Contest-list"
import ContestDetail from "@/pages/dashboard/techInterview/contest/Contest-detail"
import ContestTest from "@/pages/dashboard/techInterview/contest/Contest-test"
import NotesList from "@/pages/dashboard/techInterview/note/Note-list"
import NotesCreate from "@/pages/dashboard/techInterview/note/Note-create"

// 코딩 테스트 관련 컴포넌트
import ProblemsList from "@/pages/dashboard/codingtest/Problem-list.tsx"
import ProblemsPresent from "@/pages/dashboard/codingtest/Problem-present.tsx"
import Problem from "@/pages/dashboard/codingtest/Problem"
import ProblemSubmit from "@/pages/dashboard/codingtest/Problem-submit"
// import WrongAnswerNote from "@/pages/dashboard/codingtest/WrongAnswerNote"

import GitHubCallback from "@/pages/login/GitHubCallback";
import SpaceSetting from "@/pages/dashboard/settings/Space-setting";

// 개발 모드 확인
const SKIP_LOGIN = false;

// 인증 필요한 라우트를 위한 래퍼 컴포넌트
const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  if (SKIP_LOGIN) return <Outlet />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/login" element={SKIP_LOGIN ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/auth/callback/github" element={<GitHubCallback />} />

      {/* 인증 필요한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />}>
          {/* 대시보드 인덱스 */}
          <Route index element={<MainPage />} />

          {/* 스페이스별 라우트 */}
          <Route path="space/:spaceId">
            {/* 메인 페이지 */}
            <Route index element={<MainPage />} />

            {/* 이력서 & 포트폴리오 섹션 */}
            <Route path="resume">
              <Route index element={<ResumeList />} />
              <Route path="resumes" element={<ResumeList />} />
              <Route path="resumes/new" element={<Resume />} />
              <Route path="resumes/:id/detail" element={<ResumeDetail />} />
              <Route path="resumes/:id/edit" element={<Resume />} />
              <Route path="portfolios" element={<PortfolioList />} />
              <Route path="portfolios/new" element={<Portfolio />} />
              <Route path="portfolios/:id/detail" element={<PortfolioDetail />} />
              <Route path="portfolios/:id/edit" element={<Portfolio />} />
              <Route path="schedule" element={<DescriptionList />} />
            </Route>

            {/* 기술 면접 섹션 */}
            <Route path="interview">
              <Route index element={<Questions />} />
              <Route path="questions" element={<Questions />} />
              <Route path="questions/:questionId" element={<StudyDetail />} />
              <Route path="contests" element={<Contest />} />
              <Route path="contests/:contestId" element={<ContestDetail />} />
              <Route path="contests/:contestId/test" element={<ContestTest />} />
              <Route path="notes" element={<NotesList />} />
              <Route path="notes/new" element={<NotesCreate />} />
              <Route path="notes/:noteId" element={<NotesCreate />} />
            </Route>

            {/* 코딩 테스트 섹션 */}
            <Route path="coding">
              <Route index element={<ProblemsList />} />
              <Route path="problems" element={<ProblemsList />} />
              <Route path="problems/present" element={<ProblemsPresent />} />
              <Route path="problems/new" element={<Problem />} />
              <Route path="problems/:problemId/edit" element={<Problem />} />
              <Route path="problems/:problemId/submit" element={<ProblemSubmit />} />
              {/* <Route path="wrong-notes" element={<WrongAnswerNote />} /> */}
            </Route>

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