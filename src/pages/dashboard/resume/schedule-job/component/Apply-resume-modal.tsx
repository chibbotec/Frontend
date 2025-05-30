import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import axios from 'axios';

interface Resume {
  id: string;
  title: string;
  createdAt: string;
}

interface ApplyResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resume: Resume) => void;
  spaceId: string;
}

const apiUrl = import.meta.env.VITE_API_URL || '';

// Mock data for testing
/*
const MOCK_RESUMES: Resume[] = [
  {
    id: '1',
    title: '프론트엔드 개발자 이력서',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    title: '백엔드 개발자 이력서',
    createdAt: '2024-03-21',
  },
  {
    id: '3',
    title: '풀스택 개발자 이력서',
    createdAt: '2024-03-22',
  },
];
*/

export const ApplyResumeModal: React.FC<ApplyResumeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  spaceId,
}) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Resume[]>(`${apiUrl}/api/v1/resume/${spaceId}/resume`, {
          withCredentials: true
        });
        setResumes(response.data);
      } catch (error) {
        console.error('이력서 목록을 불러오는데 실패했습니다:', error);
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && spaceId) {
      fetchResumes();
    }
  }, [isOpen, spaceId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>이력서 선택</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    onSelect(resume);
                    onClose();
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{resume.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(resume.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">작성된 이력서가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
