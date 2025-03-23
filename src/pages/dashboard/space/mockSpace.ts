// src/mocks/mockSpace.ts
import { Space, SpaceMember, CreateSpaceRequest } from '@/pages/dashboard/space/Space';

// 고정된 스페이스 ID 사용 (ID: 1)
export const MOCK_SPACE_ID = 1;

// 간단한 목업 스페이스 데이터
export const mockSpace: Space = {
  id: MOCK_SPACE_ID,
  spaceName: "개발팀 워크스페이스",
  spaceOwner: "개발자",
  type: "TEAM",
  members: [
    { id: 1, nickname: "개발자" },
    { id: 2, nickname: "디자이너" },
    { id: 3, nickname: "기획자" }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 간단한 목업 스페이스 서비스 함수
export const mockSpaceService = {
  // 항상 mockSpace를 반환하는 getMySpaces
  getMySpaces: async (): Promise<Space[]> => {
    return [mockSpace];
  },

  // ID와 상관없이 항상 mockSpace를 반환
  getSpaceById: async (id: number): Promise<Space> => {
    return mockSpace;
  },

  // 나머지 필요한 함수들 (최소한으로 구현)
  createSpace: async (type: 'PERSONAL' | 'TEAM', request: CreateSpaceRequest): Promise<Space> => {
    return mockSpace;
  },

  addSpaceMembers: async (spaceId: number, members: any[]): Promise<SpaceMember[]> => {
    return mockSpace.members;
  }
};