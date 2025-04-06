"use client"

import { Link, useParams } from 'react-router-dom';
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  // 현재 활성 스페이스 ID 가져오기
  const { spaceId } = useParams<{ spaceId: string }>();
  const activeSpaceId = spaceId || localStorage.getItem('activeSpaceId');

  return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
              <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        // URLs 처리 - 스페이스 ID가 필요한 경로에는 활성 스페이스 ID 삽입
                        let finalUrl = subItem.url;

                        // subItem.url이 "/study"나 "/questions"와 같은 특정 패턴이면 스페이스 ID 추가
                        if (activeSpaceId && (
                          subItem.url === "/study" ||
                          subItem.url === "/questions" ||
                          subItem.url === "/notes" ||
                          subItem.url === "/create-notes/new" ||
                          subItem.url === "/problemList" ||
                          subItem.url === "/problemPresent" ||
                          subItem.url === "/create-problem" ||  // 추가
                          subItem.url.startsWith("/edit-problem/") ||  // 추가
                          subItem.url === "/settings"
                      )) {
                          finalUrl = `/space/${activeSpaceId}${subItem.url}`;
                      }

                        return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={finalUrl}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}