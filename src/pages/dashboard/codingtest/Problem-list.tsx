import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Clock, MemoryStick } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// 기존 Problem 인터페이스 유지
interface Problem {
  id: number; // _id 대신 id 사용
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  memoryLimit: number;
  createdBy: {
    id: number;
    nickname: string;
  };
  createTime: string;
  languages: string[]; // availableLanguages 대신 languages 사용
}


// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function ProblemCardsView() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 난이도 색상 매핑
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 문제 목록 가져오기
  const fetchProblems = async () => {
    if (!currentSpaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/${currentSpaceId}/problems`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      // 데이터 직접 매핑
      const mappedProblems = response.data.data.map((item: any) => ({
        id: item.id,
        _id: item._id,
        title: item.title,
        description: item.description,
        difficulty: item.difficulty || 'Mid', // 기본값 설정
        timeLimit: item.time_limit || item.timeLimit || 1000,
        memoryLimit: item.memory_limit || item.memoryLimit || 256,
        createdBy: {
          id: item.created_by?.id || item.createdBy?.id || 0,
          nickname: item.created_by?.nickname || item.createdBy?.nickname || '미상'
        },
        createTime: item.create_time || item.createTime || new Date().toISOString(),
        languages: item.languages || ['Python3', 'Golang'] // 기본값 설정
      }));

      setProblems(mappedProblems);
    } catch (err) {
      console.error('문제 목록을 가져오는 중 오류 발생:', err);
      setError('문제 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 문제 목록 가져오기
  useEffect(() => {
    fetchProblems();
  }, [currentSpaceId]);

  // 문제 풀기 핸들러
  const handleSolveProblem = (problemId: string) => {
    navigate(`/space/${currentSpaceId}/coding/problems/${problemId}/submit`);
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
          <h2 className="text-2xl font-bold">코딩 테스트 문제</h2>
          <Button
              variant="outline"
              onClick={() => navigate(`/space/${currentSpaceId}/coding/problems/new`)}
          >
            새 문제 등록
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.length === 0 ? (
              <div className="col-span-full text-center py-6">
                등록된 문제가 없습니다. 새 문제를 등록해보세요.
              </div>
          ) : (
              problems.map((problem) => (
                  <Card
                      key={problem.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSolveProblem(problem.id.toString())}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{problem.title}</span>
                        <Badge
                            variant="outline"
                            className={`${getDifficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                      사용 가능 언어: {problem.languages.join(', ')}
                    </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">시간 제한: {problem.timeLimit}ms</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MemoryStick className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">메모리 제한: {problem.memoryLimit}MB</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-xs text-gray-500">작성자: {problem.createdBy.nickname}</span>
                      <Button size="sm" variant="outline">
                        문제 풀기
                      </Button>
                    </CardFooter>
                  </Card>
              ))
          )}
        </div>
      </div>
  );
}

export default ProblemCardsView;