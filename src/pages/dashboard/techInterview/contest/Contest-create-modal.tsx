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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Question {
  id: string;
  techInterviewId: number;
  questionText: string;
  techClass: string;
  aiAnswer: string | null;
  answers?: {
    ai?: string;
  };
  createdAt: string;
}

interface SelectedQuestion {
  id: string;
  techInterviewId: number;
  aiAnswer?: string;
}

interface Participant {
  id: number;
  nickname: string;
}

interface ProblemRequest {
  problemId: number;
}

interface ContestCreateRequest {
  title: string;
  createAt: string;
  timeoutMillis: number;
  problems: ProblemRequest[];
  participants: Participant[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ContestCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const techClassOptions = [
  "JAVASCRIPT", "TYPESCRIPT", "REACT", "VUE", "ANGULAR",
  "NODE.JS", "JAVA", "SPRING", "PYTHON", "DJANGO",
  "DATABASE", "DEVOPS", "MOBILE", "ALGORITHM", "CS", "OS",
  "NETWORK", "SECURITY", "CLOUD", "CSS", "ETC"
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
  const [randomQuestion, setRandomQuestion] = useState(false);
  const [randomQuestionCount, setRandomQuestionCount] = useState(1);

  // 검색 조건 상태 추가
  const [searchTechClass, setSearchTechClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 문제 검색
  const searchQuestions = async () => {
    if (!currentSpaceId) return;

    try {
      const response = await axios.post<PageResponse<Question>>(
        `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions/search`,
        {
          techClass: searchTechClass
        },
        {
          withCredentials: true,
          params: {
            page: currentPage,
            size: 10,
            sort: 'createdAt,desc'
          }
        }
      );
      setQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('문제 검색 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      searchQuestions();
    }
  }, [isOpen, searchTechClass, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.some(q => q.id === question.id);

      if (isSelected) {
        return prev.filter(q => q.id !== question.id);
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
          id: question.id,
          techInterviewId: question.techInterviewId,
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
    if (!currentSpaceId || !title || (!randomQuestion && selectedQuestions.length === 0)) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const now = new Date();
      if (randomQuestion) {
        // 랜덤 문제 대회 생성
        const randomData = {
          title,
          createAt: now.toISOString(),
          timeoutMillis: timeoutMinutes * 60 * 1000,
          participants: selectedParticipants,
          randomCount: randomQuestionCount,
          techClasses: searchTechClass ? [searchTechClass] : []
        };
        await axios.post(
          `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/contests/random`,
          randomData,
          { withCredentials: true }
        );
      } else {
        // 기존 문제 선택 대회 생성
        const contestData: ContestCreateRequest = {
          title,
          createAt: now.toISOString(),
          timeoutMillis: timeoutMinutes * 60 * 1000,
          problems: selectedQuestions.map(q => ({
            problemId: q.techInterviewId
          })),
          participants: selectedParticipants
        };
        await axios.post(
          `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/contests`,
          contestData,
          { withCredentials: true }
        );
      }
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
      <DialogContent className="sm:max-w-[90vw] md:w-[75vw] h-[80vh] flex flex-col gap-1">
        <DialogHeader>
          <DialogTitle>테스트 등록</DialogTitle>
          <div className="flex items-center justify-between">
            <DialogDescription>
              등록할 기술 문제의 정보를 입력해주세요. 등록 후 참여자들이 답변할 수 있습니다.
            </DialogDescription>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="random-submission"
                checked={randomQuestion}
                onCheckedChange={(checked) => setRandomQuestion(checked as boolean)}
                className="h-4 w-4"
              />
              <label
                htmlFor="random-submission"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                랜덤 제출
              </label>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-6">
            {/* 좌측 컨테이너: 검색 및 기술 분야 리스트 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {searchTechClass || "전체"}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSearchTechClass(null)}>
                          전체
                        </DropdownMenuItem>
                        {techClassOptions.map((tech) => (
                          <DropdownMenuItem
                            key={tech}
                            onClick={() => setSearchTechClass(tech)}
                          >
                            {tech}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {/* 모바일에서는 드롭다운, 데스크탑에서는 리스트로 표시 */}
                <div className="hidden md:block border rounded-md p-4 max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      key="all"
                      onClick={() => setSearchTechClass(null)}
                      className={`px-3 py-2 text-xs rounded-md transition-colors ${searchTechClass === null
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100'
                        }`}
                    >
                      전체
                    </button>
                    {techClassOptions.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSearchTechClass(searchTechClass === tech ? null : tech)}
                        className={`px-3 py-2 text-xs rounded-md transition-colors ${searchTechClass === tech
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 컨테이너: 문제 리스트 테이블 or 랜덤 문제 설정 */}
            <div className="border rounded-md col-span-3">
              {randomQuestion ? (
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="random-techclass">기술 분야</Label>
                    <select
                      id="random-techclass"
                      className="border rounded-md p-2"
                      value={searchTechClass || ''}
                      onChange={e => setSearchTechClass(e.target.value || null)}
                    >
                      <option value="">전체</option>
                      {techClassOptions.map((tech) => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="random-count">문제 개수</Label>
                    <Input
                      id="random-count"
                      type="number"
                      min={1}
                      max={20}
                      value={randomQuestionCount}
                      onChange={(e) => setRandomQuestionCount(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <div className="text-gray-500 text-xs">* 대회 생성 시, 선택한 분야에서 무작위로 문제가 출제됩니다.</div>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="p-4 text-center">로딩 중...</div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">선택</TableHead>
                            <TableHead className='w-[80px] md:w-auto'>기술 분야</TableHead>
                            <TableHead className='w-[50px] text-center hidden md:table-cell'>AI답변</TableHead>
                            <TableHead className='w-[80px] md:w-auto'>문제내용</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {questions.map((question) => (
                            <TableRow
                              key={question.id}
                              className={`cursor-pointer hover:bg-gray-50 ${!question.aiAnswer ? 'opacity-50' : ''}`}
                              onClick={() => question.aiAnswer && handleQuestionSelect(question)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedQuestions.some(q => q.id === question.id)}
                                    onChange={() => question.aiAnswer && handleQuestionSelect(question)}
                                    className="h-4 w-4 rounded border-gray-300"
                                    disabled={!question.aiAnswer}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs ${question.aiAnswer
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-500'
                                  }`}>
                                  {question.techClass}
                                </span>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs ${question.aiAnswer
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-500'
                                  }`}>
                                  {question.aiAnswer ? '있음' : '없음'}
                                </span>
                              </TableCell>
                              <TableCell className="text-[10px] md:text-xs md:whitespace-nowrap md:break-normal whitespace-normal break-words">
                                {question.questionText.length > 50
                                  ? question.questionText.slice(0, 50) + '...'
                                  : question.questionText}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                          >
                            이전
                          </Button>
                          <span className="flex items-center px-4">
                            {currentPage + 1} / {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                          >
                            다음
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t pt-3 mt-0">
          <Label>참여자 선택</Label>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-min p-2">
              {currentSpace?.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 shrink-0">
                  <Checkbox
                    id={`participant-${member.id}`}
                    checked={selectedParticipants.some(p => p.id === member.id)}
                    onCheckedChange={() => handleParticipantSelect(member)}
                  />
                  <label
                    htmlFor={`participant-${member.id}`}
                    className="text-sm cursor-pointer whitespace-nowrap"
                  >
                    {member.nickname}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-2 mt-2">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Label htmlFor="title" className="text-right w-20 shrink-0">
                  테스트명
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Label htmlFor="timeout" className="text-right w-20 shrink-0">
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
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <Button variant="outline" onClick={onClose} className="flex-1 md:flex-none">
                취소
              </Button>
              <Button onClick={handleCreateContest} disabled={isLoading} className="flex-1 md:flex-none">
                {isLoading ? '생성 중...' : '대회 생성'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ContestCreateModal;
