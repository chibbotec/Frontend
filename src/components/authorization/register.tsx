import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.tsx";

interface SignupFormProps {
  className?: string;
  onSignupSuccess?: () => void;
}

export function RegisterDialog({
                                 onSignupSuccess,
                                 children,
                               }: {
  onSignupSuccess?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSignupSuccess) onSignupSuccess();
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원가입</DialogTitle>
            <DialogDescription>
              새로운 계정을 만들고 취업 뽀개기의 다양한 서비스를 이용해보세요.
            </DialogDescription>
          </DialogHeader>
          <SignupForm onSignupSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
  );
}

function SignupForm({ className, onSignupSuccess }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    nickname: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";

      // 회원가입 요청
      const response = await axios.post(`${apiUrl}/api/v1/auth/signup`, formData);

      console.log("회원가입 성공:", response.data);

      // 성공 콜백 호출
      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      // 에러 처리
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data?.message || "회원가입에 실패했습니다";
          setError(errorMessage);
        } else if (err.request) {
          setError("서버 응답이 없습니다. 네트워크 연결을 확인해주세요.");
        } else {
          setError("요청 설정 중 오류가 발생했습니다.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      console.error("회원가입 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)}>
        {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="username">사용자명 *</Label>
          <Input
              id="username"
              name="username"
              type="text"
              placeholder="사용자명 입력 (3-50자)"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">3자 이상 50자 이하여야 합니다</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호 *</Label>
          <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력 (4자 이상)"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">4자 이상이어야 합니다</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임 입력"
              value={formData.nickname}
              onChange={handleChange}
              disabled={isLoading}
          />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              취소
            </Button>
          </DialogClose>
          <Button type="submit" variant="outline" disabled={isLoading}>
            {isLoading ? "처리 중..." : "가입하기"}
          </Button>
        </DialogFooter>
      </form>
  );
}

// 로그인 폼에서의 사용을 위한 래퍼 컴포넌트
export function RegisterLink({ onSignupSuccess }: { onSignupSuccess?: () => void }) {
  return (
      <RegisterDialog onSignupSuccess={onSignupSuccess}>
        <a className="underline underline-offset-4 cursor-pointer">
          회원가입
        </a>
      </RegisterDialog>
  );
}