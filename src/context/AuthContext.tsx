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
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        console.log('API URL:', apiUrl);
        const response = await axios.get(`${apiUrl}/api/v1/members/me`, {
          withCredentials: true
        });
        console.log('사용자 정보:', response.data);
        setUser(response.data);
        setIsLoggedIn(true);
        setIsGuest(false);
      } catch (error: any) {
        console.error('인증 실패 상세:', error.response?.data || error.message);
        // 401 에러를 포함한 모든 에러에서 게스트 모드로 전환
        setUser(null);
        setIsLoggedIn(false);
        setIsGuest(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
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