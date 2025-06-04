import { GalleryVerticalEnd } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { LoginForm } from "@/components/authorization/login-form.tsx"

export default function LoginPage() {
  const { login } = useAuth()

  // login 함수가 Promise를 반환하는 것을 명시적으로 타입 지정
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>취업 뽀개기</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login-background.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}