import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProcessCard } from './Drag-and-Drop-card';
import { Card, CardContent } from '@/components/ui/card';
import { FileUp, X, Building2, Briefcase, Globe, FileText, FolderOpen, Paperclip } from 'lucide-react';
import { ApplyResumeModal } from './Apply-resume-modal';
import { ApplyPortfolioModal } from './Apply-portfolio-modal';
import axios from 'axios';

interface ApplyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCard: ProcessCard) => void;
  spaceId: string;
}

interface Resume {
  id: string;
  title: string;
  createdAt: string;
}

interface Portfolio {
  id: string;
  title: string;
  createdAt: string;
}

interface PortfolioDto {
  id: string;
  title: string;
}

const PLATFORM_OPTIONS = [
  { value: '잡코리아', label: '잡코리아' },
  { value: '사람인', label: '사람인' },
  { value: '원티드', label: '원티드' },
  { value: '기타', label: '기타' },
];

// Mock data for testing
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

const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: '1',
    title: '프로젝트 A',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    title: '프로젝트 B',
    createdAt: '2024-03-21',
  },
  {
    id: '3',
    title: '프로젝트 C',
    createdAt: '2024-03-22',
  },
];

export const ApplyCreateModal: React.FC<ApplyCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  spaceId,
}) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    platform: '잡코리아',
    resume: { id: '', title: '' },
    portfolio: [] as PortfolioDto[],
    files: [] as File[],
  });

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedPortfolios, setSelectedPortfolios] = useState<Portfolio[]>([]);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('company', formData.company);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('platform', formData.platform);

      // Append resume data
      formDataToSend.append('resume.id', formData.resume.id);
      formDataToSend.append('resume.title', formData.resume.title);

      // Append portfolios data as JSON string
      formDataToSend.append('portfolios', JSON.stringify(formData.portfolio));

      // Append files
      formData.files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const response = await axios.post(
        `${apiUrl}/api/v1/resume/${spaceId}/job-application`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const newCard: ProcessCard = {
        id: response.data.id,
        company: response.data.company,
        position: response.data.position,
        platform: response.data.platform,
        status: response.data.processStatus,
        date: new Date().toISOString().split('T')[0],
        section: response.data.processStatus.toLowerCase(),
        resume: response.data.resume,
        portfolio: response.data.portfolios,
        files: response.data.files.map((f: any) => new File([], f.oringinalFileName))
      };

      onSubmit(newCard);
      onClose();
      setFormData({
        company: '',
        position: '',
        platform: '잡코리아',
        resume: { id: '', title: '' },
        portfolio: [],
        files: []
      });
      setSelectedResume(null);
      setSelectedPortfolios([]);
    } catch (error) {
      console.error('지원서 생성에 실패했습니다:', error);
      // TODO: 에러 메시지를 사용자에게 보여주는 로직 추가
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleResumeSelect = (resume: Resume) => {
    setSelectedResume(resume);
    setFormData(prev => ({
      ...prev,
      resume: { id: resume.id, title: resume.title }
    }));
  };

  const handlePortfolioSelect = (portfolios: Portfolio[]) => {
    setSelectedPortfolios(portfolios);
    setFormData(prev => ({
      ...prev,
      portfolio: portfolios.map(p => ({ id: p.id, title: p.title }))
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold text-gray-900">새 지원서 추가</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">
                      회사명 *
                    </label>
                  </div>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="회사명을 입력하세요"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <label htmlFor="position" className="text-sm font-medium text-gray-700">
                      직무 *
                    </label>
                  </div>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="직무를 입력하세요"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <label htmlFor="platform" className="text-sm font-medium text-gray-700">
                    플랫폼
                  </label>
                </div>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <SelectValue placeholder="플랫폼 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 이력서 섹션 */}
            <Card className="border-blue-200 bg-blue-50/30 py-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      이력서
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 border-blue-200 hover:bg-white hover:border-blue-300 transition-all duration-200"
                    onClick={() => setIsResumeModalOpen(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {selectedResume ? selectedResume.title : '이력서를 선택하세요'}
                        </div>
                        {!selectedResume && (
                          <div className="text-xs text-blue-500 mt-1">
                            저장된 이력서 중에서 선택할 수 있습니다
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 포트폴리오 섹션 */}
            <Card className="border-blue-200 bg-blue-50/30 py-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      포트폴리오
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 border-blue-200 hover:bg-white hover:border-blue-300 transition-all duration-200"
                    onClick={() => setIsPortfolioModalOpen(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {selectedPortfolios.length > 0
                            ? `${selectedPortfolios.length}개의 포트폴리오 선택됨`
                            : '포트폴리오를 선택하세요'}
                        </div>
                        <div className="text-xs text-blue-500 mt-1">
                          {selectedPortfolios.length > 0
                            ? '여러 개의 포트폴리오를 선택할 수 있습니다'
                            : '저장된 포트폴리오 중에서 선택할 수 있습니다'
                          }
                        </div>
                      </div>
                    </div>
                  </Button>

                  {selectedPortfolios.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {selectedPortfolios.map((portfolio) => (
                        <div key={portfolio.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 group">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                              <FolderOpen className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate flex-1">{portfolio.title}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            onClick={() => {
                              setSelectedPortfolios(prev => prev.filter(p => p.id !== portfolio.id));
                              setFormData(prev => ({
                                ...prev,
                                portfolio: prev.portfolio.filter(p => p.id !== portfolio.id)
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 첨부파일 섹션 */}
            <Card className="border-blue-200 bg-blue-50/30 py-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      첨부파일
                    </label>
                  </div>

                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-24 px-4 py-6 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-white hover:border-blue-300 transition-all duration-200 group"
                  >
                    <FileUp className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <span className="text-sm text-gray-600 font-medium mt-2">
                      파일을 선택하거나 여기에 드래그하세요
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX, JPG, PNG 등
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {formData.files.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 group">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                              <Paperclip className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate flex-1">{file.name}</span>
                            <span className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 버튼 섹션 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 hover:bg-gray-50 transition-all duration-200"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                추가
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ApplyResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSelect={handleResumeSelect}
        spaceId={spaceId}
      />

      <ApplyPortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onSelect={handlePortfolioSelect}
        spaceId={spaceId}
      />
    </>
  );
};