import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

// GitHub 소셜 로그인 버튼 컴포넌트
export function GitHubLoginButton({ disabled = false }: { disabled?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  // GitHubLoginButton 컴포넌트 수정
  // const handleGitHubLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     // 소셜 로그인 URL 구성
  //     const apiUrl = import.meta.env.VITE_API_URL || '';
  //     // const apiUrl = "http://localhost:9010" // 끝에 슬래시 제거
  //
  //     // // 리다이렉트 URL은 현재 도메인 기준으로 설정
  //     // const redirectUri = `${window.location.origin}/auth/callback/github`;
  //     //
  //     //
  //     //
  //     // // 최종 URL 로깅
  //     // // const finalUrl = `${apiUrl}/oauth2/authorization/github?redirect_uri=${encodeURIComponent(redirectUri)}`;
  //     // const finalUrl = `${apiUrl}/oauth2/authorization/github?redirectUrl=${encodeURIComponent(redirectUri)}`;
  //
  //     // const frontendCallbackUrl = window.location.origin + '/auth/callback/github';
  //     // const finalUrl = `${apiUrl}/oauth2/authorization/github?state=${encodeURIComponent(frontendCallbackUrl)}&redirectUrl=${encodeURIComponent(frontendCallbackUrl)}`;
  //
  //     // state만 설정하고 redirect_uri는 백엔드 설정을 따르게 함
  //     const stateValue = window.location.origin + '/auth/callback/github';
  //     const finalUrl = `${apiUrl}/oauth2/authorization/github?state=${encodeURIComponent(stateValue)}`;
  //
  //     console.log('GitHub 로그인 URL:', finalUrl);
  //
  //     // 실제 인증 URL로 리다이렉트
  //     window.location.href = finalUrl;
  //   } catch (error) {
  //     console.error("GitHub 로그인 오류:", error);
  //     setIsLoading(false);
  //   }
  // };

  const handleGitHubLogin = () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // frontUrl은 환경에 따라 적절히 설정 (constants.js에서 가져오거나 현재 URL 기반으로 설정)
      const frontUrl = window.location.origin + '/auth/callback/github';

      // 카카오 로그인 방식과 유사하게 수정
      const finalUrl = `${apiUrl}/oauth2/authorization/github?redirectUrl=${encodeURIComponent(frontUrl)}&state=github_auth_state`;

      console.log('GitHub 로그인 URL:', finalUrl);

      window.location.href = finalUrl;
    } catch (error) {
      console.error("GitHub 로그인 오류:", error);
      setIsLoading(false);
    }
  };

  return (
      <Button
          variant="outline"
          className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium"
          style={{ color: 'white', backgroundColor: '#24292F' }} // 인라인 스타일로 강제 적용
          onClick={handleGitHubLogin}
          disabled={disabled || isLoading}
          type="button"
      >
        {isLoading ? (
            <span className="animate-spin mr-2">⟳</span>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
              />
            </svg>
        )}
        GitHub로 로그인
      </Button>
  );
}