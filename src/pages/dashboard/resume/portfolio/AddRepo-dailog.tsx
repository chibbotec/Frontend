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
import { Progress } from '@/components/ui/progress';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface FileInfo {
  path: string;
  size: number;
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

interface TaskStatusResponse {
  taskId: string;
  completed: boolean;
  progress: number;
  totalFiles: number;
  completedFiles: number;
  savedFiles: string[];
  failedFiles: string[];
  error: string;
  savedPath: string;
}

interface TaskResponse {
  taskId: string;
  message: string;
}

interface AddRepoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRepos: GitHubRepo[];
  onSave: (repos: GitHubRepo[]) => void;
  onFilesSaved: (response: any) => void;
  userId: number;
  spaceId: string;
  onSavingChange?: (saving: boolean) => void;
  currentTotalByteSize?: number; // 현재 총 바이트 크기
  maxByteSize?: number; // 최대 바이트 크기
}

const AddRepoDialog: React.FC<AddRepoDialogProps> = ({
  open,
  onOpenChange,
  selectedRepos,
  onSave,
  onFilesSaved,
  userId,
  spaceId,
  onSavingChange,
  currentTotalByteSize = 0,
  maxByteSize = 10000000,
}) => {
  const [tempSelectedRepo, setTempSelectedRepo] = useState<GitHubRepo | null>(selectedRepos[0] || null);
  const [availableRepos, setAvailableRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRepo, setCurrentRepo] = useState<GitHubRepo | null>(null);
  const [syncingDb, setSyncingDb] = useState(false);
  const [selectedFileInfos, setSelectedFileInfos] = useState<FileInfo[]>([]);
  const [calculatingSize, setCalculatingSize] = useState(false);
  
  // 바이트 크기 계산 상태
  const [totalByteSize, setTotalByteSize] = useState(0);

  // UI에 표시할 남은 공간 계산
  const remainingBytes = maxByteSize - currentTotalByteSize;
  const currentRepoExceedsLimit = totalByteSize > remainingBytes;
  
  // 프로그레스 바 계산
  const currentUsagePercent = (currentTotalByteSize / maxByteSize) * 100;
  const projectedUsagePercent = ((currentTotalByteSize + totalByteSize) / maxByteSize) * 100;
  const isProjectedOverLimit = projectedUsagePercent > 100;

  const [taskStatus, setTaskStatus] = useState<TaskStatusResponse | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Poll task status
  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/resume/${spaceId}/github/tasks/${taskId}`,
        { withCredentials: true }
      );
      
      const status: TaskStatusResponse = response.data;
      setTaskStatus(status);

      if (status.completed || status.error) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setIsPolling(false);

        if (status.error) {
          setError(`파일 저장 중 오류가 발생했습니다: ${status.error}`);
        } else {
          // Success case
          onFilesSaved({
            savedFiles: status.savedFiles,
            savedPath: status.savedPath,
            repository: tempSelectedRepo?.name
          });
        }
      }
    } catch (err) {
      console.error('작업 상태 확인 중 오류 발생:', err);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setIsPolling(false);
      setError('작업 상태를 확인하는 중 오류가 발생했습니다.');
    }
  };

  // 다이얼로그가 열릴 때 GitHub 저장소 목록 가져오기
  useEffect(() => {
    if (open) {
      fetchGitHubRepositories();
      setTempSelectedRepo(selectedRepos[0] || null);
      setCurrentRepo(null);
      setSelectedFileInfos([]);
      setTotalByteSize(0);
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
          byteSize: 0,
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

  // 선택된 파일/디렉토리의 크기 계산
  const calculateFileSize = async (repoName: string, filePath: string): Promise<number> => {
    try {
      // 이미 계산된 파일 정보가 있는지 확인
      const existingFileInfo = selectedFileInfos.find(info => info.path === filePath);
      if (existingFileInfo) {
        return existingFileInfo.size;
      }

      // 파일 크기 정보 가져오기
      const response = await axios.get(
        `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/file-size`,
        {
          params: {
            repository: repoName,
            path: filePath
          },
          withCredentials: true
        }
      );

      const size = response.data.size || 0;
      
      // 계산된 파일 정보 저장
      setSelectedFileInfos(prev => [...prev, { path: filePath, size }]);
      
      return size;
    } catch (err) {
      console.error(`파일 크기 정보를 가져오는데 실패했습니다: ${filePath}`, err);
      return 0;
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
    if (!tempSelectedRepo) return;

    setError(null);
    handleCloseDialog();
    onSavingChange?.(true);

    try {
      const repoWithSize = {
        ...tempSelectedRepo,
        byteSize: totalByteSize
      };

      if (tempSelectedRepo.selectedDirectories && tempSelectedRepo.selectedDirectories.length > 0) {
        console.log(`서버에 ${tempSelectedRepo.name} 레포지토리 파일 저장 시작...`);

        // Start async download task
        const response = await axios.post(
          `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/save-files`,
          {
            repository: tempSelectedRepo.name,
            filePaths: tempSelectedRepo.selectedDirectories,
            branch: 'main'
          },
          { withCredentials: true }
        );

        const result: TaskResponse = response.data;
        
        if (result.taskId) {
          // Pass taskId to parent component for polling
          onFilesSaved({
            taskId: result.taskId,
            repository: tempSelectedRepo.name
          });
        } else {
          throw new Error('작업 ID를 받지 못했습니다.');
        }
      }

      onSave([repoWithSize]);

    } catch (err) {
      console.error('파일 저장에 실패했습니다:', err);
      setError('서버에 파일을 저장하는 중 오류가 발생했습니다.');
      onSavingChange?.(false);
    }
  };

  const handleToggleRepo = (repo: GitHubRepo) => {
    setTempSelectedRepo(tempSelectedRepo?.name === repo.name ? null : repo);
  };

  const handleSaveDirectorySelection = async (selectedPaths: string[], totalSize: number) => {
    if (currentRepo) {
      setCalculatingSize(true);
      
      try {
        // 총 바이트 크기 설정
        setTotalByteSize(totalSize);

        const updatedRepo = { 
          ...currentRepo, 
          selectedDirectories: selectedPaths,
          byteSize: totalSize
        };

        // 선택된 경로 정보를 콘솔에 출력
        console.log(`[${currentRepo.name}] 선택된 디렉토리/파일 경로:`, selectedPaths);
        console.log(`총 바이트 크기: ${totalSize} bytes (${(totalSize/1024).toFixed(2)} KB)`);

        setTempSelectedRepo(updatedRepo);
      } catch (err) {
        console.error('파일 크기 계산에 실패했습니다:', err);
      } finally {
        setCalculatingSize(false);
      }
    }
  };

  // KB 단위로 크기 포맷팅
  const formatSize = (bytes: number): string => {
    return (bytes / 1024).toFixed(1) + ' KB';
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
                        // 선택된 레포가 tempSelectedRepo에 없으면 추가
                        if (!tempSelectedRepo || tempSelectedRepo.name !== selectedRepo.name) {
                          setTempSelectedRepo(selectedRepo);
                          setTotalByteSize(0); // 새 레포 선택시 바이트 크기 초기화
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
            
            {/* 스토리지 사용량 프로그레스 바 */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>
                  사용량: {formatSize(currentTotalByteSize)}
                  {totalByteSize > 0 && (
                    <span className={isProjectedOverLimit ? "text-red-600 font-medium" : "text-amber-500"}>
                      {" + "}{formatSize(totalByteSize)}
                      {isProjectedOverLimit && " (초과)"}
                    </span>
                  )}
                </span>
                <span>최대 용량: {formatSize(maxByteSize)}</span>
              </div>
              <div className="relative">
                {/* 현재 사용량 프로그레스 바 */}
                <Progress 
                  value={currentUsagePercent} 
                  className={`h-1.5 ${currentUsagePercent > 80 ? "[&>div]:bg-amber-500" : ""}`}
                />
                
                {/* 예상 사용량 영역 */}
                {totalByteSize > 0 && (
                  <div 
                    className={`absolute top-0 left-0 h-1.5 rounded-r-full transition-all ${isProjectedOverLimit ? "bg-red-500" : "bg-blue-400"}`} 
                    style={{ 
                      width: `${Math.min(projectedUsagePercent, 100)}%`,
                      opacity: 0.8,
                      clipPath: totalByteSize > 0 ? `inset(0 0 0 ${currentUsagePercent}%)` : 'none'
                    }}
                  />
                )}
              </div>
              
              {/* 사용량 표시 텍스트 */}
              <div className="flex justify-between text-xs">
                <span className={isProjectedOverLimit ? "text-red-600 font-medium" : ""}>
                  {totalByteSize > 0 
                    ? `예상 사용량: ${formatSize(currentTotalByteSize + totalByteSize)} (${Math.min(projectedUsagePercent, 100).toFixed(1)}%)` 
                    : `현재 사용량: ${formatSize(currentTotalByteSize)} (${currentUsagePercent.toFixed(1)}%)`
                  }
                </span>
                <span className={isProjectedOverLimit ? "text-red-600 font-medium" : ""}>
                  {isProjectedOverLimit 
                    ? `초과: ${formatSize((currentTotalByteSize + totalByteSize) - maxByteSize)}` 
                    : `남은 용량: ${formatSize(maxByteSize - (currentTotalByteSize + totalByteSize))}`
                  }
                </span>
              </div>
            </div>
            
            {/* 크기 계산 중 표시 */}
            {calculatingSize && (
              <div className="mt-2 text-xs text-blue-600 flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                크기 계산 중...
              </div>
            )}
          </div>

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

        {/* Add task status display */}
        {isPolling && taskStatus && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>파일 저장 진행 중...</span>
              <span>{taskStatus.completedFiles} / {taskStatus.totalFiles} 파일</span>
            </div>
            <Progress value={taskStatus.progress} className="h-2" />
            {taskStatus.error && (
              <div className="text-sm text-red-600">{taskStatus.error}</div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {tempSelectedRepo ? 
              `1개 레포지토리 선택됨${totalByteSize > 0 ? ` (${(totalByteSize/1024).toFixed(1)} KB)` : ''}` : 
              '레포지토리를 선택해주세요'}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              취소
            </Button>
            <Button
              onClick={handleSaveRepoSelection}
              disabled={!tempSelectedRepo || currentRepoExceedsLimit || isPolling}
            >
              {isPolling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '완료'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepoDialog;