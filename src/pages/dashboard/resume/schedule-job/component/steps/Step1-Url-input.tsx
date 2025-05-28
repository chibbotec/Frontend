import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';

interface Step1UrlInputProps {
  onNext: (step: number) => void;
  onStateChange: (url: string, isManualInput: boolean) => void;
  initialState: {
    url: string;
    isManualInput: boolean;
  };
  spaceId: string;
}

interface JobDescription {
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
}

const apiUrl = import.meta.env.VITE_API_URL || '';

export const Step1UrlInput: React.FC<Step1UrlInputProps> = ({ onNext, onStateChange, initialState, spaceId }) => {
  const [url, setUrl] = useState(initialState.url);
  const [isManualInput, setIsManualInput] = useState(initialState.isManualInput);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(initialState.url);
    setIsManualInput(initialState.isManualInput);
  }, [initialState]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (isManualInput) {
      setIsManualInput(false);
      onStateChange(newUrl, false);
    } else {
      onStateChange(newUrl, isManualInput);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isManualInput) {
      onNext(3);
    } else if (url) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post(
          `${apiUrl}/api/v1/ai/${spaceId}/resume/job-description`,
          { url }
        );

        const result = response.data.analysis;
        // 누락된 필드에 대한 기본값 설정
        const completeResult = {
          company: result.company || '',
          position: result.position || '',
          mainTasks: result.mainTasks || [],
          requirements: result.requirements || [],
          career: result.career || '경력 미상',
          resumeRequirements: result.resumeRequirements || [],
          recruitmentProcess: result.recruitmentProcess || []
        };

        setJobDescription(completeResult);
        onNext(2);
      } catch (err: any) {
        if (err.response?.data?.detail) {
          setError(err.response.data.detail.replace('. ', '.\n'));
        } else {
          setError('채용공고 분석 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setIsManualInput(isChecked);
    if (isChecked) {
      setUrl('');
      onStateChange('', true);
    } else {
      onStateChange(url, false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="max-h-[250px] sm:max-h-[300px] md:max-h-[350px] overflow-y-auto pr-4 space-y-3 text-sm">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
                      <p className="text-gray-600 text-sm">채용공고를 분석중입니다...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-sm whitespace-pre-line">{error}</div>
                ) : jobDescription ? (
                  <>
                    <div>
                      <span className="font-medium">채용 기업 : </span>
                      <span className="text-gray-600">{jobDescription.company}</span>
                    </div>
                    <div>
                      <span className="font-medium">포지션 상세 : </span>
                      <span className="text-gray-600">{jobDescription.position}</span>
                    </div>
                    <div>
                      <span className="font-medium">주요업무 : </span>
                      <div className="text-gray-600 mt-1">
                        {jobDescription.mainTasks.map((task, index) => (
                          <p key={index}>• {task}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">자격요건 : </span>
                      <div className="text-gray-600 mt-1">
                        {jobDescription.requirements.map((req, index) => (
                          <p key={index}>• {req}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">경력 : </span>
                      <span className="text-gray-600">{jobDescription.career}</span>
                    </div>
                    <div>
                      <span className="font-medium">이력서 포함 사항 : </span>
                      <div className="text-gray-600 mt-1">
                        {jobDescription.resumeRequirements.map((req, index) => (
                          <p key={index}>• {req}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">채용 절차 : </span>
                      <div className="text-gray-600 mt-1">
                        <p>{jobDescription.recruitmentProcess.join(' → ')}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    채용공고 URL을 입력하면 자동으로 내용을 분석합니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">채용공고 URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={handleUrlChange}
                required
                disabled={isManualInput}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manual-input"
                checked={isManualInput}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="manual-input" className="text-sm font-medium">직접 공고 입력</Label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
