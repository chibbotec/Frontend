import React from 'react';
import { useParams, Outlet, Link, useLocation } from 'react-router-dom';
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
import { useSpace } from '@/context/SpaceContext';

// 경로에 따른 한글 이름 매핑
const pathToKorean: { [key: string]: string } = {
  resume: '이력서 & 포트폴리오',
  interview: '기술 면접',
  coding: '코딩 테스트',
  settings: '설정',
  share: '이력서 공유',
  portfolios: '포트폴리오',
  schedule: '일정 관리',
  study: '문제 풀기',
  questions: '문제 제출',
  contests: '콘테스트',
  notes: '나의 노트',
  problems: '문제 풀기',
  'wrong-notes': '오답 노트',
};

// 대시보드 메인 컴포넌트
export default function Dashboard() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { currentSpace } = useSpace();
  const location = useLocation();

  // 현재 경로를 배열로 분리
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // 'space'와 spaceId는 breadcrumb에서 제외
  let filteredSegments = pathSegments;
  const spaceIdx = pathSegments.findIndex(seg => seg === 'space');
  if (spaceIdx !== -1 && pathSegments.length > spaceIdx + 1) {
    filteredSegments = pathSegments.slice(spaceIdx + 2); // 'space'와 spaceId 건너뜀
  }

  // breadcrumb 항목 생성
  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const path = `/space/${spaceId}/` + filteredSegments.slice(0, index + 1).join('/');
    const isLast = index === filteredSegments.length - 1;
    const koreanName = pathToKorean[segment] || segment;

    if (isLast) {
      return (
        <BreadcrumbItem key={path}>
          <BreadcrumbPage>{koreanName}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    return (
      <React.Fragment key={path}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={path}>{koreanName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </React.Fragment>
    );
  });

  // 스페이스 ID가 URL 파라미터로 주어진 경우 localStorage에 저장
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
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/space/${spaceId}`}>
                      {currentSpace?.spaceName || '스페이스'}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.length > 0 && (
                  <>
                    <BreadcrumbSeparator />
                    {breadcrumbItems}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}