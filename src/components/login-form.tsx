import { useState } from "react"
import axios from "axios";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RegisterLink } from "@/components/register"

export function LoginForm({
  className,
  onLogin,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { onLogin?: () => void }) {

  const [username, setUsername] = useState("") // email → username으로 변경
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''; // 기본값 추가

      // API 엔드포인트 및 요청 본문 수정
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password
      }, {
        withCredentials: true // 쿠키를 주고받기 위해 필요
      });

      // 백엔드에서는 쿠키로 토큰을 관리하므로 localStorage 저장 제거
      // 대신 응답 데이터 로깅
      console.log('로그인 성공:', response.data);

      // onLogin 콜백 호출
      if (onLogin) onLogin();
    } catch (err) {
      // axios 에러 처리
      if (axios.isAxiosError(err)) {
        // API 에러 응답이 있는 경우
        if (err.response) {
          const errorMessage = err.response.data?.message || '로그인에 실패했습니다';
          setError(errorMessage);
        } else if (err.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          setError('서버 응답이 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          // 요청 설정 과정에서 오류가 발생한 경우
          setError('요청 설정 중 오류가 발생했습니다.');
        }
      } else {
        // 일반 오류
        setError('알 수 없는 오류가 발생했습니다.');
      }
      console.error('로그인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="grid gap-2">
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
        </div>
        <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          GitHub로 로그인
        </Button>
      </div>
      <div className="text-center text-sm">
        새로운 계정 만들기!{" "}
        <RegisterLink onSignupSuccess={handleSignupSuccess} />
      </div>
    </form>
  )
}