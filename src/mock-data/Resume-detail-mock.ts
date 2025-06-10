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

// 게스트 모드에서 보여줄 이력서 상세 정보 매핑
export const mockResumeDetailList: { [key: string]: ResumeDetail } = {
  "1": {
    id: "1",
    spaceId: 1,
    author: {
      id: 1,
      nickname: "게스트"
    },
    createdAt: "2024-03-15T09:00:00Z",
    updatedAt: "2024-03-15T09:00:00Z",
    title: "프론트엔드 개발자 이력서",
    name: "홍길동",
    email: "example@email.com",
    phone: "010-1234-5678",
    careerType: "신입",
    position: "프론트엔드 개발자",
    techStack: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Redux",
      "Jest",
      "Git"
    ],
    techSummary: "React와 TypeScript를 주로 사용하는 프론트엔드 개발자입니다. 컴포넌트 기반 개발과 상태 관리에 익숙하며, 사용자 경험을 중요시합니다. Next.js를 활용한 SSR 구현과 Tailwind CSS를 통한 반응형 디자인 구현 경험이 있습니다.",
    links: [
      {
        type: "github",
        url: "https://github.com/example"
      },
      {
        type: "blog",
        url: "https://blog.example.com"
      }
    ],
    careers: [],
    projects: [
      {
        name: "포트폴리오 웹사이트",
        description: "React와 TypeScript를 사용한 개인 포트폴리오 웹사이트입니다. 반응형 디자인과 다크 모드를 구현했습니다.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        role: ["프론트엔드 개발", "UI/UX 디자인", "반응형 구현"],
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        memberCount: 1,
        memberRoles: "Front",
        githubLink: "https://github.com/example/portfolio",
        deployLink: "https://portfolio.example.com"
      }
    ],
    educations: [
      {
        school: "한국대학교",
        major: "컴퓨터공학",
        startDate: "2020-03-01",
        endDate: "2024-02-28",
        degree: "학사",
        note: "웹 개발 동아리 회장"
      }
    ],
    certificates: [
      {
        type: "자격증",
        name: "정보처리기사",
        date: "2023-12-01",
        organization: "한국산업인력공단"
      }
    ],
    coverLetters: [
      {
        title: "프론트엔드 개발자로서의 성장",
        content: "React와 TypeScript를 주로 사용하는 프론트엔드 개발자입니다. 컴포넌트 기반 개발과 상태 관리에 익숙하며, 사용자 경험을 중요시합니다. Next.js를 활용한 SSR 구현과 Tailwind CSS를 통한 반응형 디자인 구현 경험이 있습니다."
      }
    ]
  }
};
