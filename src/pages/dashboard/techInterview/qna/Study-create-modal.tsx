import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSpace } from "@/context/SpaceContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// 타입 정의
interface Participant {
  id: number;
  nickname: string;
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

// DefaultQuestionResponse 타입 정의
interface DefaultQuestionResponse {
  id: number;
  techClass: string;
  aiAnswer: string;
  keyPoints: string;
  additionalTopics: string;
  questionText: string;
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

interface StudyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  existingQuestions: Question[];
}

export const StudyCreateModal: React.FC<StudyCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingQuestions,
}) => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { currentSpace } = useSpace();
  const [activeTab, setActiveTab] = useState("database");
  const [questions, setQuestions] = useState<DefaultQuestionResponse[]>([]);
  const [publicQuestions, setPublicQuestions] = useState<DefaultQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublicLoading, setIsPublicLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicError, setPublicError] = useState<string | null>(null);
  const [selectedTechClass, setSelectedTechClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [directQuestions, setDirectQuestions] = useState<Array<{
    techClass: string;
    questionText: string;
    isPublic: boolean;
  }>>([{
    techClass: "",
    questionText: "",
    isPublic: true
  }]);
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
  const [validationErrors, setValidationErrors] = useState<Array<{
    techClass: boolean;
    questionText: boolean;
  }>>([]);
  const [publicCurrentPage, setPublicCurrentPage] = useState(1);
  const publicItemsPerPage = 8;

  // 모달이 열릴 때 데이터베이스에서 문제 목록 가져오기
  useEffect(() => {
    if (isOpen && activeTab === "database") {
      fetchQuestions();
    }
    if (isOpen && activeTab === "public") {
      fetchPublicQuestions();
    }
  }, [isOpen, activeTab]);

  const fetchQuestions = async () => {
    if (!spaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<DefaultQuestionResponse[]>(
        `${API_BASE_URL}/api/v1/tech-interview/${spaceId}/questions/db/DEFAULT`,
        { withCredentials: true }
      );
      setQuestions(response.data);
    } catch (err) {
      console.error('문제 목록을 가져오는 중 오류 발생:', err);
      setError('문제 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublicQuestions = async () => {
    if (!spaceId) {
      setPublicError('유효한 스페이스 ID가 없습니다.');
      return;
    }
    setIsPublicLoading(true);
    setPublicError(null);
    try {
      const response = await axios.get<DefaultQuestionResponse[]>(
        `${API_BASE_URL}/api/v1/tech-interview/${spaceId}/questions/db/PUBLIC`,
        { withCredentials: true }
      );
      setPublicQuestions(response.data);
    } catch (err) {
      console.error('공개 문제 목록을 가져오는 중 오류 발생:', err);
      setPublicError('공개 문제 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsPublicLoading(false);
    }
  };

  // 필터링된 문제 목록
  const filteredQuestions = questions.filter(question => {
    const matchesTechClass = !selectedTechClass || question.techClass === selectedTechClass;
    const matchesSearch = !searchQuery ||
      question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.keyPoints?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTechClass && matchesSearch;
  });

  // 공개문제 필터링 및 페이지네이션
  const filteredPublicQuestions = publicQuestions.filter(question => {
    const matchesTechClass = !selectedTechClass || question.techClass === selectedTechClass;
    const matchesSearch = !searchQuery ||
      question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.keyPoints?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTechClass && matchesSearch;
  });

  // 이미 등록된 문제인지 확인하는 함수
  const isAlreadyRegistered = (questionId: number) => {
    return existingQuestions.some(
      existing => existing.techInterviewId === questionId
    );
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  // 공개문제 페이지네이션 계산
  const publicTotalPages = Math.ceil(filteredPublicQuestions.length / publicItemsPerPage);
  const publicStartIndex = (publicCurrentPage - 1) * publicItemsPerPage;
  const paginatedPublicQuestions = filteredPublicQuestions.slice(publicStartIndex, publicStartIndex + publicItemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 공개문제 페이지 변경 핸들러
  const handlePublicPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= publicTotalPages) {
      setPublicCurrentPage(newPage);
    }
  };

  // 검색어나 필터가 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTechClass]);

  // 공개문제 검색/필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPublicCurrentPage(1);
  }, [searchQuery, selectedTechClass]);

  // 체크박스 핸들러
  const handleCheckboxChange = (questionId: number) => {
    setSelectedQuestionIds(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // 행 클릭 핸들러
  const handleRowClick = (questionId: number) => {
    handleCheckboxChange(questionId);
  };

  // Add new question form
  const handleAddQuestionForm = () => {
    setDirectQuestions([...directQuestions, {
      techClass: "",
      questionText: "",
      isPublic: true
    }]);
    setValidationErrors([...validationErrors, { techClass: false, questionText: false }]);
  };

  // Remove question form
  const handleRemoveQuestionForm = (index: number) => {
    setDirectQuestions(directQuestions.filter((_, i) => i !== index));
    setValidationErrors(validationErrors.filter((_, i) => i !== index));
  };

  // Update question form
  const handleQuestionChange = (index: number, field: 'techClass' | 'questionText' | 'isPublic', value: string | boolean) => {
    const updatedQuestions = [...directQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setDirectQuestions(updatedQuestions);

    // validation 상태 업데이트 (isPublic이 아닌 경우에만)
    if (field !== 'isPublic') {
      const updatedValidation = [...validationErrors];
      updatedValidation[index] = {
        ...updatedValidation[index],
        [field]: !value
      };
      setValidationErrors(updatedValidation);
    }
  };

  // 직접 문제 등록 핸들러
  const handleDirectSubmit = async () => {
    if (!spaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      return;
    }

    // 모든 필드 validation 체크
    const hasErrors = directQuestions.some((question, index) => {
      const techClassError = !question.techClass;
      const questionTextError = !question.questionText.trim();

      const updatedValidation = [...validationErrors];
      updatedValidation[index] = {
        techClass: techClassError,
        questionText: questionTextError
      };
      setValidationErrors(updatedValidation);

      return techClassError || questionTextError;
    });

    if (hasErrors) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // 모든 문제를 한 번에 제출
      const requestData = {
        questions: directQuestions.map(question => ({
          techClass: question.techClass.replace(/\s+/g, '_').toUpperCase(),
          questionText: question.questionText,
          interviewType: question.isPublic ? 'PUBLIC' : 'PRIVATE'
        })),
        participants: currentSpace ?
          currentSpace.members.map(member => ({
            id: member.id,
            nickname: member.nickname
          })) : []
      };

      await axios.post(
        `${API_BASE_URL}/api/v1/tech-interview/${spaceId}/questions`,
        requestData,
        { withCredentials: true }
      );

      onSubmit();
    } catch (err) {
      console.error('문제 등록 중 오류 발생:', err);
      setError('문제 등록에 실패했습니다.');
    }
  };

  // 선택한 문제들 등록
  const handleSubmit = async () => {
    if (!spaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      setError('하나 이상의 문제를 선택해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/tech-interview/${spaceId}/questions/db`,
        {
          questionIds: selectedQuestionIds,
          participants: currentSpace ?
            currentSpace.members.map(member => ({
              id: member.id,
              nickname: member.nickname
            })) : []
        },
        { withCredentials: true }
      );

      console.log('선택한 문제 등록 결과:', response.data);
      onSubmit();
    } catch (err) {
      console.error('문제 등록 중 오류 발생:', err);
      setError('문제 등록에 실패했습니다.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70vw] w-[70vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>새 기술 문제 등록</DialogTitle>
          <DialogDescription>
            등록할 기술 문제의 정보를 입력해주세요. 등록 후 참여자들이 답변할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pt-1">
          <Tabs defaultValue="database" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="database">데이터베이스</TabsTrigger>
              <TabsTrigger value="public">공개문제</TabsTrigger>
              <TabsTrigger value="direct">직접 제출</TabsTrigger>
            </TabsList>
            <TabsContent value="database" className="mt-0">
              <div className="grid grid-cols-4 gap-6">
                {/* 좌측 컨테이너: 검색 및 기술 분야 리스트 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="검색어를 입력하세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="border rounded-md p-4 max-h-[350px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          key="all"
                          onClick={() => setSelectedTechClass(null)}
                          className={`px-3 py-2 text-xs rounded-md transition-colors ${selectedTechClass === null
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                            }`}
                        >
                          전체
                        </button>
                        {["JAVASCRIPT", "TYPESCRIPT", "REACT", "VUE", "ANGULAR", "NODE.JS", "JAVA", "SPRING", "PYTHON", "DJANGO", "DATABASE", "DEVOPS", "MOBILE", "ALGORITHM", "CS", "OS", "NETWORK", "SECURITY", "CLOUD", "CSS", "ETC"].map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedTechClass(selectedTechClass === tech ? null : tech)}
                            className={`px-3 py-2 text-xs rounded-md transition-colors ${selectedTechClass === tech
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

                {/* 우측 컨테이너: 문제 리스트 테이블 */}
                <div className="border rounded-md col-span-3">
                  {isLoading ? (
                    <div className="p-4 text-center">로딩 중...</div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">선택</TableHead>
                          <TableHead>기술 분야</TableHead>
                          <TableHead>문제 내용</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedQuestions.map((question) => {
                          const registered = isAlreadyRegistered(question.id);
                          return (
                            <TableRow
                              key={question.id}
                              className={`cursor-pointer hover:bg-gray-50 ${registered ? 'bg-gray-50' : ''}`}
                              onClick={() => !registered && handleRowClick(question.id)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedQuestionIds.includes(question.id)}
                                    onChange={() => !registered && handleCheckboxChange(question.id)}
                                    className="h-4 w-4 rounded border-gray-300"
                                    disabled={registered}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  {registered && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      이미 등록됨
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {question.techClass}
                                </span>
                              </TableCell>
                              <TableCell>
                                {question.questionText.length > 50
                                  ? `${question.questionText.slice(0, 50)}...`
                                  : question.questionText}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                  {/* 페이지네이션 */}
                  <div className="px-4 py-3 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        총 {filteredQuestions.length}개의 문제
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          이전
                        </button>
                        <span className="text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          다음
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="public" className="mt-0">
              <div className="grid grid-cols-4 gap-6">
                {/* 좌측 컨테이너: 검색 및 기술 분야 리스트 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="검색어를 입력하세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="border rounded-md p-4 max-h-[350px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          key="all"
                          onClick={() => setSelectedTechClass(null)}
                          className={`px-3 py-2 text-xs rounded-md transition-colors ${selectedTechClass === null
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                            }`}
                        >
                          전체
                        </button>
                        {["JAVASCRIPT", "TYPESCRIPT", "REACT", "VUE", "ANGULAR", "NODE.JS", "JAVA", "SPRING", "PYTHON", "DJANGO", "DATABASE", "DEVOPS", "MOBILE", "ALGORITHM", "CS", "OS", "NETWORK", "SECURITY", "CLOUD", "CSS", "ETC"].map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedTechClass(selectedTechClass === tech ? null : tech)}
                            className={`px-3 py-2 text-xs rounded-md transition-colors ${selectedTechClass === tech
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
                {/* 우측 컨테이너: 문제 리스트 테이블 */}
                <div className="border rounded-md col-span-3">
                  {isPublicLoading ? (
                    <div className="p-4 text-center">로딩 중...</div>
                  ) : publicError ? (
                    <div className="p-4 text-center text-red-500">{publicError}</div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">선택</TableHead>
                            <TableHead>기술 분야</TableHead>
                            <TableHead>문제 내용</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPublicQuestions.map((question) => {
                            const registered = isAlreadyRegistered(question.id);
                            return (
                              <TableRow
                                key={question.id}
                                className={`cursor-pointer hover:bg-gray-50 ${registered ? 'bg-gray-50' : ''}`}
                                onClick={() => !registered && handleRowClick(question.id)}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedQuestionIds.includes(question.id)}
                                      onChange={() => !registered && handleCheckboxChange(question.id)}
                                      className="h-4 w-4 rounded border-gray-300"
                                      disabled={registered}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    {registered && (
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        이미 등록됨
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {question.techClass}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {question.questionText.length > 50
                                    ? `${question.questionText.slice(0, 50)}...`
                                    : question.questionText}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      {/* 페이지네이션 */}
                      <div className="px-4 py-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            총 {filteredPublicQuestions.length}개의 문제
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                              onClick={() => setPublicCurrentPage(publicCurrentPage - 1)}
                              disabled={publicCurrentPage === 1}
                            >
                              이전
                            </button>
                            <span className="text-sm">
                              {publicCurrentPage} / {publicTotalPages}
                            </span>
                            <button
                              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                              onClick={() => setPublicCurrentPage(publicCurrentPage + 1)}
                              disabled={publicCurrentPage === publicTotalPages}
                            >
                              다음
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="direct" className="mt-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">기술 분야</TableHead>
                      <TableHead>문제 내용</TableHead>
                      <TableHead className="w-[100px]">공개 여부</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directQuestions.map((question, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-[180px] justify-between ${validationErrors[index]?.techClass ? 'border-red-500' : ''}`}
                                >
                                  {question.techClass || "기술 분야 선택"}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[180px]">
                                {["JAVASCRIPT", "TYPESCRIPT", "REACT", "VUE", "ANGULAR", "NODE.JS", "JAVA", "SPRING", "PYTHON", "DJANGO", "DATABASE", "DEVOPS", "MOBILE", "ALGORITHM", "CS", "OS", "NETWORK", "SECURITY", "CLOUD", "CSS", "ETC"].map((tech) => (
                                  <DropdownMenuItem
                                    key={tech}
                                    onClick={() => handleQuestionChange(index, 'techClass', tech)}
                                  >
                                    {tech}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <input
                              type="text"
                              className={`w-full p-2 border rounded-md ${validationErrors[index]?.questionText ? 'border-red-500' : ''}`}
                              placeholder="문제 내용을 입력하세요..."
                              value={question.questionText}
                              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={question.isPublic}
                              onCheckedChange={(checked) => handleQuestionChange(index, 'isPublic', checked)}
                            />
                            <span className="text-sm text-gray-500">
                              {question.isPublic ? '공개' : '비공개'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {index > 0 && (
                            <button
                              onClick={() => handleRemoveQuestionForm(index)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuestionForm}
                  className="w-full"
                >
                  + 문제 추가
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="border-t pt-2 mt-2">
          <Button variant="outline" onClick={activeTab === "database" ? handleSubmit : activeTab === "public" ? handleSubmit : handleDirectSubmit}>
            {activeTab === "database" ? "선택하기" : activeTab === "public" ? "선택하기" : "등록하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
