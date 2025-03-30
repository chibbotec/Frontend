// src/services/spaceService.ts
import axios from 'axios';
import { mockSpaceService } from '@/pages/dashboard/space/mockSpace';

// Space 관련 타입 정의
export interface SpaceMember {
  id: number;
  nickname: string;
}

export interface Space {
  id: number;
  spaceName: string;
  spaceOwner: string;
  type: 'PERSONAL' | 'TEAM';
  members: SpaceMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpaceRequest {
  spaceName: string;
  members?: SpaceMemberRequest[];
}

export interface SpaceMemberRequest {
  id: number;
  nickname: string;
}

export interface SpaceMemberRoleRequest {
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

// 목업 사용 설정 (true로 설정하면 실제 API 호출 없이 목업 데이터 사용)
const USE_MOCK = false;

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

// Space 서비스 함수 정의
export const spaceService = USE_MOCK ? mockSpaceService : {
  // 내 스페이스 목록 조회
  getMySpaces: async (): Promise<Space[]> => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/space`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('스페이스 목록 조회 오류:', error);
      throw error;
    }
  },

  // 특정 스페이스 조회
  getSpaceById: async (id: number): Promise<Space> => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/space/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 조회 오류(ID: ${id}):`, error);
      throw error;
    }
  },

  // 스페이스 생성
  createSpace: async (type: 'PERSONAL' | 'TEAM', request: CreateSpaceRequest): Promise<Space> => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/space?type=${type}`, request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('스페이스 생성 오류:', error);
      throw error;
    }
  },

  // 스페이스 정보 수정
  updateSpace: async (id: number, request: CreateSpaceRequest): Promise<Space> => {
    try {
      const response = await axios.patch(`${apiUrl}/api/v1/space/${id}`, request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 수정 오류(ID: ${id}):`, error);
      throw error;
    }
  },

  // 스페이스 삭제
  deleteSpace: async (id: number): Promise<string> => {
    try {
      const response = await axios.delete(`${apiUrl}/api/v1/space/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 삭제 오류(ID: ${id}):`, error);
      throw error;
    }
  },

  // 스페이스 멤버 목록 조회
  getSpaceMembers: async (spaceId: number): Promise<SpaceMember[]> => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/space/${spaceId}/members`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 멤버 목록 조회 오류(ID: ${spaceId}):`, error);
      throw error;
    }
  },

  // 스페이스 멤버 추가
  addSpaceMembers: async (spaceId: number, members: SpaceMemberRequest[]): Promise<SpaceMember[]> => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/space/${spaceId}/members`, members, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 멤버 추가 오류(ID: ${spaceId}):`, error);
      throw error;
    }
  },

  // 스페이스 멤버 역할 변경
  changeSpaceMemberRole: async (spaceId: number, userId: number, request: SpaceMemberRoleRequest): Promise<string> => {
    try {
      const response = await axios.put(`${apiUrl}/api/v1/space/${spaceId}/members/${userId}`, request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 멤버 역할 변경 오류(스페이스ID: ${spaceId}, 사용자ID: ${userId}):`, error);
      throw error;
    }
  },

  // 스페이스 멤버 삭제
  deleteSpaceMember: async (spaceId: number, userId: number): Promise<string> => {
    try {
      const response = await axios.delete(`${apiUrl}/api/v1/space/${spaceId}/members/${userId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`스페이스 멤버 삭제 오류(스페이스ID: ${spaceId}, 사용자ID: ${userId}):`, error);
      throw error;
    }
  }
};