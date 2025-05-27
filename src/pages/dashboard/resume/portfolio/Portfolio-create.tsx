import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Save, FileCode, Plus, AlertCircle, Loader2, CalendarIcon, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import AddRepoDialog from './AddRepo-dailog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  roles?: string[];
  features?: Record<string, string[]>;
  architecture?: {
    communication: string;
    deployment: string;
  };
}

interface GitHubRepo {
  name: string;
  url: string;
  description?: string;
  language?: string;
  lineCount?: number;
  byteSize?: number;
  selectedDirectories?: string[];
}

interface SavedFile {
  id: string;
  name: string;
  path: string;
  repository: string;
  savedPath: string;
}

interface PortfolioRequest {
  title: string;
  author: Author;
  duration: Duration;
  contents: Contents;
  thumbnailUrl?: string;
  publicAccess: boolean;
  features?: Record<string, string[]>;
  githubRepos?: GitHubRepo[];
  savedFiles?: SavedFile[];
  githubLink: string;
  deployLink: string;
  memberCount: number;
  memberRoles: string;
}

interface PortfolioCreate {
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
  githubRepos?: GitHubRepo[];
}

interface Feature {
  title: string;
  descriptions: string[];
  imageUrl?: string;
}

// 단일 레포지토리의 커밋 파일 정보
interface CommitFileInfo {
  repository: string;      // 레포지토리 이름
  commitFiles: string[];   // 커밋된 파일 경로 배열
}

// 전체 응답 데이터 구조
interface CommitSummaryResponse {
  commitFiles: CommitFileInfo[];  // 레포지토리별 커밋 파일 정보 배열
}

// AI 생성 상태 관리를 위한 인터페이스
interface AIGenerationStatus {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  currentStep: 'commit_collection' | 'portfolio_generation' | 'role_generation' | 'completed';
  message: string;
}

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId, id, action } = useParams<{ spaceId: string; id: string; action: string }>();
  const isEditMode = action === 'edit';
  const isNewMode = id === 'new';

  const [user, setUser] = useState<{ id: number; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [publicAccess, setPublicAccess] = useState(false);
  const [architecture, setArchitecture] = useState('');
  const [deployment, setDeployment] = useState('');

  // Popover 상태 관리 추가
  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);

  // GitHub 연동 관련 상태
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<GitHubRepo[]>([]);
  const [knowledgePercent, setKnowledgePercent] = useState(0);
  const [totalByteSize, setTotalByteSize] = useState(0);
  const MAX_BYTE_SIZE = 10000000; // 최대 바이트 크기

  // GitHub 레포 모달 관련 상태
  const [isRepoDialogOpen, setIsRepoDialogOpen] = useState(false);
  const [isSavingFiles, setIsSavingFiles] = useState(false);

  const [features, setFeatures] = useState<Feature[]>([]);
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);

  // AI 요약 관련 상태
  const [isAISummarizing, setIsAISummarizing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [progress, setProgress] = useState<{
    total: number;
    completed: number;
    success: number;
    failed: number;
    skipped: number;
    in_progress: number;
  } | null>(null);

  // 파일 다운로드 상태 추가
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadPollingInterval, setDownloadPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // AI 생성 상태 추가
  const [aiStatus, setAiStatus] = useState<AIGenerationStatus>({
    status: 'idle',
    currentStep: 'commit_collection',
    message: ''
  });

  // 커밋 정보 포함 체크박스 상태 추가
  const [includeCommitInfo, setIncludeCommitInfo] = useState(true);

  // 주요 역할 상태 추가
  const [roles, setRoles] = useState<string[]>([]);

  // 상태 추가
  const [memberCount, setMemberCount] = useState<number>(0);
  const [memberRole, setMemberRole] = useState<string>('');

  // 상태 추가
  const [githubLink, setGithubLink] = useState<string>('');
  const [deployLink, setDeployLink] = useState<string>('');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  };

  // AI 요약 요청 함수
  const handleAISummary = async () => {
    try {
      // 기존 폴링이 있다면 중지
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }

      console.log('=== 현재 저장된 레포지토리 목록 ===');
      console.log('총 레포지토리 수:', selectedRepos.length);
      selectedRepos.forEach((repo, index) => {
        console.log(`\n[${index + 1}] 레포지토리 정보:`);
        console.log('- 이름:', repo.name);
      });
      console.log('========================');

      setIsAISummarizing(true);
      setElapsedTime(0);
      setProgress(null);

      // 1단계: Commit 정보 수집
      setAiStatus({
        status: 'processing',
        currentStep: 'commit_collection',
        message: 'Commit 정보 수집중입니다.'
      });

      let commitFiles: CommitFileInfo[] = [];
      if (includeCommitInfo) {
        // Commit 정보 수집 요청
        const commitResponse = await axios.post<CommitSummaryResponse>(
          `${apiUrl}/api/v1/resume/${spaceId}/github/users/${user?.id}/repositories/commit/summary`,
          {
            repoNames: selectedRepos.map(repo => repo.name)
          },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        commitFiles = commitResponse.data.commitFiles;
      }

      // 2단계: AI 포트폴리오 생성 시작
      setAiStatus({
        status: 'processing',
        currentStep: 'portfolio_generation',
        message: 'AI 포트폴리오 생성 중입니다.'
      });

      // AI 요약 API 호출
      const response = await axios.post(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/${user?.id}/create-portfolio`,
        {
          repositories: selectedRepos.map(repo => `${spaceId}_${user?.id}_${repo.name.replace(/\//g, '-')}`),
          commitFiles: commitFiles
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // 폴링 시작
        const interval = setInterval(async () => {
          try {
            const statusResponse = await axios.get(
              `${apiUrl}/api/v1/ai/${spaceId}/resume/${user?.id}/portfolio-status`,
              { withCredentials: true }
            );

            console.log('Status response:', statusResponse.data);

            if (statusResponse.data.status === 'completed') {
              // 폴링 중지
              clearInterval(interval);
              setPollingInterval(null);
              setIsAISummarizing(false);
              setElapsedTime(0);
              setProgress(null);
              setAiStatus({
                status: 'completed',
                currentStep: 'completed',
                message: '포트폴리오 생성이 완료되었습니다.'
              });

              // 결과 데이터 처리
              const data = statusResponse.data.result.portfolio;
              const rolesData = statusResponse.data.result.roles;

              // 요약 정보 업데이트
              setSummary(data.summary);
              setDescription(data.overview);

              // 기술 스택 처리
              let processedTechStack: string[] = [];
              if (Array.isArray(data.tech_stack)) {
                processedTechStack = data.tech_stack;
              } else if (typeof data.tech_stack === 'string') {
                processedTechStack = data.tech_stack
                  .split(',')
                  .map((tech: string) => tech.trim())
                  .filter((tech: string) => tech.length > 0)
                  .map((tech: string) => {
                    return tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase();
                  });
              }
              setTechStack(processedTechStack);

              // 기능 정보 업데이트
              const newFeatures = Object.entries(data.features).map(([title, descriptions]) => ({
                title,
                descriptions: descriptions as string[],
                imageUrl: undefined
              }));
              setFeatures(newFeatures);

              // 아키텍처와 배포 정보 업데이트
              setArchitecture(data.architecture.communication);
              setDeployment(data.architecture.deployment);

              // 주요 역할 정보 업데이트
              if (rolesData && rolesData.roles) {
                setRoles(rolesData.roles);
              }

              toast.success('AI가 포트폴리오 내용을 생성했습니다.');
            } else if (statusResponse.data.status === 'failed') {
              // 폴링 중지
              clearInterval(interval);
              setPollingInterval(null);
              setIsAISummarizing(false);
              setElapsedTime(0);
              setProgress(null);
              setAiStatus({
                status: 'failed',
                currentStep: 'completed',
                message: '포트폴리오 생성에 실패했습니다.'
              });
              toast.error('AI 요약 생성에 실패했습니다.');
            } else if (statusResponse.data.status === 'processing') {
              // 처리 중일 때 경과 시간과 진행 상태 업데이트
              setElapsedTime(Math.floor(statusResponse.data.elapsed_time));
              setProgress(statusResponse.data.progress);

              // 현재 단계에 따른 메시지 업데이트
              if (statusResponse.data.current_step === 'portfolio_generation') {
                setAiStatus({
                  status: 'processing',
                  currentStep: 'portfolio_generation',
                  message: 'AI 포트폴리오 생성 중입니다.'
                });
              } else if (statusResponse.data.current_step === 'role_generation') {
                setAiStatus({
                  status: 'processing',
                  currentStep: 'role_generation',
                  message: '주요 역할을 정리 중입니다.'
                });
              }
            }
          } catch (error) {
            console.error('상태 확인 실패:', error);
            // 폴링 중지
            clearInterval(interval);
            setPollingInterval(null);
            setIsAISummarizing(false);
            setElapsedTime(0);
            setProgress(null);
            setAiStatus({
              status: 'failed',
              currentStep: 'completed',
              message: '상태 확인에 실패했습니다.'
            });
            toast.error('상태 확인에 실패했습니다.');
          }
        }, 2000);

        setPollingInterval(interval);
      }
    } catch (error) {
      console.error('AI 요약 요청 실패:', error);
      // 기존 폴링이 있다면 중지
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setIsAISummarizing(false);
      setElapsedTime(0);
      setProgress(null);
      setAiStatus({
        status: 'failed',
        currentStep: 'completed',
        message: 'AI 생성 프로세스에 실패했습니다.'
      });
      toast.error('AI 요약 요청에 실패했습니다.');
    }
  };
  // 저장된 파일 처리 함수 수정
  const handleSavedFiles = (response: any) => {
    if (response.taskId) {
      let interval: NodeJS.Timeout | null = null;

      const pollTaskStatus = async () => {
        try {
          const statusResponse = await axios.get(
            `${apiUrl}/api/v1/resume/${spaceId}/github/tasks/${response.taskId}`,
            { withCredentials: true }
          );
          const status = statusResponse.data;
          console.log('파일 저장 상태=======================:', status);

          if (status.completed || status.error) {
            console.log('폴링 중지 조건 충족:=========', { completed: status.completed, error: status.error });
            if (interval) clearInterval(interval);
            setIsDownloading(false);
            setIsSavingFiles(false);

            if (status.error) {
              toast.error(`파일 저장 중 오류가 발생했습니다: ${status.error}`);
            } else {
              const newFiles = status.savedFiles.map((filePath: string, index: number) => ({
                id: Date.now().toString() + index,
                name: filePath.split('/').pop() || '',
                path: filePath,
                repository: response.repository || '',
                savedPath: status.savedPath || ''
              }));
              setSavedFiles(prev => [...prev, ...newFiles]);
              toast.success('파일 저장 성공', {
                description: `${newFiles.length}개의 파일이 저장되었습니다.`
              });
            }
          }
        } catch (err) {
          if (interval) clearInterval(interval);
          setIsDownloading(false);
          setIsSavingFiles(false);
          toast.error('작업 상태를 확인하는 중 오류가 발생했습니다.');
        }
      };

      interval = setInterval(pollTaskStatus, 2000);
      setIsDownloading(true);
      setIsSavingFiles(true);
      pollTaskStatus();
    }
  };

  // 컴포넌트 언마운트 시 폴링 중지
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    };
  }, [pollingInterval]);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 실제 애플리케이션에서는 현재 인증된 사용자 정보를 가져오는 API를 호출
        const response = await axios.get(`${apiUrl}/api/v1/members/me`, {
          withCredentials: true
        });
        setUser(response.data);

        // 사용자의 GitHub 연동 상태 확인
        checkGitHubConnection(response.data.id);
      } catch (err) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', err);
        setError('사용자 정보가 없습니다. 다시 로그인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // GitHub 연동 상태 확인
  const checkGitHubConnection = async (userId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}`, {
        withCredentials: true
      });

      if (response.data) {
        setIsGitHubConnected(true);
      }
    } catch (err) {
      console.log('GitHub 연동 정보가 없습니다.');
      setIsGitHubConnected(false);
    }
  };

  // 기존 포트폴리오 정보 가져오기 (수정 모드일 때)
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (isNewMode || !isEditMode) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio/${id}`,
          { withCredentials: true }
        );

        const portfolio: PortfolioCreate = response.data;

        // 폼 상태 초기화
        setTitle(portfolio.title || '');
        // 기술 스택 처리
        if (portfolio.contents?.techStack) {
          const techStackArray = portfolio.contents.techStack
            .split(',')
            .map((tech: string) => tech.trim())
            .filter((tech: string) => tech.length > 0)
            .map((tech: string) => {
              return tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase();
            });
          setTechStack(techStackArray);
        } else {
          setTechStack([]);
        }
        setSummary(portfolio.contents?.summary || '');
        setDescription(portfolio.contents?.description || '');
        setStartDate(portfolio.duration?.startDate ? formatDate(new Date(portfolio.duration.startDate)) : '');
        setEndDate(portfolio.duration?.endDate ? formatDate(new Date(portfolio.duration.endDate)) : '');
        setPublicAccess(portfolio.publicAccess || false);

        // GitHub 저장소 정보가 있으면 설정
        if (portfolio.githubRepos && portfolio.githubRepos.length > 0) {
          setSelectedRepos(portfolio.githubRepos);
          setIsGitHubConnected(true);

          // 지식 공량 퍼센트 계산
          const totalBytes = portfolio.githubRepos.reduce((sum, repo) => sum + (repo.byteSize || 0), 0);
          setTotalByteSize(totalBytes);

          // 지식 공량 퍼센트 계산
          const percent = Math.min(Math.floor((totalBytes / MAX_BYTE_SIZE) * 100), 100);
          setKnowledgePercent(percent);
        }

        setError(null);
      } catch (err) {
        console.error('포트폴리오 정보를 불러오는데 실패했습니다:', err);
        setError('포트폴리오 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [spaceId, id, isEditMode, isNewMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('사용자 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);

      // GitHub 레포지토리 데이터 준비
      const githubReposData = selectedRepos.length > 0 ? selectedRepos.map(repo => ({
        name: repo.name,
        url: repo.url,
        description: repo.description || '',
        language: repo.language || '',
        lineCount: repo.lineCount || 0,
        selectedDirectories: repo.selectedDirectories || []
      })) : [];

      // 저장된 파일 데이터 준비
      const savedFilesData = savedFiles.length > 0 ? savedFiles.map(file => ({
        id: file.id,
        name: file.name,
        path: file.path,
        repository: file.repository,
        savedPath: file.savedPath
      })) : [];

      const portfolioData: PortfolioRequest = {
        title: title.trim(),
        author: {
          id: user.id,
          nickname: user.nickname
        },
        duration: {
          startDate: startDate ? formatDate(new Date(startDate)) : '',
          endDate: endDate ? formatDate(new Date(endDate)) : ''
        },
        contents: {
          techStack: techStack.join(', '),
          summary: summary.trim(),
          description: description.trim(),
          roles: roles,
          features: features.reduce((acc: Record<string, string[]>, feature) => {
            if (feature.title.trim()) {
              acc[feature.title] = feature.descriptions
                .map(desc => desc.trim())
                .filter(desc => desc.length > 0);
            }
            return acc;
          }, {}),
          architecture: {
            communication: architecture.trim(),
            deployment: deployment.trim()
          }
        },
        publicAccess,
        githubRepos: githubReposData,
        savedFiles: savedFilesData,
        githubLink: githubLink ? githubLink.trim() : '',
        deployLink: deployLink ? deployLink.trim() : '',
        memberCount: memberCount,
        memberRoles: memberRole
      };

      console.log('전송할 데이터:', JSON.stringify(portfolioData, null, 2));

      const response = await axios.post(
        `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
        portfolioData,
        { withCredentials: true }
      );

      toast.success('포트폴리오가 성공적으로 저장되었습니다.');

      // 생성/수정된 포트폴리오 상세 페이지로 이동
      navigate(`/space/${spaceId}/resume/portfolios/${response.data.id}`);
    } catch (err) {
      console.error('포트폴리오 저장에 실패했습니다:', err);
      setError('포트폴리오 저장에 실패했습니다. 다시 시도해주세요.');
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/space/${spaceId}/resume/portfolios`);
  };

  const handleConnectGitHub = () => {
    // GitHub OAuth 인증을 위한 URL
    const redirectUrl = encodeURIComponent(`${window.location.origin}/github/callback?spaceId=${spaceId}`);
    const githubAuthUrl = `${apiUrl}/api/v1/auth/oauth2/authorization/github?redirect_uri=${redirectUrl}`;

    // 새 창이나 현재 창에서 GitHub 인증 페이지로 이동
    window.location.href = githubAuthUrl;
  };

  // GitHub 레포지토리 모달 핸들러
  const handleOpenRepoDialog = () => {
    if (!user) {
      toast.error('오류', {
        description: '사용자 정보가 없습니다. 다시 로그인해주세요.'
      });
      return;
    }

    setIsRepoDialogOpen(true);
  };

  const handleSaveRepos = (repos: GitHubRepo[]) => {
    setSelectedRepos(prevRepos => {
      const repoMap = new Map<string, GitHubRepo>();

      // 기존 레포 먼저 넣기
      prevRepos.forEach(repo => {
        repoMap.set(repo.name, { ...repo });
      });

      // 새로 추가된 레포 처리
      repos.forEach(newRepo => {
        if (repoMap.has(newRepo.name)) {
          // 이미 있으면 selectedDirectories, byteSize 등 합치기
          const oldRepo = repoMap.get(newRepo.name)!;
          repoMap.set(newRepo.name, {
            ...oldRepo,
            selectedDirectories: Array.from(new Set([...(oldRepo.selectedDirectories || []), ...(newRepo.selectedDirectories || [])])),
            byteSize: (oldRepo.byteSize || 0) + (newRepo.byteSize || 0),
          });
        } else {
          repoMap.set(newRepo.name, newRepo);
        }
      });

      return Array.from(repoMap.values());
    });

    // 바이트 크기 합계 계산
    const updatedRepos = [...selectedRepos, ...repos];
    const newTotalBytes = updatedRepos.reduce((sum, repo) => sum + (repo.byteSize || 0), 0);
    setTotalByteSize(newTotalBytes);

    // 지식 공량 퍼센트 계산
    const percent = Math.min(Math.floor((newTotalBytes / MAX_BYTE_SIZE) * 100), 100);
    setKnowledgePercent(percent);

    toast.success('성공.', {
      description: `${repos.length}개의 레포지토리가 포트폴리오에 추가되었습니다.`,
    });
  };

  // 바이트 크기 업데이트 핸들러 
  const handleUpdateTotalByteSize = (newByteSize: number) => {
    setTotalByteSize(prevSize => prevSize + newByteSize);

    // 지식 공량 퍼센트 재계산
    const newTotal = totalByteSize + newByteSize;
    const percent = Math.min(Math.floor((newTotal / MAX_BYTE_SIZE) * 100), 100);
    setKnowledgePercent(percent);
  };


  const getLanguageBadgeColor = (language?: string) => {
    const languageMap: Record<string, string> = {
      'javascript': 'bg-yellow-500',
      'typescript': 'bg-blue-500',
      'java': 'bg-orange-600',
      'python': 'bg-green-600',
      'yml': 'bg-purple-500',
      'yaml': 'bg-purple-500',
    };

    return languageMap[language?.toLowerCase() || ''] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로딩 중...</p>
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
        <h2 className="text-2xl font-bold">
          {isNewMode ? '새 포트폴리오 작성' : '포트폴리오 수정'}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-3">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>기본 정보</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="publicAccess"
                    checked={publicAccess}
                    onCheckedChange={setPublicAccess}
                  />
                  <Label htmlFor="publicAccess">공개 설정</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="w-full md:w-1/2 md:pr-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="title" className="w-20 text-xs">제목</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="포트폴리오 제목을 입력하세요"
                          required
                          className="flex-1"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="memberCount" className="w-20 text-xs">참여인원</Label>
                        <Select
                          value={memberCount ? String(memberCount) : ''}
                          onValueChange={value => setMemberCount(Number(value))}
                        >
                          <SelectTrigger className="h-8 text-xs flex-1" id="memberCount">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">개인</SelectItem>
                            <SelectItem value="2">2명</SelectItem>
                            <SelectItem value="3">3명</SelectItem>
                            <SelectItem value="4">4명</SelectItem>
                            <SelectItem value="5">5명</SelectItem>
                            <SelectItem value="6">6명 이상</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="memberRole" className="w-20 text-xs">역할</Label>
                        <Select
                          value={memberRole}
                          onValueChange={value => setMemberRole(value)}
                        >
                          <SelectTrigger className="h-8 text-xs flex-1" id="memberRole">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PO">PO</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                            <SelectItem value="Fullstack">Fullstack</SelectItem>
                            <SelectItem value="Backend">Backend</SelectItem>
                            <SelectItem value="Frontend">Frontend</SelectItem>
                            <SelectItem value="Publisher">Publisher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 md:pl-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label className="w-20 text-xs">기간</Label>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Popover open={openStartDatePopover} onOpenChange={setOpenStartDatePopover}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-8 text-xs w-full justify-start text-left font-normal"
                              >
                                {startDate ? (
                                  format(new Date(startDate), 'yyyy.MM.dd', { locale: ko })
                                ) : (
                                  <span>시작일</span>
                                )}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={startDate ? new Date(startDate) : undefined}
                                onSelect={(date) => {
                                  setStartDate(date ? formatDate(date) : '');
                                  setOpenStartDatePopover(false);
                                }}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                          <Popover open={openEndDatePopover} onOpenChange={setOpenEndDatePopover}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-8 text-xs w-full justify-start text-left font-normal"
                              >
                                {endDate ? (
                                  format(new Date(endDate), 'yyyy.MM.dd', { locale: ko })
                                ) : (
                                  <span>종료일</span>
                                )}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={endDate ? new Date(endDate) : undefined}
                                onSelect={(date) => {
                                  setEndDate(date ? formatDate(date) : '');
                                  setOpenEndDatePopover(false);
                                }}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-20 flex items-center gap-2">
                          <FaGithub className="w-4 h-4" />
                          <span className="text-xs">GitHub</span>
                        </div>
                        <Input
                          className="h-9 text-xs flex-1"
                          placeholder="링크 입력"
                          value={githubLink}
                          onChange={e => setGithubLink(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-20 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-xs">Deploy</span>
                        </div>
                        <Input
                          className="h-9 text-xs flex-1"
                          placeholder="링크 입력"
                          value={deployLink}
                          onChange={e => setDeployLink(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center">
                  <FaGithub className="w-4 h-4 mr-2" />
                  <CardTitle>GitHub 연동하기</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 왼쪽 컨테이너 */}
                  <div className="w-full md:w-1/3">
                    {!isGitHubConnected ? (
                      <div className="flex flex-col items-center space-y-2 py-3">
                        <FaGithub className="h-10 w-10 text-gray-400" />
                        <p className="text-center text-xs text-muted-foreground">
                          GitHub 계정을 연동하여 포트폴리오에 저장소를 추가하세요
                        </p>
                        <Button onClick={handleConnectGitHub} className="mt-1 h-7 text-xs">
                          <FaGithub className="h-3 w-3 mr-1" />
                          GitHub 연동하기
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center justify-center">
                            <FaGithub className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <p className="text-sm text-muted-foreground">
                              레포를 불러오세요
                            </p>
                            <Button
                              type="button"
                              onClick={handleOpenRepoDialog}
                              size="sm"
                              className="h-5 text-xs"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              레포지토리 추가
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium">지식 공간의 {knowledgePercent}% 사용됨 ({(totalByteSize / 1024).toFixed(1)}KB)</h3>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                          </span>
                        </div>
                        <Progress
                          value={knowledgePercent}
                          className={`h-1.5 ${knowledgePercent > 90 ? "[&>div]:bg-red-500" : knowledgePercent > 80 ? "[&>div]:bg-amber-500" : ""}`}
                        />
                        <div className="flex justify-end">
                          <div className="flex items-center space-x-2 ml-2">
                            <Switch
                              id="includeCommitInfo"
                              checked={includeCommitInfo}
                              onCheckedChange={setIncludeCommitInfo}
                              className="h-3 w-6"
                            />
                            <Label htmlFor="includeCommitInfo" className="text-xs">커밋 정보 포함</Label>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleAISummary}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
                              <path d="M12 6v4" />
                              <path d="M12 14h.01" />
                            </svg>
                            AI 요약
                          </Button>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* 오른쪽 컨테이너 */}
                  <div className="w-full md:w-2/3 md:border-l md:pl-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium mb-2">프로젝트 지식</h3>
                      {selectedRepos.length > 0 ? (
                        <div className="space-y-1">
                          {selectedRepos.map(repo => (
                            <div
                              key={repo.name}
                              className="flex items-center justify-between py-1.5 px-2 border-b border-gray-100 hover:bg-gray-50 rounded group"
                            >
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                {isDownloading ? (
                                  <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-blue-500" />
                                ) : (
                                  <FaGithub className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                                )}
                                <span className="text-xs font-medium truncate">{repo.name}</span>
                                <div className="flex items-center gap-1 ml-1">
                                  <span className="text-[10px] text-muted-foreground">{repo.lineCount}줄</span>
                                  {repo.byteSize && (
                                    <span className="text-[10px] text-blue-500">({(repo.byteSize / 1024).toFixed(1)} KB)</span>
                                  )}
                                </div>
                              </div>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 h-5 w-5 flex items-center justify-center flex-shrink-0"
                                onClick={() => {
                                  setSelectedRepos(prev => prev.filter(r => r.name !== repo.name));
                                  const newTotalBytes = selectedRepos
                                    .filter(r => r.name !== repo.name)
                                    .reduce((sum, r) => sum + (r.byteSize || 0), 0);
                                  setTotalByteSize(newTotalBytes);
                                  setKnowledgePercent(Math.min(Math.floor((newTotalBytes / MAX_BYTE_SIZE) * 100), 100));
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 border border-dashed rounded-lg">
                          <p className="text-xs text-muted-foreground text-center">
                            아직 추가된 레포지토리가 없습니다
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>포트폴리오 개요</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">요약</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="프로젝트에 대한 간략한 요약을 입력하세요"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">프로젝트의 핵심 내용을 간단히 설명하세요.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">개요</Label>
                  <Textarea
                    id="overview"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="프로젝트에 대한 상세 개요를 입력하세요"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">프로젝트의 목적, 주요 문제 해결 방식, 사용된 시스템을 설명하세요.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roles">주요역할 및 성과</Label>
                  <Textarea
                    id="roles"
                    value={roles.join('\n')}
                    onChange={(e) => setRoles(e.target.value.split('\n'))}
                    placeholder="프로젝트에 대한 주요역할과 성과를 입력하세요"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">AI가 분석한 주요 역할과 성과가 표시됩니다.</p>
                </div>

                <div className="space-y-2">
                  <Label>사용한 기술 스택</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-0.5 text-xs"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => {
                            setTechStack(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="기술 스택 입력"
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTech.trim()) {
                          e.preventDefault();
                          if (!techStack.includes(newTech.trim())) {
                            setTechStack(prev => [...prev, newTech.trim()]);
                          }
                          setNewTech('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (newTech.trim() && !techStack.includes(newTech.trim())) {
                          setTechStack(prev => [...prev, newTech.trim()]);
                          setNewTech('');
                        }
                      }}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>포트폴리오 상세</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>주요 기능</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFeatures([...features, { title: '', descriptions: [''] }]);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      기능 추가하기
                    </Button>
                  </div>

                  {features.length === 0 ? (
                    <div className="border border-dashed rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        아직 추가된 기능이 없습니다.
                      </p>
                      {/* <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFeatures([...features, { title: '', descriptions: [''] }]);
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        첫 기능 추가하기
                      </Button> */}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="bg-white border rounded-md shadow-sm hover:shadow transition-all group relative"
                        >
                          <button
                            type="button"
                            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFeatures = [...features];
                              newFeatures.splice(featureIndex, 1);
                              setFeatures(newFeatures);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>

                          <div className="p-3 pt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="col-span-1 md:col-span-3 space-y-3">
                              <div>
                                <Label htmlFor={`feature-title-${featureIndex}`} className="text-xs font-medium mb-1 block">기능</Label>
                                <Input
                                  id={`feature-title-${featureIndex}`}
                                  value={feature.title}
                                  onChange={(e) => {
                                    const newFeatures = [...features];
                                    newFeatures[featureIndex].title = e.target.value;
                                    setFeatures(newFeatures);
                                  }}
                                  placeholder="기술 관리, 카테고리 관리 등"
                                  className="h-7 text-xs"
                                />
                              </div>

                              <div>
                                <Label className="text-xs font-medium mb-1 block">세부 기능</Label>
                                <Textarea
                                  id={`feature-descriptions-${featureIndex}`}
                                  value={feature.descriptions.join('\n')}
                                  onChange={(e) => {
                                    const newFeatures = [...features];
                                    const descriptions = e.target.value
                                      .split(/\n|,/)
                                      .map(desc => desc.trim())
                                      .filter(desc => desc.length > 0);

                                    newFeatures[featureIndex].descriptions = descriptions;
                                    setFeatures(newFeatures);
                                  }}
                                  placeholder="세부 기능을 입력하세요 (줄바꿈이나 쉼표로 구분)"
                                  className="min-h-[60px] text-xs"
                                  rows={2}
                                />
                              </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                              <Label className="text-xs font-medium mb-1 block">이미지</Label>
                              <div className="border rounded-md p-2 flex flex-col items-center justify-center flex-1 bg-gray-50">
                                <div className="text-center mb-1">
                                  <p className="text-[10px] text-muted-foreground">기능을 설명하는 이미지</p>
                                </div>
                                <Button type="button" className="w-full mt-1 h-6 text-xs" variant="outline" size="sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="m12 18 4-4-4-4" /><path d="M16 14h-4" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                                  이미지 업로드
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">기능 범주와 세부 기능을 입력하면 AI가 자동으로 구조화합니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architecture">아키텍처</Label>
                  <Textarea
                    id="architecture"
                    value={architecture}
                    onChange={(e) => setArchitecture(e.target.value)}
                    placeholder="프로젝트의 아키텍처에 대한 설명을 입력하세요. 시스템 구성 요소, 통신 방식, 배포 방법 등을 포함할 수 있습니다."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">시스템 구조, 주요 컴포넌트, 통신 방식 등을 설명하세요. AI가 자동으로 구조화합니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deployment">배포</Label>
                  <Textarea
                    id="deployment"
                    value={deployment}
                    onChange={(e) => setDeployment(e.target.value)}
                    placeholder="프로젝트의 배포 방법과 환경에 대한 설명을 입력하세요."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">배포 환경, 방법, 프로세스 등을 설명하세요.</p>
                </div>
              </CardContent>
            </Card>



            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                취소
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? '저장 중...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 레포지토리 추가 다이얼로그 컴포넌트 */}
      {
        user && (
          <AddRepoDialog
            open={isRepoDialogOpen}
            onOpenChange={setIsRepoDialogOpen}
            selectedRepos={selectedRepos}
            onSave={handleSaveRepos}
            onFilesSaved={handleSavedFiles}
            userId={user.id}
            spaceId={spaceId || ''}
            onSavingChange={setIsSavingFiles}
            currentTotalByteSize={totalByteSize}
            maxByteSize={MAX_BYTE_SIZE}
          />
        )
      }

      {/* AI 요약 로딩 모달 */}
      {isAISummarizing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <h3 className="text-lg font-semibold">{aiStatus.message}</h3>
              {progress && (
                <div className="w-full space-y-2">
                  <Progress value={(progress.completed / progress.total) * 100} className="h-1.5" />
                  <p className="text-xs text-gray-500 text-center">
                    진행률: {Math.round((progress.completed / progress.total) * 100)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-400">
                경과 시간: {Math.floor(elapsedTime / 60)}분 {elapsedTime % 60}초
              </p>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Portfolio;