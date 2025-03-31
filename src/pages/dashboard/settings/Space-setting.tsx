import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSpace } from "@/context/SpaceContext";
// import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Search, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 역할 옵션
const ROLE_OPTIONS = ["ADMIN", "MEMBER"];

const apiUrl = import.meta.env.VITE_API_URL || '';

const SpaceSetting = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { currentSpace, fetchSpaces } = useSpace(); // SpaceContext에서 현재 스페이스와 fetchSpaces 함수 가져오기

  // const { toast } = useToast();
  const [spaceName, setSpaceName] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // 컴포넌트 마운트 시 현재 스페이스 정보로 상태 초기화
  useEffect(() => {
    if (currentSpace) {
      setSpaceName(currentSpace.spaceName || "");
    }
  }, [currentSpace]);

  // 스페이스 정보 업데이트
  const handleUpdateSpace = async () => {
    try {
      await axios.patch(
        `${apiUrl}/api/v1/space/${spaceId}`,
        {
          spaceName: spaceName // API 요청 본문에는 데이터만 포함
        },
        {
          withCredentials: true // 인증 관련 설정은 세 번째 매개변수로 전달
        }
      );
      // toast({ title: "스페이스 정보가 업데이트되었습니다." });

      // SpaceContext의 fetchSpaces 함수를 호출하여 전역 상태 업데이트
      fetchSpaces();
    } catch (error) {
      console.error("스페이스 정보 업데이트 실패:", error);
      // toast({ variant: "destructive", title: "스페이스 정보 업데이트에 실패했습니다." });
    }
  };

  // 스페이스 삭제
  const handleDeleteSpace = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/space/${spaceId}`, {
        withCredentials: true
      });
      // toast({ title: "스페이스가 삭제되었습니다." });

      // 홈으로 리다이렉션 전에 스페이스 목록 갱신
      fetchSpaces();
      window.location.href = "/";
    } catch (error) {
      console.error("스페이스 삭제 실패:", error);
      // toast({ variant: "destructive", title: "스페이스 삭제에 실패했습니다." });
    }
  };

  // 팀원 추가
  const handleAddMember = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/v1/space/${spaceId}/members`,
        [{
          id: selectedUser.id,
          nickname: selectedUser.nickname || selectedUser.username
        }],
        { withCredentials: true }
      );

      // newMemberEmail 리셋 코드 제거
      // setNewMemberEmail("");

      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
      setIsAddMemberDialogOpen(false);

      // 멤버 추가 후 스페이스 정보 갱신
      fetchSpaces();
    } catch (error) {
      console.error("팀원 추가 실패:", error);
    }
  };

  // 팀원 권한 변경
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await axios.put(
        `${apiUrl}/api/v1/space/${spaceId}/members/${userId}`,
        { role: newRole },  // 요청 본문에는 역할 정보만 포함
        { withCredentials: true }  // 세 번째 인자로 설정 옵션 전달
      );
      // toast({ title: "팀원 권한이 변경되었습니다." });

      // 멤버 권한 변경 후 스페이스 정보 갱신
      fetchSpaces();
    } catch (error) {
      console.error("팀원 권한 변경 실패:", error);
      // toast({ variant: "destructive", title: "팀원 권한 변경에 실패했습니다." });
    }
  };

  // 팀원 삭제
  const handleDeleteMember = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/space/${spaceId}/members/${userId}`, {
        withCredentials: true
      });
      // toast({ title: "팀원이 삭제되었습니다." });

      // 멤버 삭제 후 스페이스 정보 갱신
      fetchSpaces();
    } catch (error) {
      console.error("팀원 삭제 실패:", error);
      // toast({ variant: "destructive", title: "팀원 삭제에 실패했습니다." });
    }
  };

  // 사용자 검색 함수
  const searchUsers = async (query: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/members/search`, {
        params: { keyword: query },
        withCredentials: true
      });

      console.log('사용자 검색 결과:', response.data);

      const data = response.data;
      const userList = Array.isArray(data) ? data : [data];

      return userList.map((user: any) => ({
        id: user.id,
        username: user.username,
        nickname: user.nickname || user.username,
        email: user.email,
        selected: false
      }));
    } catch (error) {
      console.error("사용자 검색 오류:", error);
      return [];
    }
  };

  // 사용자 검색 핸들러
  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      console.error("사용자 검색 오류:", err);
    } finally {
      setSearching(false);
    }
  };

  // 검색어 변경 시 처리를 위한 useEffect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // 사용자 선택 처리
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  // 현재 스페이스가 없으면 로딩 표시
  if (!currentSpace) {
    return <div>스페이스 정보를 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">스페이스 설정</h1>

      {/* 스페이스 일반 설정 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>일반 설정</CardTitle>
          <CardDescription>스페이스 기본 정보를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">스페이스 이름</Label>
            <Input
              id="space-name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleUpdateSpace}>저장</Button>
        </CardFooter>
      </Card>

      {/* 팀원 관리 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>팀원 관리</CardTitle>
          <CardDescription>스페이스 멤버를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">팀원 추가</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent><DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 추가</DialogTitle>
                  <DialogDescription>
                    추가할 팀원을 검색하여 선택하세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
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

                  {/* 선택된 사용자 표시 */}
                  {selectedUser && (
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}`} />
                        <AvatarFallback>
                          {selectedUser.nickname?.[0] || selectedUser.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedUser.nickname || selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              className="flex items-center gap-3 p-2 rounded hover:bg-accent text-left w-full"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                                <AvatarFallback>
                                  {user.nickname?.[0] || user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-sm">
                                <span
                                  className="font-medium">{user.nickname || user.username}</span>
                                <span
                                  className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                          팀원을 검색하여 초대하세요
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddMemberDialogOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedUser(null);
                  }}>
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 이름</TableHead>
                <TableHead>역할</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(currentSpace.members) && currentSpace.members.length > 0 ? (
                currentSpace.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.nickname || "알 수 없음"}</TableCell>
                    <TableCell>
                      {member.role === "OWNER" ? (
                        <span className="font-medium">소유자</span>
                      ) : (
                        <Select
                          defaultValue={member.role || "MEMBER"}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="역할" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role === "ADMIN" ? "관리자" : "일반 멤버"}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role === "OWNER" ? (
                        <span
                          className="text-xs text-muted-foreground">소유자는 삭제할 수 없습니다</span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              삭제
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>팀원 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                정말로 이 팀원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    팀원이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* 위험 영역 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">위험 영역</CardTitle>
          <CardDescription>스페이스 삭제와 같은 되돌릴 수 없는 작업입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">스페이스 삭제</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>스페이스 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 스페이스를 삭제하시겠습니까? 모든 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSpace}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceSetting;