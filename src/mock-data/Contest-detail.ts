interface ContestDetail {
  id: number;
  title: string;
  createdAt: string;
  timeoutMillis: number;
  submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  participants: Array<{
    id: number;
    username: string | null;
    email: string | null;
    nickname: string;
    submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  }>;
  problems: Array<{
    id: number;
    problem: string;
    techClass: string;
    aiAnswer: string;
    answers: Array<{
      memberId: number;
      nickname: string;
      answer: string;
      rank: number;
      feedback: string;
    }>;
  }>;
}

export const mockContestDetails: { [key: number]: ContestDetail } = {
  1: {
    id: 1,
    title: "2024 상반기 신입 개발자 기술 면접",
    createdAt: "2024-03-15T10:00:00Z",
    timeoutMillis: 600000,
    submit: "EVALUATED",
    participants: [
      {
        id: 1,
        username: "dev1",
        email: "dev1@example.com",
        nickname: "김개발",
        submit: "COMPLETED"
      },
      {
        id: 2,
        username: "dev2",
        email: "dev2@example.com",
        nickname: "이코딩",
        submit: "COMPLETED"
      },
      {
        id: 3,
        username: "dev3",
        email: "dev3@example.com",
        nickname: "박프론트",
        submit: "COMPLETED"
      },
      {
        id: 4,
        username: "dev4",
        email: "dev4@example.com",
        nickname: "최백엔드",
        submit: "COMPLETED"
      }
    ],
    problems: [
      {
        id: 1,
        problem: "JavaScript에서 클로저(Closure)란 무엇이며, 어떤 상황에서 유용하게 사용될 수 있나요?",
        techClass: "JavaScript",
        aiAnswer: "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있는 메커니즘을 제공합니다.\n\n주요 특징:\n1. 데이터 프라이버시: 클로저를 통해 private 변수를 구현할 수 있습니다.\n2. 상태 유지: 함수가 호출될 때마다 이전 상태를 기억할 수 있습니다.\n3. 모듈화: 관련된 데이터와 함수를 하나의 스코프로 캡슐화할 수 있습니다.",
        answers: [
          {
            memberId: 1,
            nickname: "김개발",
            answer: "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있는 메커니즘을 제공합니다. 이를 통해 데이터 프라이버시를 구현하고, 상태를 유지하며, 모듈화를 할 수 있습니다.",
            rank: 85,
            feedback: "정확한 정의와 함께 주요 특징을 잘 설명했습니다. 실제 사용 사례도 언급하여 이해도를 잘 보여주었습니다."
          },
          {
            memberId: 2,
            nickname: "이코딩",
            answer: "클로저는 함수가 선언된 환경의 변수를 기억하는 함수입니다. 이를 통해 private 변수를 만들 수 있고, 함수가 호출될 때마다 이전 상태를 기억할 수 있습니다.",
            rank: 70,
            feedback: "기본적인 개념은 이해했으나, 구체적인 설명이 부족합니다. 실제 사용 사례나 예시 코드가 있으면 더 좋았을 것 같습니다."
          },
          {
            memberId: 3,
            nickname: "박프론트",
            answer: "클로저는 내부 함수가 외부 함수의 변수에 접근할 수 있는 것을 말합니다. 주로 이벤트 핸들러나 콜백 함수에서 많이 사용됩니다.",
            rank: 65,
            feedback: "간단한 설명은 했으나, 클로저의 핵심 개념과 활용 방법에 대한 설명이 부족합니다."
          },
          {
            memberId: 4,
            nickname: "최백엔드",
            answer: "클로저는 함수가 선언된 스코프의 변수를 기억하는 것입니다.",
            rank: 50,
            feedback: "너무 간단한 설명으로, 클로저의 개념과 활용 방법에 대한 이해가 부족해 보입니다."
          }
        ]
      },
      {
        id: 2,
        problem: "React의 Virtual DOM이란 무엇이며, 실제 DOM과 비교했을 때 어떤 장점이 있나요?",
        techClass: "React",
        aiAnswer: "React의 Virtual DOM은 실제 DOM의 가벼운 복사본으로, 변경사항을 효율적으로 처리하기 위한 추상화 계층입니다.\n\n주요 특징:\n1. 성능 최적화: 실제 DOM 조작은 비용이 많이 드므로, Virtual DOM에서 변경사항을 먼저 계산한 후 필요한 부분만 실제 DOM에 반영합니다.\n2. 선언적 UI: 개발자는 UI가 어떻게 보여야 하는지만 선언하고, React가 DOM 조작을 효율적으로 처리합니다.\n3. 일괄 처리: 여러 변경사항을 모아서 한 번에 처리하여 성능을 개선합니다.",
        answers: [
          {
            memberId: 1,
            nickname: "김개발",
            answer: "Virtual DOM은 실제 DOM의 가벼운 복사본으로, 변경사항을 효율적으로 처리하기 위한 추상화 계층입니다. 실제 DOM 조작은 비용이 많이 드므로, Virtual DOM에서 변경사항을 먼저 계산한 후 필요한 부분만 실제 DOM에 반영합니다.",
            rank: 80,
            feedback: "정확한 정의와 함께 주요 특징을 잘 설명했습니다. 성능 최적화 측면에서의 설명이 특히 좋습니다."
          },
          {
            memberId: 2,
            nickname: "이코딩",
            answer: "Virtual DOM은 실제 DOM을 복사해서 사용하는 것입니다. 변경사항이 있을 때 실제 DOM을 직접 수정하는 대신 Virtual DOM을 수정하고, 그 차이점만 실제 DOM에 반영합니다.",
            rank: 75,
            feedback: "기본적인 개념은 이해했으나, Virtual DOM의 구체적인 동작 방식과 장점에 대한 설명이 부족합니다."
          },
          {
            memberId: 3,
            nickname: "박프론트",
            answer: "Virtual DOM은 React에서 성능을 최적화하기 위해 사용하는 기술입니다. 실제 DOM 조작을 최소화하여 렌더링 성능을 향상시킵니다.",
            rank: 70,
            feedback: "핵심 개념은 이해했으나, Virtual DOM의 구체적인 동작 방식과 장점에 대한 설명이 부족합니다."
          },
          {
            memberId: 4,
            nickname: "최백엔드",
            answer: "Virtual DOM은 실제 DOM을 가상으로 만들어서 사용하는 것입니다.",
            rank: 55,
            feedback: "너무 간단한 설명으로, Virtual DOM의 개념과 장점에 대한 이해가 부족해 보입니다."
          }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "백엔드 개발자 실전 면접",
    createdAt: "2024-03-14T15:30:00Z",
    timeoutMillis: 600000,
    submit: "COMPLETED",
    participants: [
      {
        id: 1,
        username: "dev1",
        email: "dev1@example.com",
        nickname: "김개발",
        submit: "COMPLETED"
      },
      {
        id: 3,
        username: "dev3",
        email: "dev3@example.com",
        nickname: "박프론트",
        submit: "IN_PROGRESS"
      }
    ],
    problems: [
      {
        id: 4,
        problem: "데이터베이스에서 인덱스(Index)란 무엇이며, 어떤 장단점이 있나요?",
        techClass: "Database",
        aiAnswer: "인덱스는 데이터베이스에서 데이터 검색 속도를 향상시키기 위한 자료구조입니다.\n\n주요 특징:\n1. 검색 성능 향상: WHERE 절이나 JOIN 조건에 사용되는 컬럼에 인덱스를 생성하면 검색 속도가 빨라집니다.\n2. 정렬 성능 향상: ORDER BY나 GROUP BY에 사용되는 컬럼에 인덱스를 생성하면 정렬 속도가 빨라집니다.\n3. 유니크 제약조건: 유니크 인덱스를 통해 데이터의 중복을 방지할 수 있습니다.",
        answers: [
          {
            memberId: 1,
            nickname: "김개발",
            answer: "인덱스는 데이터베이스에서 데이터 검색 속도를 향상시키기 위한 자료구조입니다. WHERE 절이나 JOIN 조건에 사용되는 컬럼에 인덱스를 생성하면 검색 속도가 빨라지고, ORDER BY나 GROUP BY에 사용되는 컬럼에 인덱스를 생성하면 정렬 속도가 빨라집니다. 다만, 인덱스를 생성하면 추가 저장 공간이 필요하고, 데이터 삽입/수정/삭제 시 성능이 저하될 수 있습니다.",
            rank: 85,
            feedback: "정확한 정의와 함께 장단점을 잘 설명했습니다. 실무적인 관점에서의 설명이 특히 좋습니다."
          },
          {
            memberId: 3,
            nickname: "박프론트",
            answer: "인덱스는 데이터베이스에서 데이터를 빠르게 찾기 위한 자료구조입니다. B-tree나 해시 테이블을 사용하여 구현되며, 검색 속도를 향상시킬 수 있습니다.",
            rank: 65,
            feedback: "기본적인 개념은 이해했으나, 인덱스의 구체적인 장단점과 사용 시 고려사항에 대한 설명이 부족합니다."
          }
        ]
      }
    ]
  }
};
