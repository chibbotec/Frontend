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

interface JobDescription {
  id: string;
  url: string | null;
  isManualInput: boolean;
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
  spaceId: number;
  createdAt: string;
  updatedAt: string;
  publicGrade: string;
}

interface ResumeCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  jobDescription?: JobDescription | null;
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
  jobDescription,
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

  // 각 단계의 완료 상태를 관리하는 state
  const [stepCompletion, setStepCompletion] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

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

  // 모달이 열릴 때 jobDescription이 있으면 콘솔에 출력하고 step1을 완료 상태로 설정
  useEffect(() => {
    if (isOpen && jobDescription) {
      console.log('채용 공고 정보:', jobDescription);
      // step1State 업데이트
      setStep1State({
        url: jobDescription.url || '',
        isManualInput: true,
        manualData: {
          company: jobDescription.company || '',
          position: jobDescription.position || '',
          mainTasks: jobDescription.mainTasks || [],
          requirements: jobDescription.requirements || [],
          career: jobDescription.career || '',
          resumeRequirements: jobDescription.resumeRequirements || [],
          recruitmentProcess: jobDescription.recruitmentProcess || []
        }
      });
      // step1을 완료 상태로 설정
      updateStepCompletion(1, true);
    }
  }, [isOpen, jobDescription]);

  // 각 스텝의 유효성 검사 함수들
  const isStep1Valid = () => {
    if (step1State.isManualInput) {
      const { company, position, mainTasks, requirements } = step1State.manualData;
      return company.trim() !== '' &&
        position.trim() !== '' &&
        mainTasks.length > 0 &&
        requirements.length > 0;
    }
    return step1State.url.trim() !== '';
  };

  const isStep2Valid = () => {
    return true; // Step2는 항상 유효하다고 처리
  };

  const isStep3Valid = () => {
    return step3State.selectedPortfolios.length > 0;
  };

  const isStep4Valid = () => {
    return resumeResult !== null;
  };

  // 현재 스텝이 유효한지 확인하는 함수
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  };

  // 스텝 완료 상태 업데이트 함수
  const updateStepCompletion = (step: number, isCompleted: boolean) => {
    setStepCompletion(prev => ({
      ...prev,
      [`step${step}`]: isCompleted
    }));
  };

  // 다음 스텝으로 이동 가능한지 확인하는 함수
  const canMoveToStep = (targetStep: number) => {
    // 현재 스텝까지 완료된 스텝들만 이동 가능
    for (let i = 1; i < targetStep; i++) {
      if (!stepCompletion[`step${i}` as keyof typeof stepCompletion]) {
        return false;
      }
    }
    return true;
  };

  const handleNextButtonClick = async () => {
    if (!isCurrentStepValid()) {
      alert('현재 단계의 필수 정보를 모두 입력해주세요.');
      return;
    }

    // 현재 스텝 완료 상태 업데이트
    updateStepCompletion(currentStep, true);

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length) {
      if (!resumeResult?.result) {
        console.error('이력서 생성이 완료되지 않았습니다.');
        return;
      }

      try {
        onClose();

        const portfolios = resumeResult.result?.portfolio?.portfolios || [];
        const queryParams = new URLSearchParams();
        queryParams.set('data', JSON.stringify(resumeResult.result));
        queryParams.set('portfolios', JSON.stringify(portfolios));
        queryParams.set('careers', JSON.stringify(step3State.careers));

        navigate(`/space/${spaceId}/resume/resumes/new?${queryParams.toString()}`);
      } catch (error) {
        console.error('이력서 생성 중 오류가 발생했습니다:', error);
      }
    }
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1JDInput
            onStateChange={handleStep1StateChange}
            initialState={{
              url: jobDescription?.url || '',
              isManualInput: true,
              manualData: {
                company: jobDescription?.company || '',
                position: jobDescription?.position || '',
                mainTasks: jobDescription?.mainTasks || [],
                requirements: jobDescription?.requirements || [],
                career: jobDescription?.career || '',
                resumeRequirements: jobDescription?.resumeRequirements || [],
                recruitmentProcess: jobDescription?.recruitmentProcess || []
              }
            }}
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
      <DialogContent className="sm:max-w-[800px] w-[90vw] h-[90vh] p-0 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* 왼쪽 사이드바 - 스텝 네비게이션 */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-2 md:p-6 bg-gray-50 rounded-t-lg md:rounded-tl-lg md:rounded-bl-lg">
            <DialogHeader className="mt-2 mb-2 md:mb-6">
              <DialogTitle>이력서 생성</DialogTitle>
            </DialogHeader>
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "p-1 md:p-4 rounded-lg cursor-pointer transition-colors whitespace-nowrap md:whitespace-normal flex-shrink-0",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100",
                    !canMoveToStep(step.id) && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (canMoveToStep(step.id)) {
                      setCurrentStep(step.id);
                    }
                  }}
                >
                  <div className="font-medium text-xs md:text-base">Step {step.id}</div>
                  <div className="text-[11px] md:text-sm mt-0.5 md:mt-1">{step.title}</div>
                  {stepCompletion[`step${step.id}` as keyof typeof stepCompletion] && (
                    <div className="text-[11px] text-green-600 mt-0.5 md:mt-1">✓ 완료</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 컨텐츠 영역 */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold mb-1 md:mb-4">{steps[currentStep - 1].title}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-6">{steps[currentStep - 1].description}</p>
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
                  {currentStep === steps.length ? "이력서 생성" : "다음"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
