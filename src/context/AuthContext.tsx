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
  user: User | null
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await axios.get(`${apiUrl}/members/me`, {
          withCredentials: true
        });
        console.log('사용자 정보:', response.data);
        setUser(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth()
  }, [])

  const login = async () => {
    try {
      // 사용자가 로그인한 후에 사용자 정보를 가져옵니다
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await axios.get(`${apiUrl}/members/me`, {
        withCredentials: true
      });
      console.log('사용자 정보:', response.data);
      setUser(response.data);
      setIsLoggedIn(true);

      // 로컬 스토리지에 로그인 상태 저장 (선택 사항)
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
    }
  }

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await axios.get(`${apiUrl}/auth/logout`, {
        withCredentials: true
      });

      // 로그인 상태 초기화
      setIsLoggedIn(false);
      setUser(null);

      // 로컬 스토리지에서 로그인 상태 제거 (선택 사항)
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  }

  return (
      <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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