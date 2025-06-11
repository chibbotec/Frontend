import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// GitHub 콜백 처리 컴포넌트
export default function GitHubCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processGitHubCallback = async () => {
      try {
        console.log('GitHub 콜백 처리 시작');
        console.log('현재 URL:', window.location.href);
        console.log('쿼리 파라미터:', window.location.search);

        // URL에서 code와 state 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        console.log('인증 코드:', code);
        console.log('상태 값:', state);

        // 백엔드에서 이미 인증이 완료되었을 수 있으므로, 코드 검사를 건너뛰고
        // 바로 로그인 상태를 확인합니다
        console.log('로그인 상태 확인 중...');

        // 로그인 함수 호출 (이미 인증이 완료되었다면 이 함수에서 사용자 정보를 가져올 것입니다)
        await login();
        console.log('로그인 함수 호출 완료');

        // 메인 페이지로 리다이렉트
        navigate('/dashboard');
      } catch (err) {
        console.error('GitHub 콜백 처리 오류:', err);
        setError('GitHub 로그인에 실패했습니다. 다시 시도해주세요.');

        // 3초 후 메인 페이지로 리다이렉트
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    };

    processGitHubCallback();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertTitle>로그인 오류</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <p className="text-sm">잠시 후 로그인 페이지로 이동합니다...</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">GitHub 로그인 처리 중...</h2>
        <p className="text-muted-foreground">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}