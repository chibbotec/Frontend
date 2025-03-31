import axios from 'axios';

// 사용자 검색을 위한 인터페이스
export interface SearchUser {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  selected: boolean;
}

// 사용자 검색 API 함수
export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await axios.get(`${apiUrl}/api/v1/members/search`, {
      params: { keyword: query },
      withCredentials: true // credentials: 'include'와 동일한 기능
    });

    console.log('사용자 검색 결과:', response.data);

    // axios는 자동으로 response.data로 JSON을 파싱합니다
    const data = response.data;

    // API 응답이 배열인지 확인 (배열이 아니면 배열로 변환)
    const userList = Array.isArray(data) ? data : [data];

    // API 응답 형식에 맞게 처리
    return userList.map((user: any) => ({
      id: user.id,
      username: user.username,
      nickname: user.nickname || user.username,
      email: user.email,
      selected: false
    }));
  } catch (error) {
    console.error("사용자 검색 오류:", error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};