import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpace } from '@/context/SpaceContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Lock, Globe, Code, FileText, BookOpen, Users, Briefcase, ClipboardList, CheckCircle, XCircle, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ResumeSummary } from '@/pages/dashboard/resume/resume/components/types';
import { DescriptionCreateModal } from '@/pages/dashboard/resume/schedule-job/component/Description-create-modal';
import { ApplyCreateModal } from '@/pages/dashboard/resume/schedule-job/component/Apply-create-modal';
import { DescriptionDetailModal } from '@/pages/dashboard/resume/schedule-job/component/Description-detail-modal';

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

interface JobDescription {
  id: string;
  url: string | null;
  isManualInput: boolean;
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
  spaceId: number;
  createdAt: string;
  updatedAt: string;
  publicGrade: string;
}

interface ProcessCard {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  date: string;
  section: string;
  resume: {
    id: string;
    title: string;
  };
  portfolio: Array<{
    id: string;
    title: string;
  }>;
  files: File[];
}

const APPLICATION_STATUSES = [
  { id: 'RESUME', label: '지원서', section: 'resume' },
  { id: 'DOCUMENT', label: '서류', section: 'document' },
  { id: 'CODING', label: '코딩테스트', section: 'coding' },
  { id: 'INTERVIEW1', label: '1차면접', section: 'interview1' },
  { id: 'INTERVIEW2', label: '2차면접', section: 'interview2' },
  { id: 'PASS', label: '합격', section: 'pass' },
  { id: 'FAIL', label: '불합격', section: 'fail' },
];

const DroppableSection: React.FC<{
  id: string;
  title: string;
  cards: ProcessCard[];
  showDivider?: boolean;
  onCardClick?: (card: ProcessCard) => void;
  onAddCard?: (section: string) => void;
  showAddButton?: boolean;
}> = ({ id, title, cards, showDivider = true, onCardClick, onAddCard, showAddButton = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="col-span-1 relative pr-2 h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{title}</div>
        {showAddButton && (
          <button
            onClick={() => onAddCard?.(id)}
            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            + 추가
          </button>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={`h-[calc(100%-2.5rem)] rounded-lg transition-colors ${isOver ? 'bg-blue-50' : ''}`}
      >
        <div className="h-full p-2">
          {cards.length > 0 ? (
            <div className="h-full">
              <SortableContext
                items={cards.map(card => card.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {cards.map((card) => (
                    <Card
                      key={card.id}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => onCardClick?.(card)}
                    >
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">{card.company}</div>
                        <div className="text-xs text-muted-foreground">{card.position}</div>
                        <div className="text-xs text-muted-foreground mt-1">{card.platform}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SortableContext>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              {showAddButton ? "지원서를 추가해주세요" : ""}
            </div>
          )}
        </div>
      </div>
      {showDivider && <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-200"></div>}
    </div>
  );
};

const MainPage: React.FC = () => {
  const { currentSpace } = useSpace();
  const { isGuest } = useAuth();
  const navigate = useNavigate();

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
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  // 채용 공고 상태
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [applicationStats, setApplicationStats] = useState({
    resume: 0,
    document: 0,
    coding: 0,
    interview1: 0,
    interview2: 0,
    pass: 0,
    fail: 0,
  });

  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [resumeLoading, setResumeLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);

  useEffect(() => {
    if (!currentSpace?.id) return;
    setLoading(true);

    // 게스트 모드일 때는 기본 데이터 사용
    if (isGuest) {
      setStats({
        totalContestCount: 0,
        totalQuestionCount: 0,
        totalNoteCount: 0,
      });
      setLoading(false);
      return;
    }

    axios
      .get(`${apiUrl}/api/v1/tech-interview/${currentSpace.id}/home`, { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch(() => setStats({
        totalContestCount: 0,
        totalQuestionCount: 0,
        totalNoteCount: 0,
      }))
      .finally(() => setLoading(false));
  }, [currentSpace?.id, isGuest]);

  // 포트폴리오 데이터 가져오기
  useEffect(() => {
    if (!currentSpace?.id) return;

    const fetchPortfolios = async () => {
      try {
        setPortfolioLoading(true);
        // 게스트 모드일 때는 기본 데이터 사용
        if (isGuest) {
          setPrivatePortfolios([]);
          setPublicPortfolios([]);
          setPortfolioLoading(false);
          return;
        }

        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${currentSpace.id}/portfolio`,
          { withCredentials: true }
        );
        const data: CategorizedPortfolios = response.data;
        setPrivatePortfolios(data.privatePortfolios || []);
        setPublicPortfolios(data.publicPortfolios || []);
      } catch (error) {
        setPrivatePortfolios([]);
        setPublicPortfolios([]);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolios();
  }, [currentSpace?.id, isGuest]);

  // 채용 공고 데이터 가져오기
  const fetchJobDescriptions = async () => {
    if (!currentSpace?.id) return;

    try {
      setLoading(true);
      // 게스트 모드일 때는 기본 데이터 사용
      if (isGuest) {
        setJobDescriptions([]);
        setLoading(false);
        return;
      }

      const response = await axios.get<JobDescription[]>(
        `${apiUrl}/api/v1/resume/${currentSpace.id}/job-description`,
        { withCredentials: true }
      );
      setJobDescriptions(response.data);
    } catch (error) {
      console.error('채용 공고 목록을 불러오는데 실패했습니다:', error);
      setJobDescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  // 지원 현황 데이터 가져오기
  const fetchJobApplications = async () => {
    if (!currentSpace?.id) return;

    try {
      setLoading(true);
      // 게스트 모드일 때는 기본 데이터 사용
      if (isGuest) {
        setApplicationStats({
          resume: 0,
          document: 0,
          coding: 0,
          interview1: 0,
          interview2: 0,
          pass: 0,
          fail: 0,
        });
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${apiUrl}/api/v1/resume/${currentSpace.id}/job-application`,
        { withCredentials: true }
      );

      // 각 상태별 지원서 수 계산
      const stats = {
        resume: 0,
        document: 0,
        coding: 0,
        interview1: 0,
        interview2: 0,
        pass: 0,
        fail: 0,
      };

      response.data.forEach((app: any) => {
        const status = app.processStatus.toLowerCase();
        if (stats.hasOwnProperty(status)) {
          stats[status as keyof typeof stats]++;
        }
      });

      setApplicationStats(stats);
    } catch (error) {
      console.error('지원서 목록을 불러오는데 실패했습니다:', error);
      setApplicationStats({
        resume: 0,
        document: 0,
        coding: 0,
        interview1: 0,
        interview2: 0,
        pass: 0,
        fail: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
    fetchJobApplications();
  }, [currentSpace?.id]);

  useEffect(() => {
    if (!currentSpace?.id) return;
    const fetchResumes = async () => {
      try {
        setResumeLoading(true);
        // 게스트 모드일 때는 기본 데이터 사용
        if (isGuest) {
          setResumes([]);
          setResumeLoading(false);
          return;
        }

        const response = await axios.get<ResumeSummary[]>(
          `${apiUrl}/api/v1/resume/${currentSpace.id}/resume`,
          { withCredentials: true }
        );
        setResumes(response.data);
      } catch (error) {
        setResumes([]);
      } finally {
        setResumeLoading(false);
      }
    };
    fetchResumes();
  }, [currentSpace?.id, isGuest]);

  return (
    <div className="p-6 space-y-6">
      {/* 상단 통계 */}
      <div className="md:hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">이력서</span>
              </td>
              <td className="py-2 text-right">
                <span className="font-bold">{resumeLoading ? '...' : resumes.length}</span>
                <span className="text-xs text-muted-foreground ml-1">건</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <span className="text-sm">포트폴리오</span>
              </td>
              <td className="py-2 text-right">
                <span className="font-bold">{portfolioLoading ? '...' : privatePortfolios.length}</span>
                <span className="text-xs text-muted-foreground ml-1">건</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm">기술 면접</span>
              </td>
              <td className="py-2 text-right">
                <span className="font-bold">{loading ? '...' : stats.totalQuestionCount}</span>
                <span className="text-xs text-muted-foreground ml-1">건</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-sm">코딩 테스트</span>
              </td>
              <td className="py-2 text-right">
                <span className="font-bold">7</span>
                <span className="text-xs text-muted-foreground ml-1">건</span>
              </td>
            </tr>
            <tr>
              <td className="py-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">채용</span>
              </td>
              <td className="py-2 text-right">
                <span className="font-bold">{jobDescriptions.length}</span>
                <span className="text-xs text-muted-foreground ml-1">건</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 데스크탑용 카드 레이아웃 */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이력서</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumeLoading ? '...' : resumes.length}</div>
            <p className="text-xs text-muted-foreground">작성된 이력서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">포트폴리오</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioLoading ? '...' : privatePortfolios.length}</div>
            <p className="text-xs text-muted-foreground">작성된 포트폴리오</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">기술 면접</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalQuestionCount}</div>
            <p className="text-xs text-muted-foreground">총 문제 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">코딩 테스트</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">총 문제 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">채용</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobDescriptions.length}</div>
            <p className="text-xs text-muted-foreground">등록된 채용 공고</p>
          </CardContent>
        </Card>
      </div>
      {/* 2행 2열 그리드로 전체 레이아웃 재구성 */}
      <div className="grid gap-6">
        {/* 첫 번째 행: 포트폴리오(왼쪽) + 채용공고(오른쪽) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 포트폴리오 */}
          <div className="md:col-span-2">
            <Card className="py-6 gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">포트폴리오</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 내 포트폴리오 */}
                    <div className="h-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-medium">내 포트폴리오</h3>
                        <Plus className="h-4 w-4 cursor-pointer" onClick={() => navigate(`resume/portfolios/new`)} />
                      </div>
                      <div className="overflow-x-auto">
                        <div className="flex gap-4 pb-2 min-w-min">
                          {portfolioLoading ? (
                            <div className="text-gray-400 text-sm flex items-center justify-center h-full">로딩 중...</div>
                          ) : privatePortfolios.length > 0 ? (
                            privatePortfolios.slice(0, 2).map((portfolio) => (
                              <Card
                                key={portfolio.id}
                                className="h-[140px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all overflow-hidden w-[50%] flex-shrink-0"
                                onClick={() => navigate(`space/${currentSpace?.id}/resume/portfolios/${portfolio.id}/detail`)}
                              >
                                <CardHeader className="pb-1 pt-2">
                                  <CardTitle className="text-base line-clamp-1">{portfolio.title}</CardTitle>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {format(new Date(portfolio.duration?.startDate), 'yy.MM.dd')} ~ {format(new Date(portfolio.duration?.endDate), 'yy.MM.dd')}
                                  </div>
                                </CardHeader>

                              </Card>
                            ))
                          ) : (
                            <div className="text-gray-400 text-sm flex items-center justify-center h-full">작성한 포트폴리오가 없습니다.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 내 이력서 */}
                    <div className="h-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <h3 className="text-sm font-medium">내 이력서</h3>
                        <Plus className="h-4 w-4 cursor-pointer" onClick={() => navigate(`resume/resumes/new`)} />
                      </div>
                      <div className="overflow-x-auto">
                        <div className="flex gap-4 pb-2 min-w-min">
                          {resumeLoading ? (
                            <div className="text-gray-400 text-sm flex items-center justify-center h-full">로딩 중...</div>
                          ) : resumes.length > 0 ? (
                            resumes.slice(0, 2).map((resume) => (
                              <Card
                                key={resume.id}
                                className="h-[140px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all overflow-hidden w-[50%] flex-shrink-0"
                                onClick={() => navigate(`space/${currentSpace?.id}/resume/resumes/${resume.id}/detail`)}
                              >
                                <CardHeader className="pb-1 pt-2">
                                  <CardTitle className="text-base line-clamp-1">{resume.title}</CardTitle>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {format(new Date(resume.createdAt), 'yy.MM.dd')}
                                  </div>
                                </CardHeader>
                              </Card>
                            ))
                          ) : (
                            <div className="text-gray-400 text-sm flex items-center justify-center h-full">작성한 이력서가 없습니다.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 채용공고 */}
          <div className="md:col-span-1">
            <Card className="py-6 gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">채용 공고</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <h3 className="text-sm font-medium">등록된 공고</h3>
                      <Plus className="h-4 w-4 cursor-pointer" onClick={() => setIsJobModalOpen(true)} />
                    </div>
                    <div className="overflow-x-auto">
                      <div className="flex gap-4 pb-2 min-w-min">
                        {jobDescriptions.length > 0 ? (
                          jobDescriptions.slice(0, 3).map((job) => (
                            <Card
                              key={job.id}
                              className="h-[140px] cursor-pointer hover:shadow-md hover:border-primary/50 transition-all overflow-hidden w-[50%] flex-shrink-0"
                              onClick={() => {
                                setSelectedJob(job);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <CardHeader className="pb-1 pt-2">
                                <CardTitle className="text-base line-clamp-1">{job.company}</CardTitle>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {job.career}
                                </div>
                              </CardHeader>
                            </Card>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm flex items-center justify-center h-full">등록된 채용공고가 없습니다.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 두 번째 행: 지원현황(왼쪽) + 기술면접(오른쪽) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 지원현황 */}
          <div className="md:col-span-2">
            <Card className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">지원 현황</CardTitle>
                    <Plus className="h-4 w-4 cursor-pointer" onClick={() => setIsApplyModalOpen(true)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`space/${currentSpace?.id}/resume/schedule`)}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-blue-500 mb-1" />
                      <p className="text-xs font-medium">지원서</p>
                      <p className="text-base font-bold">{applicationStats.resume}건</p>
                    </CardContent>
                  </Card>
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500 mb-1" />
                      <p className="text-xs font-medium">서류전형</p>
                      <p className="text-base font-bold">{applicationStats.document}건</p>
                    </CardContent>
                  </Card>
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <Code className="h-5 w-5 text-blue-500 mb-1" />
                      <p className="text-xs font-medium">코딩테스트</p>
                      <p className="text-base font-bold">{applicationStats.coding}건</p>
                    </CardContent>
                  </Card>
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500 mb-1" />
                      <p className="text-xs font-medium">면접</p>
                      <p className="text-right text-base font-bold">{applicationStats.interview1 + applicationStats.interview2}건</p>
                    </CardContent>
                  </Card>
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                      <p className="text-xs font-medium">합격</p>
                      <p className="text-base font-bold">{applicationStats.pass}건</p>
                    </CardContent>
                  </Card>
                  <Card className="py-2">
                    <CardContent className="p-2 flex flex-col items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-500 mb-1" />
                      <p className="text-xs font-medium">불합격</p>
                      <p className="text-base font-bold">{applicationStats.fail}건</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 기술면접 */}
          <div className="md:col-span-1">
            <Card className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold">기술 면접</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`space/${currentSpace?.id}/interview/questions`)}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/questions` : '#'} className="block">
                    <Card className="hover:shadow-md transition-all py-2">
                      <CardContent className="p-2 flex flex-col items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-500 mb-1" />
                        <h4 className="text-xs font-medium">문제</h4>
                        <p className="text-base font-bold text-blue-600">{loading ? '...' : stats.totalQuestionCount}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/contests` : '#'} className="block">
                    <Card className="hover:shadow-md transition-all py-2">
                      <CardContent className="p-2 flex flex-col items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500 mb-1" />
                        <h4 className="text-xs font-medium">시험</h4>
                        <p className="text-base font-bold text-blue-600">{loading ? '...' : stats.totalContestCount}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to={currentSpace?.id ? `/space/${currentSpace.id}/interview/notes` : '#'} className="block">
                    <Card className="hover:shadow-md transition-all py-2">
                      <CardContent className="p-2 flex flex-col items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500 mb-1" />
                        <h4 className="text-xs font-medium">노트</h4>
                        <p className="text-base font-bold text-blue-600">{loading ? '...' : stats.totalNoteCount}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* DescriptionCreateModal 모달 */}
      <DescriptionCreateModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        spaceId={currentSpace?.id ? String(currentSpace.id) : ''}
        onCreated={() => {
          setIsJobModalOpen(false);
          fetchJobDescriptions();
        }}
      />
      {/* DescriptionDetailModal 모달 */}
      <DescriptionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        jobDescription={selectedJob}
        onDeleted={fetchJobDescriptions}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsJobModalOpen(true);
        }}
      />
      {/* ApplyCreateModal 모달 */}
      <ApplyCreateModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={() => {
          setIsApplyModalOpen(false);
          fetchJobApplications();
        }}
        spaceId={currentSpace?.id ? String(currentSpace.id) : ''}
      />
    </div>
  );
};

export default MainPage;
