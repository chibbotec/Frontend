"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Loader2, Home, Users, AlertCircle } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  spaceService,
  type Space
} from "@/pages/dashboard/space/Space.tsx"
import { CreateSpaceDialog } from "@/pages/dashboard/space/Create-space.tsx"

// 스페이스를 아이콘으로 변환하는 함수
const getSpaceIcon = (type: string) => {
  return type === 'PERSONAL' ? Home : Users;
}

// 스페이스 플랜 텍스트 생성 (타입에 따라)
const getSpacePlan = (type: string) => {
  return type === 'PERSONAL' ? '개인 스페이스' : '팀 스페이스';
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const [spaces, setSpaces] = React.useState<Space[]>([])
  const [activeSpace, setActiveSpace] = React.useState<Space | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  // 스페이스 목록 조회
  const fetchSpaces = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await spaceService.getMySpaces();
      setSpaces(result);

      // 활성 스페이스 선택 (기존 선택이 없거나 목록에 없으면 첫 번째 선택)
      if (!activeSpace || !result.find(space => space.id === activeSpace.id)) {
        setActiveSpace(result.length > 0 ? result[0] : null);
      }
    } catch (err) {
      console.error("스페이스 목록 조회 실패:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [activeSpace]);

  // 컴포넌트 마운트 시 스페이스 목록 조회
  React.useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // 로딩 중이거나 에러 상태일 때의 렌더링
  if (loading) {
    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent">
                <Loader2 className="size-4 animate-spin" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">로딩 중...</span>
                <span className="truncate text-xs">스페이스 정보를 불러오는 중</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
    )
  }

  if (error) {
    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-100">
                <AlertCircle className="size-4 text-red-500" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">오류 발생</span>
                <span className="truncate text-xs">스페이스 정보를 불러올 수 없음</span>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchSpaces}
                  className="ml-auto"
              >
                재시도
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
    )
  }

  // 스페이스가 없을 때의 렌더링
  if (spaces.length === 0) {
    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
                size="lg"
                onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Plus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">스페이스 만들기</span>
                <span className="truncate text-xs">팀 협업을 위한 공간을 생성하세요</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 스페이스 생성 다이얼로그 */}
          <CreateSpaceDialog
              isOpen={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              onSpaceCreated={(newSpace) => {
                setSpaces(prev => [...prev, newSpace]);
                setActiveSpace(newSpace);
                fetchSpaces(); // 목록 갱신
              }}
          />
        </SidebarMenu>
    )
  }

  // 액티브 스페이스가 없는 경우 (예외 처리)
  if (!activeSpace) {
    return null;
  }

  // 아이콘 컴포넌트 동적 결정
  const SpaceIcon = getSpaceIcon(activeSpace.type);
  const spacePlan = getSpacePlan(activeSpace.type);

  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <SpaceIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeSpace.spaceName}
                </span>
                  <span className="truncate text-xs">{spacePlan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                내 스페이스
              </DropdownMenuLabel>

              {spaces.map((space) => {
                const SpaceItemIcon = getSpaceIcon(space.type);
                return (
                    <DropdownMenuItem
                        key={space.id}
                        onClick={() => setActiveSpace(space)}
                        className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <SpaceItemIcon className="size-4 shrink-0" />
                      </div>
                      <span className="truncate">{space.spaceName}</span>
                      {space.type === 'PERSONAL' && (
                          <span className="ml-auto text-xs text-muted-foreground">개인</span>
                      )}
                    </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => setIsCreateDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">팀 스페이스 만들기</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>

        {/* 스페이스 생성 다이얼로그 */}
        <CreateSpaceDialog
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSpaceCreated={(newSpace) => {
              setSpaces(prev => [...prev, newSpace]);
              setActiveSpace(newSpace);
              fetchSpaces(); // 목록 갱신
            }}
        />
      </SidebarMenu>
  )
}