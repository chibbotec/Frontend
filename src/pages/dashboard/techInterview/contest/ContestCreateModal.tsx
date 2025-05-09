import React, { useState, useEffect } from 'react';
import { useSpace } from "@/context/SpaceContext";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  questionText: string;
  techClass: string;
  answers?: {
    ai?: string;
  };
}

interface SelectedQuestion {
  techClass: string;
  questionText: string;
  aiAnswer?: string;
}

interface Participant {
  id: number;
  nickname: string;
}

interface ContestCreateRequest {
  title: string;
  createAt: string;
  timeoutMillis: number;
  problems: SelectedQuestion[];
  participants: Participant[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ContestCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const techClassOptions = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular",
  "Node.js", "Java", "Spring", "Python", "Django",
  "Database", "DevOps", "Mobile", "Algorithm", "Computer Science", "OS",
  "Network", "Security", "Cloud", "ETC"
];

export function ContestCreateModal({ isOpen, onClose, onSuccess }: ContestCreateModalProps) {
  const { currentSpace } = useSpace();
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';

  const [title, setTitle] = useState('');
  const [timeoutMinutes, setTimeoutMinutes] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 검색 조건 상태 추가
  const [searchTechClass, setSearchTechClass] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 문제 검색
  const searchQuestions = async () => {
    if (!currentSpaceId) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions/search`,
        {
          techClass: searchTechClass === 'all' ? null : searchTechClass,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null
        },
        { withCredentials: true }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error('문제 검색 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      searchQuestions();
    }
  }, [isOpen, searchTechClass, startDate, endDate]);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.some(q => 
        q.techClass === question.techClass && q.questionText === question.questionText
      );
      
      if (isSelected) {
        return prev.filter(q => 
          !(q.techClass === question.techClass && q.questionText === question.questionText)
        );
      } else {
        let aiAnswer = undefined;
        if (question.answers?.ai) {
          try {
            const parsedAi = JSON.parse(question.answers.ai);
            aiAnswer = parsedAi.answer;
          } catch (e) {
            console.error('Failed to parse AI answer:', e);
          }
        }
        
        return [...prev, { 
          techClass: question.techClass, 
          questionText: question.questionText,
          aiAnswer
        }];
      }
    });
  };

  const handleParticipantSelect = (participant: Participant) => {
    setSelectedParticipants(prev => 
      prev.some(p => p.id === participant.id)
        ? prev.filter(p => p.id !== participant.id)
        : [...prev, participant]
    );
  };

  const handleCreateContest = async () => {
    if (!currentSpaceId || !title || selectedQuestions.length === 0) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const now = new Date();
      const contestData: ContestCreateRequest = {
        title,
        createAt: now.toISOString(),
        timeoutMillis: timeoutMinutes * 60 * 1000,
        problems: selectedQuestions,
        participants: selectedParticipants
      };

      await axios.post(
        `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/contests`,
        contestData,
        { withCredentials: true }
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error('대회 생성 중 오류 발생:', error);
      alert('대회 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>테스트 등록</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 flex-1">
              <Label htmlFor="title" className="text-right w-20">
                테스트명
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="timeout" className="text-right w-20">
                제한시간(분)
              </Label>
              <Input
                id="timeout"
                type="number"
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>문제 필터</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">기술 분야</Label>
                <Select value={searchTechClass} onValueChange={setSearchTechClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="기술 분야 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {techClassOptions.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">시작 날짜</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm">종료 날짜</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="max-h-[200px] overflow-y-auto border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 bg-gray-50 text-sm w-2/8">
                      <div className="flex justify-center">
                        <Checkbox
                          id="select-all"
                          checked={selectedQuestions.length === questions.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedQuestions(questions.map(q => ({
                                techClass: q.techClass,
                                questionText: q.questionText
                              })));
                            } else {
                              setSelectedQuestions([]);
                            }
                          }}
                        />
                      </div>
                    </th>
                    <th className="p-2 text-center bg-gray-50 text-sm w-2/6">기술분야</th>
                    <th className="p-2 text-left bg-gray-50 text-sm w-4/6">문제</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.id} className="border-t">
                      <td className="p-2 w-2/8">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`question-${question.id}`}
                            checked={selectedQuestions.some(q => 
                              q.techClass === question.techClass && q.questionText === question.questionText
                            )}
                            onCheckedChange={() => handleQuestionSelect(question)}
                          />
                        </div>
                      </td>
                      <td className="p-2 w-2/6">
                        <div className="flex justify-center">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {question.techClass}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 w-5/6">{question.questionText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <Label>참여자 선택</Label>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
              {currentSpace?.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`participant-${member.id}`}
                    checked={selectedParticipants.some(p => p.id === member.id)}
                    onCheckedChange={() => handleParticipantSelect(member)}
                  />
                  <label
                    htmlFor={`participant-${member.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {member.nickname}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleCreateContest} disabled={isLoading}>
            {isLoading ? '생성 중...' : '대회 생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ContestCreateModal;
