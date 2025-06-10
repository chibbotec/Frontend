export interface ResumeItem {
  id: string;
  title: string;
  createdAt: string;
}

export const mockResumeList: ResumeItem[] = [
  {
    id: "1",
    title: "Sample 이력서",
    createdAt: "2024-03-15T09:00:00Z"
  },
  {
    id: "2",
    title: "Sample 이력서2",
    createdAt: "2024-03-14T15:30:00Z"
  }
];
