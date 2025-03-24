import React from 'react';

export default function DashboardHome() {
  return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-lg font-medium text-muted-foreground">이력서 관리</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-lg font-medium text-muted-foreground">기술 면접</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-lg font-medium text-muted-foreground">코딩 테스트</p>
        </div>
        <div className="aspect-video md:col-span-2 rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-lg font-medium text-muted-foreground">최근 활동</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-lg font-medium text-muted-foreground">팀 멤버</p>
        </div>
      </div>
  );
}