import { useState, useEffect } from 'react';
// import { useSpace } from "@/context/SpaceContext";
import axios from 'axios';
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// 타입 정의
interface Participant {
  id: number;
  nickname: string;
}

interface Problem {
  id: string;
  _id: string;
  spaceId: number;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  memoryLimit: number;
  author: Participant;
  createdAt: string;
  participants: Participant[];
}

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function ProblemsTable() {
  // const { currentSpace } = useSpace(); // SpaceContext에서 현재 스페이스 정보 가져오기
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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
      // 새로운 API 엔드포인트 사용
      const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/${currentSpaceId}/problems`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      // OnlineJudge API 응답 타입 정의
      interface ProblemResponse {
        _id?: string;
        id?: string;
        title?: string;
        description?: string;
        difficulty?: number;
        time_limit?: number;
        memory_limit?: number;
        created_by?: {
          id?: number;
          nickname?: string;
        };
        create_time?: string;
      }

      console.log("=====================",response.data);

      // OnlineJudge API 응답 구조에 맞게 데이터 매핑
      const mappedProblems = response.data.data.map((item: ProblemResponse) => ({
        id: item.id || '',
        _id: item._id || '',
        spaceId: parseInt(currentSpaceId),
        title: item.title || '',
        description: item.description || '',
        difficulty: mapDifficulty(item.difficulty),
        timeLimit: item.time_limit || 1000,
        memoryLimit: item.memory_limit || 256,
        author: {
          id: item.created_by?.id || 0,
          nickname: item.created_by?.nickname || '미상'
        },
        createdAt: item.create_time || new Date().toISOString(),
        participants: [] // 참가자 정보는 별도 처리 필요
      }));

      setProblems(mappedProblems);
    } catch (err) {
      console.error('문제 목록을 가져오는 중 오류 발생:', err);
      setError('문제 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 난이도 매핑 함수
  const mapDifficulty = (difficultyValue?: number): string => {
    const difficultyMap: Record<number, string> = {
      1: 'Easy',
      2: 'Medium',
      3: 'Hard'
    };
    return difficultyMap[difficultyValue || 0] || 'Medium';
  };

  // 컴포넌트 마운트 시 문제 목록 가져오기
  useEffect(() => {
    fetchProblems();
  }, [currentSpaceId]);

  // 문제 삭제
  const handleDeleteProblem = async (id: string) => {
    if (!currentSpaceId) {
      alert('유효한 스페이스 ID가 없습니다.');
      return;
    }

    if (!confirm('정말로 이 문제를 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 실제 API 호출로 삭제 요청
      await axios.delete(`${API_BASE_URL}/api/v1/coding-test/${currentSpaceId}/problem-details/${id}`, {
        withCredentials: true
      });

      // 성공적으로 삭제되면 UI에서도 제거
      setProblems(problems.filter(problem => problem.id !== id));

      // 상세 보기 다이얼로그가 열려있으면 닫기
      if (selectedProblem?.id === id) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      console.error('문제 삭제 중 오류 발생:', err);
      alert('문제를 삭제하는데 실패했습니다.');
    }
  };

  const handleViewProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setViewDialogOpen(true);
  };

  // // 문제 제출 페이지로 이동
  // const handleSubmitSolution = () => {
  //   navigate(`/space/${currentSpaceId}/problemPresent`);
  // };

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

  // 설명 텍스트 줄임 처리
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
        <h2 className="text-2xl font-bold">코딩 테스트 문제 목록</h2>
        <Button
          variant="outline"
          onClick={() => navigate(`/space/${currentSpaceId}/create-problem`)}
        >
          새 문제 등록
        </Button>
      </div>

      <Table>
        <TableCaption>현재 등록된 코딩 테스트 문제 목록입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[120px]">난이도</TableHead>
            <TableHead className="w-[120px]">작성자</TableHead>
            <TableHead className="w-[150px]">등록일</TableHead>
            <TableHead className="w-[100px]">제한 시간</TableHead>
            <TableHead className="w-[80px]">참여자</TableHead>
            <TableHead className="text-right w-[160px]">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                등록된 문제가 없습니다. 새 문제를 등록해보세요.
              </TableCell>
            </TableRow>
          ) : (
            problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">{problem._id}</TableCell>
                <TableCell>{truncateText(problem.title)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {problem.difficulty}
                  </span>
                </TableCell>
                <TableCell>{problem.author.nickname}</TableCell>
                <TableCell>{formatDate(problem.createdAt)}</TableCell>
                <TableCell>{problem.timeLimit}ms</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {problem.participants.length}명
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProblem(problem)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      보기
                    </Button>
                    {/*<Button*/}
                    {/*  variant="outline"*/}
                    {/*  size="sm"*/}
                    {/*  onClick={() => handleSubmitSolution(problem.id)}*/}
                    {/*>*/}
                    {/*  풀기*/}
                    {/*</Button>*/}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/space/${currentSpaceId}/edit-problem/${problem.id}`)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProblem(problem.id)}
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
            <TableCell colSpan={7}>총 문제 수</TableCell>
            <TableCell className="text-right">{problems.length}개</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* 문제 상세 보기 다이얼로그 */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProblem && (
            <>
              <DialogHeader>
                <DialogTitle>문제 상세 정보</DialogTitle>
                <DialogDescription>
                  ID: {selectedProblem._id} | 등록일: {formatDate(selectedProblem.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">제목</h3>
                  <p className="text-sm font-bold">{selectedProblem.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">난이도</h3>
                  <p className={`px-2 py-1 rounded-md text-sm inline-block ${selectedProblem.difficulty === 'Easy' ? 'bg-green-50 text-green-800' :
                    selectedProblem.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-red-50 text-red-800'
                    }`}>
                    {selectedProblem.difficulty}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">제한 사항</h3>
                  <p className="text-sm">
                    시간 제한: {selectedProblem.timeLimit}ms | 메모리 제한: {selectedProblem.memoryLimit}MB
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">작성자</h3>
                  <p className="text-sm">
                    {selectedProblem.author.nickname} (ID: {selectedProblem.author.id})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">문제 설명</h3>
                  <p className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                    {selectedProblem.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">참여자 목록</h3>
                  {selectedProblem.participants.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProblem.participants.map(participant => (
                        <span
                          key={participant.id}
                          className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          {participant.nickname}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">아직 참여자가 없습니다.</p>
                  )}
                </div>
                <div className="flex justify-end">
                  {/*<Button*/}
                  {/*  onClick={() => {*/}
                  {/*    handleSubmitSolution(selectedProblem.id);*/}
                  {/*    setViewDialogOpen(false);*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  문제 풀기*/}
                  {/*</Button>*/}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProblemsTable;