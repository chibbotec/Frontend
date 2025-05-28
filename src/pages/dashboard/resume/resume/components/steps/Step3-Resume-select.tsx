import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Globe, Lock, Loader2 } from "lucide-react";

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface ResumeSummary {
  id: string;
  title: string;
  createdAt: string;
}

interface Portfolio {
  id: string;
  title: string;
  author: {
    nickname: string;
  };
  duration: {
    startDate: string;
    endDate: string;
  };
  contents: {
    techStack: string;
    summary: string;
  };
  publicAccess: boolean;
}

interface Step3ResumeSelectProps {
  onStateChange: (data: { type: 'resume' | 'portfolio', ids: string[] }) => void;
  initialState: {
    selectedResumeType: string;
  };
  spaceId: string;
}

export const Step3ResumeSelect: React.FC<Step3ResumeSelectProps> = ({
  onStateChange,
  initialState,
  spaceId
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>([]);
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch resumes
        const resumesResponse = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/resume`,
          { withCredentials: true }
        );
        setResumes(resumesResponse.data);

        // Fetch portfolios
        const portfoliosResponse = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
          { withCredentials: true }
        );
        setPortfolios(portfoliosResponse.data);

        setError(null);
      } catch (err) {
        console.error('데이터를 불러오는데 실패했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spaceId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    onStateChange({ type: 'resume', ids: [resumeId] });
  };

  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioIds(prev => {
      const newIds = prev.includes(portfolioId)
        ? prev.filter(id => id !== portfolioId)
        : [...prev, portfolioId];
      onStateChange({ type: 'portfolio', ids: newIds });
      return newIds;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'select' | 'create')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="select">기존 이력서 선택</TabsTrigger>
        <TabsTrigger value="create">새 이력서 만들기</TabsTrigger>
      </TabsList>
      <TabsContent value="select">
        <Card>
          <CardHeader>
            <CardTitle>기존 이력서 선택</CardTitle>
            <CardDescription>
              기존에 작성한 이력서를 선택해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className={`h-[80px] cursor-pointer transition-all px-2 flex items-center justify-center ${selectedResumeId === resume.id
                    ? 'bg-blue-100 shadow-md'
                    : 'hover:shadow-md hover:border-primary/50'
                    }`}
                  onClick={() => handleResumeSelect(resume.id)}
                >
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="text-sm font-medium text-center w-full">{resume.title}</div>
                    <div className="flex justify-center items-center text-[10px] text-muted-foreground gap-1 mt-1">
                      <Calendar className="h-2 w-2 mr-0.5" />
                      {formatDate(resume.createdAt)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>새 이력서 만들기</CardTitle>
            <CardDescription>
              기존 포트폴리오를 선택해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {portfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className={`h-[80px] cursor-pointer transition-all px-2 flex items-center justify-center ${selectedPortfolioIds.includes(portfolio.id)
                    ? 'bg-blue-100 shadow-md'
                    : 'hover:shadow-md hover:border-primary/50'
                    }`}
                  onClick={() => handlePortfolioSelect(portfolio.id)}
                >
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="text-sm font-medium text-center w-full">{portfolio.title}</div>
                    <div className="flex justify-center items-center text-[10px] text-muted-foreground gap-1 mt-1">
                      <Calendar className="h-2 w-2 mr-0.5" />
                      {formatDateRange(portfolio.duration.startDate, portfolio.duration.endDate)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
