import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

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
}

interface PortfolioDetail {
  id: string;
  spaceId: number;
  title: string;
  author: Author;
  duration: Duration;
  contents: Contents;
  thumbnailUrl?: string;
  publicAccess: boolean;
  createdAt: string;
  updatedAt: string;
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

  const handleBack = () => {
    navigate(`/space/${spaceId}/resume/portfolios`);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
        <h2 className="text-2xl font-bold">{portfolio.title}</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(portfolio.duration.startDate).toLocaleDateString()} ~ 
                  {new Date(portfolio.duration.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={portfolio.publicAccess ? "default" : "secondary"}>
                  {portfolio.publicAccess ? '공개' : '비공개'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>포트폴리오 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">요약</h3>
                <p className="text-sm text-gray-600">{portfolio.contents.summary}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">개요</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{portfolio.contents.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">사용한 기술 스택</h3>
                <div className="flex flex-wrap gap-2">
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>포트폴리오 상세</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {portfolio.contents.features && Object.entries(portfolio.contents.features).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">주요 기능</h3>
                  <div className="space-y-3">
                    {Object.entries(portfolio.contents.features).map(([title, descriptions], index) => (
                      <div 
                        key={index}
                        className="bg-white border rounded-md p-4"
                      >
                        <h4 className="font-medium mb-2">{title}</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {descriptions.map((desc, idx) => (
                            <li key={idx} className="text-sm text-gray-600">{desc}</li>
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
                    <h3 className="text-sm font-medium">아키텍처</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {portfolio.contents.architecture.communication}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">배포</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {portfolio.contents.architecture.deployment}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
