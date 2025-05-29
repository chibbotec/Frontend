export interface Link {
    type: string;
    url: string;
}

export interface Career {
    period: string;
    company: string;
    position: string;
    isCurrent: boolean;
    startDate: string;  // LocalDate 형식 (YYYY-MM-DD)
    endDate: string;    // LocalDate 형식 (YYYY-MM-DD)
    description: string;
    achievement: string;
}

export interface Project {
    name: string;
    description: string;
    techStack: string[];
    role: string[];
    startDate: string;  // LocalDate 형식 (YYYY-MM-DD)
    endDate: string;    // LocalDate 형식 (YYYY-MM-DD)
    memberCount: number;
    memberRoles?: string;
    githubLink: string;
    deployLink: string;
}

export interface Education {
    school: string;
    major: string;
    startDate: string;  // LocalDate 형식 (YYYY-MM-DD)
    endDate: string;    // LocalDate 형식 (YYYY-MM-DD)
    degree: string;
    note: string;
}

export interface Certificate {
    type: '자격증' | '수상경력';
    name: string;
    date: string;       // LocalDate 형식 (YYYY-MM-DD)
    organization: string;
}

export interface CoverLetter {
    title: string;
    content: string;
}

export interface ResumeFormData {
    title: string;
    name: string;
    email: string;
    phone: string;
    careerType: '신입' | '경력';
    position: string;
    techStack: string[];
    techSummary: string;
    links: Link[];
    careers: Career[];
    projects: Project[];
    educations: Education[];
    certificates: Certificate[];
    coverLetters: CoverLetter[];
}

export interface ResumeSummary {
    id: string;
    title: string;
    createdAt: string;
} 