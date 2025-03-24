import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

// 타입 정의
type Participant = {
  id: number;
  nickname: string;
};

type AIAnswer = {
  question: string;
  answer: string;
  tips: string;
  related_topics: string;
};

type QuestionResponse = {
  id: string;
  spaceId: number;
  techClass: string;
  questionText: string;
  author: Participant;
  participants: Participant[];
  answers: Record<string, string>;
  aiAnswer?: AIAnswer; // AI 답변 필드 추가
  createdAt: string;
  updatedAt: string;
};

interface StudyCardProps {
  question: QuestionResponse;
  onAnswerSubmit?: () => void;
}

const StudyCard = ({ question, onAnswerSubmit }: StudyCardProps) => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<AIAnswer | null>(question.aiAnswer || null);

  // AI 답변 요청 핸들러
  const handleRequestAIAnswer = async () => {
    setIsLoadingAI(true);

    try {
      // 파이썬 AI 서비스에 요청
      const response = await axios.post(`${apiUrl}/ai/${spaceId}/questions/ai-answer`, {
        questionId: question.id,
        questionText: question.questionText,
        techClass: question.techClass
      });

      // 응답 데이터 설정
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
    e.preventDefault();

    if (!answerText.trim()) {
      toast.error("답변 내용을 입력해주세요.");
      return;
    }

    // 사용할 spaceId 결정 (URL 파라미터 또는 질문 객체의 spaceId)
    const targetSpaceId = spaceId || question.spaceId;

    if (!targetSpaceId) {
      toast.error("스페이스 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청
      await axios.post(`${apiUrl}/space/${targetSpaceId}/questions/answers`, {
        questionId: question.id,
        answerText,
        techClass: question.techClass
      }, {
        withCredentials: true // 인증 정보 포함
      });

      // 성공 처리
      toast.success("답변이 성공적으로 제출되었습니다.");
      setIsAnswerDialogOpen(false);
      setAnswerText("");

      // 상위 컴포넌트에 알림
      if (onAnswerSubmit) {
        onAnswerSubmit();
      }

    } catch (error) {
      console.error("답변 제출 실패:", error);
      toast.error("답변 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 참여자 수와 답변 수 계산
  const participantCount = question.participants.length;
  const answerCount = Object.keys(question.answers).filter(key => key.startsWith("memberId:")).length;

  // 날짜 포맷팅
  const formattedDate = new Date(question.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="mb-2">{question.techClass}</Badge>
                <Badge variant="outline" className="text-xs">
                  {answerCount}/{participantCount} 응답
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">
                {question.questionText}
              </CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>출제자: {question.author.nickname}</span>
                <span className="text-xs">{formattedDate}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">참여자 목록</h4>
                <div className="flex flex-wrap gap-1">
                  {question.participants.map((participant) => (
                      <Badge key={participant.id} variant="secondary" className="text-xs">
                        {participant.nickname}
                        {question.answers[`memberId:${participant.id}`] && (
                            <span className="ml-1 text-green-500">✓</span>
                        )}
                      </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-full md:max-w-full lg:max-w-4xl h-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {question.questionText}
            </DialogTitle>
            <DialogDescription>
              <Badge className="mt-2">{question.techClass}</Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* AI 답변 섹션 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">AI 답변</h3>
                {!aiAnswer && !isLoadingAI && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRequestAIAnswer}
                        disabled={isLoadingAI}
                    >
                      AI 답변 받기
                    </Button>
                )}
              </div>

              {isLoadingAI ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">AI 답변을 생성하는 중입니다...</p>
                  </div>
              ) : aiAnswer ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">모범 답변</h4>
                      <p className="text-sm mt-1 whitespace-pre-line">{aiAnswer.answer}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">면접 팁</h4>
                      <p className="text-sm mt-1 whitespace-pre-line">{aiAnswer.tips}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">관련 주제</h4>
                      <p className="text-sm mt-1">{aiAnswer.related_topics}</p>
                    </div>
                  </div>
              ) : (
                  <p className="text-sm text-muted-foreground">
                    AI 답변을 받아 면접 준비에 활용해보세요. 모범 답변과 면접 팁을 제공합니다.
                  </p>
              )}
            </div>

            {/* 기존 답변 목록 섹션 */}
            <div>
              <h3 className="text-base font-semibold mb-2">답변 목록</h3>
              {Object.entries(question.answers)
              .filter(([key]) => key.startsWith("memberId:"))
                  .length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(question.answers)
                    .filter(([key]) => key.startsWith("memberId:"))
                    .map(([key, value]) => {
                      const memberId = key.replace("memberId:", "");
                      const participant = question.participants.find(p => p.id.toString() === memberId);

                      return (
                          <div key={key} className="p-3 bg-muted rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <Badge variant="outline">{participant?.nickname || "알 수 없음"}</Badge>
                            </div>
                            <p className="text-sm whitespace-pre-line">{value}</p>
                          </div>
                      );
                    })}
                  </div>
              ) : (
                  <p className="text-muted-foreground">아직 답변이 없습니다.</p>
              )}
            </div>

            {/* 내 답변 작성 폼 */}
            <form onSubmit={handleSubmitAnswer} className="pt-4 border-t">
              <h3 className="text-base font-semibold mb-2">내 답변 작성</h3>
              <Textarea
                  placeholder="답변을 입력하세요"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={5}
                  className="w-full mb-4"
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "제출 중..." : "답변 제출"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default StudyCard;