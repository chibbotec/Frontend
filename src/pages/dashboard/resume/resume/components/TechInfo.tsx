import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'react-router-dom';

interface ResumeSummaryResponse {
  techStack: string[];
  techSummary: string[];
}

interface TechInfoProps {
  techStack: Set<string>;
  setTechStack: React.Dispatch<React.SetStateAction<Set<string>>>;
  newTech: string;
  setNewTech: (value: string) => void;
  techSummary: string[];
  setTechSummary: (value: string[]) => void;
  position: string;
  projects: {
    name: string;
    techStack: string[];
    role: string[];
  }[];
  careers: {
    position: string;
    achievement: string;
  }[];
}

const apiUrl = import.meta.env.VITE_API_URL || '';

const TechInfo: React.FC<TechInfoProps> = ({
  techStack,
  setTechStack,
  newTech,
  setNewTech,
  techSummary,
  setTechSummary,
  position,
  projects,
  careers
}) => {
  const { user } = useAuth();
  const { spaceId } = useParams<{ spaceId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleAISummary = async () => {
    if (!user?.id || !spaceId) {
      console.error('사용자 또는 스페이스 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<ResumeSummaryResponse>(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/${user.id}/summary`,
        {
          position,
          projects: projects.map(project => ({
            name: project.name,
            techStack: project.techStack,
            role: project.role
          })),
          careers: careers.map(career => ({
            position: career.position,
            achievement: career.achievement
          }))
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('API 응답:', response.data); // API 응답 확인

      if (response.status === 200) {
        // 기술 스택 업데이트
        const newTechStack = new Set([...techStack, ...response.data.techStack]);
        setTechStack(newTechStack);

        // 기술 요약 업데이트
        console.log('기술 요약 업데이트 전:', techSummary);
        setTechSummary(response.data.techSummary);
        console.log('기술 요약 업데이트 후:', response.data.techSummary);
      }
    } catch (error) {
      console.error('AI 요약 생성 중 오류 발생:', error);
      // TODO: 에러 처리 UI 추가
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='gap-1'>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>기술 정보</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAISummary}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>요약 중...</span>
            </div>
          ) : (
            'AI 요약하기'
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="techStack" className="text-sm font-medium">기술스택</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {Array.from(techStack).map((tech, index) => (
                <span key={index} className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                  {tech}
                  <button
                    type="button"
                    onClick={() => {
                      const newSet = new Set(techStack);
                      newSet.delete(tech);
                      setTechStack(newSet);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="기술 스택 입력"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTech.trim()) {
                    e.preventDefault();
                    const newSet = new Set(techStack);
                    newSet.add(newTech.trim());
                    setTechStack(newSet);
                    setNewTech('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newTech.trim()) {
                    const newSet = new Set(techStack);
                    newSet.add(newTech.trim());
                    setTechStack(newSet);
                    setNewTech('');
                  }
                }}
              >
                추가
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="techSummary" className="text-sm font-medium">기술 역량 요약</label>
            <Textarea
              id="techSummary"
              value={techSummary.join('\n')}
              onChange={(e) => setTechSummary(e.target.value.split('\n'))}
              placeholder="기술역량을 요약해주세요"
              required
              className="text-xs resize-none h-40"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechInfo; 