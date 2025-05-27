import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Step1UrlInput } from './steps/Step1-Url-input';
import { Step2AiAnalysis } from './steps/Step2-Ai-analysis';
import { Step3EditContent } from './steps/Step3-Edit-content';
import axios from 'axios';

interface DescriptionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  onCreated?: () => void;
}

const steps = [
  { id: 1, title: "URL 입력", description: "아래와 같이 작성 됩니다" },
  { id: 2, title: "AI 공고 분석", description: "AI가 공고를 분석중입니다" },
  { id: 3, title: "공고 등록", description: "분석된 내용을 수정해주세요" },
];

export const DescriptionCreateModal: React.FC<DescriptionCreateModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  onCreated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1State, setStep1State] = useState({ url: '', isManualInput: false });
  const [step3State, setStep3State] = useState({
    company: '',
    position: '',
    mainTasks: [] as string[],
    requirements: [] as string[],
    career: '',
    resumeRequirements: [] as string[],
    recruitmentProcess: [] as string[],
    publicGrade: 'PRIVATE'
  });
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    company: string;
    position: string;
    mainTasks: string[];
    requirements: string[];
    career: string;
    resumeRequirements: string[];
    recruitmentProcess: string[];
  } | null>(null);

  // 모달이 닫힐 때만 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setStep1State({ url: '', isManualInput: false });
      setStep3State({
        company: '',
        position: '',
        mainTasks: [],
        requirements: [],
        career: '',
        resumeRequirements: [],
        recruitmentProcess: [],
        publicGrade: 'PUBLIC'
      });
      setAiAnalysisResult(null);
    }
  }, [isOpen]);

  const handleNext = (step: number) => {
    // Step 1이 완료되지 않은 상태에서는 2, 3으로 이동 불가
    if (currentStep === 1 && !step1State.url && !step1State.isManualInput) {
      return;
    }
    setCurrentStep(step);
  };

  const handleStep1StateChange = (url: string, isManualInput: boolean) => {
    setStep1State({ url, isManualInput });
    // URL이 변경되면 AI 분석 결과 초기화
    if (url !== step1State.url) {
      setAiAnalysisResult(null);
    }
  };

  const handleStep3StateChange = (field: string, value: string | string[]) => {
    setStep3State(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalysisComplete = (analysis: {
    company: string;
    position: string;
    mainTasks: string[];
    requirements: string[];
    career: string;
    resumeRequirements: string[];
    recruitmentProcess: string[];
  }) => {
    setAiAnalysisResult(analysis);
    setStep3State({
      company: analysis.company || '',
      position: analysis.position || '',
      mainTasks: analysis.mainTasks || [],
      requirements: analysis.requirements || [],
      career: analysis.career || '',
      resumeRequirements: analysis.resumeRequirements || [],
      recruitmentProcess: analysis.recruitmentProcess || [],
      publicGrade: 'PUBLIC'
    });
  };

  const handleSave = async () => {
    try {
      const requestData = {
        url: step1State.url,
        isManualInput: step1State.isManualInput,
        company: step3State.company,
        position: step3State.position,
        mainTasks: step3State.mainTasks,
        requirements: step3State.requirements,
        career: step3State.career,
        resumeRequirements: step3State.resumeRequirements,
        recruitmentProcess: step3State.recruitmentProcess,
        publicGrade: step3State.publicGrade
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/resume/${spaceId}/job-description`,
        requestData,
        {
          withCredentials: true,
        }
      );

      if (onCreated) onCreated();
      onClose();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
    }
  };

  const handleNextButtonClick = () => {
    if (currentStep === 1) {
      if (step1State.isManualInput) {
        setCurrentStep(3);
      } else if (step1State.url) {
        setCurrentStep(2);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1UrlInput
            onNext={handleNext}
            onStateChange={handleStep1StateChange}
            initialState={step1State}
          />
        );
      case 2:
        return (
          <Step2AiAnalysis
            onNext={handleNext}
            onAnalysisComplete={handleAnalysisComplete}
            url={step1State.url}
            spaceId={spaceId}
            cachedAnalysis={aiAnalysisResult}
          />
        );
      case 3:
        return (
          <Step3EditContent
            onStateChange={handleStep3StateChange}
            initialState={step3State}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] h-[90vh] p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* 왼쪽 사이드바 - 스텝 네비게이션 */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4 md:p-6 bg-gray-50 rounded-t-lg md:rounded-tl-lg md:rounded-bl-lg">
            <DialogHeader className="mb-4 md:mb-6">
              <DialogTitle>채용 공고 등록</DialogTitle>
            </DialogHeader>
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "p-2 md:p-4 rounded-lg cursor-pointer transition-colors whitespace-nowrap md:whitespace-normal flex-shrink-0",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100",
                    // 직접 입력일 때는 Step 2만 비활성화
                    step.id === 2 && step1State.isManualInput && "opacity-50 cursor-not-allowed",
                    // URL이 없고 직접 입력이 아닐 때는 Step 2, 3 비활성화
                    step.id > 1 && !step1State.url && !step1State.isManualInput && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    // 직접 입력일 때는 Step 2로 이동 불가
                    if (step.id === 2 && step1State.isManualInput) {
                      return;
                    }
                    // URL이 없고 직접 입력이 아닐 때는 Step 2, 3으로 이동 불가
                    if (step.id > 1 && !step1State.url && !step1State.isManualInput) {
                      return;
                    }
                    setCurrentStep(step.id);
                  }}
                >
                  <div className="font-medium text-sm md:text-base">Step {step.id}</div>
                  <div className="text-xs md:text-sm mt-1">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 컨텐츠 영역 */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{steps[currentStep - 1].title}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-6">{steps[currentStep - 1].description}</p>
                {renderStepContent()}
              </div>

              <DialogFooter className="mt-4 md:mt-6 flex-col sm:flex-row gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto"
                  >
                    이전
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNextButtonClick}
                  className="w-full sm:w-auto"
                >
                  {currentStep === steps.length ? "등록하기" : "다음"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
