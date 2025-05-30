import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Loader2, Users, UserCog, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import mockData from './components/Mock';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface Author {
  id: number;
  nickname: string;
}

interface Duration {
  startDate: string;
  endDate: string;
}

interface Architecture {
  communication: string;
  deployment: string;
}

interface Contents {
  techStack: string;
  summary: string;
  description: string;
  features: Record<string, string[]>;
  architecture: Architecture;
  roles?: string[];
}

interface PortfolioDetail {
  id: string;
  spaceId: number;
  title: string;
  author: Author;
  duration: Duration;
  contents: Contents;
  thumbnailUrl: string | null;
  publicAccess: boolean;
  createdAt: string;
  updatedAt: string;
  githubLink?: string;
  deployLink?: string;
  memberCount?: number;
  memberRoles?: string;
  githubRepos?: Array<{
    name: string;
    url: string;
    description: string;
    language: string;
    lineCount: number;
    byteSize: number | null;
    selectedDirectories: string[];
  }>;
}

const PortfolioDetail: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio/${id}`,
          { withCredentials: true }
        );

        const portfolioData: PortfolioDetail = response.data;
        setPortfolio(portfolioData);
        setError(null);
      } catch (err) {
        console.error('포트폴리오 정보를 불러오는데 실패했습니다:', err);
        setError('포트폴리오 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [spaceId, id]);

  // useEffect(() => {
  //   setPortfolio(mockData as PortfolioDetail);
  //   setLoading(false);
  // }, []);


  const handleBack = () => {
    navigate(`/space/${spaceId}/resume/portfolios`);
  };

  const handleEdit = () => {
    if (!portfolio) return;
    const editUrl = `/space/${spaceId}/resume/portfolios/${id}/edit`;
    console.log('Navigating to:', editUrl);
    console.log('With state:', portfolio);
    navigate(editUrl, {
      state: { portfolio }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(
        `${apiUrl}/api/v1/resume/${spaceId}/portfolio/${id}`,
        { withCredentials: true }
      );
      navigate(`/space/${spaceId}/resume/portfolios`);
    } catch (err) {
      console.error('포트폴리오 삭제에 실패했습니다:', err);
      alert('포트폴리오 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || '포트폴리오를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
        <div className="flex justify-between items-center gap-1">
          <Button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleEdit}>
            수정하기
          </Button>
          <Button
            className="px-4 py-2 text-white rounded"
            variant="destructive"
            onClick={handleDelete}>
            삭제하기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="gap-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className='text-2xl font-bold'>{portfolio.title}</CardTitle>
              <Badge variant={portfolio.publicAccess ? "default" : "secondary"}>
                {portfolio.publicAccess ? '공개' : '비공개'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 왼쪽 컨테이너 - 1/3 */}
              <div className="space-y-4">
                {/* 팀 정보 */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">팀원 {portfolio.memberCount ? `${portfolio.memberCount}명` : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    <span className="text-sm font-medium">역할 {portfolio.memberRoles || '-'}</span>
                  </div>
                </div>

                {/* 기간 정보 */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date(portfolio.duration.startDate).toLocaleDateString()} ~ {new Date(portfolio.duration.endDate).toLocaleDateString()}
                  </span>
                </div>

                {/* 링크 정보 */}
                {(portfolio.githubLink && portfolio.githubLink !== "null") || (portfolio.deployLink && portfolio.deployLink !== "null") ? (
                  <div className="flex items-center gap-4">
                    {portfolio.githubLink && portfolio.githubLink !== "null" && (
                      <a href={portfolio.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <FaGithub className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {portfolio.deployLink && portfolio.deployLink !== "null" && (
                      <a href={portfolio.deployLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <Globe className="w-4 h-4" />
                        <span>Site</span>
                      </a>
                    )}
                  </div>
                ) : null}
              </div>

              {/* 오른쪽 컨테이너 - 2/3 */}
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{portfolio.contents.summary}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>프로젝트 개요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xl font-medium">개요</label>
              <p className="text-sm text-gray-600 whitespace-pre-wrap mt-3">{portfolio.contents.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xl font-medium block mb-4">주요역할 및 성과</label>
              <ul className="list-disc pl-4 space-y-1">
                {portfolio.contents.roles?.map((role, index) => (
                  <li key={index} className="text-sm text-gray-600 pl-2">{role}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-xl font-medium">사용한 기술 스택</label>
              <div className="flex flex-wrap gap-2 mt-3">
                {portfolio.contents.techStack.split(',').map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>포트폴리오 상세</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {portfolio.contents.features && Object.entries(portfolio.contents.features).length > 0 && (
              <div className="space-y-4">
                <label className="text-xl font-medium block mb-4">주요 기능</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(portfolio.contents.features).map(([title, descriptions], index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-md p-4"
                    >
                      <h4 className="font-medium mb-2">{title}</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {descriptions.map((desc, idx) => (
                          <li key={idx} className="text-sm text-gray-600 pl-2">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolio.contents.architecture && (
              <>
                <div className="space-y-2">
                  <label className="text-xl font-medium block mb-4">아키텍처</label>
                  <ul className="list-disc pl-4 space-y-1">
                    {portfolio.contents.architecture.communication.split('\n').map((line, idx) => (
                      <li key={idx} className="text-sm text-gray-600 pl-2">{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-xl font-medium block mb-4">CI/CD 아키텍처</label>
                  <ul className="list-disc pl-4 space-y-1">
                    {portfolio.contents.architecture.deployment.split('\n').map((line, idx) => (
                      <li key={idx} className="text-sm text-gray-600 pl-2">{line}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDetail;
