import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import axios from 'axios';

interface AiAnalysisResponse {
  analysis: {
    company: string;
    position: string;
    mainTasks: string[];
    requirements: string[];
    career: string;
    resumeRequirements: string[];
    recruitmentProcess: string[];
  };
}

interface Step2AiAnalysisProps {
  onNext: (step: number) => void;
  onAnalysisComplete: (analysis: AiAnalysisResponse['analysis']) => void;
  url: string;
  spaceId: string;
  cachedAnalysis: AiAnalysisResponse['analysis'] | null;
}

const apiUrl = import.meta.env.VITE_API_URL || '';

export const Step2AiAnalysis: React.FC<Step2AiAnalysisProps> = ({
  onNext,
  onAnalysisComplete,
  url,
  spaceId,
  cachedAnalysis
}) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResponse['analysis'] | null>(cachedAnalysis);
  const [loading, setLoading] = useState(!cachedAnalysis);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 캐시된 분석 결과가 있으면 API 호출하지 않음
    if (cachedAnalysis) {
      setAnalysis(cachedAnalysis);
      setLoading(false);
      return;
    }

    const analyzeJobPosting = async () => {
      try {
        const response = await axios.post<AiAnalysisResponse>(
          `${apiUrl}/api/v1/ai/${spaceId}/resume/job-description`,
          { url }
        );

        const result = response.data.analysis;
        setAnalysis(result);
        onAnalysisComplete(result);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.data?.detail) {
          setError(err.response.data.detail.replace('. ', '.\n'));
        } else {
          setError('AI 분석 중 오류가 발생했습니다.');
        }
        setLoading(false);
      }
    };

    analyzeJobPosting();
  }, [url, spaceId, onAnalysisComplete, cachedAnalysis]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
            <p className="text-gray-600 text-sm whitespace-nowrap">AI가 채용공고를 분석중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">AI 분석 결과</h3>
              <div className="max-h-[300px] sm:max-h-[400px] md:max-h-[400px] overflow-y-auto pr-4 space-y-3 text-sm">
                <div>
                  <span className="font-medium">채용 기업 : </span>
                  <span className="text-gray-600">{analysis?.company}</span>
                </div>
                <div>
                  <span className="font-medium">포지션 상세 : </span>
                  <span className="text-gray-600">{analysis?.position}</span>
                </div>
                <div>
                  <span className="font-medium">주요업무 : </span>
                  <div className="text-gray-600 mt-1">
                    {analysis?.mainTasks.map((task, index) => (
                      <p key={index}>• {task}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">자격요건 : </span>
                  <div className="text-gray-600 mt-1">
                    {analysis?.requirements.map((req, index) => (
                      <p key={index}>• {req}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">경력 : </span>
                  <span className="text-gray-600">{analysis?.career}</span>
                </div>
                <div>
                  <span className="font-medium">이력서 포함 사항 : </span>
                  <div className="text-gray-600 mt-1">
                    {analysis?.resumeRequirements.map((req, index) => (
                      <p key={index}>• {req}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">채용 절차 : </span>
                  <div className="text-gray-600 mt-1">
                    <p>{analysis?.recruitmentProcess.join(" → ")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
// API 요청/응답 타입
