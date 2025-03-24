import { useParams, Outlet } from 'react-router-dom';
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// 대시보드 메인 컴포넌트
export default function Dashboard() {
  // 현재 활성 스페이스 ID 가져오기
  const { spaceId } = useParams<{ spaceId: string }>();

  // 스페이스 ID가 URL 파라미터로 주어진 경우 localStorage에 저장
  // (팀 전환 시점에서도 저장하지만, URL로 직접 접근한 경우를 위해 추가 처리)
  if (spaceId) {
    localStorage.setItem('activeSpaceId', spaceId);
  }

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      취업 뽀개기
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>대시보드</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Outlet을 사용하여 자식 라우트 컴포넌트를 렌더링 */}
            <Outlet />

            {/* 자식 라우트가 없는 경우 기본 대시보드 콘텐츠 표시 - 더 이상 필요하지 않음
          {!spaceId && (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          )}
          */}
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}