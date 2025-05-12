import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ChevronRight, ChevronDown, Folder, FolderOpen, FileIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
  selected: boolean;
  indeterminate?: boolean; // 부분 선택 상태
  original?: any; // 원본 데이터 참조 저장
}

interface GitHubDirectorySelectorProps {
  repositoryName: string;
  userId: number;
  spaceId: string;
  onSaveSelection: (selectedPaths: string[], totalSize: number) => void;
  initialSelectedPaths?: string[]; // 초기 선택 경로 목록 추가
}

// 새로운 파일 형식 인터페이스
interface GitHubFileItem {
  mode: string;
  path: string;
  size: number;
  type: string;
  sha: string;
}

const GitHubDirectorySelector: React.FC<GitHubDirectorySelectorProps> = ({
  repositoryName,
  userId,
  spaceId,
  onSaveSelection,
  initialSelectedPaths = [] // 기본값은 빈 배열
}) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const rawDataRef = useRef<GitHubFileItem[]>([]);

  // 디렉토리 크기 계산 함수 (크기를 캐싱하기 위한 맵)
  const directorySizeCache = useRef<Record<string, number>>({});
  
  // 특정 디렉토리의 총 크기 계산
  const calculateDirectorySize = (node: FileNode): number => {
    // 캐시된 값이 있으면 반환
    if (directorySizeCache.current[node.path] !== undefined) {
      return directorySizeCache.current[node.path];
    }
    
    if (node.type !== 'directory' || !node.children) {
      return 0;
    }
    
    let total = 0;
    const calculateSize = (children: FileNode[]) => {
      for (const child of children) {
        if (child.type === 'file' && child.original?.size) {
          total += child.original.size;
        } else if (child.type === 'directory' && child.children) {
          calculateSize(child.children);
        }
      }
    };
    
    calculateSize(node.children);
    
    // 결과 캐싱
    directorySizeCache.current[node.path] = total;
    
    return total;
  };
  
  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 선택된 경로와 크기가 변경될 때마다 부모 컴포넌트에 전달
  useEffect(() => {
    const selectedPaths = getSelectedPaths(fileTree);
    const totalSize = calculateTotalSize(fileTree);
    
    // 부모 컴포넌트에 정보 전달
    onSaveSelection(selectedPaths, totalSize);
    
    // 크기가 변경되면 디버그 정보 업데이트
    if (totalSize > 0) {
      setDebugInfo(`총 선택된 크기: ${formatFileSize(totalSize)}`);
      // 2초 후 메시지 삭제
      setTimeout(() => setDebugInfo(null), 2000);
    }
  }, [fileTree]);

  useEffect(() => {
    if (repositoryName) {
      fetchRepositoryData();
    }
  }, [repositoryName]);

  // 초기 선택 경로가 설정된 경우 처리
  useEffect(() => {
    if (initialSelectedPaths && initialSelectedPaths.length > 0 && fileTree.length > 0) {
      console.log('초기 선택 경로 적용:', initialSelectedPaths);
      setFileTree(prevTree => {
        const updatedTree = JSON.parse(JSON.stringify(prevTree)); // 깊은 복사

        // 각 초기 선택 경로에 대해 트리에서 해당 노드 선택 상태로 변경
        initialSelectedPaths.forEach(path => {
          applySelectionToPath(updatedTree, path);
        });

        return updatedTree;
      });
    }
  }, [initialSelectedPaths, fileTree.length]);

  // 경로에 해당하는 노드와 모든 상위 노드 선택
  const applySelectionToPath = (tree: FileNode[], path: string) => {
    const pathParts = path.split('/');

    // 경로 부분별로 처리
    for (let i = 1; i <= pathParts.length; i++) {
      const currentPath = pathParts.slice(0, i).join('/');
      const node = findNodeInTree(tree, currentPath);

      if (node) {
        node.selected = true;

        // 디렉토리인 경우 확장
        if (node.type === 'directory') {
          node.expanded = true;
        }
      }
    }
  };

  // 레포지토리 전체 데이터를 한번에 가져옴
  const fetchRepositoryData = async () => {
    if (!repositoryName || !userId) return;

    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      // 레포지토리 이름 분리 (owner/repo 형식)
      const [repoOwner, repoName] = repositoryName.split('/');

      // 레포지토리 상세 정보 엔드포인트
      const requestUrl = `${apiUrl}/api/v1/resume/${spaceId}/github/users/${userId}/db/repositories/${repoOwner}/${repoName}`;

      console.log('레포지토리 정보 요청 URL:', requestUrl);

      const response = await axios.get(
        requestUrl,
        { withCredentials: true }
      );

      // 레포지토리 데이터
      const repoData = response.data;

      if (!repoData || !repoData.files || !Array.isArray(repoData.files)) {
        console.error('유효한 레포지토리 파일 정보가 없습니다');
        setError('레포지토리 파일 정보를 가져오는데 실패했습니다.');
        setFileTree([]);
        return;
      }

      console.log('레포지토리 파일 데이터:', repoData.files);

      // 원본 데이터 저장 (새로운 형식)
      rawDataRef.current = repoData.files;

      // 새로운 형식에 맞게 파일 트리 구성
      const rootTree = buildFileTreeFromNewFormat(repoData.files);

      console.log('변환된 파일 트리:', rootTree);
      setFileTree(rootTree);
    } catch (err: any) {
      console.error('레포지토리 데이터를 가져오는데 실패했습니다:', err);

      let errorMessage = '레포지토리 데이터를 가져오는데 실패했습니다.';
      if (err.response?.data?.message) {
        errorMessage += ' ' + err.response.data.message;
      } else if (err.message) {
        errorMessage += ' ' + err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 새로운 형식의 파일 데이터로부터 파일 트리 생성
  const buildFileTreeFromNewFormat = (files: GitHubFileItem[]): FileNode[] => {
    // 경로별로 파일 맵 생성
    const pathMap: { [path: string]: FileNode } = {};

    // 루트 노드 생성
    const rootNodes: FileNode[] = [];

    // 경로를 기준으로 정렬 (깊이 순서대로 처리하기 위해)
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

    // 각 파일을 처리
    sortedFiles.forEach(file => {
      const pathParts = file.path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const isDirectory = file.type === 'tree';

      // 현재 파일 노드 생성
      const node: FileNode = {
        path: file.path,
        name: fileName,
        type: isDirectory ? 'directory' : 'file',
        children: isDirectory ? [] : undefined,
        expanded: false,
        selected: false,
        original: file
      };

      // 현재 노드를 맵에 저장
      pathMap[file.path] = node;

      // 루트 레벨 파일/디렉토리인 경우
      if (pathParts.length === 1) {
        rootNodes.push(node);
        return;
      }

      // 부모 디렉토리 경로
      const parentPath = pathParts.slice(0, -1).join('/');

      // 부모 디렉토리가 맵에 존재하면 자식으로 추가
      if (pathMap[parentPath]) {
        if (!pathMap[parentPath].children) {
          pathMap[parentPath].children = [];
        }
        pathMap[parentPath].children!.push(node);
      } else {
        // 부모 디렉토리가 아직 생성되지 않은 경우
        // (실제로는 깊이 순서대로 정렬했기 때문에 이 경우는 거의 없음)
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const handleToggleExpand = (node: FileNode) => {
    console.log('디렉토리 확장/축소 토글:', node.path);

    if (node.type === 'directory') {
      setFileTree(prevTree => {
        const updatedTree = JSON.parse(JSON.stringify(prevTree)); // 깊은 복사
        const nodeInTree = findNodeInTree(updatedTree, node.path);

        if (nodeInTree) {
          // 확장 상태 토글
          nodeInTree.expanded = !nodeInTree.expanded;

          // 디버그 정보 설정
          if (nodeInTree.expanded && (!nodeInTree.children || nodeInTree.children.length === 0)) {
            setDebugInfo(`디렉토리 '${node.path}'에 하위 항목이 없습니다.`);
          } else {
            setDebugInfo(null);
          }
        } else {
          console.log(`Node ${node.path} not found in tree`);
          setDebugInfo(`노드 '${node.path}'를 트리에서 찾을 수 없습니다.`);
        }

        return updatedTree;
      });
    }
  };

  const findNodeInTree = (tree: FileNode[], path: string): FileNode | null => {
    for (const node of tree) {
      if (node.path === path) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeInTree(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const handleToggleSelect = (node: FileNode) => {
    const nodeTypeStr = node.type === 'directory' ? '디렉토리' : '파일';
    console.log(`${nodeTypeStr} '${node.path}' 선택 상태 변경 시도 (현재 상태: ${node.selected ? '선택됨' : '선택안됨'})`);

    setFileTree(prevTree => {
      const updatedTree = JSON.parse(JSON.stringify(prevTree)); // 깊은 복사
      const result = toggleNodeSelection(updatedTree, node.path);

      // 선택 토글 후 노드 상태 확인
      const updatedNode = findNodeInTree(updatedTree, node.path);
      const newState = updatedNode ? (updatedNode.selected ? '선택됨' : '선택안됨') : '알 수 없음';

      console.log(`${nodeTypeStr} '${node.path}' 선택 상태 변경 ${result ? '성공' : '실패'} -> ${newState}`);
      
      // 디렉토리 선택시 특별 처리 (사용자에게 정보 표시)
      if (node.type === 'directory' && updatedNode?.selected) {
        setDebugInfo(`디렉토리 '${node.path}'를 선택하면 모든 하위 파일이 포함됩니다. 크기 계산 중...`);
        // 잠시 후 디버그 메시지 삭제
        setTimeout(() => setDebugInfo(null), 2000);
      }

      // 전체 선택된 경로 로깅 (디버깅용)
      const selectedPaths = getSelectedPaths(updatedTree);
      console.log(`현재 선택된 총 경로 수: ${selectedPaths.length}`);

      return updatedTree;
    });
  };

  const toggleNodeSelection = (tree: FileNode[], path: string) => {
    for (const node of tree) {
      if (node.path === path) {
        // 이전 상태 저장
        const wasSelected = node.selected;
        
        // 선택 상태 토글
        node.selected = !node.selected;

        // 디렉토리면 모든 하위 항목에 적용
        if (node.type === 'directory' && node.children) {
          toggleChildrenSelection(node.children, node.selected);
          
          // 디렉토리 선택 시 디버그 메시지 표시
          if (node.selected && !wasSelected) {
            // 선택 시, 캐시된 디렉토리 크기가 있으면 표시
            const dirSize = directorySizeCache.current[node.path];
            if (dirSize) {
              setDebugInfo(`'${node.path}' 디렉토리가 선택되었습니다. 포함된 파일 크기: ${formatFileSize(dirSize)}`);
              setTimeout(() => setDebugInfo(null), 3000);
            }
          }
        }

        return true;
      }

      if (node.children && node.children.length > 0) {
        const found = toggleNodeSelection(node.children, path);
        if (found) {
          // 하위 항목 선택 상태에 따라 상위 디렉토리 상태 업데이트
          updateParentSelectionState(node);
          return true;
        }
      }
    }
    return false;
  };

  const toggleChildrenSelection = (nodes: FileNode[], selected: boolean) => {
    for (const node of nodes) {
      node.selected = selected;
      if (node.children) {
        toggleChildrenSelection(node.children, selected);
      }
    }
  };

  const updateParentSelectionState = (node: FileNode) => {
    if (node.children && node.children.length > 0) {
      const allSelected = node.children.every(child => child.selected);
      const anySelected = node.children.some(child => child.selected);

      node.selected = allSelected;
      node.indeterminate = anySelected && !allSelected;
    }
  };

  const getSelectedPaths = (tree: FileNode[]): string[] => {
    const paths: string[] = [];
    const fileOnlyPaths: string[] = [];
    const dirOnlyPaths: string[] = [];

    const traverse = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.selected) {
          paths.push(node.path);

          // 파일과 디렉토리 분리 추적
          if (node.type === 'file') {
            fileOnlyPaths.push(node.path);
          } else if (node.type === 'directory') {
            dirOnlyPaths.push(node.path);
          }
        }

        // 선택되지 않았더라도 자식 노드들 확인 (부분 선택일 수 있음)
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);

    // 상세 로깅
    console.log("선택된 총 경로 수:", paths.length);
    console.log("선택된 파일 경로 수:", fileOnlyPaths.length);
    console.log("선택된 디렉토리 경로 수:", dirOnlyPaths.length);

    // 전체 경로 목록도 로깅 (너무 많으면 일부만)
    const maxLogItems = 20; // 최대 로깅 항목 수
    if (paths.length <= maxLogItems) {
      console.log("선택된 모든 경로:", paths);
    } else {
      console.log(`선택된 경로 (처음 ${maxLogItems}개):`, paths.slice(0, maxLogItems));
      console.log(`... 그리고 ${paths.length - maxLogItems}개 더`);
    }

    return paths;
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    fetchRepositoryData();
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    if (!nodes || nodes.length === 0) return null;

    return nodes.map(node => {
      // 디렉토리인 경우 크기 계산 (UI 표시용)
      const dirSize = node.type === 'directory' ? calculateDirectorySize(node) : 0;
      
      return (
        <div key={node.path} className="py-1">
          <div
            className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5"
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
          >
            <Checkbox
              id={`checkbox-${node.path}`}
              checked={node.selected}
              onCheckedChange={() => handleToggleSelect(node)}
              className="mr-1"
            />

            {node.type === 'directory' && (
              <div
                className="cursor-pointer p-0.5 rounded-sm hover:bg-gray-200"
                onClick={() => handleToggleExpand(node)}
              >
                {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}

            <div
              className="flex items-center cursor-pointer flex-1"
              onClick={() => {
                if (node.type === 'directory') {
                  handleToggleExpand(node);
                } else {
                  handleToggleSelect(node);
                }
              }}
            >
              {node.type === 'directory' ? (
                node.expanded ? <FolderOpen size={16} className="mr-1 text-blue-500" /> : <Folder size={16} className="mr-1 text-blue-500" />
              ) : (
                <FileIcon size={16} className="mr-1 text-gray-500" />
              )}
              <span className="text-sm">{node.name}</span>

              {/* 파일 크기 표시 (파일인 경우) */}
              {node.type === 'file' && node.original && node.original.size && (
                <span className="ml-2 text-xs text-gray-400">
                  ({formatFileSize(node.original.size)})
                </span>
              )}
              
              {/* 디렉토리 크기 표시 (디렉토리인 경우) */}
              {node.type === 'directory' && dirSize > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  ({formatFileSize(dirSize)})
                </span>
              )}
            </div>
          </div>

          {node.type === 'directory' && node.expanded && node.children && node.children.length > 0 && (
            <div>
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // 총 선택된 크기 계산
  const calculateTotalSize = (tree: FileNode[]): number => {
    let total = 0;

    const traverse = (nodes: FileNode[], parentSelected: boolean = false) => {
      for (const node of nodes) {
        if (node.selected || parentSelected) {
          // 파일인 경우 크기 더하기
          if (node.type === 'file' && node.original && node.original.size) {
            total += node.original.size;
          }
          
          // 하위 노드 처리 (선택된 경우 모든 하위 노드도 선택된 것으로 처리)
          if (node.children && node.children.length > 0) {
            traverse(node.children, true);
          }
        } else if (node.children && node.children.length > 0) {
          // 선택되지 않은 노드의 하위 항목 중 선택된 항목 처리
          traverse(node.children, false);
        }
      }
    };

    traverse(tree);
    
    console.log(`총 선택된 크기: ${total} 바이트 (${formatFileSize(total)})`);
    return total;
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-0">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              파일과 디렉토리를 선택하세요
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 flex items-center rounded-full"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={12} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md mb-4 text-sm flex items-start">
            <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-2 rounded-md mb-4 text-sm flex items-start">
            <Loader2 className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
            <span>{debugInfo}</span>
          </div>
        )}

        <ScrollArea className="h-[350px] rounded-md border p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-muted-foreground text-center">
                레포지토리 내용을 불러오는 중...
              </p>
            </div>
          ) : fileTree.length > 0 ? (
            <div className="space-y-0.5">
              {renderTree(fileTree)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <p className="text-muted-foreground text-center">
                {error ? '레포지토리 내용을 불러올 수 없습니다' : '파일이 없습니다'}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GitHubDirectorySelector;