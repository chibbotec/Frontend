import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Lock, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

// 노트 응답 타입 정의
interface Author {
  id: number;
  nickname: string;
}

interface NoteResponse {
  id: string;
  spaceId: number;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  publicAccess: boolean;
}

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

const NoteList: React.FC = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const [publicNotes, setPublicNotes] = useState<NoteResponse[]>([]);
  const [privateNotes, setPrivateNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { spaceId } = useParams<{ spaceId: string }>();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);

        if (isGuest) {
          setLoading(false);
          return;
        }

        // 쿠키 기반 인증 사용
        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/notes`,
          {
            withCredentials: true // 쿠키 기반 인증
          }
        );

        console.log('API 응답:', response.data);

        // 서버 응답 구조 확인 및 데이터 처리
        const data = response.data;

        // Case 1: 서버가 publicNotes와 privateNotes 필드를 직접 제공하는 경우
        if (data.publicNotes && data.privateNotes) {
          setPublicNotes(data.publicNotes);
          setPrivateNotes(data.privateNotes);
        }

      } catch (error) {
        console.error('노트 목록을 불러오는데 실패했습니다:', error);
        setPublicNotes([]);
        setPrivateNotes([]);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchNotes();
    }
  }, [spaceId, isGuest]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleNoteClick = (noteId: string) => {
    // 수정된 부분: App.tsx의 라우트 구조에 맞게 경로 설정
    navigate(`/space/${spaceId}/interview/notes/${noteId}`);
  };

  const handleCreateNote = () => {
    // 수정된 부분: App.tsx의 라우트 구조에 맞게 경로 설정
    navigate(`/space/${spaceId}/interview/notes/new`);
  };

  // 기존 renderNoteCards 함수를 사용하면서 신규 버튼을 추가하는 함수
  const renderNotesWithCreateButton = (notes: NoteResponse[], isPublic: boolean) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 새 노트 생성 버튼 - 개인 노트 섹션에만 표시 */}
        {!isPublic && (
          <div
            className="h-[200px] border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={handleCreateNote}
          >
            <div className="flex flex-col items-center text-blue-500">
              <Plus className="h-10 w-10 mb-2" />
              <span className="text-sm font-medium">신규...</span>
            </div>
          </div>
        )}

        {/* 노트 목록 */}
        {notes.map((note) => (
          <Card
            key={note.id}
            className="h-[200px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
            onClick={() => handleNoteClick(note.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <span className="text-xs text-muted-foreground">
                {formatDate(note.updatedAt)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{note.author?.nickname || '익명'}</span>
                {note.publicAccess ? (
                  <Globe className="h-4 w-4 text-blue-500" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">노트</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Globe className="h-4 w-4 mr-2 text-blue-500" />
          <h3 className="text-lg font-medium">공유 노트</h3>
        </div>
        <Separator className="mb-4" />

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <p>로딩 중...</p>
          </div>
        ) : publicNotes.length > 0 ? (
          renderNotesWithCreateButton(publicNotes, true)
        ) : (
          <div className="flex justify-center items-center h-24 text-muted-foreground">
            아직 공유된 노트가 없습니다.
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center mb-2">
          <Lock className="h-4 w-4 mr-2 text-amber-500" />
          <h3 className="text-lg font-medium">개인 노트</h3>
        </div>
        <Separator className="mb-4" />

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <p>로딩 중...</p>
          </div>
        ) : privateNotes.length > 0 ? (
          renderNotesWithCreateButton(privateNotes, false)
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* 새 노트 생성 버튼 - 노트가 없을 때도 표시 */}
            <div
              className="h-[200px] border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={handleCreateNote}
            >
              <div className="flex flex-col items-center text-blue-500">
                <Plus className="h-10 w-10 mb-2" />
                <span className="text-sm font-medium">신규...</span>
              </div>
            </div>
            <div className="col-span-full flex justify-center items-center h-24 text-muted-foreground">
              아직 개인 노트가 없습니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteList;