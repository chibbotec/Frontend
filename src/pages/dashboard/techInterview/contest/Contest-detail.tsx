import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { mockContestDetails } from '@/mock-data/Contest-detail';

const apiUrl = import.meta.env.VITE_API_URL || '';

interface MemberResponse {
  id: number;
  username: string | null;
  email: string | null;
  nickname: string;
  submit: string;
}

interface AnswerResponse {
  memberId: number;
  nickname: string;
  answer: string;
  rank: number;
  feedback: string;
}

interface AIAnswer {
  question: string;
  answer: string;
  tips: string;
  related_topics: string;
}

interface ProblemResponse {
  problem: string;
  techClass: string;
  aiAnswer: string | null;
  keyPoints?: string;
  additionalTopics?: string;
  answers: AnswerResponse[];
}

interface ContestDetailResponse {
  id: number;
  title: string;
  createdAt: string;
  submit: string;
  timeoutMillis: number;
  participants: MemberResponse[];
  problems: ProblemResponse[];
}

const ContestDetail: React.FC = () => {
  const { spaceId, contestId } = useParams<{ spaceId: string; contestId: string }>();
  const { isGuest } = useAuth();
  const [contest, setContest] = useState<ContestDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const fetchContestDetail = async () => {
      try {
        setLoading(true);

        if (isGuest) {
          // 게스트 모드일 때는 mock 데이터 사용
          const mockContest = mockContestDetails[Number(contestId)];
          if (!mockContest) {
            throw new Error('대회 정보를 찾을 수 없습니다.');
          }
          setContest(mockContest);
          return;
        }

        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/contests/${contestId}`,
          {
            withCredentials: true
          }
        );
        setContest(response.data);
      } catch (err) {
        console.error('대회 상세 정보를 불러오는데 실패했습니다:', err);
        setError('대회 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (spaceId && contestId) {
      fetchContestDetail();
    }
  }, [spaceId, contestId, isGuest]);

  const handleEvaluate = async () => {
    if (isGuest) {
      setError('게스트 모드에서는 채점할 수 없습니다.');
      return;
    }

    if (!spaceId || !contestId) return;

    try {
      setIsEvaluating(true);
      const response = await axios.get(
        `${apiUrl}/api/v1/ai/${spaceId}/contest/${contestId}/evaluate`,
        {
          withCredentials: true
        }
      );

      // Refresh contest data after evaluation
      const updatedContest = await axios.get(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/contests/${contestId}`,
        {
          withCredentials: true
        }
      );
      setContest(updatedContest.data);
    } catch (err) {
      console.error('채점 중 오류가 발생했습니다:', err);
      setError('채점 중 오류가 발생했습니다.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const calculateTotalScores = () => {
    if (!contest) return [];

    const scores = contest.participants.map(participant => {
      const totalScore = contest.problems.reduce((sum, problem) => {
        const answer = problem.answers.find(a => a.memberId === participant.id);
        return sum + (answer?.rank || 0);
      }, 0);

      return {
        nickname: participant.nickname,
        totalScore,
        memberId: participant.id
      };
    });

    return scores.sort((a, b) => b.totalScore - a.totalScore);
  };

  const getChartData = () => {
    if (!contest) return [];
    return calculateTotalScores().map(score => ({
      name: score.nickname,
      score: score.totalScore
    }));
  };

  // 공동 순위 방식으로 순위 계산
  const getRankedScores = () => {
    const scores = calculateTotalScores();
    let prevScore: number | null = null;
    let prevRank = 0;
    let skip = 0;
    return scores.map((score, idx) => {
      if (score.totalScore === prevScore) {
        skip++;
        return { ...score, rank: prevRank };
      } else {
        const rank = idx + 1;
        prevRank = rank;
        prevScore = score.totalScore;
        skip = 1;
        return { ...score, rank };
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        대회 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent>
          <div className="grid sm:grid-col-1 md:grid-cols-2 gap-8">
            <div>
              <CardTitle>{contest.title}</CardTitle>
              <div className="grid grid-cols-2 gap-1 mt-4">
                <div className="text-sm text-gray-500">
                  생성일: {new Date(contest.createdAt).toLocaleDateString()}
                </div>
                <div></div>
                <div className="text-sm text-gray-500">
                  제한시간: {Math.floor(contest.timeoutMillis / 60000)}분 {Math.floor((contest.timeoutMillis % 60000) / 1000)}초
                </div>
                {contest.submit === 'COMPLETED' && !isGuest && (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          채점 중...
                        </>
                      ) : (
                        '채점하기'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">참가자</h3>
              <div className="grid grid-cols-2 gap-2">
                {contest.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`p-2 rounded-md flex items-center justify-between text-sm ${participant.submit === 'IN_PROGRESS' ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                  >
                    <span className="truncate">{participant.nickname}</span>
                    <span className={`ml-2 flex-shrink-0 ${participant.submit === 'IN_PROGRESS' ? 'text-gray-500' : 'text-blue-600'}`}>
                      {participant.submit === 'IN_PROGRESS' ? '미제출' : '제출완료'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {contest.submit === 'EVALUATED' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>종합 평가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              {/* Left side - Bar Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">득점 현황</h3>
                {/* Desktop Chart */}
                <div className="hidden md:block h-full">
                  <BarChart
                    width={Math.max(400, getChartData().length * 70)}
                    height={250}
                    data={getChartData()}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value.length > 6 ? value.slice(0, 6) + '…' : value
                      }
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                      formatter={(value) => [`${value}점`, '점수']}
                    />
                    <Bar
                      dataKey="score"
                      fill="#2563eb"
                      radius={4}
                    />
                  </BarChart>
                </div>
                {/* Mobile Chart */}
                <div className="md:hidden h-full">
                  <BarChart
                    width={Math.max(250, getChartData().length * 40)}
                    height={180}
                    data={getChartData()}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={5}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value.length > 4 ? value.slice(0, 4) + '…' : value
                      }
                      interval={0}
                      tick={{ fontSize: 8 }}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={5}
                      axisLine={false}
                      tick={{ fontSize: 8 }}
                    />
                    <RechartsTooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '4px',
                        fontSize: '10px'
                      }}
                      formatter={(value) => [`${value}점`, '점수']}
                    />
                    <Bar
                      dataKey="score"
                      fill="#2563eb"
                      radius={2}
                    />
                  </BarChart>
                </div>
              </div>

              {/* Right side - Ranking List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">순위</h3>
                <div className="space-y-3">
                  {getRankedScores().map((score, index) => (
                    <div
                      key={score.memberId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium
                          ${score.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            score.rank === 2 ? 'bg-gray-100 text-gray-800' :
                              score.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'}`}
                        >
                          {score.rank}
                        </span>
                        <span className="font-medium">{score.nickname}</span>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">
                        {score.totalScore}점
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {contest.problems.map((problem, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-6 mb-4">
            <Card className="w-full md:w-1/3 flex-shrink-0">
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <CardTitle className="text-lg md:text-xl">Pr {index + 1}.</CardTitle>
                  <span className="px-2 py-1 text-[10px] md:text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {problem.techClass}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm md:text-base">{problem.problem}</p>
              </CardContent>
            </Card>
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="ai" className="w-full border rounded-lg p-2 md:p-4 h-[250px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ai" className="text-xs md:text-sm">AI 답변</TabsTrigger>
                  <TabsTrigger value="participants" className="text-xs md:text-sm">참가자</TabsTrigger>
                  <TabsTrigger value="rankings" className="text-xs md:text-sm">점수</TabsTrigger>
                </TabsList>
                <TabsContent value="ai" className="mt-4 h-[180px] overflow-y-auto">
                  {contest.submit === 'EVALUATED' ? problem.aiAnswer ? (
                    (() => {
                      try {
                        // const parsedAnswer: AIAnswer = JSON.parse(problem.aiAnswer);
                        return (
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-bold">모범 답변</h4>
                              <p className="text-sm mt-1 whitespace-pre-line">{problem.aiAnswer}</p>
                            </div>
                            {/* <div>
                              <h4 className="text-sm font-medium">면접 팁</h4>
                              <p className="text-sm mt-1 whitespace-pre-line">{parsedAnswer.tips}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">관련 주제</h4>
                              <p className="text-sm mt-1">{parsedAnswer.related_topics}</p>
                            </div> */}
                          </div>
                        );
                      } catch (e) {
                        console.error('AI 답변 파싱 실패:', e);
                        return <p className="text-red-500 text-sm md:text-base">AI 답변 형식이 올바르지 않습니다</p>;
                      }
                    })()
                  ) : (
                    <p className="text-red-500 text-sm md:text-base">AI 답변이 없습니다</p>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500 text-sm md:text-base">아직 시험 중입니다</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="participants" className="mt-4 h-[180px] overflow-y-auto">
                  {contest.submit === 'EVALUATED' ? (
                    <div className="space-y-2">
                      {problem.answers.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="p-2 md:p-3 border rounded-md"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm md:text-base">{answer.nickname}</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm md:text-base">{answer.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500 text-sm md:text-base">아직 시험 중입니다</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="rankings" className="mt-4 h-[180px] overflow-y-auto">
                  {contest.submit === 'EVALUATED' ? (
                    <div className="space-y-2">
                      {problem.answers
                        .sort((a, b) => b.rank - a.rank)
                        .map((answer, index) => (
                          <div
                            key={index}
                            className="p-2 md:p-3 border rounded-md flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500 w-6">
                                {index + 1}위
                              </span>
                              <span className="font-medium text-sm md:text-base">{answer.nickname}</span>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="text-xs md:text-sm text-blue-600 font-medium cursor-help">
                                    {answer.rank}점
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  <p className="text-sm">{answer.feedback}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500 text-sm md:text-base">아직 시험 중입니다</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};


export default ContestDetail;
