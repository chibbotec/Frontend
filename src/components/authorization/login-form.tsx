import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { RegisterLink } from "@/components/authorization/register.tsx"
import { GitHubLoginButton } from "@/components/authorization/GitHubLoginButton.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GalleryVerticalEnd } from "lucide-react"

interface LoginFormProps {
  isOpen: boolean;
  onClose?: () => Promise<void>;
  onLogin?: () => Promise<void>;
}

export function LoginForm({ isOpen, onClose = async () => { }, onLogin }: LoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (onLogin) {
        await onLogin();
      }
      await onClose();
      const savedSpaceId = localStorage.getItem('activeSpaceId');
      if (savedSpaceId) {
        navigate(`/space/${savedSpaceId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>취업 뽀개기</span>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">로그인</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}
            <GitHubLoginButton disabled={isLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}