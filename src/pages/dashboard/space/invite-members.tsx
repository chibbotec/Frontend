"use client"

import * as React from "react"
import { Loader2, Search, Plus, X, UserPlus } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  spaceService,
  type SpaceMemberRequest
} from "@/pages/dashboard/space/Space"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSpace } from "@/context/SpaceContext" // SpaceContext 임포트

// 초대할 사용자 검색 상태 인터페이스
interface SearchUser {
  id: number
  username: string
  nickname?: string
  email?: string
  selected: boolean
}

// 팀원 초대 버튼 컴포넌트
export function InviteMembersButton({
                                      disabled,
                                      className,
                                      variant = "outline",
                                      size = "default",
                                    }: {
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { currentSpace } = useSpace() // 스페이스 컨텍스트에서 현재 스페이스 가져오기

  if (!currentSpace) return null; // 스페이스가 없으면 렌더링하지 않음

  return (
      <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
                variant={variant}
                size={size}
                disabled={disabled}
                className={className}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              팀원 초대
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <InviteMembersDialog
                spaceId={currentSpace.id}
                onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
  )
}

// 팀원 초대 다이얼로그 내부 컴포넌트
function InviteMembersDialog({
                               spaceId,
                               onClose,
                             }: {
  spaceId: number
  onClose: () => void
}) {
  const { addMembers } = useSpace() // 스페이스 컨텍스트에서 addMembers 가져오기
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searching, setSearching] = React.useState(false)
  const [inviting, setInviting] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<SearchUser[]>([])
  const [selectedUsers, setSelectedUsers] = React.useState<SearchUser[]>([])

  // 실제 API 연동이 필요한 부분: 사용자 검색 함수
  const searchUsers = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // 이 부분은 실제 사용자 검색 API 연동이 필요합니다.
      // 현재는 목업 데이터로 대체합니다.
      await new Promise(resolve => setTimeout(resolve, 800)); // 검색 지연 시뮬레이션

      // 목업 검색 결과
      const mockResults: SearchUser[] = [
        { id: 1, username: "user1", nickname: "홍길동", email: "user1@example.com", selected: false },
        { id: 2, username: "user2", nickname: "김철수", email: "user2@example.com", selected: false },
        { id: 3, username: "user3", nickname: "이영희", email: "user3@example.com", selected: false },
        { id: 4, username: "gildong", nickname: "길동이", email: "gildong@example.com", selected: false },
        { id: 5, username: "dev.kim", nickname: "개발킴", email: "dev.kim@example.com", selected: false }
      ].filter(user =>
          user.username.includes(query) ||
          (user.nickname && user.nickname.includes(query)) ||
          (user.email && user.email.includes(query))
      );

      // 이미 선택된 사용자는 선택 상태로 표시
      mockResults.forEach(user => {
        if (selectedUsers.some(selected => selected.id === user.id)) {
          user.selected = true;
        }
      });

      setSearchResults(mockResults);
    } catch (err) {
      console.error("사용자 검색 오류:", err);
      toast.error("사용자 검색 중 오류가 발생했습니다.");
    } finally {
      setSearching(false);
    }
  }, [selectedUsers]);

  // 검색어 변경 시 처리
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, searchUsers]);

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

  // 팀원 초대 처리
  const handleInviteMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("초대할 팀원을 선택해주세요.");
      return;
    }

    setInviting(true);
    try {
      // API 요청 형식에 맞게 데이터 변환
      const membersToInvite: SpaceMemberRequest[] = selectedUsers.map(user => ({
        id: user.id,
        nickname: user.nickname || user.username
      }));

      const addedMembers = await spaceService.addSpaceMembers(spaceId, membersToInvite);
      toast.success(`${addedMembers.length}명의 팀원이 초대되었습니다.`);

      // 컨텍스트를 통해 스페이스 멤버 목록 업데이트
      addMembers(addedMembers);

      // 다이얼로그 닫기
      onClose();
    } catch (err) {
      console.error("팀원 초대 오류:", err);
      toast.error("팀원 초대에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setInviting(false);
    }
  };

  return (
      <>
        <DialogTitle>팀원 초대</DialogTitle>
        <DialogDescription>
          함께 일할 새로운 팀원을 스페이스에 초대하세요. 사용자명, 닉네임 또는 이메일로 검색할 수 있습니다.
        </DialogDescription>

        <div className="flex flex-col gap-4 py-4">
          {/* 검색 입력 필드 */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="이름, 사용자명 또는 이메일로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="min-h-[200px] max-h-[200px] overflow-y-auto p-1">
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
                            className={`flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full ${
                                user.selected ? "bg-accent/50" : ""
                            }`}
                            onClick={() => handleUserSelect(user)}
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
                    사용자를 검색하여 초대하세요
                  </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={inviting}>
            취소
          </Button>
          <Button
              onClick={handleInviteMembers}
              disabled={inviting || selectedUsers.length === 0}
          >
            {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedUsers.length}명 초대하기
          </Button>
        </DialogFooter>
      </>
  );
}