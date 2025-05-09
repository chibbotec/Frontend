import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { AlertCircle, Loader2, RefreshCw, Folder } from 'lucide-react';
import GitHubDirectorySelector from './GitHubDirectorySelector';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface GitHubRepo {
  name: string;
  url: string;
  description?: string;
  language?: string;
  lineCount?: number;
  selectedDirectories?: string[];
}

interface AddRepoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRepos: GitHubRepo[];
  onSave: (repos: GitHubRepo[]) => void;
  onFilesSaved: (response: any) => void;
  userId: number;
  spaceId: string;
}

const AddRepoDialog: React.FC<AddRepoDialogProps> = ({
  open,
  onOpenChange,
  selectedRepos,
  onSave,
  onFilesSaved,
  userId,
  spaceId,
}) => {
  const [tempSelectedRepos, setTempSelectedRepos] = useState<GitHubRepo[]>(selectedRepos);
  const [availableRepos, setAvailableRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRepo, setCurrentRepo] = useState<GitHubRepo | null>(null);
  const [syncingDb, setSyncingDb] = useState(false); // DB 동기화 상태
  const [saving, setSaving] = useState(false); // 파일 저장 상태

  // 다이얼로그가 열릴 때 GitHub 저장소 목록 가져오기
  useEffect(() => {
    if (open) {
      fetchGitHubRepositories();
      setTempSelectedRepos(selectedRepos);
      setCurrentRepo(null);
    }
  }, [open, userId]);

  // GitHub 저장소 목록 가져오기 (DB에서만)
  const fetchGitHubRepositories = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // DB에서만 데이터 조회
      const endpoint = `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/db/repositories`;

      const response = await axios.get(
        endpoint,
        { withCredentials: true }
      );

      // 응답 구조 확인 및 처리
      const repos: GitHubRepo[] = Array.isArray(response.data)
        ? response.data.map((repo: any) => ({
          name: repo.fullName || repo.name,
          url: repo.url || repo.html_url,
          description: repo.description,
          language: repo.language,
          lineCount: repo.size || 0,
          selectedDirectories: []
        }))
        : [];

      setAvailableRepos(repos);
    } catch (err) {
      console.error('GitHub 저장소 목록을 가져오는데 실패했습니다:', err);
      setError('GitHub 저장소 목록을 가져오는데 실패했습니다. DB에 저장된 데이터가 없거나 서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // DB 데이터 동기화
  const syncDatabaseData = async () => {
    if (!userId) return;

    setSyncingDb(true);
    setError(null);

    try {
      await axios.get(
        `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/sync/repositories`,
        { withCredentials: true }
      );

      // 동기화 완료 후 데이터 다시 로드
      fetchGitHubRepositories();
    } catch (err) {
      console.error('GitHub 저장소 데이터 동기화에 실패했습니다:', err);
      setError('GitHub 저장소 데이터 동기화에 실패했습니다.');
    } finally {
      setSyncingDb(false);
    }
  };

  const handleCloseDialog = () => {
    onOpenChange(false);
    setError(null);
  };

  const handleSaveRepoSelection = async () => {
    // 선택된 레포지토리와 디렉토리 정보를 콘솔에 출력
    console.log('====== 선택된 레포지토리 및 디렉토리 정보 ======');
    tempSelectedRepos.forEach(repo => {
      console.log(`레포지토리 이름: ${repo.name}`);
      console.log(`선택된 디렉토리/파일 목록:`, repo.selectedDirectories || []);
      console.log('---');
    });
    console.log('===============================================');

    // 저장 상태 설정
    setSaving(true);
    setError(null);

    try {
      // 선택된 각 레포지토리와 파일/디렉토리를 서버에 저장
      for (const repo of tempSelectedRepos) {
        if (repo.selectedDirectories && repo.selectedDirectories.length > 0) {
          console.log(`서버에 ${repo.name} 레포지토리 파일 저장 시작...`);

          // POST 요청 전송
          const response = await axios.post(
            `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/save-files`,
            {
              repository: repo.name,
              filePaths: repo.selectedDirectories,
              branch: 'main' // 기본 브랜치
            },
            { withCredentials: true }
          );

          // 응답 처리
          const result = response.data;
          if (result.success) {
            console.log(`${repo.name} 파일 저장 성공:`, result.savedFiles);
            console.log('저장 경로:', result.savedPath);
            
            // 부모 컴포넌트에 저장된 파일 정보 전달
            onFilesSaved({
              ...result,
              repository: repo.name
            });
          } else {
            console.error(`${repo.name} 파일 저장 실패:`, result.error);
          }
        }
      }

      // 부모 컴포넌트 콜백 호출
      onSave(tempSelectedRepos);

      // 대화상자 닫기
      handleCloseDialog();
    } catch (err) {
      console.error('파일 저장에 실패했습니다:', err);
      setError('서버에 파일을 저장하는 중 오류가 발생했습니다.');
      setSaving(false);
    }
  };

  const handleToggleRepo = (repo: GitHubRepo) => {
    if (tempSelectedRepos.some(r => r.name === repo.name)) {
      setTempSelectedRepos(tempSelectedRepos.filter(r => r.name !== repo.name));
    } else {
      setTempSelectedRepos([...tempSelectedRepos, repo]);
    }
  };

  const handleSaveDirectorySelection = (selectedPaths: string[]) => {
    if (currentRepo) {
      const updatedRepo = { ...currentRepo, selectedDirectories: selectedPaths };

      // 선택된 경로 정보를 콘솔에 출력
      console.log(`[${currentRepo.name}] 선택된 디렉토리/파일 경로:`, selectedPaths);

      // 임시 선택 목록에 업데이트된 레포 정보 저장
      const updatedSelectedRepos = tempSelectedRepos.map(repo =>
        repo.name === currentRepo.name ? updatedRepo : repo
      );

      if (!tempSelectedRepos.some(repo => repo.name === currentRepo.name)) {
        updatedSelectedRepos.push(updatedRepo);
      }

      setTempSelectedRepos(updatedSelectedRepos);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>GitHub 레포지토리 추가</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <label htmlFor="repo-select" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub 레포지토리 선택
            </label>

            <div className="flex gap-2">
              {/* 셀렉트 박스 (2/3 너비) */}
              <div className="w-2/3">
                {loading ? (
                  <div className="flex items-center space-x-2 h-10 px-3 py-2 rounded-md border border-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500">로드 중...</span>
                  </div>
                ) : (
                  <Select
                    value={currentRepo?.name || ''}
                    onValueChange={(value) => {
                      const selectedRepo = availableRepos.find(repo => repo.name === value);
                      if (selectedRepo) {
                        setCurrentRepo(selectedRepo);
                        // 선택된 레포가 tempSelectedRepos에 없으면 추가
                        if (!tempSelectedRepos.some(r => r.name === selectedRepo.name)) {
                          setTempSelectedRepos([...tempSelectedRepos, selectedRepo]);
                        }
                      } else {
                        setCurrentRepo(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="레포지토리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRepos.map(repo => (
                        <SelectItem key={repo.name} value={repo.name}>
                          {repo.name} ({repo.language || '기타'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* 동기화 버튼 (1/3 너비) */}
              <div className="w-1/3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={syncDatabaseData}
                  disabled={syncingDb}
                  className="flex items-center justify-center w-full"
                >
                  {syncingDb ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                  )}
                  GitHub 데이터 동기화
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md mt-2 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* 선택된 레포지토리 목록 */}
          {tempSelectedRepos.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                선택된 레포지토리
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {tempSelectedRepos.map((repo) => (
                  <Badge
                    key={repo.name}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span>{repo.name}</span>
                    <button
                      onClick={() => handleToggleRepo(repo)}
                      className="ml-1 p-0.5 rounded-full hover:bg-gray-200"
                    >
                      <span className="sr-only">삭제</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 11L11 3M3 3L11 11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 레포의 디렉토리 구조 - 항상 표시 */}
          {currentRepo ? (
            <GitHubDirectorySelector
              repositoryName={currentRepo.name}
              userId={userId}
              spaceId={spaceId}
              onSaveSelection={handleSaveDirectorySelection}
              initialSelectedPaths={currentRepo.selectedDirectories || []}
            />
          ) : (
            <Card className="mt-4">
              <CardContent className="pt-0">
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">
                    디렉토리를 선택하세요
                  </p>
                </div>
                <ScrollArea className="h-[350px] rounded-md border p-2">
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Folder size={32} className="text-gray-300 mb-2" />
                    <p className="text-muted-foreground text-center font-medium">
                      레포지토리를 선택해주세요
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      GitHub 레포지토리를 선택하면 파일 구조가 여기에 표시됩니다
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {tempSelectedRepos.length}개 레포지토리 선택됨
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              취소
            </Button>
            <Button
              onClick={handleSaveRepoSelection}
              disabled={tempSelectedRepos.length === 0 || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : '완료'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepoDialog;