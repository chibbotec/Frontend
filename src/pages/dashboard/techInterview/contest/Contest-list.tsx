import React, { useState, useEffect } from 'react';
import { useSpace } from "@/context/SpaceContext";
import { useAuth } from "@/context/AuthContext";
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
import { Plus, Eye, Play } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ContestCreateModal from './ContestCreateModal';

// 타입 정의
interface Contest {
  id: number;
  title: string;
  createdAt: string;
  submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  participants: Array<{
    id: number;
    nickname: string;
    submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  }>;
}

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function ContestList() {
  const { currentSpace } = useSpace();
  const { user } = useAuth();
  const { spaceId } = useParams<{ spaceId: string }>();
  const currentSpaceId = spaceId || localStorage.getItem('activeSpaceId') || '';
  const navigate = useNavigate();

  console.log('Current spaceId:', spaceId);
  console.log('Current spaceId from localStorage:', localStorage.getItem('activeSpaceId'));
  console.log('Final currentSpaceId:', currentSpaceId);

  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 대회 목록 가져오기
  const fetchContests = async () => {
    if (!currentSpaceId) {
      setError('유효한 스페이스 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/tech-interview/${currentSpaceId}/contests`, {
        withCredentials: true
      });
      // Sort contests by creation date in descending order
      const sortedContests = response.data.sort((a: Contest, b: Contest) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setContests(sortedContests);
    } catch (err) {
      console.error('대회 목록을 가져오는 중 오류 발생:', err);
      setError('대회 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 대회 목록 가져오기
  useEffect(() => {
    fetchContests();
  }, [currentSpaceId]);

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

  const handleCreateSuccess = () => {
    fetchContests(); // Refresh the list after creating a new contest
  };

  // 참여자 여부 확인 함수
  const isParticipant = (contest: Contest) => {
    if (!user) return false;
    return contest.participants.some(participant => participant.id === user.id);
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
        <h2 className="text-2xl font-bold">대회 관리</h2>
        <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          새 대회 등록
        </Button>
      </div>

      <Table>
        <TableCaption>현재 등록된 대회 목록입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">등록일</TableHead>
            <TableHead className="text-center w-[100px]">참여자</TableHead>
            <TableHead className="text-center w-[100px]">상태</TableHead>
            <TableHead className="text-center w-[100px]">시험</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                등록된 대회가 없습니다. 새 대회를 등록해보세요.
              </TableCell>
            </TableRow>
          ) : (
            contests.map((contest) => (
              <TableRow key={contest.id}>
                <TableCell className="font-medium">{contest.id}</TableCell>
                <TableCell>{contest.title}</TableCell>
                <TableCell>{formatDate(contest.createdAt)}</TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {contest.participants.length}명
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    contest.submit === 'IN_PROGRESS' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : contest.submit === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {contest.submit === 'IN_PROGRESS' 
                      ? '진행중'
                      : contest.submit === 'COMPLETED'
                      ? '제출완료'
                      : '평가완료'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(`/space/${currentSpaceId}/interview/contests/${contest.id}`);
                      }}
                    >
                      조회
                    </Button>
                    <Button
                      variant={isParticipant(contest) ? "default" : "secondary"}
                      size="icon"
                      disabled={!isParticipant(contest)}
                      onClick={() => {
                        navigate(`/space/${currentSpaceId}/interview/contests/${contest.id}/test`);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>총 대회 수</TableCell>
            <TableCell className="text-right">{contests.length}개</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <ContestCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default ContestList;
