import React, { useState, useEffect } from 'react';
import { useSpace } from "@/context/SpaceContext";
import { useAuth } from "@/context/AuthContext";
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
import { useParams, useNavigate } from "react-router-dom";
import { StudyCreateModal } from './Study-create-modal';
import { mockQuestions } from '@/mock-data/Study-list-mock';


// 타입 정의
interface Participant {
  id: number;
  nickname: string;
}

interface Question {
  id: number;
  spaceId: number;
  techInterviewId: number;
  techClass: string;
  aiAnswer: string | null;
  keyPoints: string | null;
  additionalTopics: string | null;
  questionText: string;
  author: Participant;
  participants: Participant[];
  answers: any[];
  createdAt: string;
  updatedAt: string;
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

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// API 기본 URL (실제 환경에 맞게 수정 필요)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// 기술 분야 옵션
const techClassOptions = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular",
  "Node.js", "Java", "Spring", "Python", "Django",
  "Database", "DevOps", "Mobile", "Algorithm", "Computer Science", "OS",
  "Network", "Security", "Cloud", "ETC"
];

export function QuestionsTable() {
  const { currentSpace } = useSpace();
  const { isGuest } = useAuth(); // AuthContext에서 게스트 모드 상태 가져오기
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTechClass, setSelectedTechClass] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);


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
    setIsLoading(true);
    setError(null);

    if (isGuest) {
      // 게스트 모드일 때는 목데이터 사용
      const filteredQuestions = selectedTechClass
        ? mockQuestions.filter(q => q.techClass === selectedTechClass)
        : mockQuestions;

      const startIndex = currentPage * 10;
      const endIndex = startIndex + 10;
      const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

      setQuestions(paginatedQuestions);
      setTotalPages(Math.ceil(filteredQuestions.length / 10));
      setTotalElements(filteredQuestions.length);
      setIsLoading(false);
      return;
    }

    // 로그인 모드일 때만 API 호출
    if (!currentSpaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get<PageResponse<Question>>(
        `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions`,
        {
          withCredentials: true,
          params: {
            page: currentPage,
            size: 10,
            'tech-class': selectedTechClass ? selectedTechClass.replace(/\s+/g, '_').toUpperCase() : undefined
          }
        }
      );
      setQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
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
  }, [currentSpaceId, currentPage, selectedTechClass]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewQuestion({
      ...newQuestion,
      [name]: value
    });
  };

  // 새 문제 등록
  const handleAddQuestion = async () => {
    /* 모달로 이동
    if (!currentSpaceId) {
      alert('유효한 스페이스 ID가 없습니다.');
      return;
    }

    try {
      // Convert techClass to match backend enum format
      const requestData = {
        ...newQuestion,
        techClass: newQuestion.techClass.replace(/\s+/g, '_').toUpperCase()
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions`,
        requestData,
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
    */
    fetchQuestions(); // 목록 새로고침
    setIsDialogOpen(false);
  };

  // 문제 삭제
  const handleDeleteQuestion = async (id: number) => {
    if (!currentSpaceId) {
      alert('유효한 스페이스 ID가 없습니다.');
      return;
    }

    if (!confirm('정말로 이 문제를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/questions/${id}`, {
        withCredentials: true
      });

      // 현재 페이지의 마지막 항목을 삭제한 경우
      if (questions.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        // 현재 페이지 데이터 다시 로드
        fetchQuestions();
      }
    } catch (err) {
      console.error('문제 삭제 중 오류 발생:', err);
      alert('문제를 삭제하는데 실패했습니다.');
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${year}.${month}.${day} ${ampm} ${hour12}:${minutes}`;
  };

  // 질문 텍스트 줄임 처리
  const truncateText = (text: string, maxLength = 48) => {
    const mobileMaxLength = 15;
    if (window.innerWidth < 640) { // sm 브레이크포인트
      if (text.length <= mobileMaxLength) return text;
      return text.substring(0, mobileMaxLength) + '...';
    }
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 문제 상세 페이지로 이동
  const handleQuestionClick = (questionId: number) => {
    navigate(`/space/${currentSpaceId}/interview/questions/${questionId}`);
  };

  if (isLoading) {
    return <div className="text-center p-6">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-2 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">문제 관리</h2>
        {!isGuest && (
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            새 문제 등록
          </Button>
        )}
        {isDialogOpen && !isGuest && (
          <StudyCreateModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleAddQuestion}
            existingQuestions={questions}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* 좌측 컨테이너: 기술 분야 필터 */}
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3">기술 분야</h3>
            <div className="flex flex-wrap md:grid md:grid-cols-2 gap-1">
              <button
                key="all"
                onClick={() => setSelectedTechClass(null)}
                className={`px-2 py-1 text-xs rounded-md transition-colors text-left ${selectedTechClass === null
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
                  }`}
              >
                전체
              </button>
              {techClassOptions.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTechClass(tech)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors text-left ${selectedTechClass === tech
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

        {/* 우측 컨테이너: 문제 테이블 */}
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sm:w-[10px] w-[80px] text-center">기술 분야</TableHead>
                  <TableHead>문제 내용</TableHead>
                  <TableHead className="w-[80px] text-center hidden sm:table-cell">작성자</TableHead>
                  <TableHead className="w-[150px] text-center hidden sm:table-cell">등록일</TableHead>
                  <TableHead className="w-[80px] text-center hidden sm:table-cell">참여자</TableHead>
                  <TableHead className="sm:w-[10px] w-[60px] text-center">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      등록된 문제가 없습니다. 새 문제를 등록해보세요.
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="text-center">
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800">
                          {question.techClass}
                        </span>
                      </TableCell>
                      <TableCell
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => handleQuestionClick(question.id)}
                      >
                        {truncateText(question.questionText)}
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{question.author.nickname}</TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{formatDate(question.createdAt)}</TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-green-100 text-green-800">
                          {question.participants.length}명
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {!isGuest && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-left">총 문제 수</TableCell>
                  <TableCell colSpan={2} className="hidden sm:table-cell"></TableCell>
                  <TableCell colSpan={2} className="text-center">{totalElements}개</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          {/* 페이지네이션 */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              총 {totalElements}개의 문제
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </button>
              <span className="text-sm">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsTable;