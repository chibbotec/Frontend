import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { mockResumeData } from '../AI_mock';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface Portfolio {
  id: string;
  spaceId: number;
  title: string;
  author: {
    id: number;
    nickname: string;
  };
  duration: {
    startDate: string;
    endDate: string;
  };
  githubLink: string | null;
  deployLink: string | null;
  memberCount: number | null;
  memberRoles: string[] | null;
  contents: {
    techStack: string;
    summary: string;
    description: string;
    roles: string[] | null;
    features: {
      [key: string]: string[];
    };
    architecture: {
      communication: string;
      deployment: string;
    };
  };
}

interface Career {
  company: string;
  position: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  description: string;
  achievement: string;
}

interface Step4ResumeCreateProps {
  step1Data: {
    url: string;
    isManualInput: boolean;
    manualData: {
      company: string;
      position: string;
      mainTasks: string[];
      requirements: string[];
      career: string;
      resumeRequirements: string[];
      recruitmentProcess: string[];
    };
  };
  step2Data: {
    additionalInfo: string[];
  };
  step3Data: {
    selectedPortfolios: Portfolio[];
    careers: Career[];
  };
  spaceId: string;
  onComplete: (result: any) => void;
}

type GenerationStatus = 'processing' | 'completed' | 'failed' | 'skipped';

interface ProgressInfo {
  success: number;
  failed: number;
  current_step: string;
  message?: string;
  start_time: number;
  result?: any;
}

interface GenerationResponse {
  status: GenerationStatus;
  message?: string;
  progress?: ProgressInfo;
  current_step?: string;
  elapsed_time?: number;
  result?: any;
  error?: string;
}

export const Step4ResumeCreate: React.FC<Step4ResumeCreateProps> = ({
  step1Data,
  step2Data,
  step3Data,
  spaceId,
  onComplete
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('이력서 생성을 시작합니다...');
  const [userId, setUserId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(true);

  const getStepMessage = (step: string, message?: string): string => {
    if (message) return message;

    const messages: Record<string, string> = {
      start: '이력서와 지원공고를 분석중입니다.',
      portfolio: '포트폴리오를 분석중입니다.',
      career: '경력을 분석중입니다.',
      tech_stack: '지원자의 역량을 작성중입니다.',
      cover_letter: '자기소개서를 작성중입니다.'
    };
    return messages[step] || '이력서 생성 중...';
  };

  const renderSummary = () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">1단계: 지원 공고 정보</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {step1Data.isManualInput ? (
              <div className="grid grid-cols-2 gap-2">
                <p><span className="font-medium">회사:</span> {step1Data.manualData.company}</p>
                <p><span className="font-medium">포지션:</span> {step1Data.manualData.position}</p>
              </div>
            ) : (
              <p><span className="font-medium">URL:</span> {step1Data.url}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">2단계: 추가 정보</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {step2Data.additionalInfo.length > 0 && step2Data.additionalInfo.some(info => info.trim() !== '') ? (
              <div className="space-y-1">
                {step2Data.additionalInfo
                  .filter(info => info.trim() !== '')
                  .map((info, index) => (
                    <p key={index}><span className="font-medium">•</span> {info}</p>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">추가 정보 없음</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">3단계: 포트폴리오 및 경력</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium mb-1">포트폴리오</p>
                {step3Data.selectedPortfolios.length > 0 ? (
                  <ul className="space-y-1">
                    {step3Data.selectedPortfolios.map((portfolio, index) => (
                      <li key={index} className="text-gray-600">• {portfolio.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">선택된 포트폴리오 없음</p>
                )}
              </div>
              <div>
                <p className="font-medium mb-1">경력</p>
                {step3Data.careers.length > 0 ? (
                  <ul className="space-y-1">
                    {step3Data.careers.map((career, index) => (
                      <li key={index} className="text-gray-600">• {career.company}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">경력 정보 없음</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">

        </div>
      </div>
    );
  };

  // 컴포넌트 마운트 시 자동으로 이력서 생성 시작
  useEffect(() => {
    if (isInitialized || showSummary) return;

    const startResumeCreation = async () => {
      try {
        const generatedUserId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        setUserId(generatedUserId);
        setIsInitialized(true);

        setLoading(true);
        setProgress('이력서 생성 중...');

        // // 2초 후에 mock 데이터로 완료 처리
        // setTimeout(() => {
        //   setLoading(false);
        //   setIsCompleted(true);
        //   setResultData(mockResumeData.result);
        //   onComplete(mockResumeData);
        // }, 2000);

        // 실제 API 호출 로직 주석 처리
        await handleCreateResume(generatedUserId);

        const pollInterval = setInterval(async () => {
          try {
            const response = await axios.get<GenerationResponse>(
              `${apiUrl}/api/v1/ai/${spaceId}/resume/${generatedUserId}/custom-resume-status`,
              { withCredentials: true }
            );

            const { status, message, progress: progressInfo, current_step, elapsed_time, result, error } = response.data;

            if (error) {
              throw new Error(error);
            }

            if (current_step) {
              setProgress(getStepMessage(current_step, progressInfo?.message));
            } else if (progressInfo?.message) {
              setProgress(progressInfo.message);
            }

            if (status === 'completed') {
              clearInterval(pollInterval);
              setLoading(false);
              setIsCompleted(true);
              setResultData(result);
              onComplete({ result });
            } else if (status === 'failed') {
              clearInterval(pollInterval);
              setLoading(false);
              setError(message || '이력서 생성 중 오류가 발생했습니다.');
            } else if (status === 'skipped') {
              clearInterval(pollInterval);
              setLoading(false);
              setError('이력서 생성이 건너뛰어졌습니다.');
            }
          } catch (err) {
            console.error('상태 확인 중 오류 발생:', err);
            clearInterval(pollInterval);
            setLoading(false);
            if (axios.isAxiosError(err) && err.response?.status === 404) {
              setError('이력서 생성 요청을 찾을 수 없습니다.');
            } else {
              setError('상태 확인 중 오류가 발생했습니다.');
            }
          }
        }, 2000);

        return () => {
          clearInterval(pollInterval);
        };
      } catch (err) {
        console.error('이력서 생성 시작 중 오류 발생:', err);
        setError('이력서 생성 시작 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    startResumeCreation();
  }, [spaceId, showSummary]);

  const handleCreateResume = async (generatedUserId: string) => {
    try {
      setLoading(true);
      setError(null);
      setProgress('이력서 생성 요청 중...');
      setProgress('AI 이력서 생성 중...');

      // AI 이력서 생성 요청
      const response = await axios.post(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/${generatedUserId}/custom-resume`,
        {
          jobDescription: step1Data.isManualInput ? step1Data.manualData : { url: step1Data.url },
          additionalInfo: step2Data.additionalInfo,
          selectedPortfolios: step3Data.selectedPortfolios,
          careers: step3Data.careers
        },
        { withCredentials: true }
      );

      if (response.status === 202) {
        setProgress('이력서 생성이 시작되었습니다...');
      } else {
        throw new Error('이력서 생성 요청이 실패했습니다.');
      }

    } catch (err) {
      console.error('이력서 생성 요청 중 오류가 발생했습니다:', err);
      setError('이력서 생성 요청 중 오류가 발생했습니다.');
      setLoading(false);
      throw err;
    }
  };

  const renderResultSummary = () => {
    if (!resultData) return null;

    return (
      <div className="space-y-3 text-sm">
        <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md">
          <p className="font-medium text-sm">이력서 생성이 완료되었습니다!</p>
          <p className="text-xs mt-0.5">{resultData.message}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-sm mb-1">지원 포지션</h3>
            <p className="text-xs text-gray-600">{resultData.position}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-1">지원자의 기술 스택</h3>
            <div className="flex flex-wrap gap-1">
              {resultData.tech_stack.tech_stack.map((tech: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-1">지원자의 포트폴리오</h3>
            {resultData.portfolio.portfolios.map((portfolio: any, index: number) => (
              <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{portfolio.name}</h4>
                </div>
                <p className="text-gray-600 mt-1 line-clamp-2">{portfolio.description}</p>
              </div>
            ))}
          </div>

          {resultData.career && (
            <div>
              <h3 className="font-medium text-sm mb-1">경력</h3>
              {resultData.career.careers.map((career: any, index: number) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{career.company}</h4>
                  </div>
                  <p className="text-gray-600 mt-1">{career.position}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-medium text-sm mb-1">자기소개서 항목</h3>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              {resultData.cover_letter.coverLetter.map((item: any, index: number) => (
                <li key={index} className="text-gray-600">{item.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI 이력서 생성 완료</CardTitle>
          <CardDescription >
            AI가 생성한 이력서 정보를 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className='max-h-[400px] overflow-y-auto'>
          {renderResultSummary()}
        </CardContent>
      </Card>
    );
  }

  if (showSummary) {
    return (
      <Card >
        <CardHeader>
          <CardTitle>입력 정보 확인</CardTitle>
          <CardDescription>
            입력하신 정보를 확인하고 이력서 생성을 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="max-h-[500px] overflow-y-auto pb-16">
            {renderSummary()}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
            <Button
              onClick={() => {
                setShowSummary(false);
                setIsInitialized(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              이력서 생성 시작하기
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 이력서 생성</CardTitle>
        <CardDescription>
          입력하신 정보를 바탕으로 AI가 이력서를 생성합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8">
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-sm text-gray-600">{progress}</p>
            </>
          ) : (
            <p className="text-sm text-gray-600">{progress}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
