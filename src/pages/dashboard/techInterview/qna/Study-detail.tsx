import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, StickyNote, Save } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnswerDetailModal from "./Answer-detail-modal";
import NoteAddModal from "./Note-add-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

// 타입 정의
type Participant = {
  id: number;
  nickname: string;
};

type AIAnswer = {
  answer: string;
  tips: string;
  related_topics: string;
};

type Answer = {
  id: number;
  memberId: number;
  nickname: string;
  comment: string;
  createdAt: string;
};

type QuestionResponse = {
  id: string;
  spaceId: number;
  techClass: string;
  questionText: string;
  author: Participant;
  participants: Participant[];
  answers: Answer[];
  aiAnswer?: string;
  keyPoints?: string;
  additionalTopics?: string;
  createdAt: string;
  updatedAt: string;
  techInterviewId: string;
};

type Question = {
  id: string;
  techClass: string;
  questionText: string;
  author: Participant;
  participants: Participant[];
  answers: Answer[];
  createdAt: string;
};

const StudyDetail = () => {
  const { spaceId, questionId } = useParams<{ spaceId: string; questionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [otherQuestions, setOtherQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<AIAnswer | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isNoteSheetOpen, setIsNoteSheetOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  // 문제 데이터 가져오기
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/questions/${questionId}`,
          { withCredentials: true }
        );
        setQuestion(response.data);
        // 초기에는 aiAnswer를 null로 설정
        setAiAnswer(null);
      } catch (error) {
        console.error("문제 데이터 로드 실패:", error);
        toast.error("문제 데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      }
    };

    if (spaceId && questionId) {
      fetchQuestion();
    }
  }, [spaceId, questionId]);

  // 다른 문제들 가져오기
  useEffect(() => {
    const fetchOtherQuestions = async () => {
      if (!spaceId || !question?.techClass) return;

      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/questions`,
          {
            withCredentials: true,
            params: {
              page: currentPage,
              size: 4,
              'tech-class': question.techClass.replace(/\s+/g, '_').toUpperCase()
            }
          }
        );
        setOtherQuestions(response.data.content);
        setHasNextPage(!response.data.last);
      } catch (error) {
        console.error("다른 문제 데이터 로드 실패:", error);
      }
    };

    fetchOtherQuestions();
  }, [spaceId, question?.techClass, currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // AI 답변 요청 핸들러
  const handleRequestAIAnswer = async () => {
    if (!question) return;

    // 이미 답변이 있으면 바로 표시
    if (question.aiAnswer) {
      const existingAnswer: AIAnswer = {
        answer: question.aiAnswer,
        tips: question.keyPoints || '',
        related_topics: question.additionalTopics || ''
      };
      setAiAnswer(existingAnswer);
      return;
    }

    setIsLoadingAI(true);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/ai/${spaceId}/questions/ai-answer`,
        {
          id: question.techInterviewId,
          techClass: question.techClass,
          questionText: question.questionText
        },
        { withCredentials: true }
      );

      setAiAnswer(response.data);
      toast.success("AI 답변이 생성되었습니다.");

    } catch (error) {
      console.error("AI 답변 생성 실패:", error);
      toast.error("AI 답변을 생성하는데 실패했습니다.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 답변 제출 핸들러
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    console.log('handleSubmitAnswer 함수 시작');
    e.preventDefault();
    if (!question) {
      console.log('question이 없음');
      return;
    }

    console.log('답변 제출 시도:', {
      answerText,
      questionId: question.id,
      techClass: question.techClass,
      spaceId
    });

    if (!answerText.trim()) {
      console.log('답변 내용이 비어있음');
      toast.error("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    console.log('제출 시작 - isSubmitting:', true);

    try {
      console.log('API 요청 시작');
      const response = await axios.post(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/questions/answers`,
        {
          questionId: question.id,
          answerText,
          techClass: question.techClass
        },
        { withCredentials: true }
      );
      console.log('API 응답 성공:', response.data);

      toast.success("답변이 성공적으로 제출되었습니다.");
      setAnswerText("");

      // 문제 데이터 새로고침
      console.log('문제 데이터 새로고침 시작');
      const refreshResponse = await axios.get(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/questions/${questionId}`,
        { withCredentials: true }
      );
      console.log('문제 데이터 새로고침 완료');
      setQuestion(refreshResponse.data);

    } catch (error) {
      console.error("답변 제출 실패:", error);
      toast.error("답변 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      console.log('제출 완료 - isSubmitting:', false);
    }
  };

  const handleParticipantClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsAnswerModalOpen(true);
  };

  const handleNoteSelect = async (noteId: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/notes/${noteId}`,
        { withCredentials: true }
      );

      // 현재 질문과 답변 내용을 포함한 텍스트 생성
      const noteContent = `

## 질문
${question?.questionText}

### 내 답변
${answerText}

### AI 모범 답변
${question?.aiAnswer || 'AI 답변이 없습니다.'}

### 면접 팁
${question?.keyPoints || '면접 팁이 없습니다.'}

### 관련 주제
${question?.additionalTopics || '관련 주제가 없습니다.'}

---
${response.data.content}`;

      setSelectedNote({
        id: noteId,
        title: response.data.title,
        content: response.data.content
      });
      setEditedContent(noteContent);
      setIsNoteSheetOpen(true);
    } catch (error) {
      console.error('노트 데이터 로드 실패:', error);
      toast.error('노트를 불러오는데 실패했습니다.');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      await axios.put(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/notes/${selectedNote.id}`,
        {
          title: selectedNote.title,
          content: editedContent,
        },
        { withCredentials: true }
      );

      setSelectedNote(prev => prev ? { ...prev, content: editedContent } : null);
      setIsNoteSheetOpen(false);
      toast.success('노트가 저장되었습니다.');
    } catch (error) {
      console.error('노트 저장 실패:', error);
      toast.error('노트 저장에 실패했습니다.');
    }
  };

  if (!question) {
    return <div className="container mx-auto p-6">로딩 중...</div>;
  }

  // 참여자 수와 답변 수 계산
  const participantCount = question.participants.length;
  const answerCount = question.answers.length;

  // 날짜 포맷팅
  const formattedDate = new Date(question.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(`/space/${spaceId}/interview/questions`)}>
          ← 돌아가기
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-1 lg:h-[80vh] mx-3 lg:overflow-hidden">
        {/* Left Container */}
        <div className="w-full lg:w-1/3">
          <Card className="h-full lg:h-full flex flex-col gap-2">
            <CardHeader className="mb-0 pb-0">
              <Badge className="mb-0">{question.techClass}</Badge>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {question.questionText}
                </CardTitle>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>출제자: {question.author.nickname}</span>
                <span>{formattedDate}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pb-8">
              <Separator />
              <div className="flex flex-col lg:h-[calc(100vh-300px)]">
                <div className="h-auto lg:h-1/3 overflow-y-auto">
                  <h3 className="text-base font-bold mb-2">참여자 목록</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
                    {question.participants.map((participant) => {
                      const answer = question.answers.find(answer => answer.memberId === participant.id);
                      return (
                        <Badge
                          key={participant.id}
                          variant="secondary"
                          className="text-sm px-3 py-1 cursor-pointer hover:bg-primary/10 w-full justify-center"
                          onClick={() => handleParticipantClick(participant)}
                        >
                          {participant.nickname}
                          {answer && <span className="ml-1 text-green-500">✓</span>}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="h-auto lg:h-2/3 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold">다른 {question.techClass} 문제</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {otherQuestions.map((q) => {
                      const hasUserAnswer = q.answers.some(answer => answer.memberId === user?.id);
                      return (
                        <Card
                          key={q.id}
                          className={`w-full cursor-pointer hover:bg-accent/50 p-0 ${hasUserAnswer ? 'bg-blue-50' : ''
                            }`}
                          onClick={() => navigate(`/space/${spaceId}/interview/questions/${q.id}`)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-1.5">
                              <Badge variant="secondary" className="text-xs">
                                {q.techClass}
                              </Badge>
                              <p className="text-xs line-clamp-3">
                                {q.questionText}
                              </p>
                              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                                <span>참여자 {q.participants.length}명</span>
                                <span>답변 {q.answers.length}개</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Container */}
        <div className="w-full lg:w-2/3 lg:h-full">
          {/* 내 답변 작성 폼 */}
          <Card className="h-[40vh] lg:h-[40vh] gap-1">
            <CardHeader className="flex-shrink-0 mb-0 pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">내 답변 작성</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setIsNoteModalOpen(true)}
                >
                  <StickyNote className="h-4 w-4 mr-1" />
                  노트 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden pt-0 px-3">
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  <Textarea
                    placeholder="답변을 입력하세요"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full h-full text-sm resize-none overflow-y-auto"
                  />
                </div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting}
                  className="self-end text-xs px-3 py-1 h-7 mt-2"
                >
                  {isSubmitting ? "제출 중..." : "답변 제출"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI 답변 섹션 */}
          <Card className="mt-1 h-[calc(100%-40vh-4px)] lg:h-[calc(100%-40vh-4px)] gap-1">
            <CardHeader className="flex-shrink-0 mb-0 pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">AI 답변</CardTitle>
                {!aiAnswer && !isLoadingAI && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestAIAnswer}
                    disabled={isLoadingAI}
                    className="text-xs"
                  >
                    AI 답변 받기
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full px-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 h-full overflow-y-auto">
                {isLoadingAI ? (
                  <div className="text-center py-4 h-full flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">AI 답변을 생성하는 중입니다...</p>
                  </div>
                ) : aiAnswer ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-md font-bold">모범 답변</h4>
                      <p className="text-xs mt-1 whitespace-pre-line">{aiAnswer.answer}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-bold">면접 팁</h4>
                      <p className="text-xs mt-1 whitespace-pre-line">{aiAnswer.tips}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-bold">관련 주제</h4>
                      <p className="text-xs mt-1">{aiAnswer.related_topics}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      AI 답변을 받아 면접 준비에 활용해보세요. 모범 답변과 면접 팁을 제공합니다.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedParticipant && (
        <AnswerDetailModal
          isOpen={isAnswerModalOpen}
          onClose={() => setIsAnswerModalOpen(false)}
          answers={question.answers.filter(answer => answer.memberId === selectedParticipant.id)}
          nickname={selectedParticipant.nickname}
        />
      )}

      <NoteAddModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteSelect={handleNoteSelect}
      />

      <Sheet open={isNoteSheetOpen} onOpenChange={setIsNoteSheetOpen}>
        <SheetContent className="w-[95vw] sm:w-[600px] md:w-[800px] overflow-y-auto p-3">
          <h2 className="text-2xl font-bold ">노트 추가</h2>
          <SheetHeader className="flex flex-row pb-0 mb-0 items-center justify-between">
            <SheetTitle>{selectedNote?.title}</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNote}
              className="text-xs"
            >
              <Save className="h-4 w-4 mr-1" />
              저장
            </Button>
          </SheetHeader>
          <div className="mt-0">
            <div data-color-mode="light">
              <MDEditor
                value={editedContent}
                onChange={(value) => setEditedContent(value || '')}
                height={600}
                preview="edit"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StudyDetail;
