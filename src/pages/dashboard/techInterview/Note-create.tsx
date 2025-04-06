import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Globe, Lock, Save, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";

const NoteCreate: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId, noteId } = useParams<{ spaceId: string, noteId: string }>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [publicAccess, setPublicAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // API 기본 URL
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    // noteId가 'new'가 아니고 존재하는 경우 기존 노트 데이터 불러오기
    if (noteId && noteId !== 'new') {
      setIsEditMode(true);
      fetchNoteData();
    }
  }, [noteId, spaceId]);

  const fetchNoteData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
          `${apiUrl}/api/v1/tech-interview/${spaceId}/notes/${noteId}`,
          { withCredentials: true }
      );

      const noteData = response.data;
      setTitle(noteData.title);
      setContent(noteData.content);
      setPublicAccess(noteData.publicAccess);
    } catch (error) {
      console.error('노트 데이터 불러오기 실패:', error);
      toast.error('노트 데이터를 불러오는데 실패했습니다', {
        description: '잠시 후 다시 시도해주세요'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // 기존 노트 수정
        await axios.put(
            `${apiUrl}/api/v1/tech-interview/${spaceId}/notes/${noteId}`,
            {
              title,
              content,
              publicAccess,
            },
            { withCredentials: true }
        );
      } else {
        // 새 노트 생성
        await axios.post(
            `${apiUrl}/api/v1/tech-interview/${spaceId}/notes`,
            {
              title,
              content,
              publicAccess,
            },
            { withCredentials: true }
        );
      }

      toast.success('노트가 저장되었습니다');

      // 저장 성공 후 노트 목록 페이지로 이동
      navigate(`/space/${spaceId}/notes`);
    } catch (error) {
      console.error('노트 저장 실패:', error);
      toast.error('노트 저장에 실패했습니다', {
        description: '잠시 후 다시 시도해주세요'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/space/${spaceId}/notes`);
  };

  return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg sm:text-2xl font-bold">{isEditMode ? '노트 수정' : '새 노트 작성'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              {publicAccess ? (
                  <Globe className="h-4 w-4 text-blue-500" />
              ) : (
                  <Lock className="h-4 w-4 text-amber-500" />
              )}
              <Label htmlFor="public-switch" className="text-xs sm:text-sm whitespace-nowrap">
                {publicAccess ? '공개' : '비공개'}
              </Label>
              <Switch
                  id="public-switch"
                  checked={publicAccess}
                  onCheckedChange={setPublicAccess}
              />
            </div>
            <Button onClick={handleSave} disabled={loading} size="sm" className="text-xs sm:text-sm">
              <Save className="h-4 w-4 mr-1 sm:mr-2" />
              {isEditMode ? '수정' : '저장'}
            </Button>
          </div>
        </div>


        <div className="mb-4">
          <Label htmlFor="title" className="text-base font-medium">
            제목
          </Label>
          <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="노트 제목을 입력하세요"
              className="mt-1"
          />
        </div>

        <Separator className="my-4" />

            <div className="markarea h-100vh" data-color-mode="light">
              <MDEditor height="calc(100vh - 250px)" value={content} onChange={(value) => setContent(value || '')}  />
            </div>
          {/*/!* 마크다운 에디터 *!/*/}
          {/*<div className="h-full">*/}
          {/*</div>*/}

        {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-280px)]">*/}
        {/*  /!* 미리보기 *!/*/}
        {/*  <Card className="h-full overflow-auto">*/}
        {/*    <CardHeader className="pb-2">*/}
        {/*      <CardTitle className="text-base">미리보기</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <MDEditor.Markdown source={content} />*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}
      </div>
  );
};

export default NoteCreate;