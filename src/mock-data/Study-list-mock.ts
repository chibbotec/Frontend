import { Question } from '@/types/study';

export const mockQuestions: Question[] = [
  {
    id: 1,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "JavaScript",
    aiAnswer: "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있는 메커니즘을 제공합니다.",
    keyPoints: "렉시컬 스코프, 스코프 체인, 가비지 컬렉션",
    additionalTopics: "메모리 관리, 성능 최적화",
    questionText: "JavaScript에서 클로저(Closure)란 무엇이며, 어떤 상황에서 유용하게 사용될 수 있나요?",
    author: {
      id: 1,
      nickname: "김개발"
    },
    participants: [
      { id: 1, nickname: "김개발" },
      { id: 2, nickname: "이코딩" }
    ],
    answers: [],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "React",
    aiAnswer: "React의 Virtual DOM은 실제 DOM의 가벼운 복사본으로, 변경사항을 효율적으로 처리하기 위한 추상화 계층입니다.",
    keyPoints: "DOM 조작 최적화, 렌더링 성능, 메모리 사용",
    additionalTopics: "React 18의 새로운 렌더링 메커니즘",
    questionText: "React의 Virtual DOM이란 무엇이며, 실제 DOM과 비교했을 때 어떤 장점이 있나요?",
    author: {
      id: 2,
      nickname: "이코딩"
    },
    participants: [
      { id: 1, nickname: "김개발" },
      { id: 2, nickname: "이코딩" },
      { id: 3, nickname: "박프론트" }
    ],
    answers: [],
    createdAt: "2024-03-14T15:30:00Z",
    updatedAt: "2024-03-14T15:30:00Z"
  },
  {
    id: 3,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "TypeScript",
    aiAnswer: "TypeScript의 제네릭은 타입을 파라미터화하여 재사용 가능한 컴포넌트를 만들 수 있게 해주는 기능입니다.",
    keyPoints: "타입 안정성, 코드 재사용성, 타입 추론",
    additionalTopics: "제네릭 제약조건, 조건부 타입",
    questionText: "TypeScript에서 제네릭(Generic)이란 무엇이며, 어떤 상황에서 사용하면 좋을까요?",
    author: {
      id: 3,
      nickname: "박프론트"
    },
    participants: [
      { id: 1, nickname: "김개발" },
      { id: 3, nickname: "박프론트" }
    ],
    answers: [],
    createdAt: "2024-03-13T09:15:00Z",
    updatedAt: "2024-03-13T09:15:00Z"
  },
  {
    id: 4,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "Database",
    aiAnswer: "인덱스는 데이터베이스에서 데이터 검색 속도를 향상시키기 위한 자료구조입니다.",
    keyPoints: "B-tree, 해시 인덱스, 클러스터드 인덱스",
    additionalTopics: "인덱스 최적화, 인덱스 선택 전략",
    questionText: "데이터베이스에서 인덱스(Index)란 무엇이며, 어떤 장단점이 있나요?",
    author: {
      id: 1,
      nickname: "김개발"
    },
    participants: [
      { id: 1, nickname: "김개발" },
      { id: 2, nickname: "이코딩" },
      { id: 3, nickname: "박프론트" },
      { id: 4, nickname: "최백엔드" }
    ],
    answers: [],
    createdAt: "2024-03-12T14:20:00Z",
    updatedAt: "2024-03-12T14:20:00Z"
  },
  {
    id: 5,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "Network",
    aiAnswer: "HTTP/2는 웹의 성능을 개선하기 위해 설계된 프로토콜로, 멀티플렉싱, 헤더 압축, 서버 푸시 등의 기능을 제공합니다.",
    keyPoints: "멀티플렉싱, 헤더 압축, 서버 푸시, 스트림 우선순위",
    additionalTopics: "HTTP/3와의 비교, QUIC 프로토콜",
    questionText: "HTTP/2의 주요 특징과 HTTP/1.1과 비교했을 때 어떤 장점이 있나요?",
    author: {
      id: 4,
      nickname: "최백엔드"
    },
    participants: [
      { id: 2, nickname: "이코딩" },
      { id: 4, nickname: "최백엔드" }
    ],
    answers: [],
    createdAt: "2024-03-11T11:45:00Z",
    updatedAt: "2024-03-11T11:45:00Z"
  }
];
