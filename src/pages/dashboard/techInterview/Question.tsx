import React, { useState, useEffect } from 'react';
import { useSpace } from "@/context/SpaceContext";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Eye } from "lucide-react";
import { useParams } from "react-router-dom";


// 타입 정의
interface Participant {
  id: number;
  nickname: string;
}

interface Question {
  id: string;
  spaceId: number;
  techClass: string;
  questionText: string;
  author: Participant;
  createdAt: string;
  participants: Participant[];
  answers?: Record<string, string>;
}

interface SpaceMemberRequest {
  id: number;
  nickname: string;
}

interface QuestionCreateRequest {
  techClass: string;
  questionText: string;
  participants: SpaceMemberRequest[];
}

// API 기본 URL (실제 환경에 맞게 수정 필요)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// 기술 분야 옵션
const techClassOptions = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular",
  "Node.js", "Java", "Spring", "Python", "Django",
  "Database", "DevOps", "Mobile", "Algorithm"
];

export function QuestionsTable() {
  const { currentSpace } = useSpace(); // SpaceContext에서 현재 스페이스 정보 가져오기
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);


  const [newQuestion, setNewQuestion] = useState<QuestionCreateRequest>({
    techClass: "JavaScript",
    questionText: "",
    participants: currentSpace ?
        currentSpace.members.map(member => ({
          id: member.id,
          nickname: member.nickname
        })) :
        [] // 현재 스페이스 멤버가 있으면 멤버 목록으로, 없으면 빈 배열
  });

  useEffect(() => {
    if (currentSpace) {
      setNewQuestion(prev => ({
        ...prev,
        participants: currentSpace.members.map(member => ({
          id: member.id,
          nickname: member.nickname
        }))
      }));
    }
  }, [currentSpace]);

  // 문제 목록 가져오기
  const fetchQuestions = async () => {
    if (!currentSpaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions`, {
        withCredentials: true
      });
      setQuestions(response.data);
    } catch (err) {
      console.error('문제 목록을 가져오는 중 오류 발생:', err);
      setError('문제 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 문제 목록 가져오기
  useEffect(() => {
    fetchQuestions();
  }, [currentSpaceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewQuestion({
      ...newQuestion,
      [name]: value
    });
  };

// 새 문제 등록
const handleAddQuestion = async () => {
  if (!currentSpaceId) {
    alert('유효한 스페이스 ID가 없습니다.');
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions`,
      newQuestion,
      { withCredentials: true }
    );

    console.log('새 문제 등록 결과:', response.data);

    // 성공적으로 추가되면 목록 새로고침
    fetchQuestions();

    // 입력 폼 초기화 - 현재 스페이스 멤버를 유지
    setNewQuestion({
      techClass: "JavaScript",
      questionText: "",
      participants: currentSpace ? 
        currentSpace.members.map(member => ({
          id: member.id,
          nickname: member.nickname
        })) : []
    });

    // 다이얼로그 닫기
    setIsDialogOpen(false);
  } catch (err) {
    console.error('문제 등록 중 오류 발생:', err);
    alert('문제를 등록하는데 실패했습니다.');
  }
};

  // 문제 삭제
  const handleDeleteQuestion = async (id: string) => {
    if (!currentSpaceId) {
      alert('유효한 스페이스 ID가 없습니다.');
      return;
    }

    if (!confirm('정말로 이 문제를 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 실제 API 호출로 삭제 요청
      await axios.delete(`${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions/${id}`, {
        withCredentials: true
      });

      // 성공적으로 삭제되면 UI에서도 제거
      setQuestions(questions.filter(question => question.id !== id));

      // 상세 보기 다이얼로그가 열려있으면 닫기
      if (selectedQuestion?.id === id) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      console.error('문제 삭제 중 오류 발생:', err);
      alert('문제를 삭제하는데 실패했습니다.');
    }
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 질문 텍스트 줄임 처리
  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <div className="text-center p-6">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">문제 관리</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                새 문제 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>새 기술 문제 등록</DialogTitle>
                <DialogDescription>
                  등록할 기술 문제의 정보를 입력해주세요. 등록 후 참여자들이 답변할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="techClass" className="text-right">
                    기술 분야
                  </Label>
                  <select
                      id="techClass"
                      name="techClass"
                      value={newQuestion.techClass}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    {techClassOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="questionText" className="text-right pt-2">
                    문제 내용
                  </Label>
                  <textarea
                      id="questionText"
                      name="questionText"
                      value={newQuestion.questionText}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
                      placeholder="기술 면접 문제를 입력하세요..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="submit" onClick={handleAddQuestion}>등록하기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableCaption>현재 등록된 기술 문제 목록입니다.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[120px]">기술 분야</TableHead>
              <TableHead>문제 내용</TableHead>
              <TableHead className="w-[120px]">작성자</TableHead>
              <TableHead className="w-[150px]">등록일</TableHead>
              <TableHead className="w-[80px]">참여자</TableHead>
              <TableHead className="text-right w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    등록된 문제가 없습니다. 새 문제를 등록해보세요.
                  </TableCell>
                </TableRow>
            ) : (
                questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.id}</TableCell>
                      <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {question.techClass}
                  </span>
                      </TableCell>
                      <TableCell>{truncateText(question.questionText)}</TableCell>
                      <TableCell>{question.author.nickname}</TableCell>
                      <TableCell>{formatDate(question.createdAt)}</TableCell>
                      <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {question.participants.length}명
                  </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQuestion(question)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>총 문제 수</TableCell>
              <TableCell className="text-right">{questions.length}개</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* 문제 상세 보기 다이얼로그 */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedQuestion && (
                <>
                  <DialogHeader>
                    <DialogTitle>문제 상세 정보</DialogTitle>
                    <DialogDescription>
                      ID: {selectedQuestion.id} | 등록일: {formatDate(selectedQuestion.createdAt)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">기술 분야</h3>
                      <p className="px-2 py-1 rounded-md text-sm bg-blue-50 text-blue-800 inline-block">
                        {selectedQuestion.techClass}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">작성자</h3>
                      <p className="text-sm">
                        {selectedQuestion.author.nickname} (ID: {selectedQuestion.author.id})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">문제 내용</h3>
                      <p className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                        {selectedQuestion.questionText}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">참여자 목록</h3>
                      {selectedQuestion.participants.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedQuestion.participants.map(participant => (
                                <span
                                    key={participant.id}
                                    className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                                >
                          {participant.nickname}
                        </span>
                            ))}
                          </div>
                      ) : (
                          <p className="text-sm text-gray-500">아직 참여자가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}

export default QuestionsTable;