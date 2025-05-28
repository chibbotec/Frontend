import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import axios from 'axios';

interface Step1JDInputProps {
  onStateChange: (url: string, isManualInput: boolean, manualData?: ManualInputState) => void;
  initialState: {
    url: string;
    isManualInput: boolean;
    manualData: ManualInputState;
  };
  spaceId: string;
}

interface ManualInputState {
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
}

type TagField = 'mainTasks' | 'requirements' | 'resumeRequirements' | 'recruitmentProcess';

interface AiAnalysisResponse {
  analysis: ManualInputState;
}

const apiUrl = import.meta.env.VITE_API_URL || '';

export const Step1JDInput: React.FC<Step1JDInputProps> = ({
  onStateChange,
  initialState,
  spaceId
}) => {
  const [url, setUrl] = useState(initialState.url);
  const [manualInput, setManualInput] = useState<ManualInputState>(initialState.manualData);

  const [tagInputs, setTagInputs] = useState<Record<TagField, string>>({
    mainTasks: '',
    requirements: '',
    resumeRequirements: '',
    recruitmentProcess: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>(initialState.isManualInput ? 'manual' : 'url');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onStateChange(newUrl, false, manualInput);
  };

  const handleInputChange = (field: string, value: string) => {
    const newState = {
      ...manualInput,
      [field]: value
    };
    setManualInput(newState);
    onStateChange(url, true, newState);
  };

  const handleTagInputChange = (field: TagField, value: string) => {
    setTagInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (field: TagField) => {
    const trimmedValue = tagInputs[field].trim();

    if (trimmedValue && !manualInput[field].includes(trimmedValue)) {
      const newTags = [...manualInput[field], trimmedValue];
      const newState = {
        ...manualInput,
        [field]: newTags
      };
      setManualInput(newState);
      onStateChange(url, true, newState);
      setTagInputs(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const removeTag = (field: TagField, index: number) => {
    const newTags = manualInput[field].filter((_, i: number) => i !== index);
    const newState = {
      ...manualInput,
      [field]: newTags
    };
    setManualInput(newState);
    onStateChange(url, true, newState);
  };

  const analyzeJobPosting = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<AiAnalysisResponse>(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/job-description`,
        { url }
      );

      const result = response.data.analysis;
      // 누락된 필드에 대한 기본값 설정
      const completeResult = {
        ...result,
        recruitmentProcess: result.recruitmentProcess || [],
        resumeRequirements: result.resumeRequirements || [],
        mainTasks: result.mainTasks || [],
        requirements: result.requirements || [],
        career: result.career || '경력 미상',
        company: result.company || '',
        position: result.position || ''
      };

      setManualInput(completeResult);
      onStateChange(url, true, completeResult);
      setActiveTab('manual');
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

  const renderAnalysisResult = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
            <p className="text-gray-600 text-sm whitespace-nowrap">AI가 채용공고를 분석중입니다...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-h-[450px] overflow-y-auto pr-4 space-y-3 text-sm">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="company" className="text-sm">채용 기업</Label>
              <Input
                id="company"
                placeholder="예: 카카오"
                className="h-8"
                value={manualInput.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-sm">포지션 상세</Label>
              <Input
                id="position"
                placeholder="예: 백엔드 개발자"
                className="h-8"
                value={manualInput.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">주요업무</Label>
            <ul className="flex flex-col gap-2 mt-1 mb-2">
              {manualInput.mainTasks.map((task, index) => (
                <li key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                  <span>• {task}</span>
                  <button
                    onClick={() => removeTag('mainTasks', index)}
                    className="text-gray-500 hover:text-gray-700 ml-auto"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="항목을 입력하세요"
                className="h-8"
                value={tagInputs.mainTasks}
                onChange={(e) => handleTagInputChange('mainTasks', e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddTag('mainTasks')}
                className="h-8"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm">자격요건</Label>
            <ul className="flex flex-col gap-2 mt-1 mb-2">
              {manualInput.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                  <span>• {req}</span>
                  <button
                    onClick={() => removeTag('requirements', index)}
                    className="text-gray-500 hover:text-gray-700 ml-auto"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="항목을 입력하세요"
                className="h-8"
                value={tagInputs.requirements}
                onChange={(e) => handleTagInputChange('requirements', e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddTag('requirements')}
                className="h-8"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="career" className="text-sm">경력</Label>
            <Input
              id="career"
              placeholder="예: 신입/경력"
              className="h-8"
              value={manualInput.career}
              onChange={(e) => handleInputChange('career', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm">이력서 포함 사항</Label>
            <ul className="flex flex-col gap-2 mt-1 mb-2">
              {manualInput.resumeRequirements.map((req, index) => (
                <li key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                  <span>• {req}</span>
                  <button
                    onClick={() => removeTag('resumeRequirements', index)}
                    className="text-gray-500 hover:text-gray-700 ml-auto"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="항목을 입력하세요"
                className="h-8"
                value={tagInputs.resumeRequirements}
                onChange={(e) => handleTagInputChange('resumeRequirements', e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddTag('resumeRequirements')}
                className="h-8"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm">채용 절차</Label>
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
              {manualInput.recruitmentProcess.map((process, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <span>{process}</span>
                    <button
                      onClick={() => removeTag('recruitmentProcess', index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {index < manualInput.recruitmentProcess.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="항목을 입력하세요"
                className="h-8"
                value={tagInputs.recruitmentProcess}
                onChange={(e) => handleTagInputChange('recruitmentProcess', e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddTag('recruitmentProcess')}
                className="h-8"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'manual')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="url">URL 입력</TabsTrigger>
        <TabsTrigger value="manual">직접 입력</TabsTrigger>
      </TabsList>
      <TabsContent value="url">
        <Card>
          <CardHeader>
            <CardTitle>채용 공고 URL</CardTitle>
            <CardDescription>
              채용 공고 URL을 입력하면 자동으로 내용을 분석합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">URL</Label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={handleUrlChange}
              />
            </div>
            <Button
              className="w-full"
              onClick={analyzeJobPosting}
              disabled={loading || !url}
            >
              {loading ? '분석 중...' : 'URL 분석하기'}
            </Button>
            {loading && (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
                  <p className="text-gray-600 text-sm whitespace-nowrap">AI가 채용공고를 분석중입니다...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle>직접 입력</CardTitle>
            <CardDescription>
              채용 공고 내용을 직접 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderAnalysisResult()}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
