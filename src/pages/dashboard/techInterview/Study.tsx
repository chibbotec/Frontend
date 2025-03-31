import { useState, useEffect } from "react";
import axios from "axios";
import { ColumnsIcon, ChevronDownIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StudyCard from "@/pages/dashboard/techInterview/StudyCard";

const apiUrl = import.meta.env.VITE_API_URL || '';

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

const Study = () => {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("latest"); // 정렬 옵션 상태

  // 스페이스 ID 확인 및 처리
  useEffect(() => {
    if (!spaceId) {
      // 스페이스 ID가 없으면 localStorage에서 확인
      const savedSpaceId = localStorage.getItem('activeSpaceId');

      if (savedSpaceId) {
        // localStorage에 저장된 ID가 있으면 해당 경로로 리다이렉트
        navigate(`/space/${savedSpaceId}/study`);
      } else {
        // 저장된 ID도 없으면 대시보드로 리다이렉트하고 알림
        toast.error("유효한 스페이스를 먼저 선택해주세요");
        navigate('/dashboard');
      }
    }
  }, [spaceId, navigate]);

  // 질문 목록 조회
  const fetchQuestions = async () => {
    if (!spaceId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/api/v1/tech-interview/${spaceId}/questions`,{
        withCredentials: true
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("질문 목록 조회 실패:", error);
      toast.error("질문 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 함수
  const sortQuestions = (questions: QuestionResponse[], filter: string) => {
    const sortedQuestions = [...questions];

    switch (filter) {
      case "latest":
        return sortedQuestions.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "response-rate":
        return sortedQuestions.sort((a, b) => {
          const rateA = Object.keys(a.answers).filter(k => k.startsWith("memberId:")).length / a.participants.length || 0;
          const rateB = Object.keys(b.answers).filter(k => k.startsWith("memberId:")).length / b.participants.length || 0;
          return rateB - rateA;
        });
      default:
        return sortedQuestions;
    }
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (spaceId) {
      fetchQuestions();
    }
  }, [spaceId]);

  // 카테고리별 질문 필터링 함수
  const filterQuestionsByCategory = (category: string) => {
    if (category === "all") return sortQuestions(questions, selectedFilter);
    return sortQuestions(
        questions.filter(q => q.techClass.toLowerCase() === category.toLowerCase()),
        selectedFilter
    );
  };

  return (
      <div className="flex flex-col gap-6 p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all" className="px-2 sm:px-4 py-2">전체 문제</TabsTrigger>
              <TabsTrigger value="frontend" className="px-2 sm:px-4 py-2">Frontend</TabsTrigger>
              <TabsTrigger value="backend" className="px-2 sm:px-4 py-2">Backend</TabsTrigger>
              <TabsTrigger value="cs" className="px-2 sm:px-4 py-2">CS 지식</TabsTrigger>
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
                <DropdownMenuItem onClick={() => handleSortChange("latest")}>
                  최신순
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("response-rate")}>
                  응답률순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                  <p>문제를 불러오는 중...</p>
              ) : questions.length > 0 ? (
                  filterQuestionsByCategory("all").map((question) => (
                      <StudyCard
                          key={question.id}
                          question={question}
                          onAnswerSubmit={fetchQuestions}
                      />
                  ))
              ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg font-medium mb-2">아직 출제된 문제가 없습니다</p>
                    <p className="text-muted-foreground">새로운 문제를 출제해보세요!</p>
                  </div>
              )}

              {/* API 연동 전까지만 표시할 더미 데이터 - 실 구현 시 삭제 */}
              {questions.length === 0 && !isLoading && (
                  <>
                    <StudyCard
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
                        onAnswerSubmit={fetchQuestions}
                    />

                    <StudyCard
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
                        onAnswerSubmit={fetchQuestions}
                    />

                    <StudyCard
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
                        onAnswerSubmit={fetchQuestions}
                    />
                  </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="frontend">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                  <p>문제를 불러오는 중...</p>
              ) : (
                  filterQuestionsByCategory("frontend").map((question) => (
                      <StudyCard
                          key={question.id}
                          question={question}
                          onAnswerSubmit={fetchQuestions}
                      />
                  ))
              )}

              {/* 더미 데이터 - 실 구현 시 삭제 */}
              {filterQuestionsByCategory("frontend").length === 0 && !isLoading && (
                  <StudyCard
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
                      onAnswerSubmit={fetchQuestions}
                  />
              )}
            </div>
          </TabsContent>

          <TabsContent value="backend">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                  <p>문제를 불러오는 중...</p>
              ) : (
                  filterQuestionsByCategory("backend").map((question) => (
                      <StudyCard
                          key={question.id}
                          question={question}
                          onAnswerSubmit={fetchQuestions}
                      />
                  ))
              )}

              {/* 더미 데이터 - 실 구현 시 삭제 */}
              {filterQuestionsByCategory("backend").length === 0 && !isLoading && (
                  <StudyCard
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
                      onAnswerSubmit={fetchQuestions}
                  />
              )}
            </div>
          </TabsContent>

          <TabsContent value="cs">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                  <p>문제를 불러오는 중...</p>
              ) : (
                  filterQuestionsByCategory("cs").map((question) => (
                      <StudyCard
                          key={question.id}
                          question={question}
                          onAnswerSubmit={fetchQuestions}
                      />
                  ))
              )}

              {/* 더미 데이터 - 실 구현 시 삭제 */}
              {filterQuestionsByCategory("cs").length === 0 && !isLoading && (
                  <StudyCard
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
                      onAnswerSubmit={fetchQuestions}
                  />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default Study;