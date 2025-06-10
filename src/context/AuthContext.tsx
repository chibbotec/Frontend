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
      } catch (error: any) {
        console.log('인증 실패, 게스트 모드로 전환');
        setUser(null);
        setIsLoggedIn(false);
        setIsGuest(true);

        // 로컬 스토리지에 게스트 모드 상태 저장
        localStorage.setItem('isGuest', 'true');
      } finally {
        setIsLoading(false);
      }
    }

    // 로컬 스토리지에서 게스트 모드 상태 확인
    const isGuestMode = localStorage.getItem('isGuest') === 'true';
    if (isGuestMode) {
      setIsGuest(true);
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
    } else {
      checkAuth();
    }
  }, [])

  const enterGuestMode = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
    setUser(null);
  }

  const login = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await axios.get(`${apiUrl}/api/v1/members/me`, {
        withCredentials: true
      });
      console.log('사용자 정보:', response.data);
      setUser(response.data);
      setIsLoggedIn(true);
      setIsGuest(false);

      localStorage.setItem('isLoggedIn', 'true');

      return response.data;
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      throw error;
    }
  }

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await axios.get(`${apiUrl}/api/v1/auth/logout`, {
        withCredentials: true
      });

      setIsLoggedIn(false);
      setUser(null);
      setIsGuest(true);

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