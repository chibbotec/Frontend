import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

// User 인터페이스 정의
interface User {
  id?: number | string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  // 필요한 다른 사용자 속성들
}

type AuthContextType = {
  isLoggedIn: boolean
  isGuest: boolean
  user: User | null
  login: () => void
  logout: () => Promise<void>
  enterGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      // 로그인 페이지에서는 인증 검사를 건너뜀
      if (location.pathname === '/login') {
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await axios.get(`${apiUrl}/api/v1/members/me`, {
          withCredentials: true
        });
        console.log('사용자 정보:', response.data);
        setUser(response.data);
        setIsLoggedIn(true);
        setIsGuest(false);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
        setIsGuest(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth()
  }, [])

  const enterGuestMode = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
    setUser(null);
  }

  const login = async () => {
    try {
      // 사용자가 로그인한 후에 사용자 정보를 가져옵니다
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await axios.get(`${apiUrl}/api/v1/members/me`, {
        withCredentials: true
      });
      console.log('사용자 정보:', response.data);
      setUser(response.data);
      setIsLoggedIn(true);
      setIsGuest(false);

      // 로컬 스토리지에 로그인 상태 저장 (선택 사항)
      localStorage.setItem('isLoggedIn', 'true');

      return response.data; // 데이터 반환하도록 수정
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리하도록 함
    }
  }

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await axios.get(`${apiUrl}/api/v1/auth/logout`, {
        withCredentials: true
      });

      // 로그인 상태 초기화
      setIsLoggedIn(false);
      setUser(null);
      setIsGuest(true);

      // 로컬 스토리지에서 로그인 상태 제거 (선택 사항)
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isGuest, user, login, logout, enterGuestMode }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다')
  }
  return context
}