import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Save, Github, FileCode, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  features?: Record<string, string[]>;
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

  // AI 요약 요청 함수
  const handleAISummary = async () => {
    try {
      console.log('=== 현재 저장된 레포지토리 목록 ===');
      console.log('총 레포지토리 수:', selectedRepos.length);
      selectedRepos.forEach((repo, index) => {
        console.log(`\n[${index + 1}] 레포지토리 정보:`);
        console.log('- 이름:', repo.name);
      });
      console.log('========================');

      // AI 요약 API 호출
      const response = await axios.post(
        `${apiUrl}/api/v1/ai/${spaceId}/resume/${user?.id}/create-portfolio`,
        {
          repositories: selectedRepos.map(repo => `${spaceId}_${user?.id}_${repo.name.replace(/\//g, '-')}`)
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const data = response.data;
        
        // 요약 정보 업데이트
        setSummary(data.summary);
        setDescription(data.overview);
        
        // 기술 스택 처리
        let processedTechStack: string[] = [];
        if (Array.isArray(data.tech_stack)) {
          processedTechStack = data.tech_stack;
        } else if (typeof data.tech_stack === 'string') {
          // 문자열인 경우 쉼표로 분리하고 각 항목 정리
          processedTechStack = data.tech_stack
            .split(',')
            .map((tech: string) => tech.trim())
            .filter((tech: string) => tech.length > 0)
            .map((tech: string) => {
              // 첫 글자를 대문자로 변환
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

        toast.success('AI가 포트폴리오 내용을 생성했습니다.');
      }
    } catch (error) {
      console.error('AI 요약 요청 실패:', error);
      toast.error('AI 요약 요청에 실패했습니다.');
    }
  };

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
        setStartDate(portfolio.duration?.startDate ? new Date(portfolio.duration.startDate).toISOString().split('T')[0] : '');
        setEndDate(portfolio.duration?.endDate ? new Date(portfolio.duration.endDate).toISOString().split('T')[0] : '');
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

      const portfolioData = {
        title: title.trim(),
        author: {
          id: user.id,
          nickname: user.nickname
        },
        duration: {
          startDate: startDate ? new Date(startDate).toISOString() : '',
          endDate: endDate ? new Date(endDate).toISOString() : ''
        },
        contents: {
          techStack: techStack.join(', '),
          summary: summary.trim(),
          description: description.trim(),
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
        savedFiles: savedFilesData
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
    // 기존 레포지토리와 새로운 레포지토리 합치기
    const updatedRepos = [...selectedRepos, ...repos];
    setSelectedRepos(updatedRepos);

    // 바이트 크기 합계 계산
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

  // 저장된 파일 처리 함수 추가
  const handleSavedFiles = (response: any) => {
    if (response.success && response.savedFiles) {
      const newFiles = response.savedFiles.map((filePath: string, index: number) => ({
        id: Date.now().toString() + index,
        name: filePath.split('/').pop() || '',
        path: filePath,
        repository: response.repository || '',
        savedPath: response.savedPath || ''
      }));

      setSavedFiles(prev => [...prev, ...newFiles]);
      toast.success('파일 저장 성공', {
        description: `${newFiles.length}개의 파일이 저장되었습니다.`
      });
    } else {
      toast.error('파일 저장 실패', {
        description: '일부 파일 저장에 실패했습니다.'
      });
    }
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
        <div className="col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="포트폴리오 제목을 입력하세요"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">시작일</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">종료일</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="publicAccess"
                    checked={publicAccess}
                    onCheckedChange={setPublicAccess}
                  />
                  <Label htmlFor="publicAccess">공개 설정</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>포트폴리오 개요</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="summary">요약</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="프로젝트에 대한 간략한 요약을 입력하세요"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">예시: 이 프로젝트는 Spring Boot와 JPA를 사용하여 기술 카테고리를 관리하는 웹 애플리케이션입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">개요</Label>
                  <Textarea
                    id="overview"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="프로젝트에 대한 상세 개요를 입력하세요"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">프로젝트의 목적, 주요 문제 해결 방식, 사용된 시스템을 설명하세요.</p>
                </div>

                <div className="space-y-2">
                  <Label>사용한 기술 스택</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => {
                            setTechStack(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="기술 스택 입력 후 Enter"
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
                  <p className="text-xs text-muted-foreground">기술 스택을 입력하고 Enter를 누르거나 추가 버튼을 클릭하세요.</p>
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
                          
                          <div className="p-3 pt-3 grid grid-cols-5 gap-3">
                            <div className="col-span-3 space-y-3">
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
                                    // 줄바꿈을 기준으로 설명을 분리하거나, 쉼표로 구분된 항목을 처리
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
                            
                            <div className="col-span-2 flex flex-col h-full">
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
        <div className="col-span-1">
          <Card className="mb-6">
            <div className="px-3 pt-0">
              <div className="flex items-center text-m font-semibold">
                <Github className="h-4 w-4 mr-1" />
                GitHub 연동하기
              </div>
              
              {!isGitHubConnected ? (
                <div className="flex flex-col items-center space-y-2 py-3 mt-2">
                  <Github className="h-10 w-10 text-gray-400" />
                  <p className="text-center text-xs text-muted-foreground">
                    GitHub 계정을 연동하여 포트폴리오에 저장소를 추가하세요
                  </p>
                  <Button onClick={handleConnectGitHub} className="mt-1 h-7 text-xs">
                    <Github className="h-3 w-3 mr-1" />
                    GitHub 연동하기
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div className="space-y-1">
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
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xs font-medium">프로젝트 지식</h3>
                      <Button
                        onClick={handleOpenRepoDialog}
                        size="sm"
                        className="h-6 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        레포 추가하기
                      </Button>
                    </div>

                    {isSavingFiles && (
                      <div className="border rounded-lg p-2 flex items-center justify-center mb-1">
                        <Loader2 className="h-3 w-3 animate-spin text-blue-500 mr-1" />
                        <p className="text-xs text-gray-600">파일 저장 중...</p>
                      </div>
                    )}

                    {selectedRepos.length > 0 ? (
                      <div className="space-y-1">
                        {selectedRepos.map(repo => (
                          <div
                            key={repo.name}
                            className="flex items-center justify-between py-1.5 px-2 border-b border-gray-100 hover:bg-gray-50 rounded group"
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              {repo.name.includes('/') ? (
                                <Github className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                              ) : (
                                <FileCode className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                              )}
                              <span className="text-xs font-medium truncate">{repo.name}</span>
                              <div className="flex items-center gap-1 ml-1">
                                <span className="text-[10px] text-muted-foreground">{repo.lineCount}줄</span>
                                {repo.byteSize && (
                                  <span className="text-[10px] text-blue-500">({(repo.byteSize/1024).toFixed(1)} KB)</span>
                                )}
                              </div>
                            </div>
                            <button
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 h-5 w-5 flex items-center justify-center flex-shrink-0"
                              onClick={() => {
                                // 레포지토리 제거 기능
                                setSelectedRepos(prev => prev.filter(r => r.name !== repo.name));
                                // 바이트 크기 재계산
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
              )}
            </div>
          </Card>
          <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>저장된 파일</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      // 테스트용 AI 요약 요청
                      axios.post(
                        `${apiUrl}/api/v1/ai/${spaceId}/resume/${user?.id}/create-portfolio`,
                        {
                          repositories: ['58_8_kknaks-chijoontec_back']
                        },
                        {
                          withCredentials: true,
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        }
                      ).then(response => {
                        if (response.data) {
                          const data = response.data;
                          
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

                          toast.success('AI가 포트폴리오 내용을 생성했습니다.');
                        }
                      }).catch(error => {
                        console.error('AI 요약 요청 실패:', error);
                        toast.error('AI 요약 요청에 실패했습니다.');
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                      <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z"/>
                      <path d="M12 6v4"/>
                      <path d="M12 14h.01"/>
                    </svg>
                    테스트
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleAISummary}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                      <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z"/>
                      <path d="M12 6v4"/>
                      <path d="M12 14h.01"/>
                    </svg>
                    AI 요약하기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedFiles.length === 0 ? (
                    <div className="border border-dashed rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        아직 저장된 파일이 없습니다.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-1">
                        {savedFiles.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex items-center justify-between py-1.5 px-2 border-b border-gray-100 hover:bg-gray-50 rounded group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Badge variant="secondary" className="truncate max-w-[70px] px-1.5 py-0 text-xs h-5 flex-shrink-0">{file.repository}</Badge>
                              <span className="text-xs font-medium truncate">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 h-5 w-5 flex items-center justify-center flex-shrink-0"
                              onClick={() => {
                                setSavedFiles(prev => prev.filter(f => f.id !== file.id));
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>
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
    </div >
  );
};

export default Portfolio;