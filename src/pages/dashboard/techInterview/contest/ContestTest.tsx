import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PieChart, Pie, Label, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useAuth } from '@/context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL || '';

interface MemberResponse {
  id: number;
  username: string | null;
  email: string | null;
  nickname: string;
  submmit: string;
}

interface AnswerResponse {
  memberId: number;
  nickname: string;
  answer: string;
  rank: number;
}

interface ProblemResponse {
  id: number;
  problem: string;
  techClass: string;
  aiAnswer: string | null;
  answers: AnswerResponse[];
}

interface ContestDetailResponse {
  id: number;
  title: string;
  createdAt: string;
  submmit: string;
  timeoutMillis: number;
  participants: MemberResponse[];
  problems: ProblemResponse[];
  submit: string;
}

const ContestTest: React.FC = () => {
  const { spaceId, contestId } = useParams<{ spaceId: string; contestId: string }>();
  const { user } = useAuth();
  const [contest, setContest] = useState<ContestDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  // Add function to check if user has submitted
  const hasUserSubmitted = () => {
    if (!user || !contest) return false;
    // 대회가 EVALUATED 상태이거나
    if (contest.submit === 'EVALUATED') return true;
    
    // 사용자의 제출 상태가 COMPLETED나 EVALUATED인 경우
    const participant = contest.participants.find(p => p.id === user.id);
    return participant?.submmit === 'COMPLETED' || participant?.submmit === 'EVALUATED';
  };

  useEffect(() => {
    const fetchContestDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/contests/${contestId}`,
          {
            withCredentials: true
          }
        );
        setContest(response.data);
        setTimeLeft(response.data.timeoutMillis);
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
  }, [spaceId, contestId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            setIsStarted(false);
            toast.error("시험 시간이 종료되었습니다.");
            handleSubmit(); // 시간 초과 시 자동 제출
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isStarted, timeLeft]);

  useEffect(() => {
    if (contest) {
      setAnswers(Array(contest.problems.length).fill(''));
    }
  }, [contest]);

  const handleStart = () => {
    setIsStarted(true);
    toast.success("시험이 시작되었습니다. 시간이 카운트다운됩니다.");
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  const techClassData = React.useMemo(() => {
    if (!contest) return [];
    
    const techClassCount = contest.problems.reduce((acc, problem) => {
      acc[problem.techClass] = (acc[problem.techClass] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(techClassCount).map(([techClass, count]) => ({
      name: techClass,
      value: count,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  }, [contest]);

  // 답변 입력 핸들러
  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // 제출 함수
  const handleSubmit = async () => {
    if (!window.confirm("제출 하시겠습니까?")) return;
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!contest) return;

    const body = {
      memberId: user.id,
      answers: contest.problems.map((problem, idx) => ({
        problemId: problem.id,
        answer: answers[idx] ?? ''
      }))
    };

    try {
      await axios.post(
        `${apiUrl}/api/v1/tech-interview/${spaceId}/contests/${contestId}/submit`,
        body,
        { withCredentials: true }
      );
      
      // Update contest state after successful submission
      setContest(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map(p => 
            p.id === user.id ? { ...p, submmit: 'COMPLETED' } : p
          )
        };
      });
      
      setIsStarted(false);
      toast.success("제출이 완료되었습니다!");
    } catch (e) {
      toast.error("제출에 실패했습니다.");
    }
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
          <div className="grid grid-cols-3 gap-8">
            <div>
              <CardTitle>{contest.title}</CardTitle>
              <div className="text-sm text-gray-500 mt-2">
                생성일: {new Date(contest.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                제한시간: {Math.floor(contest.timeoutMillis / 60000)}분 {Math.floor((contest.timeoutMillis % 60000) / 1000)}초
              </div>
              <div className="text-sm text-gray-500 mt-2">
                참여 인원: {contest.participants.length}명
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mt-2">
                제출 비중:
                <div className="h-[120px] w-[120px] mx-auto flex items-center justify-center">
                  <ChartContainer config={{}} className="h-full w-full flex items-center justify-center">
                    <PieChart width={120} height={120}>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={techClassData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={20}
                        outerRadius={55}
                        strokeWidth={15}
                        isAnimationActive={false}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (!viewBox || typeof viewBox !== 'object') return null;
                            const cx = 'cx' in viewBox ? Number(viewBox.cx) : 0;
                            const cy = 'cy' in viewBox ? Number(viewBox.cy) : 0;
                            return (
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  className="fill-foreground text-lg font-bold"
                                >
                                  {contest.problems.length}
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy + 16}
                                  className="fill-muted-foreground text-xs"
                                >
                                  문제
                                </tspan>
                              </text>
                            );
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              {!isStarted ? (
                hasUserSubmitted() ? (
                  <div className="text-center flex flex-col items-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      제출 완료
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={handleStart}
                    className="w-32"
                  >
                    시작하기
                  </Button>
                )
              ) : (
                <div className="text-center flex flex-col items-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    남은 시간
                  </div>
                  {hasUserSubmitted() ? (
                    <div className="text-2xl font-bold text-green-600">
                      제출 완료
                    </div>
                  ) : (
                    <Button
                      className="w-32 mt-2"
                      onClick={handleSubmit}
                      variant="secondary"
                    >
                      제출하기
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {contest.problems.map((problem, index) => (
          <Card key={problem.id} className="gap-1 h-[300px]">
            <CardContent>
              <div className="flex flex-col h-full gap-5">
                <div className="h-1/3">
                  <div className="flex items-center gap-2 mb-4">
                    <CardTitle className="text-lg md:text-xl">Pr {index + 1}.</CardTitle>
                    <span className="px-2 py-1 text-[10px] md:text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {problem.techClass}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm md:text-base">{problem.problem}</p>
                </div>
                <div className="h-2/3">
                  <div className="flex flex-col h-full">
                    <div className="mb-2">
                      <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        답변 작성
                      </span>
                    </div>
                    <textarea
                      className="h-[100px] w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="답변을 입력해주세요..."
                      disabled={!isStarted}
                      value={answers[index] || ''}
                      onChange={e => handleAnswerChange(index, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContestTest;
