import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Step1UrlInputProps {
  onNext: (step: number) => void;
  onStateChange: (url: string, isManualInput: boolean) => void;
  initialState: {
    url: string;
    isManualInput: boolean;
  };
}

export const Step1UrlInput: React.FC<Step1UrlInputProps> = ({ onNext, onStateChange, initialState }) => {
  const [url, setUrl] = useState(initialState.url);
  const [isManualInput, setIsManualInput] = useState(initialState.isManualInput);

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

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isManualInput) {
      onNext(3);
    } else if (url) {
      onNext(2);
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
                <div>
                  <span className="font-medium">채용 기업 : </span>
                  <span className="text-gray-600">카카오</span>
                </div>
                <div>
                  <span className="font-medium">포지션 상세 : </span>
                  <span className="text-gray-600">백엔드 개발자</span>
                </div>
                <div>
                  <span className="font-medium">주요업무 : </span>
                  <div className="text-gray-600 mt-1">
                    <p>• 확장성과 유연성이 높은 결제 시스템 개발</p>
                    <p>• 대규모 트래픽 처리가 가능한 안정적인 시스템 구축</p>
                    <p>• 정확하고 빠른 정산 시스템 개발</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium">자격요건 : </span>
                  <div className="text-gray-600 mt-1">
                    <p>• 결제 산업 혁신에 관심이 있는 분</p>
                    <p>• 지속적인 성장과 새로운 기술 학습에 열정이 있는 분</p>
                    <p>• 비즈니스 이해도와 시스템 설계 능력을 보유한 분</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium">경력 : </span>
                  <span className="text-gray-600">신입/경력</span>
                </div>
                <div>
                  <span className="font-medium">이력서 포함 사항 : </span>
                  <div className="text-gray-600 mt-1">
                    <p>• 개발 관련 문제 해결 사례</p>
                    <p>• 레거시 코드 리팩토링 경험</p>
                    <p>• 비즈니스 문제 해결 경험</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium">채용 절차 : </span>
                  <div className="text-gray-600 mt-1">
                    <p>서류접수 → 사전과제 → 직무 인터뷰 → 문화적합성 인터뷰 → 레퍼런스 체크 → 처우협의 → 최종합격</p>
                  </div>
                </div>
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
