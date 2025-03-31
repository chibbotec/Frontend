import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/auth/logout`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        // 로그아웃 성공 후 로그인 페이지로 리다이렉트
        navigate('/login');
      } else {
        console.error('로그아웃에 실패했습니다:', response.status);
      }
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  return { logout };
};