import { AppSidebar } from "@/components/dashboard/app-sidebar.tsx"
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
import { useSpace } from "@/context/SpaceContext" // SpaceContext import
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Dashboard() {
  // 스페이스 컨텍스트에서 현재 스페이스와 로딩 상태 가져오기
  const { currentSpace, isLoading, error, fetchSpaces } = useSpace()

  // 컴포넌트 마운트 시 스페이스 목록 가져오기
  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />

              {isLoading ? (
                  // 로딩 중 상태 표시
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <Skeleton className="h-5 w-24" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <Skeleton className="h-5 w-32" />
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
              ) : error ? (
                  // 오류 상태 표시
                  <span className="text-red-500 flex items-center gap-1">
                <AlertCircle size={16} />
                스페이스 정보를 불러올 수 없습니다
              </span>
              ) : currentSpace ? (
                  // 현재 스페이스 정보 표시
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          {currentSpace.type === 'PERSONAL' ? '개인 스페이스' : '팀 스페이스'}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentSpace.spaceName}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
              ) : (
                  // 스페이스가 없는 경우
                  <span className="text-muted-foreground">스페이스가 없습니다</span>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {!currentSpace && !isLoading && !error ? (
                // 스페이스가 없는 경우 안내 메시지
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>스페이스가 없습니다</AlertTitle>
                  <AlertDescription>
                    왼쪽 사이드바의 "스페이스 만들기" 버튼을 클릭하여 첫 번째 스페이스를 만들어보세요.
                  </AlertDescription>
                </Alert>
            ) : (
                // 정상적인 대시보드 콘텐츠
                <>
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                  </div>
                  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}