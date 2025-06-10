"use client"

import * as React from "react"
import { Loader2, Plus, Search, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  spaceService,
  type Space,
  type SpaceMemberRequest,
  type CreateSpaceRequest
} from "@/pages/dashboard/space/Space"
import axios from 'axios';
import { useSpace } from "@/context/SpaceContext" // SpaceContext 임포트
import { useAuth } from "@/context/AuthContext"

// 사용자 검색을 위한 인터페이스
interface SearchUser {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  selected: boolean;
}

// 사용자 검색 API 함수
export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await axios.get(`${apiUrl}/api/v1/members/search`, {
      params: { keyword: query },
      withCredentials: true // credentials: 'include'와 동일한 기능
    });

    console.log('사용자 검색 결과:', response.data);

    // axios는 자동으로 response.data로 JSON을 파싱합니다
    const data = response.data;

    // API 응답이 배열인지 확인 (배열이 아니면 배열로 변환)
    const userList = Array.isArray(data) ? data : [data];

    // API 응답 형식에 맞게 처리
    return userList.map((user: any) => ({
      id: user.id,
      username: user.username,
      nickname: user.nickname || user.username,
      email: user.email,
      selected: false
    }));
  } catch (error) {
    console.error("사용자 검색 오류:", error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

// 스페이스 생성 다이얼로그 Props
export interface CreateSpaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceCreated?: (space: Space) => void; // 선택적으로 변경
}

export function CreateSpaceDialog({
  isOpen,
  onClose,
}: CreateSpaceDialogProps) {
  const { addSpace } = useSpace(); // SpaceContext의 addSpace 사용
  const { isGuest } = useAuth();
  const [spaceName, setSpaceName] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchUser[]>([]);
  const [selectedUsers, setSelectedUsers] = React.useState<SearchUser[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);

  // 다이얼로그가 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSpaceName("");
        setSearchQuery("");
        setSearchResults([]);
        setSelectedUsers([]);
      }, 300); // 다이얼로그 닫힘 애니메이션 이후 초기화
    }
  }, [isOpen]);

  // 사용자 검색
  const handleSearchUsers = React.useCallback(async (query: string) => {
    if (!query.trim() || isGuest) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);

      const processedResults = results.map(user => ({
        ...user,
        selected: selectedUsers.some(selected => selected.id === user.id)
      }));

      setSearchResults(processedResults);
    } catch (err) {
      console.error("사용자 검색 오류:", err);
    } finally {
      setSearching(false);
    }
  }, [selectedUsers, isGuest]);

  // 검색어 변경 시 처리
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearchUsers]);

  // 사용자 선택 처리
  const handleUserSelect = (user: SearchUser) => {
    // 이미 선택된 사용자인 경우 선택 해제
    if (user.selected) {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));

      // 검색 결과에서도 선택 해제
      setSearchResults(prev =>
        prev.map(u => u.id === user.id ? { ...u, selected: false } : u)
      );
    }
    // 선택되지 않은 사용자인 경우 선택
    else {
      setSelectedUsers(prev => [...prev, { ...user, selected: true }]);

      // 검색 결과에서도 선택으로 표시
      setSearchResults(prev =>
        prev.map(u => u.id === user.id ? { ...u, selected: true } : u)
      );
    }
  };

  // 선택된 사용자 제거
  const handleRemoveSelected = (user: SearchUser) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== user.id));

    // 검색 결과에서도 선택 해제
    setSearchResults(prev =>
      prev.map(u => u.id === user.id ? { ...u, selected: false } : u)
    );
  };

  // 스페이스 생성 처리
  const handleCreateSpace = async () => {
    if (!spaceName.trim()) {
      toast.error("스페이스 이름을 입력해주세요.");
      return;
    }

    if (isGuest) {
      toast.error("게스트 모드에서는 스페이스를 생성할 수 없습니다.");
      return;
    }

    setIsCreating(true);
    try {
      const members: SpaceMemberRequest[] = selectedUsers.map(user => ({
        id: user.id,
        nickname: user.nickname || user.username
      }));

      const request: CreateSpaceRequest = {
        spaceName: spaceName.trim(),
        members: members.length > 0 ? members : undefined
      };

      const newSpace = await spaceService.createSpace('TEAM', request);

      toast.success("새 스페이스가 생성되었습니다.", {
        description: members.length > 0 ?
          `${members.length}명의 팀원과 함께 시작하세요!` :
          "이제 팀원을 초대하고 협업을 시작하세요."
      });

      addSpace(newSpace);
      onClose();
    } catch (err) {
      console.error("스페이스 생성 실패:", err);
      toast.error("스페이스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>새 팀 스페이스 생성</DialogTitle>
        <DialogDescription>
          팀원들과 함께 사용할 스페이스를 생성합니다. 바로 팀원을 초대할 수도 있습니다.
        </DialogDescription>

        <div className="grid gap-6 py-2">
          {/* 스페이스 이름 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="spaceName">스페이스 이름</Label>
            <Input
              id="spaceName"
              placeholder="스페이스 이름을 입력하세요"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              disabled={isCreating || isGuest}
            />
          </div>

          {/* 팀원 초대 섹션 */}
          <div className="grid gap-2">
            <Label>팀원 초대 (선택사항)</Label>

            {/* 검색 입력 필드 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 사용자명 또는 이메일로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isCreating || isGuest}
              />
            </div>

            {/* 선택된 사용자 목록 */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md text-sm"
                  >
                    <span>{user.nickname || user.username}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(user)}
                      disabled={isCreating}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과 */}
            <div className="border rounded-md overflow-hidden">
              <div className="min-h-[150px] max-h-[150px] overflow-y-auto p-1">
                {searching ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {searchResults.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        className={`flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full ${user.selected ? "bg-accent/50" : ""
                          }`}
                        onClick={() => handleUserSelect(user)}
                        disabled={isCreating}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                          <AvatarFallback>
                            {user.nickname?.[0] || user.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{user.nickname || user.username}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        {user.selected && (
                          <div className="ml-auto h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <Plus className="h-3 w-3 text-white rotate-45" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                    팀원을 검색하여 초대하세요
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            취소
          </Button>
          <Button
            onClick={handleCreateSpace}
            variant="outline"
            disabled={isCreating || !spaceName.trim() || isGuest}
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedUsers.length > 0
              ? `${selectedUsers.length}명의 팀원과 함께 생성`
              : "스페이스 생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}