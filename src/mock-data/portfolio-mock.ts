export interface Portfolio {
  id: string;
  spaceId: number;
  title: string;
  author: {
    id: number;
    nickname: string;
  };
  duration: {
    startDate: string;
    endDate: string;
  };
  githubLink: string;
  deployLink: string;
  memberCount: number;
  memberRoles: string[] | null;
  contents: {
    techStack: string;
    summary: string;
    description: string;
    roles: string[];
    features: {
      [key: string]: string[];
    };
    architecture: {
      communication: string;
      deployment: string;
    };
  };
}

export const mockPortfolios: Portfolio[] = [
  {
    id: "1",
    spaceId: 1,
    title: "쇼핑몰 통합 관리 시스템",
    author: {
      id: 1,
      nickname: "김개발"
    },
    duration: {
      startDate: "2024-01-01",
      endDate: "2024-03-15"
    },
    githubLink: "https://github.com/example/shopping-mall",
    deployLink: "https://shopping-mall.example.com",
    memberCount: 4,
    memberRoles: ["프론트엔드", "백엔드", "UI/UX", "PM"],
    contents: {
      techStack: "React, TypeScript, Node.js, MongoDB",
      summary: "다중 쇼핑몰을 통합 관리할 수 있는 웹 기반 시스템",
      description: "여러 쇼핑몰의 재고, 주문, 회원 정보를 한 곳에서 관리할 수 있는 통합 관리 시스템을 개발했습니다.",
      roles: ["프론트엔드 개발", "API 설계", "데이터베이스 설계"],
      features: {
        "재고 관리": ["실시간 재고 현황", "자동 발주 시스템", "재고 알림"],
        "주문 관리": ["주문 상태 추적", "배송 관리", "반품/교환 처리"],
        "회원 관리": ["회원 등급 시스템", "포인트 관리", "구매 이력 조회"]
      },
      architecture: {
        communication: "REST API",
        deployment: "AWS EC2, S3"
      }
    }
  },
  {
    id: "2",
    spaceId: 1,
    title: "AI 기반 채팅 상담 시스템",
    author: {
      id: 1,
      nickname: "김개발"
    },
    duration: {
      startDate: "2023-09-01",
      endDate: "2023-12-31"
    },
    githubLink: "https://github.com/example/ai-chat",
    deployLink: "https://ai-chat.example.com",
    memberCount: 3,
    memberRoles: ["프론트엔드", "백엔드", "AI 엔지니어"],
    contents: {
      techStack: "Vue.js, Python, TensorFlow, PostgreSQL",
      summary: "자연어 처리 기반의 AI 채팅 상담 시스템",
      description: "고객 문의를 자동으로 처리하고 응답하는 AI 기반 채팅 상담 시스템을 개발했습니다.",
      roles: ["프론트엔드 개발", "AI 모델 통합", "데이터 전처리"],
      features: {
        "자연어 처리": ["의도 분류", "엔티티 추출", "감정 분석"],
        "대화 관리": ["대화 이력 저장", "맥락 유지", "자동 응답"],
        "관리자 기능": ["응답 템플릿 관리", "성능 모니터링", "데이터 분석"]
      },
      architecture: {
        communication: "WebSocket",
        deployment: "Docker, Kubernetes"
      }
    }
  },
  {
    id: "3",
    spaceId: 1,
    title: "실시간 공동 문서 편집기",
    author: {
      id: 1,
      nickname: "김개발"
    },
    duration: {
      startDate: "2023-06-01",
      endDate: "2023-08-31"
    },
    githubLink: "https://github.com/example/collaborative-editor",
    deployLink: "https://editor.example.com",
    memberCount: 2,
    memberRoles: ["프론트엔드", "백엔드"],
    contents: {
      techStack: "React, TypeScript, Node.js, Redis",
      summary: "여러 사용자가 동시에 편집할 수 있는 실시간 문서 편집기",
      description: "구글 독스와 유사한 실시간 공동 문서 편집 시스템을 개발했습니다.",
      roles: ["프론트엔드 개발", "실시간 동기화 구현", "충돌 해결 로직"],
      features: {
        "실시간 편집": ["동시 편집", "변경 사항 실시간 반영", "커서 위치 공유"],
        "문서 관리": ["버전 관리", "변경 이력", "문서 공유"],
        "협업 기능": ["댓글", "알림", "권한 관리"]
      },
      architecture: {
        communication: "WebSocket, Operational Transformation",
        deployment: "AWS Lambda, DynamoDB"
      }
    }
  },
  {
    id: "4",
    spaceId: 1,
    title: "모바일 헬스케어 앱",
    author: {
      id: 1,
      nickname: "김개발"
    },
    duration: {
      startDate: "2023-03-01",
      endDate: "2023-05-31"
    },
    githubLink: "https://github.com/example/healthcare-app",
    deployLink: "https://healthcare.example.com",
    memberCount: 5,
    memberRoles: ["프론트엔드", "백엔드", "모바일 개발", "UI/UX", "PM"],
    contents: {
      techStack: "React Native, Node.js, MongoDB, Firebase",
      summary: "건강 데이터를 추적하고 관리하는 모바일 헬스케어 앱",
      description: "사용자의 건강 데이터를 수집하고 분석하여 건강 관리에 도움을 주는 모바일 앱을 개발했습니다.",
      roles: ["프론트엔드 개발", "API 설계", "데이터 시각화"],
      features: {
        "건강 데이터": ["운동 기록", "식단 관리", "수면 패턴"],
        "분석 기능": ["데이터 시각화", "건강 리포트", "목표 설정"],
        "소셜 기능": ["친구 추가", "도전 과제", "랭킹 시스템"]
      },
      architecture: {
        communication: "REST API, Firebase Realtime Database",
        deployment: "AWS Amplify, App Store, Play Store"
      }
    }
  }
];
