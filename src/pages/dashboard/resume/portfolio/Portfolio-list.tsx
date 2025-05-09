import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Lock, Globe, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// 포트폴리오 타입 정의
interface Author {
  id: number;
  nickname: string;
}

interface Duration {
  startDate: string;
  endDate: string;
}

interface Contents {
  techStack: string;
  summary: string;
  description: string;
}

interface Portfolio {
  id: string;
  spaceId: number;
  title: string;
  author: Author;
  duration: Duration;
  contents: Contents;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  publicAccess?: boolean;
}

interface CategorizedPortfolios {
  publicPortfolios: Portfolio[];
  privatePortfolios: Portfolio[];
}

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

const PortfolioList: React.FC = () => {
  const navigate = useNavigate();
  const [publicPortfolios, setPublicPortfolios] = useState<Portfolio[]>([]);
  const [privatePortfolios, setPrivatePortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const { spaceId } = useParams<{ spaceId: string }>();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);

        // 쿠키 기반 인증 사용
        const response = await axios.get(
            `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
            {
              withCredentials: true // 쿠키 기반 인증
            }
        );

        console.log('API 응답:', response.data);

        // 서버 응답 데이터 처리
        const data: CategorizedPortfolios = response.data;

        if (data.publicPortfolios && data.privatePortfolios) {
          setPublicPortfolios(data.publicPortfolios);
          setPrivatePortfolios(data.privatePortfolios);
        }

      } catch (error) {
        console.error('포트폴리오 목록을 불러오는데 실패했습니다:', error);
        setPublicPortfolios([]);
        setPrivatePortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchPortfolios();
    }
  }, [spaceId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return '기간 미설정';
    const start = startDate ? formatDate(startDate) : '시작일 미설정';
    const end = endDate ? formatDate(endDate) : '종료일 미설정';
    return `${start} ~ ${end}`;
  };

  const handlePortfolioClick = (portfolioId: string) => {
    navigate(`/space/${spaceId}/portfolio/${portfolioId}`);
  };

  const handleCreatePortfolio = () => {
    navigate(`/space/${spaceId}/create-portfolios/new`);
  };

  // 포트폴리오 카드 렌더링 함수 (신규 생성 버튼 포함)
  const renderPortfoliosWithCreateButton = (portfolios: Portfolio[], isPublic: boolean) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* 새 포트폴리오 생성 버튼 - 개인 포트폴리오 섹션에만 표시 */}
          {!isPublic && (
              <div
                  className="h-[280px] border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={handleCreatePortfolio}
              >
                <div className="flex flex-col items-center text-blue-500">
                  <Plus className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">신규 포트폴리오 작성</span>
                </div>
              </div>
          )}

          {/* 포트폴리오 목록 */}
          {portfolios.map((portfolio) => (
              <Card
                  key={portfolio.id}
                  className="h-[280px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all overflow-hidden"
                  onClick={() => handlePortfolioClick(portfolio.id)}
              >
                {portfolio.thumbnailUrl && (
                    <div className="h-24 overflow-hidden">
                      <img
                          src={portfolio.thumbnailUrl}
                          alt={portfolio.title}
                          className="w-full h-full object-cover"
                      />
                    </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{portfolio.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDateRange(portfolio.duration?.startDate, portfolio.duration?.endDate)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-1">기술 스택</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{portfolio.contents?.techStack || '미설정'}</p>

                  <p className="text-sm font-medium mb-1">요약</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{portfolio.contents?.summary || '요약 정보가 없습니다.'}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{portfolio.author?.nickname || '익명'}</span>
                    {portfolio.publicAccess ? (
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
          <h2 className="text-2xl font-bold mb-4">포트폴리오</h2>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Globe className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-lg font-medium">공개 포트폴리오</h3>
          </div>
          <Separator className="mb-4" />

          {loading ? (
              <div className="flex justify-center items-center h-24">
                <p>로딩 중...</p>
              </div>
          ) : publicPortfolios.length > 0 ? (
              renderPortfoliosWithCreateButton(publicPortfolios, true)
          ) : (
              <div className="flex justify-center items-center h-24 text-muted-foreground">
                아직 공개된 포트폴리오가 없습니다.
              </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-2">
            <Lock className="h-4 w-4 mr-2 text-amber-500" />
            <h3 className="text-lg font-medium">내 포트폴리오</h3>
          </div>
          <Separator className="mb-4" />

          {loading ? (
              <div className="flex justify-center items-center h-24">
                <p>로딩 중...</p>
              </div>
          ) : (
              <div>
                {renderPortfoliosWithCreateButton(privatePortfolios, false)}
                {privatePortfolios.length === 0 && (
                    <div className="flex justify-center items-center h-24 text-muted-foreground mt-4">
                      아직 작성한 포트폴리오가 없습니다.
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
};

export default PortfolioList;