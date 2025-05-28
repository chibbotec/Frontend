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

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

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
    selectedResumeType: 'resume' | 'portfolio';
    selectedIds: string[];
  };
  spaceId: string;
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
  spaceId
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('이력서 생성을 시작합니다...');
  const [userId, setUserId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // 컴포넌트 마운트 시 자동으로 이력서 생성 시작
  useEffect(() => {
    handleCreateResume();
  }, []);

  // 폴링 로직
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const pollGenerationStatus = async () => {
      if (!userId) return;

      try {
        const response = await axios.get<GenerationResponse>(
          `${apiUrl}/api/v1/ai/${spaceId}/resume/${userId}/custom-resume-status`,
          { withCredentials: true }
        );

        const { status, message, progress: progressInfo, current_step, elapsed_time, result, error } = response.data;

        if (error) {
          throw new Error(error);
        }

        if (progressInfo) {
          const progressMessage = progressInfo.message || `현재 단계: ${current_step} (${Math.round(elapsed_time || 0)}초 경과)`;
          setProgress(progressMessage);
        }

        if (status === 'completed') {
          clearInterval(pollInterval);
          setLoading(false);
          // 성공 시 Resume-create 페이지로 이동
          const queryParams = new URLSearchParams();
          queryParams.set('data', JSON.stringify(result));
          navigate(`/space/${spaceId}/resume/create-new?${queryParams.toString()}`);
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
    };

    if (userId) {
      // 2초마다 상태 확인
      pollInterval = setInterval(pollGenerationStatus, 2000);
      // 초기 상태 확인
      pollGenerationStatus();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [userId, spaceId, navigate]);

  const handleCreateResume = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress('이력서 생성 요청 중...');

      let selectedResume = [];
      let selectedPortfolio = [];

      // 선택된 이력서/포트폴리오 상세 정보 가져오기
      if (step3Data.selectedResumeType === 'resume') {
        const resumeResponse = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/resume/${step3Data.selectedIds}`,
          { withCredentials: true }
        );
        selectedResume.push(resumeResponse.data);
      } else {
        const portfolioPromises = step3Data.selectedIds.map(id =>
          axios.get(
            `${apiUrl}/api/v1/resume/${spaceId}/portfolio/${id}`,
            { withCredentials: true }
          )
        );
        const portfolioResponses = await Promise.all(portfolioPromises);
        selectedPortfolio = portfolioResponses.map(response => response.data);
      }

      setProgress('AI 이력서 생성 중...');

      // AI 이력서 생성 요청
      const response = await axios.post(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/custom-resume`,
        {
          jobDescription: step1Data.isManualInput ? step1Data.manualData : { url: step1Data.url },
          additionalInfo: step2Data.additionalInfo,
          selectedResume: selectedResume,
          selectedPortfolio: selectedPortfolio,
          type: step3Data.selectedResumeType
        },
        { withCredentials: true }
      );

      if (response.status === 202 && response.data.user_id) {
        setUserId(response.data.user_id);
        setProgress('이력서 생성이 시작되었습니다...');
      } else {
        throw new Error('이력서 생성 요청이 실패했습니다.');
      }

    } catch (err) {
      console.error('이력서 생성 요청 중 오류가 발생했습니다:', err);
      setError('이력서 생성 요청 중 오류가 발생했습니다.');
      setLoading(false);
    }
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
