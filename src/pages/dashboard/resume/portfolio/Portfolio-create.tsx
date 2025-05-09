import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Save, Github, FileCode, Plus, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AddRepoDialog from './AddRepo-dailog';

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
  const [techStack, setTechStack] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [publicAccess, setPublicAccess] = useState(false);

  // GitHub 연동 관련 상태
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<GitHubRepo[]>([]);
  const [knowledgePercent, setKnowledgePercent] = useState(11); // 초기 지식 퍼센트

  // GitHub 레포 모달 관련 상태
  const [isRepoDialogOpen, setIsRepoDialogOpen] = useState(false);

  const [features, setFeatures] = useState<Feature[]>([]);
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);

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
        setTechStack(portfolio.contents?.techStack || '');
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
          const percent = Math.min(11 + portfolio.githubRepos.length * 10, 100);
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

      const portfolioData: PortfolioRequest = {
        title,
        author: {
          id: user.id,
          nickname: user.nickname
        },
        duration: {
          startDate: startDate ? new Date(startDate).toISOString() : '',
          endDate: endDate ? new Date(endDate).toISOString() : ''
        },
        contents: {
          techStack,
          summary,
          description,
          features: features.reduce((acc: Record<string, string[]>, feature) => {
            if (feature.title.trim()) {
              acc[feature.title] = feature.descriptions.filter(desc => desc.trim());
            }
            return acc;
          }, {})
        },
        publicAccess,
        githubRepos: isGitHubConnected ? selectedRepos : undefined,
        savedFiles: savedFiles
      };

      const portfolioId = isNewMode ? 'new' : id;

      const response = await axios.post(
        `${apiUrl}/api/v1/resume/${spaceId}/portfolio/${portfolioId}`,
        portfolioData,
        { withCredentials: true }
      );

      toast.success('포트폴리오가 성공적으로 저장되었습니다.');

      // 생성/수정된 포트폴리오 상세 페이지로 이동
      navigate(`/space/${spaceId}/portfolio/${response.data.id}`);
    } catch (err) {
      console.error('포트폴리오 저장에 실패했습니다:', err);
      setError('포트폴리오 저장에 실패했습니다. 다시 시도해주세요.');
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/space/${spaceId}/portfolio`);
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
    setSelectedRepos(repos);

    // 지식 공량 퍼센트 계산 (선택된 레포 수에 따라)
    const percent = Math.min(11 + repos.length * 10, 100);
    setKnowledgePercent(percent);
    toast.success('성공.', {
      description: `${repos.length}개의 레포지토리가 포트폴리오에 추가되었습니다.`,
    });
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
                  <Label htmlFor="techStack">사용한 기술 스택</Label>
                  <Input
                    id="techStack"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="Spring Boot, Spring Data JPA, MySQL, OpenAI API 등"
                  />
                  <p className="text-xs text-muted-foreground">기술 스택은 쉼표(,)로 구분하여 입력해주세요.</p>
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
                    <div className="space-y-4">
                      {features.map((feature, featureIndex) => (
                        <Card key={featureIndex} className="relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => {
                              const newFeatures = [...features];
                              newFeatures.splice(featureIndex, 1);
                              setFeatures(newFeatures);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </Button>
                          <CardContent className="p-4 pt-6 grid grid-cols-5 gap-4">
                            <div className="col-span-3 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`feature-title-${featureIndex}`}>기능</Label>
                                <Input
                                  id={`feature-title-${featureIndex}`}
                                  value={feature.title}
                                  onChange={(e) => {
                                    const newFeatures = [...features];
                                    newFeatures[featureIndex].title = e.target.value;
                                    setFeatures(newFeatures);
                                  }}
                                  placeholder="기술 관리, 카테고리 관리 등"
                                />
                              </div>

                              <div className="space-y-3">
                                <Label>세부 기능</Label>
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
                                  rows={3}
                                />
                              </div>
                            </div>
                            
                            <div className="">
                            <Label><p className="text-sm font-medium">기능 이미지</p></Label>
                            <div className="col-span-2 border rounded-md p-3 flex flex-col items-center justify-center">

                              <div className="text-center mb-2">
                                
                                <p className="text-xs text-muted-foreground">기능을 설명하는 이미지</p>
                              </div>
                              <Button type="button" className="w-full mt-2" variant="outline" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="m12 18 4-4-4-4" /><path d="M16 14h-4" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                                이미지 업로드
                              </Button>
                            </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">기능 범주와 세부 기능을 입력하면 AI가 자동으로 구조화합니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architecture">아키텍처</Label>
                  <Textarea
                    id="architecture"
                    placeholder="프로젝트의 아키텍처에 대한 설명을 입력하세요. 시스템 구성 요소, 통신 방식, 배포 방법 등을 포함할 수 있습니다."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">시스템 구조, 주요 컴포넌트, 통신 방식 등을 설명하세요. AI가 자동으로 구조화합니다.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>저장된 파일</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {savedFiles.length === 0 ? (
                    <div className="border border-dashed rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        아직 저장된 파일이 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedFiles.map((file) => (
                        <Card key={file.id} className="relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => {
                              setSavedFiles(prev => prev.filter(f => f.id !== file.id));
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </Button>
                          <CardContent className="p-4 pt-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{file.repository}</Badge>
                                <span className="text-sm font-medium">{file.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {file.path}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="h-5 w-5 mr-2" />
                GitHub 연동하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isGitHubConnected ? (
                <div className="flex flex-col items-center space-y-4 py-6">
                  <Github className="h-16 w-16 text-gray-400" />
                  <p className="text-center text-sm text-muted-foreground">
                    GitHub 계정을 연동하여 포트폴리오에 저장소를 추가하세요
                  </p>
                  <Button onClick={handleConnectGitHub} className="mt-2">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub 연동하기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">지식 공량의 {knowledgePercent}% 사용됨</h3>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                      </span>
                    </div>
                    <Progress value={knowledgePercent} className="h-2" />
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">프로젝트 지식</h3>
                      <Button
                        onClick={handleOpenRepoDialog}
                        size="sm"
                        className="h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        레포 추가하기
                      </Button>
                    </div>

                    {selectedRepos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1">
                        {selectedRepos.map(repo => (
                          <div
                            key={repo.name}
                            className="border rounded-lg p-2 transition-all overflow-hidden relative group"
                          >
                            <div className="flex justify-between items-start">
                              <div className="overflow-hidden">
                                <h4 className="text-xs font-medium flex items-center text-nowrap overflow-hidden text-ellipsis">
                                  {repo.name.includes('/') ? (
                                    <Github className="h-3 w-3 mr-1 flex-shrink-0" />
                                  ) : (
                                    <FileCode className="h-3 w-3 mr-1 flex-shrink-0" />
                                  )}
                                  <span className="truncate">{repo.name}</span>
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {repo.lineCount}줄
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`${getLanguageBadgeColor(repo.language)} text-white text-xs px-1.5 py-0.5 ml-1`}
                              >
                                {repo.language?.toUpperCase() || '기타'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground text-center mb-2">
                          아직 추가된 레포지토리가 없습니다
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
          />
        )
      }
    </div >
  );
};

export default Portfolio;