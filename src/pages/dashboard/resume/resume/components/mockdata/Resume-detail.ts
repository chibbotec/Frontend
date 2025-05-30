interface Author {
  id: number;
  nickname: string;
}

interface Link {
  type: string;
  url: string;
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  role: string[];
  startDate: string;
  endDate: string;
  memberCount: number;
  memberRoles: string;
  githubLink: string;
  deployLink: string;
}

interface Education {
  school: string;
  major: string;
  startDate: string;
  endDate: string;
  degree: string;
  note: string | null;
}

interface Certificate {
  type: string;
  name: string;
  date: string;
  organization: string;
}

interface CoverLetter {
  title: string;
  content: string;
}

interface ResumeDetail {
  id: string;
  spaceId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  careerType: string;
  position: string;
  techStack: string[];
  techSummary: string;
  links: Link[];
  careers: any[];
  projects: Project[];
  educations: Education[];
  certificates: Certificate[];
  coverLetters: CoverLetter[];
}

export const resumeDetail: ResumeDetail = {
  id: "68391f07bba1864e4e89320c",
  spaceId: 70,
  author: {
    id: 17,
    nickname: "kknaks"
  },
  createdAt: "2025-05-30T11:59:19.611",
  updatedAt: "2025-05-30T11:59:19.611",
  title: "AI 생성 이력서",
  name: "이건학",
  email: "dh221009@naver.com",
  phone: "01055113764",
  careerType: "신입",
  position: "서버 개발자(3년이하)",
  techStack: [
    "Java",
    "Spring Boot",
    "JPA",
    "MySQL",
    "Redis",
    "Elasticsearch",
    "Kafka",
    "Spring MVC",
    "Spring Webflux",
    "Spring Batch",
    "Spring Cloud Gateway",
    "Spring Cloud Config",
    "Netty",
    "Oracle",
    "Docker",
    "Gradle",
    "OAuth2",
    "PostgreSQL",
    "PostGIS",
    "AWS S3",
    "Terraform",
    "Python"
  ],
  techSummary: "대용량 트래픽 환경에서의 확장성과 안정성을 고려한 시스템 설계 및 구현 경험 (Elasticsearch, Redis, Kafka, Docker 등 활용)\nSpring Boot, JPA, MySQL을 기반으로 한 REST API 및 서버 구조 설계, 데이터 교환 효율화\nElasticsearch, Redis 등 오픈소스 기반 성능 최적화 및 검색/캐싱 시스템 구축 경험\nKafka 기반 비동기 메시징 시스템 구축 및 실시간 알림/이벤트 처리 경험\nN+1 문제 해결, 부하/성능 테스트(K6) 등 성능 개선 및 레거시 코드 리팩토링 경험\nOAuth2, JWT 등 인증/보안 시스템 설계 및 구현 경험\nTerraform을 활용한 인프라 코드화(IaC) 및 클라우드(AWS, NCP) 환경 배포 자동화 경험\nPython, FastAPI 등 다양한 언어와 프레임워크를 활용한 데이터 수집 및 이미지 처리 자동화 경험\nPostgreSQL, PostGIS 등 다양한 DB 및 위치 기반 서비스 구현 경험\nWebSocket, SSE 등 실시간 데이터 처리 및 알림 시스템 구현 경험",
  links: [
    {
      type: "github",
      url: ""
    },
    {
      type: "notion",
      url: ""
    },
    {
      type: "blog",
      url: ""
    }
  ],
  careers: [],
  projects: [
    {
      name: "StockNote",
      description: "주식 투자 및 커뮤니티 플랫폼으로, 사용자 맞춤 포트폴리오 관리, 실시간 주식 시세, 게시글 및 댓글, 투표, 알림 기능을 제공하는 통합 시스템입니다. 다양한 기술을 활용하여 안정적이고 확장 가능한 구조를 구현하였으며, 사용자 경험 향상과 데이터 분석을 위한 검색 및 캐싱 시스템도 포함되어 있습니다.",
      techStack: [
        "Spring Boot",
        "JPA",
        "MySQL",
        "Redis",
        "Elasticsearch",
        "OAuth2",
        "Docker",
        "Terraform",
        "EC2",
        "NCP",
        "Python"
      ],
      role: [
        "Elasticsearch를 사용해서 게시글 검색 기능 구현하여 응답시간 99.61% 개선(12s → 47ms), 처리량 1,325.66% 개선(4.17건/s → 59.45건/s)",
        "Spring Boot와 JPA를 사용해서 서버 구조 설계 및 API 개발하여 데이터 교환 효율성 향상",
        "Redis를 사용해서 캐시 관리 및 성능 최적화하여 데이터 조회 속도 향상",
        "K6 테스트 도구를 사용해서 부하/성능 테스트 수행 후 N+1 개선하여 포트폴리오 목록조회 응답시간 62.7% 감소(75ms → 28ms)",
        "Terraform을 사용해서 인프라 코드화(IaC)로 AWS, NCP 리소스 배포 시간 단축",
        "Python 스크립트를 사용해서 MySQL 연동 자동화하여 주식 데이터 수집 및 업데이트 프로세스 자동화"
      ],
      startDate: "2022-03-01",
      endDate: "2022-12-31",
      memberCount: 5,
      memberRoles: "Backend",
      githubLink: "https://github.com/kknaks/StockNote_BE",
      deployLink: ""
    },
    {
      name: "여기잇개",
      description: "이 프로젝트는 동물 보호센터와 유기견 발견 게시글 간의 유사 이미지 매칭 시스템을 구축하여, 사용자 간 신뢰성 높은 정보 공유와 빠른 유기견 찾기를 지원하는 플랫폼입니다. REST API, Kafka, AWS S3, 클라이언트-서버 통신, 얼굴 인식 및 임베딩 기술을 활용하여 이미지 분석과 실시간 알림 기능을 통합하였으며, 효율적이고 확장 가능한 시스템 아키텍처를 설계하였습니다.",
      techStack: [
        "Spring Boot",
        "JPA",
        "Kafka",
        "PostgreSQL",
        "PostGIS",
        "AWS S3",
        "Docker",
        "OpenCV",
        "dlib",
        "PyTorch",
        "CLIP (OpenAI)",
        "FastAPI"
      ],
      role: [
        "Kafka를 사용해서 비동기 메시징 시스템 구축하여 실시간 알림 및 이벤트 처리 성능 향상",
        "Spring Boot와 JPA를 사용해서 REST API 서버 구현하여 클라이언트 요청 처리 및 데이터 저장 성능 향상",
        "PostgreSQL과 PostGIS를 사용해서 지리정보 기반 거리 검색 기능 구현하여 위치 기반 서비스 제공",
        "OpenCV와 dlib를 사용해서 강아지 얼굴 검출 및 임베딩 추출 기능 구현하여 얼굴 인식 정확도 향상",
        "CLIP 모델을 사용해서 이미지 특징 벡터 추출 및 유사도 계산 구현하여 이미지 매칭 정밀도 확보",
        "FastAPI와 OpenCV를 사용해서 강아지 얼굴 검출 API 개발하여 이미지 처리 속도 1.5배 향상"
      ],
      startDate: "2023-01-01",
      endDate: "2023-08-31",
      memberCount: 6,
      memberRoles: "Backend",
      githubLink: "https://github.com/Here-is-Paw",
      deployLink: "https://www.pawpaw.kknaks.site/"
    }
  ],
  educations: [
    {
      school: "Test",
      major: "Test",
      startDate: "2025-05-01",
      endDate: "2025-05-03",
      degree: "졸업",
      note: null
    }
  ],
  certificates: [
    {
      type: "자격증",
      name: "Test",
      date: "2025-05-01",
      organization: "Test"
    }
  ],
  coverLetters: [
    {
      title: "성장하는 서버 개발자, 문제 해결에 집중합니다",
      content: "저는 3년 이하의 경력을 가진 서버 개발자로, 다양한 프로젝트에서 실제 비즈니스 문제를 기술적으로 해결하는 데 집중해왔습니다. 빠르게 변화하는 환경에서 요구되는 확장성과 안정성을 갖춘 시스템을 설계하고, 성능 개선 및 레거시 코드 리팩토링을 통해 서비스의 가치를 높이는 경험을 쌓았습니다. 이러한 경험을 바탕으로 토스페이먼츠가 추구하는 '확장성 있고 유연한 결제 시스템' 구축에 기여하고자 지원하게 되었습니다."
    },
    {
      title: "대용량 트래픽과 확장성: 실전 경험",
      content: "StockNote 프로젝트에서는 실시간 주식 시세, 커뮤니티, 포트폴리오 관리 등 다양한 기능을 통합한 시스템을 설계하며, Elasticsearch와 Redis를 활용해 대용량 데이터 검색 및 캐싱 구조를 구현했습니다. 특히 게시글 검색 기능의 응답시간을 99.61% 개선(12초 → 47ms), 처리량을 1,325% 향상(4.17건/s → 59.45건/s)시켰고, K6 부하 테스트와 N+1 문제 해결로 포트폴리오 목록 조회 속도를 62.7% 단축(75ms → 28ms)하는 등 트래픽 급증 상황에서도 안정적인 서비스를 제공할 수 있도록 했습니다. 이는 토스페이먼츠의 선착순 결제, 이벤트 등 순간 트래픽 폭증 상황에 대응하는 시스템 구축과 맞닿아 있습니다."
    },
    {
      title: "비즈니스 요구사항을 빠르게 반영하는 유연한 시스템 설계",
      content: "여기잇개 프로젝트에서는 Kafka 기반 비동기 메시징 시스템을 구축하여 실시간 알림 및 이벤트 처리 성능을 높였고, Spring Boot와 JPA를 활용해 REST API 서버를 설계하여 다양한 클라이언트 요구사항에 빠르게 대응했습니다. 또한, PostgreSQL과 PostGIS로 위치 기반 검색을 구현하고, OpenCV·CLIP 등 AI 기술을 접목해 이미지 매칭 정밀도를 확보했습니다. 이 과정에서 요구사항 변화에 유연하게 대응할 수 있는 모듈화된 구조와 API 설계 역량을 키웠으며, 이는 토스페이먼츠의 다양한 결제/정산 요구사항을 신속하게 반영하는 데 강점이 될 수 있습니다."
    },
    {
      title: "레거시 코드 리팩토링 및 성능 개선 경험",
      content: "프로젝트 진행 중 레거시 코드의 성능 저하와 유지보수 어려움을 직접 경험하며, 코드 리팩토링과 성능 최적화에 집중했습니다. 예를 들어, StockNote에서 N+1 쿼리 문제를 발견하고 JPA fetch 전략 개선 및 쿼리 최적화로 응답 속도를 대폭 향상시켰습니다. 또한, Terraform을 활용한 인프라 코드화(IaC)로 AWS/NCP 배포 자동화와 무중단 배포 환경을 구축해, 서비스의 안정성과 개발 효율성을 높였습니다. 이러한 경험은 MSA 환경에서의 무중단 배포, 지속적인 시스템 개선이 중요한 토스페이먼츠의 개발 문화와 잘 맞는다고 생각합니다."
    },
    {
      title: "기술적 깊이와 폭: 다양한 스택 경험",
      content: "Java, Spring Boot, JPA, MySQL, Redis, Elasticsearch, Kafka 등 토스페이먼츠에서 요구하는 핵심 기술 스택을 실전 프로젝트에서 직접 다뤄왔습니다. 또한, Docker, Gradle, Terraform을 통한 배포 자동화, OAuth2 기반 인증 시스템, Python·FastAPI를 활용한 데이터 수집 및 이미지 처리 자동화 등 다양한 언어와 프레임워크 경험을 쌓았습니다. 이를 통해 새로운 기술 습득과 적용에 빠르게 적응할 수 있는 역량을 갖추었습니다."
    },
    {
      title: "토스페이먼츠에서의 성장과 기여",
      content: "토스페이먼츠의 서버 개발자로서, 결제 트래픽 급증 상황에서도 무너지지 않는 안정적인 시스템, 다양한 비즈니스 요구사항을 빠르게 반영하는 유연한 API, 그리고 무중단 배포가 가능한 MSA 환경 구축에 기여하고 싶습니다. 실제 문제 해결 경험과 성능 개선, 레거시 리팩토링 역량을 바탕으로, 고객사와 사용자 모두에게 신뢰받는 결제 플랫폼을 함께 만들어가겠습니다. 새로운 도전과 성장에 대한 열정으로, 토스페이먼츠와 함께 더 큰 가치를 창출하고 싶습니다."
    }
  ]
};