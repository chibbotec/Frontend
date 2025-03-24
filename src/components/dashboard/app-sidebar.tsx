"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import { useAuth } from "@/context/AuthContext"
import { NavMain } from "@/components/dashboard/nav-main.tsx"
import {NavProjects} from "@/components/dashboard/nav-projects"
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
          title: "이력서 공유",
          url: "#",
        },
        {
          title: "포트폴리오 공유",
          url: "#",
        },
        {
          title: "일정관리",
          url: "#",
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
          url: "/study",
        },
        {
          title: "문제 제출",
          url: "/questions",
        },
        {
          title: "나의 노트",
          url: "#",
        },
      ],
    },
    {
      title: "코딩테스트",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "문제풀러가기",
          url: "#",
        },
        {
          title: "풀이기록",
          url: "#",
        },
        {
          title: "오답노트",
          url: "#",
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
          url: "#",
        },
        {
          title: "팀 설정",
          url: "#",
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
