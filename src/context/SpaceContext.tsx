import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { spaceService, type Space, type SpaceMember } from '@/pages/dashboard/space/Space';
import { useAuth } from './AuthContext';

// 스페이스 컨텍스트 타입 정의
interface SpaceContextType {
  spaces: Space[];
  currentSpace: Space | null;
  isLoading: boolean;
  error: boolean;
  fetchSpaces: () => Promise<void>;
  switchSpace: (space: Space) => void;
  addSpace: (space: Space) => void;
  addMembers: (members: SpaceMember[]) => void;
}

// 스페이스 컨텍스트 생성
const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

// 스페이스 컨텍스트 프로바이더
export function SpaceProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 스페이스 목록 조회
  const fetchSpaces = useCallback(async () => {
    console.log('===== fetchSpaces 함수 호출 시작 =====');
    setIsLoading(true);
    setError(false);
    try {
      // 로그인 페이지에서는 스페이스 조회를 건너뜁니다
      if (location.pathname === '/login') {
        console.log('로그인 페이지에서는 스페이스 조회를 건너뜁니다');
        setIsLoading(false);
        return;
      }

      // 게스트 모드일 경우 기본 스페이스 생성
      if (isGuest) {
        console.log('게스트 모드: 게스트 스페이스 생성');
        const guestSpace: Space = {
          id: -1,  // 게스트 스페이스는 음수 ID 사용
          spaceName: 'Guest Space',
          spaceOwner: 'Guest',
          type: 'PERSONAL',
          members: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSpaces([guestSpace]);
        setCurrentSpace(guestSpace);
        setIsLoading(false);
        return;
      }

      // 로그인된 사용자의 경우 API로 스페이스 목록 조회
      console.log('spaceService.getMySpaces 호출 전');
      const result = await spaceService.getMySpaces();
      console.log('스페이스 목록 조회 결과:', result);
      setSpaces(result);

      if (result.length > 0) {
        console.log('스페이스 목록이 존재함. 길이:', result.length);
        // URL에서 현재 스페이스 ID 가져오기
        const pathParts = location.pathname.split('/');
        const spaceIdFromUrl = pathParts[pathParts.indexOf('space') + 1];

        // URL에 있는 스페이스 ID로 스페이스 찾기
        if (spaceIdFromUrl) {
          const spaceFromUrl = result.find(space => space.id.toString() === spaceIdFromUrl);
          if (spaceFromUrl) {
            setCurrentSpace(spaceFromUrl);
            return;
          }
        }
        // URL에 스페이스 ID가 없거나 유효하지 않으면 첫 번째 스페이스 선택
        setCurrentSpace(result[0]);
        navigate(`/space/${result[0].id}`);
      } else {
        console.log('스페이스 목록이 비어 있음');
        setCurrentSpace(null);
      }
    } catch (err) {
      console.error("스페이스 목록 조회 실패:", err);
      setError(true);
      // 에러 발생 시 게스트 모드로 전환
      if (isGuest) {
        const guestSpace: Space = {
          id: -1,
          spaceName: 'Guest Space',
          spaceOwner: 'Guest',
          type: 'PERSONAL',
          members: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSpaces([guestSpace]);
        setCurrentSpace(guestSpace);
      }
    } finally {
      setIsLoading(false);
      console.log('===== fetchSpaces 함수 호출 완료 =====');
    }
  }, [isGuest, navigate]);

  // 스페이스 변경 함수
  const switchSpace = useCallback((space: Space) => {
    console.log('switchSpace 호출. 선택된 스페이스:', space);
    setCurrentSpace(space);
    console.log(`/space/${space.id}로 이동합니다.`);
    navigate(`/space/${space.id}`);
  }, [navigate]);

  // 새 스페이스 추가 함수
  const addSpace = useCallback((space: Space) => {
    console.log('addSpace 호출. 추가할 스페이스:', space);
    setSpaces(prev => [...prev, space]);
    switchSpace(space);
  }, [switchSpace]);

  // 스페이스 멤버 추가 함수
  const addMembers = useCallback((members: SpaceMember[]) => {
    console.log('addMembers 호출. 추가할 멤버들:', members);
    if (!currentSpace) {
      console.log('현재 스페이스가 없어 멤버를 추가할 수 없습니다.');
      return;
    }

    console.log('현재 스페이스에 멤버 추가:', currentSpace.id);
    setCurrentSpace({
      ...currentSpace,
      members: [...currentSpace.members, ...members]
    });

    setSpaces(prev => prev.map(space =>
      space.id === currentSpace.id
        ? {
          ...space,
          members: [...space.members, ...members]
        }
        : space
    ));
  }, [currentSpace]);

  // 컴포넌트 마운트 시 스페이스 목록 조회
  useEffect(() => {
    console.log('SpaceProvider 마운트. fetchSpaces 호출');
    fetchSpaces();

    // 컴포넌트 언마운트 시 로그
    return () => {
      console.log('SpaceProvider 언마운트');
    };
  }, [fetchSpaces]);

  // 현재 상태 로깅
  useEffect(() => {
    console.log('현재 스페이스 상태:', {
      spaces: spaces.length > 0 ? `${spaces.length}개의 스페이스` : '없음',
      currentSpace: currentSpace ? `ID: ${currentSpace.id}, 이름: ${currentSpace.spaceName}` : '없음',
      isLoading,
      error
    });
  }, [spaces, currentSpace, isLoading, error]);

  const value = {
    spaces,
    currentSpace,
    isLoading,
    error,
    fetchSpaces,
    switchSpace,
    addSpace,
    addMembers
  };

  return (
    <SpaceContext.Provider value={value}>
      {children}
    </SpaceContext.Provider>
  );
}

// 스페이스 컨텍스트 훅
export function useSpace() {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
}