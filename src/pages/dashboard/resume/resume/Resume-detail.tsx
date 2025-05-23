import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Resume {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ResumeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 연동
    // 임시 데이터
    setResume({
      id: id || '',
      title: '샘플 이력서',
      content: '이력서 내용이 여기에 들어갑니다.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (!resume) {
    return <div className="p-6">이력서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{resume.title}</CardTitle>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
            >
              목록으로
            </Button>
            <Button
              onClick={() => navigate(`/space/${spaceId}/resume/resumes/${id}/edit`)}
            >
              수정
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>작성일: {new Date(resume.createdAt).toLocaleDateString()}</p>
              <p>수정일: {new Date(resume.updatedAt).toLocaleDateString()}</p>
            </div>
            <div className="whitespace-pre-wrap">{resume.content}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeDetail;