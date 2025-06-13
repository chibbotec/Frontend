import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TagField = 'mainTasks' | 'requirements' | 'resumeRequirements' | 'recruitmentProcess';

interface Step3EditContentProps {
  onStateChange: (field: string, value: string | string[]) => void;
  initialState: {
    company: string;
    position: string;
    mainTasks: string[];
    requirements: string[];
    career: string;
    resumeRequirements: string[];
    recruitmentProcess: string[];
    publicGrade: string;
  };
}

const apiUrl = import.meta.env.VITE_API_URL || '';

export const Step3EditContent: React.FC<Step3EditContentProps> = ({ onStateChange, initialState }) => {
  const [formState, setFormState] = useState<Step3EditContentProps['initialState']>({
    company: '',
    position: '',
    mainTasks: [],
    requirements: [],
    career: '',
    resumeRequirements: [],
    recruitmentProcess: [],
    publicGrade: '전체'
  });

  const [tagInputs, setTagInputs] = useState<Record<TagField, string>>({
    mainTasks: '',
    requirements: '',
    resumeRequirements: '',
    recruitmentProcess: ''
  });

  useEffect(() => {
    if (initialState) {
      const safeInitialState = {
        company: initialState.company || '',
        position: initialState.position || '',
        mainTasks: Array.isArray(initialState.mainTasks) ? initialState.mainTasks : [],
        requirements: Array.isArray(initialState.requirements) ? initialState.requirements : [],
        career: initialState.career || '',
        resumeRequirements: Array.isArray(initialState.resumeRequirements) ? initialState.resumeRequirements : [],
        recruitmentProcess: Array.isArray(initialState.recruitmentProcess) ? initialState.recruitmentProcess : [],
        publicGrade: initialState.publicGrade || '전체'
      };
      setFormState(safeInitialState);
    }
  }, [initialState]);

  const handleInputChange = (field: string, value: string) => {
    const newState = {
      ...formState,
      [field]: value
    };
    setFormState(newState);
    onStateChange(field, value);
  };

  const handleTagInputChange = (field: TagField, value: string) => {
    setTagInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (field: TagField) => {
    const trimmedValue = tagInputs[field].trim();

    if (trimmedValue && !formState[field].includes(trimmedValue)) {
      const newTags = [...formState[field], trimmedValue];
      const newState = {
        ...formState,
        [field]: newTags
      };
      setFormState(newState);
      onStateChange(field, newTags);
      setTagInputs(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const removeTag = (field: TagField, index: number) => {
    const newTags = formState[field].filter((_, i: number) => i !== index);
    const newState = {
      ...formState,
      [field]: newTags
    };
    setFormState(newState);
    onStateChange(field, newTags);
  };

  return (
    <div>
      <Card className='gap-1 md:gap-2'>
        <CardHeader>
          <div className="flex items-center justify-end gap-2">
            <Label htmlFor="publicGrade" className="text-sm">공개</Label>
            <Select
              value={formState.publicGrade}
              onValueChange={(value) => handleInputChange('publicGrade', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="공개 등급 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">전체</SelectItem>
                <SelectItem value="GROUP">그룹</SelectItem>
                <SelectItem value="PRIVATE">개인</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] sm:max-h-[100px] md:max-h-[400px] lg:max-h-[450px] overflow-y-auto pr-4 space-y-3 text-sm">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="company" className="text-sm">채용 기업</Label>
                  <Input
                    id="company"
                    placeholder="예: 카카오"
                    className="h-8"
                    value={formState.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-sm">포지션 상세</Label>
                  <Input
                    id="position"
                    placeholder="예: 백엔드 개발자"
                    className="h-8"
                    value={formState.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">주요업무</Label>
                <ul className="flex flex-col gap-2 mt-1 mb-2">
                  {formState.mainTasks.map((task, index) => (
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
                  {formState.requirements.map((req, index) => (
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
                  value={formState.career}
                  onChange={(e) => handleInputChange('career', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">이력서 포함 사항</Label>
                <ul className="flex flex-col gap-2 mt-1 mb-2">
                  {formState.resumeRequirements.map((req, index) => (
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
                  {formState.recruitmentProcess.map((process, index) => (
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
                      {index < formState.recruitmentProcess.length - 1 && (
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
        </CardContent>
      </Card>
    </div>
  );
};
