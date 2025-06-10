
export const mockPortfolios = {
  publicPortfolios: [
    {
      id: '1',
      spaceId: 1,
      title: '웹 포트폴리오 프로젝트',
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
        description: 'React와 TypeScript를 사용하여 반응형 포트폴리오 웹사이트를 개발했습니다.'
      },
      // thumbnailUrl: 'https://picsum.photos/400/200',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      publicAccess: true
    }
  ],
  privatePortfolios: [
    {
      id: '2',
      spaceId: 1,
      title: '쇼핑몰 프로젝트',
      author: {
        id: 1,
        nickname: '홍길동'
      },
      duration: {
        startDate: '2024-02-01',
        endDate: '2024-04-01'
      },
      contents: {
        techStack: 'Next.js, TypeScript, Prisma',
        summary: '온라인 쇼핑몰 플랫폼 개발',
        description: 'Next.js와 Prisma를 활용한 풀스택 쇼핑몰 프로젝트를 진행했습니다.'
      },
      // thumbnailUrl: 'https://picsum.photos/400/201',
      createdAt: '2024-04-01',
      updatedAt: '2024-04-01',
      publicAccess: false
    }
  ]
};
