import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { RegisterLink } from "@/components/authorization/register.tsx"
import { GitHubLoginButton } from "@/components/authorization/GitHubLoginButton.tsx"

export function LoginForm({
  className,
  onLogin,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { onLogin?: () => Promise<void> }) { // Promise<void> 타입으로 변경

  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // 로그인 API 요청
      const response = await axios.post(`${apiUrl}/api/v1/auth/login`, {
        username,
        password
      }, {
        withCredentials: true
      });

      console.log('로그인 성공:', response.data);

      // onLogin 콜백을 기다림
      if (onLogin) {
        await onLogin(); // await 추가
        console.log('onLogin 콜백 완료');
      }

      // 로그인 성공 및 콜백 완료 후 대시보드로 리다이렉트
      console.log('대시보드로 네비게이션 시작');
      const savedSpaceId = localStorage.getItem('activeSpaceId');
      if (savedSpaceId) {
        navigate(`/space/${savedSpaceId}`);
      } else {
        navigate('/dashboard');
      }
      console.log('네비게이션 명령 실행됨');

    } catch (err) {
      // 에러 처리 코드는 그대로 유지...
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data?.message || '로그인에 실패했습니다';
          setError(errorMessage);
        } else if (err.request) {
          setError('서버 응답이 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          setError('요청 설정 중 오류가 발생했습니다.');
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      console.error('로그인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 나머지 코드는 그대로 유지...

  // 회원가입 성공 후 처리
  const handleSignupSuccess = () => {
    // 회원가입 성공 시 메시지 표시 또는 다른 동작 수행 가능
    setError(null);
    // 가입한 정보를 로그인 폼에 자동으로 채울 수도 있음
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">취업 뽀개기</h1>
        <p className="text-balance text-sm text-muted-foreground">
          로그인을 해주세요
        </p>
      </div>
      <div className="grid gap-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
        {/* <div className="grid gap-2">
          <Label htmlFor="username">사용자 이름</Label>
          <Input
            id="username"
            type="text"
            placeholder="사용자 이름 입력"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">비밀번호</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              비밀번호 찾기
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full text-black" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            또는 다음으로 계속하기
          </span>
        </div> */}
        {/* GitHub 소셜 로그인 버튼으로 교체 */}
        <GitHubLoginButton disabled={isLoading} />
      </div>
      {/* <div className="text-center text-sm">
        새로운 계정 만들기!{" "}
        <RegisterLink onSignupSuccess={handleSignupSuccess} />
      </div> */}
    </form>
  )
}