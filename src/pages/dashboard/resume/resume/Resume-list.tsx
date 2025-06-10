import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';
import axios from 'axios';
import { ResumeSummary } from './components/types';
import { ResumeCustomModal } from './components/Resume-custom-modal';
import { mockResumeList } from '@/mock-data/Resume-list-mock';
import { LoginForm } from '@/components/authorization/login-form';
import { useAuth } from '@/context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL || '';

const ResumeList: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { spaceId } = useParams<{ spaceId: string }>();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isGuestMode = !localStorage.getItem('token'); // 게스트 모드 체크
  const { login } = useAuth();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      if (isGuestMode) {
        // 게스트 모드일 경우 mock 데이터 사용
        setResumes(mockResumeList as ResumeSummary[]);
      } else {
        const response = await axios.get<ResumeSummary[]>(`${apiUrl}/api/v1/resume/${spaceId}/resume`, {
          withCredentials: true
        });
        setResumes(response.data);
      }
    } catch (error) {
      console.error('이력서 목록을 불러오는데 실패했습니다:', error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceId || isGuestMode) {
      fetchResumes();
    }
  }, [spaceId, isGuestMode]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleResumeClick = (resumeId: string) => {
    navigate(`/space/${spaceId}/resume/resumes/${resumeId}/detail`);
  };

  const handleCreateResume = () => {
    if (isGuestMode) {
      setIsLoginModalOpen(true);
    } else {
      navigate(`/space/${spaceId}/resume/resumes/new`);
    }
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
                  {formatDate(resume.createdAt)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  이력서를 클릭하여 상세 내용을 확인하세요.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="text-xs text-muted-foreground">
                  작성일: {formatDate(resume.createdAt)}
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
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            if (isGuestMode) {
              setIsLoginModalOpen(true);
            } else {
              setIsCustomModalOpen(true);
            }
          }}
        >
          채용공고 맞춤 이력서 작성
        </button>
      </div>

      <ResumeCustomModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        spaceId={spaceId || ''}
        onCreated={() => {
          setIsCustomModalOpen(false);
          // Refresh the resume list
          if (spaceId) {
            fetchResumes();
          }
        }}
      />

      <LoginForm
        isOpen={isLoginModalOpen}
        onClose={async () => setIsLoginModalOpen(false)}
        onLogin={login}
      />
    </div>
  );
};

export default ResumeList;
