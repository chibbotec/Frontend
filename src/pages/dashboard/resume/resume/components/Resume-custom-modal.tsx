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
import { useNavigate } from 'react-router-dom';
import { Step1JDInput } from './steps/Step1-JD-input';
import { Step2CultureInput } from './steps/Step2-Culture-input';
import { Step3ResumeSelect } from './steps/Step3-Resume-select';
import { Step4ResumeCreate } from './steps/Step4-Resume-create';
import axios from 'axios';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface ResumeCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  onCreated?: () => void;
}

interface Step1State {
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
  githubLink: string;
  deployLink: string;
  memberCount: number;
  memberRoles: string[] | null;
  contents: {
    techStack: string;
    summary: string;
    description: string;
    roles: string[];
    features: {
      [key: string]: string[];
    };
    architecture: {
      communication: string;
      deployment: string;
    };
  };
}

const steps = [
  { id: 1, title: "공고 등록 및 분석", description: "채용 공고를 등록하고 분석합니다" },
  { id: 2, title: "추가 정보 등록", description: "채용에 필요한 추가정보를 등록합니다" },
  { id: 3, title: "이력서 선택", description: "생성할 이력서를 선택합니다" },
  { id: 4, title: "이력서 생성", description: "이력서를 생성합니다" },
];

export const ResumeCustomModal: React.FC<ResumeCustomModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  onCreated,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1State, setStep1State] = useState<Step1State>({
    url: '',
    isManualInput: false,
    manualData: {
      company: '',
      position: '',
      mainTasks: [],
      requirements: [],
      career: '',
      resumeRequirements: [],
      recruitmentProcess: []
    }
  });
  const [step2State, setStep2State] = useState({
    additionalInfo: [''],
  });
  const [step3State, setStep3State] = useState({
    selectedPortfolios: [] as Portfolio[],
    careers: [] as Career[]
  });
  const [resumeResult, setResumeResult] = useState<any>(null);

  // 모달이 닫힐 때만 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setStep1State({
        url: '',
        isManualInput: false,
        manualData: {
          company: '',
          position: '',
          mainTasks: [],
          requirements: [],
          career: '',
          resumeRequirements: [],
          recruitmentProcess: []
        }
      });
      setStep2State({
        additionalInfo: [''],
      });
      setStep3State({
        selectedPortfolios: [],
        careers: []
      });
    }
  }, [isOpen]);

  const handleNext = (step: number) => {
    setCurrentStep(step);
  };

  const handleStep1StateChange = (url: string, isManualInput: boolean, manualData?: Step1State['manualData']) => {
    setStep1State(prev => ({
      ...prev,
      url,
      isManualInput,
      manualData: manualData || prev.manualData
    }));
  };

  const handleStep2StateChange = (field: string, value: string | string[]) => {
    setStep2State(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStep3StateChange = (data: { type: 'portfolio' | 'career', ids: string[], portfolios?: Portfolio[], careers: Career[] }) => {
    if (data.type === 'portfolio' && data.portfolios) {
      setStep3State(prev => ({
        ...prev,
        selectedPortfolios: data.portfolios || []
      }));
    } else if (data.type === 'career') {
      setStep3State(prev => ({
        ...prev,
        careers: data.careers
      }));
    }
  };

  const handleResumeComplete = (result: any) => {
    setResumeResult(result);
  };

  const handleNextButtonClick = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (resumeResult) {
      onClose();

      const queryParams = new URLSearchParams();
      queryParams.set('data', JSON.stringify(resumeResult));
      queryParams.set('portfolios', JSON.stringify(step3State.selectedPortfolios));
      queryParams.set('careers', JSON.stringify(step3State.careers));

      navigate(`/space/${spaceId}/resume/resumes/new?${queryParams.toString()}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1JDInput
            onStateChange={handleStep1StateChange}
            initialState={step1State}
            spaceId={spaceId}
          />
        );
      case 2:
        return (
          <Step2CultureInput
            onStateChange={handleStep2StateChange}
            initialState={step2State}
          />
        );
      case 3:
        return (
          <Step3ResumeSelect
            onStateChange={handleStep3StateChange}
            initialState={step3State}
            spaceId={spaceId}
          />
        );
      case 4:
        return (
          <Step4ResumeCreate
            step1Data={step1State}
            step2Data={step2State}
            step3Data={step3State}
            spaceId={spaceId}
            onComplete={handleResumeComplete}
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
              <DialogTitle>이력서 생성</DialogTitle>
            </DialogHeader>
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "p-2 md:p-4 rounded-lg cursor-pointer transition-colors whitespace-nowrap md:whitespace-normal flex-shrink-0",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => setCurrentStep(step.id)}
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
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="w-full sm:w-auto"
                  >
                    이전
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNextButtonClick}
                  className="w-full sm:w-auto"
                  disabled={currentStep === steps.length && !resumeResult}
                >
                  {currentStep === steps.length ? "이력서 생성 완료" : "다음"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
