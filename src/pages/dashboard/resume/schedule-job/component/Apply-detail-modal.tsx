import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProcessCard } from './Drag-and-Drop-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { Building2, Briefcase, Globe, Clock, FileText, FolderOpen, Paperclip } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApplyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: ProcessCard;
  onStatusChange?: (cardId: string, newStatus: string) => void;
  spaceId: string;
  onDeleted?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'RESUME', label: '지원서' },
  { value: 'DOCUMENT', label: '서류' },
  { value: 'CODING', label: '코딩테스트' },
  { value: 'INTERVIEW1', label: '1차면접' },
  { value: 'INTERVIEW2', label: '2차면접' },
  { value: 'PASS', label: '합격' },
  { value: 'FAIL', label: '불합격' },
];

export const ApplyDetailModal: React.FC<ApplyDetailModalProps> = ({
  isOpen,
  onClose,
  card,
  onStatusChange,
  spaceId,
  onDeleted,
}) => {
  console.log('Modal rendering:', { isOpen, card }); // 디버깅용 로그

  const handleStatusChange = async (newStatus: string) => {
    console.log('Status changed:', newStatus);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.patch(
        `${apiUrl}/api/v1/resume/${spaceId}/job-application/${card.id}/process`,
        newStatus,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      if (onStatusChange) {
        onStatusChange(card.id, newStatus);
        // Update the card's status and section
        card.status = newStatus;
        card.section = newStatus.toLowerCase();
      }
    } catch (error) {
      console.error('상태 변경에 실패했습니다:', error);
      // TODO: 에러 메시지를 사용자에게 보여주는 로직 추가
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">지원 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">
                    회사명
                  </label>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">{card.company}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">
                    직무
                  </label>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">{card.position}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-700">
                  플랫폼
                </label>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">{card.platform || '없음'}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-700">
                  상태
                </label>
              </div>
              <Select
                defaultValue={card.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
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
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{card.resume.title}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 포트폴리오 섹션 */}
          {card.portfolio.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/30 py-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      포트폴리오
                    </label>
                  </div>
                  <div className="space-y-2">
                    {card.portfolio.map((p) => (
                      <div key={p.id} className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                            <FolderOpen className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{p.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 첨부파일 섹션 */}
          {card.files.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/30 py-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      첨부파일
                    </label>
                  </div>
                  <div className="space-y-2">
                    {card.files.map((file, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                            <Paperclip className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 버튼 섹션 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (window.confirm('정말로 이 지원을 삭제하시겠습니까?')) {
                  try {
                    const apiUrl = import.meta.env.VITE_API_URL || '';
                    await axios.delete(
                      `${apiUrl}/api/v1/resume/${spaceId}/job-application/${card.id}`,
                      {
                        withCredentials: true
                      }
                    );
                    onClose();
                    if (onDeleted) {
                      onDeleted();
                    }
                  } catch (error) {
                    console.error('지원 삭제에 실패했습니다:', error);
                    alert('지원 삭제에 실패했습니다.');
                  }
                }
              }}
              className="px-6 hover:bg-red-50 transition-all duration-200"
            >
              삭제
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 hover:bg-gray-50 transition-all duration-200"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
