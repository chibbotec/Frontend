import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';

interface Resume {
  id: string;
  spaceId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ResumeList: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { spaceId } = useParams<{ spaceId: string }>();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        // TODO: API 연동
        // 임시 데이터
        setResumes([
          {
            id: '1',
            spaceId: Number(spaceId),
            title: '샘플 이력서 1',
            content: '이력서 내용 1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            spaceId: Number(spaceId),
            title: '샘플 이력서 2',
            content: '이력서 내용 2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('이력서 목록을 불러오는데 실패했습니다:', error);
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchResumes();
    }
  }, [spaceId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleResumeClick = (resumeId: string) => {
    navigate(`/space/${spaceId}/resume/resumes/${resumeId}/detail`);
  };

  const handleCreateResume = () => {
    navigate(`/space/${spaceId}/resume/resumes/new`);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">이력서</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <p>로딩 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* 새 이력서 생성 버튼 */}
          <div
            className="h-[200px] border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={handleCreateResume}
          >
            <div className="flex flex-col items-center text-blue-500">
              <Plus className="h-10 w-10 mb-2" />
              <span className="text-sm font-medium">신규 이력서 작성</span>
            </div>
          </div>

          {/* 이력서 목록 */}
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="h-[200px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
              onClick={() => handleResumeClick(resume.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{resume.title}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(resume.updatedAt)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {resume.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="text-xs text-muted-foreground">
                  마지막 수정: {formatDate(resume.updatedAt)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && resumes.length === 0 && (
        <div className="flex justify-center items-center h-24 text-muted-foreground">
          아직 작성한 이력서가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ResumeList;
