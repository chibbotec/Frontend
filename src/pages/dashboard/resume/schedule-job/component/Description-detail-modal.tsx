import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface DescriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: JobDescription | null;
  onDeleted?: () => void;
  onEdit?: () => void;
}

export const DescriptionDetailModal: React.FC<DescriptionDetailModalProps> = ({
  isOpen,
  onClose,
  jobDescription,
  onDeleted,
  onEdit,
}) => {
  if (!jobDescription) return null;

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleDelete = async () => {
    if (!jobDescription) return;
    try {
      await axios.delete(
        `${apiUrl}/api/v1/resume/${jobDescription.spaceId}/job-description/${jobDescription.id}`,
        { withCredentials: true }
      );
      if (onDeleted) onDeleted();
      onClose();
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] h-[80vh] sm:h-[85vh] p-4 sm:p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{jobDescription.company}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${jobDescription.publicGrade === 'PUBLIC'
              ? 'bg-blue-100 text-blue-700'
              : jobDescription.publicGrade === 'GROUP'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
              }`}>
              {jobDescription.publicGrade === 'PUBLIC'
                ? '전체'
                : jobDescription.publicGrade === 'GROUP'
                  ? '그룹'
                  : '개인'}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="h-full px-4 sm:px-6">
            <div className="h-full overflow-y-auto space-y-3 text-sm break-words [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                <div className="text-gray-600 mt-1 pl-4">
                  {jobDescription.mainTasks.map((task, index) => (
                    <p key={index} className="relative pl-4 before:content-['•'] before:absolute before:left-0">
                      {task}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">자격요건 : </span>
                <div className="text-gray-600 mt-1 pl-4">
                  {jobDescription.requirements.map((req, index) => (
                    <p key={index} className="relative pl-4 before:content-['•'] before:absolute before:left-0">
                      {req}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">경력 : </span>
                <span className="text-gray-600">{jobDescription.career}</span>
              </div>
              <div>
                <span className="font-medium">이력서 포함 사항 : </span>
                <div className="text-gray-600 mt-1 pl-4">
                  {jobDescription.resumeRequirements.map((req, index) => (
                    <p key={index} className="relative pl-4 before:content-['•'] before:absolute before:left-0">
                      {req}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">채용 절차 : </span>
                <div className="text-gray-600 mt-1">
                  <p>{jobDescription.recruitmentProcess.join(' → ')}</p>
                </div>
              </div>
              {jobDescription.url && (
                <div>
                  <span className="font-medium">원본 URL : </span>
                  <a
                    href={jobDescription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {jobDescription.url}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            삭제하기
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            수정하기
          </Button>
          <Button
            onClick={() => {
              // TODO: 이력서 작성 페이지로 이동하는 로직 추가
              console.log('이력서 작성 페이지로 이동', jobDescription?.id);
            }}
            className="w-full sm:w-auto"
          >
            맞춤 이력서 작성하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
