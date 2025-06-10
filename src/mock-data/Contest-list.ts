interface Contest {
  id: number;
  title: string;
  createdAt: string;
  submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  participants: Array<{
    id: number;
    username: string | null;
    email: string | null;
    nickname: string;
    submit: 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
  }>;
}

export const mockContests: Contest[] = [
  {
    id: 1,
    title: "2025 상반기 신입 개발자 기술 면접",
    createdAt: "2024-03-15T10:00:00Z",
    submit: "EVALUATED",
    participants: [
      {
        id: 1,
        username: null,
        email: null,
        nickname: "김개발",
        submit: "COMPLETED"
      },
      {
        id: 2,
        username: null,
        email: null,
        nickname: "이코딩",
        submit: "COMPLETED"
      }
    ]
  }
];
