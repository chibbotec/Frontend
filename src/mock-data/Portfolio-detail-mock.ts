interface Author {
  id: number;
  nickname: string;
}

interface Duration {
  startDate: string;
  endDate: string;
}

interface Architecture {
  communication: string;
  deployment: string;
}

interface Contents {
  techStack: string;
  summary: string;
  description: string;
  features: Record<string, string[]>;
  architecture: Architecture;
  roles?: string[];
}

interface GithubRepo {
  name: string;
  url?: string;
  description: string;
  language: string;
  lineCount: number;
  byteSize: number | null;
  selectedDirectories: string[];
}

interface PortfolioDetail {
  id: string;
  spaceId: number;
  title: string;
  author: Author;
  duration: Duration;
  contents: Contents;
  thumbnailUrl: string | null;
  publicAccess: boolean;
  createdAt: string;
  updatedAt: string;
  githubLink?: string;
  deployLink?: string;
  memberCount?: number;
  memberRoles?: string;
  githubRepos?: GithubRepo[];
}

interface MockPortfolioDetails {
  [key: string]: PortfolioDetail;
}

export const mockPortfolioDetails: MockPortfolioDetails = {
  // 웹 포트폴리오 프로젝트 상세
  '1': {
    id: '1',
    spaceId: 1,
    title: 'Sample 포트폴리오 프로젝트',
    author: {
      id: 1,
      nickname: '홍길동'
    },
    duration: {
      startDate: '2024-01-01',
      endDate: '2024-03-01'
    },
    contents: {
      techStack: 'React, TypeScript, Tailwind CSS',
      summary: '개인 포트폴리오 웹사이트 개발 프로젝트',
      description: 'React와 TypeScript를 사용하여 반응형 포트폴리오 웹사이트를 개발했습니다. 모던 웹 개발 트렌드를 반영한 디자인과 사용자 경험을 제공합니다.',
      features: {
        '반응형 디자인': [
          '모바일, 태블릿, 데스크톱 등 다양한 디바이스 지원',
          'Tailwind CSS를 활용한 유연한 레이아웃 구현',
          '미디어 쿼리를 통한 최적화된 화면 구성'
        ],
        '포트폴리오 관리': [
          'CRUD 기능을 통한 포트폴리오 관리',
          '이미지 업로드 및 관리 기능',
          '마크다운 에디터를 통한 콘텐츠 작성'
        ],
        '사용자 경험': [
          '다크 모드 지원',
          '애니메이션 효과를 통한 인터랙티브한 UI',
          '로딩 상태 및 에러 처리'
        ]
      },
      architecture: {
        communication: 'REST API를 통한 서버 통신\nJWT 기반 인증 처리\nAxios를 활용한 HTTP 클라이언트 구현',
        deployment: 'Vercel을 통한 자동 배포\nGitHub Actions를 활용한 CI/CD 파이프라인\n환경 변수를 통한 설정 관리'
      },
      roles: [
        '프론트엔드 개발 및 UI/UX 디자인',
        '반응형 웹 디자인 구현',
        '성능 최적화 및 코드 품질 관리'
      ]
    },
    thumbnailUrl: null,
    publicAccess: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    githubLink: 'https://github.com/example/portfolio',
    deployLink: 'https://portfolio-example.vercel.app',
    memberCount: 1,
    memberRoles: '프론트엔드 개발자',
    githubRepos: [
      {
        name: 'portfolio-frontend',
        // url: 'https://github.com/example/portfolio',
        description: '포트폴리오 웹사이트 프론트엔드',
        language: 'TypeScript',
        lineCount: 5000,
        byteSize: 1024000,
        selectedDirectories: ['src/components', 'src/pages']
      }
    ]
  },

  // 쇼핑몰 프로젝트 상세
  '2': {
    id: '2',
    spaceId: 1,
    title: 'Sample 프로젝트',
    author: {
      id: 1,
      nickname: '홍길동'
    },
    duration: {
      startDate: '2024-02-01',
      endDate: '2024-04-01'
    },
    contents: {
      techStack: 'Next.js, TypeScript, Prisma, PostgreSQL',
      summary: '온라인 쇼핑몰 플랫폼 개발',
      description: 'Next.js와 Prisma를 활용한 풀스택 쇼핑몰 프로젝트를 진행했습니다. 실시간 재고 관리와 결제 시스템을 구현했습니다.',
      features: {
        '상품 관리': [
          '상품 등록 및 수정 기능',
          '카테고리별 상품 분류',
          '재고 관리 시스템'
        ],
        '결제 시스템': [
          'PG사 연동 결제 처리',
          '주문 내역 관리',
          '결제 상태 추적'
        ],
        '사용자 기능': [
          '회원가입 및 로그인',
          '장바구니 기능',
          '주문 내역 조회'
        ]
      },
      architecture: {
        communication: 'Next.js API Routes를 통한 서버 통신\nPrisma를 활용한 데이터베이스 연동\nRedis를 통한 캐싱 구현',
        deployment: 'AWS ECS를 통한 컨테이너 배포\nDocker를 활용한 환경 구성\nGitHub Actions를 통한 자동화된 배포'
      },
      roles: [
        '풀스택 개발 및 시스템 설계',
        '데이터베이스 스키마 설계',
        '결제 시스템 연동 및 구현'
      ]
    },
    thumbnailUrl: null,
    publicAccess: false,
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
    githubLink: 'https://github.com/example/shopping-mall',
    deployLink: 'https://shopping-mall-example.com',
    memberCount: 3,
    memberRoles: '백엔드 개발자',
    githubRepos: [
      {
        name: 'shopping-mall-backend',
        // url: 'https://github.com/example/shopping-mall-backend',
        description: '쇼핑몰 백엔드 API',
        language: 'TypeScript',
        lineCount: 8000,
        byteSize: 2048000,
        selectedDirectories: ['src/api', 'src/services']
      },
      {
        name: 'shopping-mall-frontend',
        // url: 'https://github.com/example/shopping-mall-frontend',
        description: '쇼핑몰 프론트엔드',
        language: 'TypeScript',
        lineCount: 6000,
        byteSize: 1536000,
        selectedDirectories: ['src/components', 'src/pages']
      }
    ]
  }
};
