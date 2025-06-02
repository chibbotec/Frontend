import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface NoteAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteSelect: (noteId: string) => void;
}

const NoteAddModal: React.FC<NoteAddModalProps> = ({ isOpen, onClose, onNoteSelect }) => {
  const [publicNotes, setPublicNotes] = useState<NoteResponse[]>([]);
  const [privateNotes, setPrivateNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { spaceId } = useParams<{ spaceId: string }>();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/notes`,
          { withCredentials: true }
        );

        const data = response.data;
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
  }, [spaceId, isOpen]);

  const handleNoteClick = (noteId: string) => {
    onNoteSelect(noteId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>노트 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 공유 노트 섹션 */}
          <div>
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 mr-2 text-blue-500" />
              <h3 className="text-sm font-medium">공유 노트</h3>
            </div>
            <Separator className="mb-2" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {loading ? (
                <p className="text-sm text-muted-foreground col-span-4">로딩 중...</p>
              ) : publicNotes.length > 0 ? (
                publicNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="cursor-pointer hover:bg-accent/50 p-1"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <CardContent className="px-0 text-center">
                      <p className="text-sm truncate">{note.title}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-4">공유된 노트가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 개인 노트 섹션 */}
          <div>
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 mr-2 text-amber-500" />
              <h3 className="text-sm font-medium">개인 노트</h3>
            </div>
            <Separator className="mb-2" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {loading ? (
                <p className="text-sm text-muted-foreground col-span-4">로딩 중...</p>
              ) : privateNotes.length > 0 ? (
                privateNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="cursor-pointer hover:bg-accent/50 p-1"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <CardContent className="px-0 text-center">
                      <p className="text-sm truncate">{note.title}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-4">개인 노트가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteAddModal;
