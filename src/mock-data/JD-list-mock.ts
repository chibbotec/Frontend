interface JobDescription {
  id: string;
  url: string | null;
  isManualInput: boolean;
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
  spaceId: number;
  createdAt: string;
  updatedAt: string;
  publicGrade: string;
}

export const mockJobDescriptions: JobDescription[] = [
  {
    id: "1",
    url: null,
    isManualInput: true,
    company: "테크 컴퍼니",
    position: "프론트엔드 개발자",
    mainTasks: [
      "웹 애플리케이션 개발 및 유지보수",
      "사용자 인터페이스 설계 및 구현",
      "성능 최적화 및 코드 품질 개선"
    ],
    requirements: [
      "React, Vue.js 등 프론트엔드 프레임워크 3년 이상 경력",
      "TypeScript 사용 경험",
      "반응형 웹 디자인 구현 능력"
    ],
    career: "3년 이상",
    resumeRequirements: [
      "이력서",
      "자기소개서",
      "포트폴리오"
    ],
    recruitmentProcess: [
      "서류전형",
      "1차 면접",
      "2차 면접",
      "최종합격"
    ],
    spaceId: 1,
    createdAt: "2024-03-20T09:00:00Z",
    updatedAt: "2024-03-20T09:00:00Z",
    publicGrade: "PUBLIC"
  },
  {
    id: "2",
    url: null,
    isManualInput: true,
    company: "AI 스타트업",
    position: "백엔드 개발자",
    mainTasks: [
      "서버 사이드 애플리케이션 개발",
      "데이터베이스 설계 및 최적화",
      "API 설계 및 구현"
    ],
    requirements: [
      "Java/Spring 또는 Node.js 3년 이상 경력",
      "RESTful API 설계 경험",
      "AWS 또는 GCP 사용 경험"
    ],
    career: "3년 이상",
    resumeRequirements: [
      "이력서",
      "자기소개서"
    ],
    recruitmentProcess: [
      "서류전형",
      "코딩테스트",
      "1차 면접",
      "2차 면접",
      "최종합격"
    ],
    spaceId: 1,
    createdAt: "2024-03-21T10:00:00Z",
    updatedAt: "2024-03-21T10:00:00Z",
    publicGrade: "GROUP"
  },
  {
    id: "3",
    url: null,
    isManualInput: true,
    company: "핀테크 기업",
    position: "풀스택 개발자",
    mainTasks: [
      "웹 애플리케이션 전반 개발",
      "마이크로서비스 아키텍처 설계",
      "시스템 성능 최적화"
    ],
    requirements: [
      "프론트엔드/백엔드 개발 경력 5년 이상",
      "마이크로서비스 아키텍처 설계 경험",
      "Docker, Kubernetes 사용 경험"
    ],
    career: "5년 이상",
    resumeRequirements: [
      "이력서",
      "자기소개서",
      "포트폴리오"
    ],
    recruitmentProcess: [
      "서류전형",
      "코딩테스트",
      "1차 면접",
      "2차 면접",
      "최종합격"
    ],
    spaceId: 1,
    createdAt: "2024-03-22T11:00:00Z",
    updatedAt: "2024-03-22T11:00:00Z",
    publicGrade: "PRIVATE"
  }
];
