import { Question } from '@/types/study';

export const mockStudyDetails: { [key: number]: Question } = {
  1: {
    id: 1,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "JavaScript",
    aiAnswer: "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있는 메커니즘을 제공합니다.\n\n주요 특징:\n1. 데이터 프라이버시: 클로저를 통해 private 변수를 구현할 수 있습니다.\n2. 상태 유지: 함수가 호출될 때마다 이전 상태를 기억할 수 있습니다.\n3. 모듈화: 관련된 데이터와 함수를 하나의 스코프로 캡슐화할 수 있습니다.\n\n사용 예시:\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment() { count++; return count; },\n    decrement() { count--; return count; },\n    getCount() { return count; }\n  };\n}\n```",
    keyPoints: "렉시컬 스코프, 스코프 체인, 가비지 컬렉션, 메모리 관리",
    additionalTopics: "메모리 누수 방지, 성능 최적화, 모듈 패턴",
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
  2: {
    id: 2,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "React",
    aiAnswer: "React의 Virtual DOM은 실제 DOM의 가벼운 복사본으로, 변경사항을 효율적으로 처리하기 위한 추상화 계층입니다.\n\n주요 특징:\n1. 성능 최적화: 실제 DOM 조작은 비용이 많이 드므로, Virtual DOM에서 변경사항을 먼저 계산한 후 필요한 부분만 실제 DOM에 반영합니다.\n2. 선언적 UI: 개발자는 UI가 어떻게 보여야 하는지만 선언하고, React가 DOM 조작을 효율적으로 처리합니다.\n3. 일괄 처리: 여러 변경사항을 모아서 한 번에 처리하여 성능을 개선합니다.\n\n작동 방식:\n1. 상태 변경 시 새로운 Virtual DOM 트리 생성\n2. 이전 Virtual DOM과 비교(diffing)\n3. 변경된 부분만 실제 DOM에 반영(reconciliation)",
    keyPoints: "DOM 조작 최적화, 렌더링 성능, 메모리 사용, Reconciliation",
    additionalTopics: "React 18의 새로운 렌더링 메커니즘, Concurrent Mode, Suspense",
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
  3: {
    id: 3,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "TypeScript",
    aiAnswer: "TypeScript의 제네릭은 타입을 파라미터화하여 재사용 가능한 컴포넌트를 만들 수 있게 해주는 기능입니다.\n\n주요 특징:\n1. 타입 안정성: 컴파일 시점에 타입 체크를 수행하여 런타임 에러를 방지합니다.\n2. 코드 재사용성: 다양한 타입에 대해 동일한 로직을 재사용할 수 있습니다.\n3. 타입 추론: 컴파일러가 타입을 자동으로 추론하여 개발 편의성을 제공합니다.\n\n사용 예시:\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\n// 사용\nlet output = identity<string>('hello');\nlet output2 = identity<number>(42);\n```",
    keyPoints: "타입 안정성, 코드 재사용성, 타입 추론, 제네릭 제약조건",
    additionalTopics: "제네릭 클래스, 제네릭 인터페이스, 조건부 타입, 매핑 타입",
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
  4: {
    id: 4,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "Database",
    aiAnswer: "인덱스는 데이터베이스에서 데이터 검색 속도를 향상시키기 위한 자료구조입니다.\n\n주요 특징:\n1. 검색 성능 향상: WHERE 절이나 JOIN 조건에 사용되는 컬럼에 인덱스를 생성하면 검색 속도가 빨라집니다.\n2. 정렬 성능 향상: ORDER BY나 GROUP BY에 사용되는 컬럼에 인덱스를 생성하면 정렬 속도가 빨라집니다.\n3. 유니크 제약조건: 유니크 인덱스를 통해 데이터의 중복을 방지할 수 있습니다.\n\n장단점:\n장점:\n- 검색 성능 향상\n- 정렬 성능 향상\n- 유니크 제약조건 지원\n\n단점:\n- 추가 저장 공간 필요\n- INSERT/UPDATE/DELETE 성능 저하\n- 인덱스 관리 오버헤드",
    keyPoints: "B-tree, 해시 인덱스, 클러스터드 인덱스, 복합 인덱스",
    additionalTopics: "인덱스 최적화, 인덱스 선택 전략, 실행 계획 분석",
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
  5: {
    id: 5,
    spaceId: 1,
    techInterviewId: 1,
    techClass: "Network",
    aiAnswer: "HTTP/2는 웹의 성능을 개선하기 위해 설계된 프로토콜로, HTTP/1.1의 한계를 극복하기 위해 개발되었습니다.\n\n주요 특징:\n1. 멀티플렉싱: 하나의 TCP 연결에서 여러 요청과 응답을 동시에 처리할 수 있습니다.\n2. 헤더 압축: HPACK을 사용하여 HTTP 헤더를 압축하여 전송 데이터를 줄입니다.\n3. 서버 푸시: 서버가 클라이언트의 요청을 기다리지 않고 필요한 리소스를 미리 전송할 수 있습니다.\n4. 스트림 우선순위: 중요한 리소스에 우선순위를 부여하여 먼저 전송할 수 있습니다.\n\nHTTP/1.1과의 비교:\n1. 연결 수: HTTP/1.1은 여러 TCP 연결이 필요하지만, HTTP/2는 하나의 연결로 처리\n2. 헤더 크기: HTTP/2는 헤더 압축으로 전송 데이터 감소\n3. 응답 순서: HTTP/1.1은 요청 순서대로 응답하지만, HTTP/2는 우선순위 기반 응답",
    keyPoints: "멀티플렉싱, 헤더 압축, 서버 푸시, 스트림 우선순위",
    additionalTopics: "HTTP/3와의 비교, QUIC 프로토콜, TLS 1.3",
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
  },
  6: {
    id: 6,
    spaceId: 70,
    techInterviewId: 12,
    techClass: "Spring",
    aiAnswer: "@Controller와 @RestController의 주요 차이점은 다음과 같습니다:\n\n1. 응답 처리 방식:\n- @Controller: 주로 View를 반환하며, @ResponseBody 어노테이션을 추가해야 JSON/XML 등의 데이터를 반환할 수 있습니다.\n- @RestController: @Controller + @ResponseBody가 결합된 형태로, 모든 메서드가 자동으로 @ResponseBody가 적용되어 데이터를 반환합니다.\n\n2. 사용 목적:\n- @Controller: 전통적인 웹 애플리케이션에서 View를 반환하는 경우 사용\n- @RestController: RESTful 웹 서비스를 구현할 때 사용\n\n3. 응답 형식:\n- @Controller: HTML, JSP, Thymeleaf 등의 View 템플릿을 반환\n- @RestController: JSON, XML 등의 데이터 형식을 반환\n\n예시 코드:\n```java\n// @Controller 사용\n@Controller\npublic class UserController {\n    @GetMapping(\"/user\")\n    @ResponseBody\n    public User getUser() {\n        return new User();\n    }\n}\n\n// @RestController 사용\n@RestController\npublic class UserRestController {\n    @GetMapping(\"/user\")\n    public User getUser() {\n        return new User();\n    }\n}\n```",
    keyPoints: "View 반환, 데이터 반환, @ResponseBody, RESTful API",
    additionalTopics: "Spring MVC, REST API 설계, 응답 형식 변환",
    questionText: "@Controller 와 @RestController 의 차이점을 설명해주세요.",
    author: {
      id: 17,
      nickname: "kknaks"
    },
    participants: [
      { id: 17, nickname: "kknaks" }
    ],
    answers: [],
    createdAt: "2025-06-01T00:13:23.537086",
    updatedAt: "2025-06-01T00:13:23.537086"
  }
};
