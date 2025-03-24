import { useState } from "react";
import axios from "axios";
import { PlusIcon, TrendingUpIcon, ColumnsIcon, ChevronDownIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const apiUrl = import.meta.env.VITE_API_URL || '';

type QuestionCreateType = z.infer<typeof questionCreateSchema>;

// 질문 응답 타입
type Participant = {
  id: number;
  nickname: string;
};

type QuestionResponse = {
  id: string;
  spaceId: number;
  techClass: string;
  questionText: string;
  author: Participant;
  participants: Participant[];
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

const Question = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 질문 목록 조회
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/${spaceId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error("질문 목록 조회 실패:", error);
      toast.error("질문 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로딩
  useState(() => {
    if (spaceId) {
      fetchQuestions();
    }
  });

  return (
      <div className="flex flex-col gap-6 p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">전체 문제</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="cs">CS 지식</TabsTrigger>
            </TabsList>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon className="mr-2 h-4 w-4" />
                  정렬
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>최신순</DropdownMenuItem>
                <DropdownMenuItem>난이도순</DropdownMenuItem>
                <DropdownMenuItem>응답률순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                  <p>문제를 불러오는 중...</p>
              ) : questions.length > 0 ? (
                  questions.map((question) => (
                      <QuestionCard key={question.id} question={question} />
                  ))
              ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg font-medium mb-2">아직 출제된 문제가 없습니다</p>
                    <p className="text-muted-foreground">새로운 문제를 출제해보세요!</p>
                  </div>
              )}

              {/*더미 데이터 카드 (실제 구현 시 삭제)*/}
              <QuestionCard
                  question={{
                    id: "1",
                    spaceId: Number(spaceId),
                    techClass: "Frontend",
                    questionText: "React에서 상태 관리를 위한 다양한 방법과 각각의 장단점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 2, nickname: "김철수" },
                      { id: 3, nickname: "이영희" }
                    ],
                    answers: { "memberId:2": "Redux, Context API, Recoil 등이 있습니다..." },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />

              <QuestionCard
                  question={{
                    id: "2",
                    spaceId: Number(spaceId),
                    techClass: "Backend",
                    questionText: "REST API와 GraphQL의 차이점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 2, nickname: "김철수" },
                      { id: 4, nickname: "박지성" }
                    ],
                    answers: {},
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />

              <QuestionCard
                  question={{
                    id: "3",
                    spaceId: Number(spaceId),
                    techClass: "CS Fundamentals",
                    questionText: "프로세스와 스레드의 차이점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 3, nickname: "이영희" },
                      { id: 4, nickname: "박지성" }
                    ],
                    answers: {
                      "memberId:3": "프로세스는 실행 중인 프로그램의 인스턴스이고, 스레드는 프로세스 내에서 실행되는 작업 단위입니다...",
                      "memberId:4": "프로세스는 독립적인 메모리 공간을 가지지만, 스레드는 메모리를 공유합니다..."
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />
            </div>
          </TabsContent>

          <TabsContent value="frontend">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <QuestionCard
                  question={{
                    id: "1",
                    spaceId: Number(spaceId),
                    techClass: "Frontend",
                    questionText: "React에서 상태 관리를 위한 다양한 방법과 각각의 장단점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 2, nickname: "김철수" },
                      { id: 3, nickname: "이영희" }
                    ],
                    answers: { "memberId:2": "Redux, Context API, Recoil 등이 있습니다..." },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />
            </div>
          </TabsContent>

          <TabsContent value="backend">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <QuestionCard
                  question={{
                    id: "2",
                    spaceId: Number(spaceId),
                    techClass: "Backend",
                    questionText: "REST API와 GraphQL의 차이점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 2, nickname: "김철수" },
                      { id: 4, nickname: "박지성" }
                    ],
                    answers: {},
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />
            </div>
          </TabsContent>

          <TabsContent value="cs">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <QuestionCard
                  question={{
                    id: "3",
                    spaceId: Number(spaceId),
                    techClass: "CS Fundamentals",
                    questionText: "프로세스와 스레드의 차이점에 대해 설명해주세요.",
                    author: { id: 1, nickname: "면접관" },
                    participants: [
                      { id: 3, nickname: "이영희" },
                      { id: 4, nickname: "박지성" }
                    ],
                    answers: {
                      "memberId:3": "프로세스는 실행 중인 프로그램의 인스턴스이고, 스레드는 프로세스 내에서 실행되는 작업 단위입니다...",
                      "memberId:4": "프로세스는 독립적인 메모리 공간을 가지지만, 스레드는 메모리를 공유합니다..."
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

// 질문 카드 컴포넌트
const QuestionCard = ({ question }: { question: QuestionResponse }) => {
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 답변 제출 핸들러
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerText.trim()) {
      toast.error("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청
      await axios.post("/api/v1/questions/answers", {
        questionId: question.id,
        answerText,
        techClass: question.techClass
      });

      // 성공 처리
      toast.success("답변이 성공적으로 제출되었습니다.");
      setIsAnswerDialogOpen(false);
      setAnswerText("");

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
      <Card>
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
        <CardFooter className="flex justify-between">
          <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">답변 보기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {question.questionText}
                </DialogTitle>
                <DialogDescription>
                  <Badge className="mt-2">{question.techClass}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
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

        </CardFooter>
      </Card>
  );
};

export default Question;