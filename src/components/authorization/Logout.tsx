import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSpace } from "@/context/SpaceContext";

export const useLogout = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();
  const { fetchSpaces } = useSpace();

  const logout = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/auth/logout`, {
        withCredentials: true
      });

      if (response.status === 200) {
        // 로그아웃 성공 후 게스트 모드로 전환
        enterGuestMode();
        // 게스트 스페이스로 전환
        await fetchSpaces();
        // 메인 페이지로 이동
        navigate('/');
      } else {
        console.error('로그아웃에 실패했습니다:', response.status);
      }
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  return { logout };
};