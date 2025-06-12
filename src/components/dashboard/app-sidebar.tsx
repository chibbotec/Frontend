"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  MessageCircle,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import { useAuth } from "@/context/AuthContext"
import { NavMain } from "@/components/dashboard/nav-main.tsx"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/pages/dashboard/space/team-switcher.tsx"
import { GitHubLoginButton } from "@/components/authorization/GitHubLoginButton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "이력서&포트폴리오",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "이력서",
          url: "/resume/resumes",
        },
        {
          title: "포트폴리오",
          url: "/resume/portfolios",
        },
        {
          title: "일정/채용공고",
          url: "/resume/schedule",
        },
      ],
    },
    {
      title: "기술면접",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "공부하기",
          url: "/interview/questions",
        },
        {
          title: "시험보기",
          url: "/interview/contests",
        },
        {
          title: "필기노트",
          url: "/interview/notes",
        },
      ],
    },
    {
      title: "코딩테스트",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "문제 풀기",
          url: "/coding/problems",
        },
        // {
        //   title: "문제 제출",
        //   url: "/coding/problems/present",
        // },
        // {
        //   title: "오답노트",
        //   url: "/coding/wrong-notes",
        // },
      ],
    },
    {
      title: "설정",
      url: "#",
      icon: Settings2,
      items: [
        // {
        //   title: "일반설정",
        //   url: "/settings",
        // },
        {
          title: "스페이스 설정",
          url: "/settings",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const isGuestMode = !user;

  // 사용자 정보 구성 (기본 값 설정 및 실제 사용자 정보로 대체)
  const userData = {
    name: user?.nickname || user?.username || "사용자",
    email: user?.email || "이메일 없음",
    avatar: user?.avatar || "/assets/default.jpg", // 기본 아바타 경로 설정
  };

  // GitHub 로그인 함수 (GitHubLoginButton과 동일)
  const handleGitHubLogin = React.useCallback(() => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const frontUrl = window.location.origin + '/auth/callback/github';
      const finalUrl = `${apiUrl}/oauth2/authorization/github?redirectUrl=${encodeURIComponent(frontUrl)}`;
      window.location.href = finalUrl;
    } catch (error) {
      console.error("GitHub 로그인 오류:", error);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/*<TeamSwitcher teams={data.teams} />*/}
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <div className="px-3 py-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0 flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center">
        <a
          href="https://discord.gg/DNAeTkrC"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground group group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center w-full"
        >
          <MessageCircle className="h-5 w-5 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
          <span className="group-data-[collapsible=icon]:hidden">Discord 피드백 남기기</span>
        </a>
      </div>
      <SidebarFooter>
        {isGuestMode ? (
          <div className="px-3 py-2 flex items-center justify-center relative">
            {/* 펼쳐졌을 때만 GitHubLoginButton 보임 */}
            <div className="group-data-[collapsible=icon]:hidden w-full">
              <GitHubLoginButton />
            </div>
            {/* 접혔을 때만 로그인 기능이 되는 아이콘 버튼 */}
            <button
              onClick={handleGitHubLogin}
              className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-8 h-8 rounded-lg bg-[#24292F] text-white absolute left-1/2 -translate-x-1/2 hover:bg-[#24292F]/90"
              title="GitHub 로그인"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github w-5 h-5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V22" fill="white" />
              </svg>
            </button>
          </div>
        ) : (
          <NavUser user={userData} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
