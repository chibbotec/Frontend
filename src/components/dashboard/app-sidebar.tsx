"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import { useAuth } from "@/context/AuthContext"
import { NavMain } from "@/components/dashboard/nav-main.tsx"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/pages/dashboard/space/team-switcher.tsx"
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
          title: "문제 풀기",
          url: "/interview/study",
        },
        {
          title: "문제 제출",
          url: "/interview/questions",
        },
        {
          title: "콘테스트",
          url: "/interview/contests",
        },
        {
          title: "나의 노트",
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
        {
          title: "문제 제출",
          url: "/coding/problems/present",
        },
        {
          title: "오답노트",
          url: "/coding/wrong-notes",
        },
      ],
    },
    {
      title: "설정",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "일반설정",
          url: "/settings",
        },
        {
          title: "스페이스 설정",
          url: "/settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // 사용자 정보 구성 (기본 값 설정 및 실제 사용자 정보로 대체)
  const userData = {
    name: user?.nickname || user?.username || "사용자",
    email: user?.email || "이메일 없음",
    avatar: user?.avatar || "/assets/default.jpg", // 기본 아바타 경로 설정
  };


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/*<TeamSwitcher teams={data.teams} />*/}
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
