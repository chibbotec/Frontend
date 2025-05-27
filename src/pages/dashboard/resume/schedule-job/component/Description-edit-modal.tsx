import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import axios from "axios";

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

interface DescriptionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: JobDescription | null;
  onUpdated?: () => void;
}

export const DescriptionEditModal: React.FC<DescriptionEditModalProps> = ({
  isOpen,
  onClose,
  jobDescription,
  onUpdated,
}) => {
  if (!jobDescription) return null;

  const [formState, setFormState] = useState<JobDescription>(jobDescription);
  const [newItem, setNewItem] = useState<{
    mainTasks: string;
    requirements: string;
    resumeRequirements: string;
    recruitmentProcess: string;
  }>({
    mainTasks: '',
    requirements: '',
    resumeRequirements: '',
    recruitmentProcess: '',
  });

  const [changedFields, setChangedFields] = useState<Partial<JobDescription>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    if (jobDescription[field as keyof JobDescription] !== value) {
      setChangedFields(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setChangedFields(prev => {
        const newFields = { ...prev };
        delete newFields[field as keyof JobDescription];
        return newFields;
      });
    }
  };

  const handleAddItem = (field: 'mainTasks' | 'requirements' | 'resumeRequirements' | 'recruitmentProcess') => {
    const value = newItem[field].trim();
    if (value) {
      const newArray = [...formState[field], value];
      setFormState(prev => ({
        ...prev,
        [field]: newArray
      }));
      setNewItem(prev => ({
        ...prev,
        [field]: ''
      }));
      setChangedFields(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleRemoveItem = (field: 'mainTasks' | 'requirements' | 'resumeRequirements' | 'recruitmentProcess', index: number) => {
    const newArray = formState[field].filter((_, i) => i !== index);
    setFormState(prev => ({
      ...prev,
      [field]: newArray
    }));
    setChangedFields(prev => ({
      ...prev,
      [field]: newArray
    }));
  };
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleSave = async () => {
    try {
      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }

      await axios.patch(
        `${apiUrl}/api/v1/resume/${jobDescription.spaceId}/job-description/${jobDescription.id}`,
        changedFields,
        { withCredentials: true }
      );
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error('수정 중 오류가 발생했습니다:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const renderListField = (
    field: 'mainTasks' | 'requirements' | 'resumeRequirements' | 'recruitmentProcess',
    label: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <ul className="space-y-2">
        {formState[field].map((item, index) => (
          <li key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            <span className="flex-1">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(field, index)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={newItem[field]}
          onChange={(e) => setNewItem(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder="새 항목 추가"
          className="h-8"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => handleAddItem(field)}
          className="h-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] h-[80vh] sm:h-[85vh] p-4 sm:p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle>채용 공고 수정</DialogTitle>
        </DialogHeader>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="h-full px-4 sm:px-6">
            <div className="h-full overflow-y-auto space-y-6 text-sm">
              <div className="space-y-2">
                <Label className="text-sm font-medium">채용 기업</Label>
                <Input
                  value={formState.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">포지션 상세</Label>
                <Input
                  value={formState.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="h-8"
                />
              </div>
              {renderListField('mainTasks', '주요업무')}
              {renderListField('requirements', '자격요건')}
              <div className="space-y-2">
                <Label className="text-sm font-medium">경력</Label>
                <Input
                  value={formState.career}
                  onChange={(e) => handleInputChange('career', e.target.value)}
                  className="h-8"
                />
              </div>
              {renderListField('resumeRequirements', '이력서 포함 사항')}
              {renderListField('recruitmentProcess', '채용 절차')}
            </div>
          </CardContent>
        </Card>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
