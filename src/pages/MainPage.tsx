import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpace } from '@/context/SpaceContext';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MainPageCalendar } from '@/components/ui/calendar-main';

const apiUrl = import.meta.env.VITE_API_URL || '';

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

const MainPage: React.FC = () => {
  const { currentSpace } = useSpace();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // 디버깅을 위한 로그 추가
  console.log('MainPage currentSpace:', currentSpace);

  // 기술면접 통계 상태
  const [stats, setStats] = useState({
    totalContestCount: 0,
    totalQuestionCount: 0,
    totalNoteCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // 포트폴리오 상태
  const [publicPortfolios, setPublicPortfolios] = useState<Portfolio[]>([]);
  const [privatePortfolios, setPrivatePortfolios] = useState<Portfolio[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    if (!currentSpace?.id) return;
    setLoading(true);
    axios
      .get(`${apiUrl}/api/v1/tech-interview/${currentSpace.id}/home`, { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch(() => setStats({
        totalContestCount: 0,
        totalQuestionCount: 0,
        totalNoteCount: 0,
      }))
      .finally(() => setLoading(false));
  }, [currentSpace?.id]);

  // 포트폴리오 데이터 가져오기
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!currentSpace?.id) return;

      try {
        setPortfolioLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${currentSpace.id}/portfolio`,
          { withCredentials: true }
        );

        const data: CategorizedPortfolios = response.data;
        if (data.publicPortfolios) {
          setPublicPortfolios(data.publicPortfolios);
        }
        if (data.privatePortfolios) {
          setPrivatePortfolios(data.privatePortfolios);
        }
      } catch (error) {
        console.error('포트폴리오 목록을 불러오는데 실패했습니다:', error);
        setPublicPortfolios([]);
        setPrivatePortfolios([]);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolios();
  }, [currentSpace?.id]);

  // 더미 일정 데이터
  const dummySchedules = [
    { date: '2025-05-04', title: '스터디 모임' },
    { date: '2025-05-10', title: '이력서 제출' },
  ];
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const schedulesForSelected = dummySchedules.filter(s => s.date === selectedDateStr);

  return (
    <div className="p-4 min-h-screen overflow-y-auto">
      {/* <h4 className="text-2xl font-bold mb-6">{currentSpace?.spaceName || '스페이스 홈'}</h4> */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 auto-rows-min">
        {/* 이력서&포트폴리오 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-m font-semibold mb-3">포트폴리오</h2>
          <div className="flex flex-row items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">공개 포트폴리오</span>

          </div>
          <div className="flex flex-row gap-2 overflow-x-auto pb-2">
            {portfolioLoading ? (
              <div className="text-gray-400 text-sm flex items-center">로딩 중...</div>
            ) : publicPortfolios.length > 0 ? (
              publicPortfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="min-w-[180px] max-w-[180px] bg-gray-50 rounded-lg p-3 shadow cursor-pointer hover:bg-blue-50 transition flex flex-col"
                  onClick={() => navigate(`resume/portfolios/${portfolio.id}/detail`)}
                >
                  <div className="font-semibold text-gray-900 truncate mb-1">{portfolio.title}</div>
                  <div className="text-xs text-gray-500 mb-1">{portfolio.author?.nickname || '익명'}</div>
                  <div className="text-xs text-gray-400 mb-1">
                    {format(new Date(portfolio.duration?.startDate), 'yy-MM-dd')} ~ {format(new Date(portfolio.duration?.endDate), 'yy-MM-dd')}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">{portfolio.contents?.summary || '요약 없음'}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm flex items-center">공개 포트폴리오가 없습니다.</div>
            )}
          </div>

          {/* 내 포트폴리오 섹션 */}
          <div className="mt-4">
            <div className="flex flex-row items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">내 포트폴리오</span>
              <button
                className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                onClick={() => navigate(`resume/portfolios/new`)}
              >
                <Plus className="w-4 h-4" /> 포트폴리오 생성
              </button>
            </div>
            <div className="flex flex-row gap-2 overflow-x-auto pb-2">
              {portfolioLoading ? (
                <div className="text-gray-400 text-sm flex items-center">로딩 중...</div>
              ) : privatePortfolios.length > 0 ? (
                privatePortfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="min-w-[180px] max-w-[180px] bg-gray-50 rounded-lg p-3 shadow cursor-pointer hover:bg-blue-50 transition flex flex-col"
                    onClick={() => navigate(`resume/portfolios/${portfolio.id}/detail`)}
                  >
                    <div className="font-semibold text-gray-900 truncate mb-1">{portfolio.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{portfolio.author?.nickname || '익명'}</div>
                    <div className="text-xs text-gray-400 mb-1">
                      {format(new Date(portfolio.duration?.startDate), 'yy-MM-dd')} ~ {format(new Date(portfolio.duration?.endDate), 'yy-MM-dd')}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">{portfolio.contents?.summary || '요약 없음'}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm flex items-center">작성한 포트폴리오가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 일정관리 카드 (오른쪽 2행 차지) */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow md:row-span-2 flex flex-col">
          <h2 className="text-m font-semibold mb-3">일정관리</h2>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-[350px]">
              <MainPageCalendar
                selectedDate={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-2 text-gray-900">
                {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : '-'}
              </div>
              <ul className="text-gray-700 text-sm space-y-1">
                {schedulesForSelected.length > 0 ? (
                  schedulesForSelected.map((s, i) => (
                    <li key={i}>
                      <div className="bg-gray-100 rounded p-3 mb-2 shadow">
                        <div className="font-semibold text-gray-900">{s.title}</div>
                        <div className="text-xs text-gray-500">2025-05-04 14:00</div>
                        <div className="text-sm text-gray-700 mt-1">스터디룸 A에서 진행</div>
                        <div className="flex gap-2 justify-end mt-2">

                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="bg-gray-50 rounded p-3 text-gray-400 text-center">일정이 없습니다.</div>
                  </li>
                )}
              </ul>
              <div className="flex justify-end gap-1 mt-2">
                <button className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition">채용공고등록</button>
                <button className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">일정 추가</button>
              </div>
            </div>
          </div>
        </div>

        {/* 기술면접 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col gap-2">
          <h4 className="text-m font-semibold">기술 면접</h4>
          <div className="flex flex-row gap-2 w-full mb-1">
            <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/study` : '#'} className="flex-1">
              <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1 cursor-pointer hover:bg-blue-50 transition">
                <span className="text-xs text-gray-500">총 문제수</span>
                <span className="text-xl font-bold text-blue-600">{loading ? '...' : stats.totalQuestionCount}</span>
              </div>
            </Link>
            <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/contests` : '#'} className="flex-1">
              <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1 cursor-pointer hover:bg-blue-50 transition">
                <span className="text-xs text-gray-500">총 시험 수</span>
                <span className="text-xl font-bold text-blue-600">{loading ? '로딩중' : stats.totalContestCount}</span>
              </div>
            </Link>
            <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/notes` : '#'} className="flex-1">
              <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1 cursor-pointer hover:bg-blue-50 transition">
                <span className="text-xs text-gray-500">총 노트 수</span>
                <span className="text-xl font-bold text-blue-600">{loading ? '...' : stats.totalNoteCount}</span>
              </div>
            </Link>
          </div>
          <h4 className="text-m font-semibold mb-1">코딩 테스트</h4>
          <div className="flex flex-row gap-2 w-full">
            <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500">총 문제수</span>
              <span className="text-xl font-bold text-blue-600">7</span>
            </div>
            <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500">총 제출</span>
              <span className="text-xl font-bold text-blue-600">7</span>
            </div>
            <div className="bg-gray-100 rounded p-3 flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500">총 오답 노트</span>
              <span className="text-xl font-bold text-blue-600">7</span>
            </div>
          </div>
        </div>

        {/* 멤버 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-m font-semibold mb-3">멤버</h2>
          <div className="flex flex-row gap-2 overflow-x-auto">
            {currentSpace?.members && currentSpace.members.length > 0 ? (
              currentSpace.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 min-w-[120px] bg-gray-50 rounded p-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.nickname[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-700">{member.nickname}</span>
                    <span className="text-xs text-gray-500">
                      {member.role === 'OWNER' ? '소유자' :
                        member.role === 'ADMIN' ? '관리자' : '멤버'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">멤버가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
