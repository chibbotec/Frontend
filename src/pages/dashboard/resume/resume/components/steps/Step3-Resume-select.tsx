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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Globe, Lock, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { mockPortfolios } from '../mockdata/portfolio-mock';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

interface Portfolio {
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

interface Career {
  company: string;
  position: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  description: string;
  achievement: string;
}

interface PortfolioResponse {
  publicPortfolios: Portfolio[];
  privatePortfolios: Portfolio[];
}

interface Step3ResumeSelectProps {
  onStateChange: (data: { type: 'portfolio' | 'career', ids: string[], portfolios?: any[], careers: Career[] }) => void;
  initialState: {
    selectedPortfolios: any[];
    careers: Career[];
  };
  spaceId: string;
}

export const Step3ResumeSelect: React.FC<Step3ResumeSelectProps> = ({
  onStateChange,
  initialState,
  spaceId
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'career'>('portfolio');
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>([]);
  const [careers, setCareers] = useState<Career[]>(initialState.careers || []);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const portfoliosResponse = await axios.get<PortfolioResponse>(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
          { withCredentials: true }
        );
        const allPortfolios = [
          ...portfoliosResponse.data.publicPortfolios,
          ...portfoliosResponse.data.privatePortfolios
        ];
        const uniquePortfolios = Array.from(
          new Map(allPortfolios.map(portfolio => [portfolio.id, portfolio])).values()
        );
        setPortfolios(uniquePortfolios);

        // Initialize careers from initialState only on mount
        if (initialState.careers && initialState.careers.length > 0) {
          setCareers(initialState.careers);
          onStateChange({
            type: 'career',
            ids: initialState.careers.map(career => career.company),
            careers: initialState.careers
          });
        }

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

  const validateAndFormatDate = (value: string, type: 'year' | 'month' | 'day'): string => {
    // 숫자만 허용
    const cleaned = value.replace(/[^\d]/g, '');

    if (type === 'year') {
      // 년도는 2자리까지만
      return cleaned.slice(0, 2);
    } else if (type === 'month') {
      // 월은 1-12까지만
      const num = parseInt(cleaned);
      if (num > 12) return '12';
      if (num < 1) return '01';
      return num.toString().padStart(2, '0');
    } else {
      // 일은 1-31까지만
      const num = parseInt(cleaned);
      if (num > 31) return '31';
      if (num < 1) return '01';
      return num.toString().padStart(2, '0');
    }
  };

  const handleDateChange = (index: number, field: 'startDate' | 'endDate', type: 'year' | 'month' | 'day', value: string) => {
    const formattedValue = validateAndFormatDate(value, type);
    const currentDate = field === 'startDate' ? careers[index].startDate : careers[index].endDate;
    const [year = '', month = '', day = ''] = currentDate.split('.');

    let newDate = '';
    if (type === 'year') {
      newDate = `${formattedValue}.${month}.${day}`;
    } else if (type === 'month') {
      newDate = `${year}.${formattedValue}.${day}`;
    } else {
      newDate = `${year}.${month}.${formattedValue}`;
    }

    handleCareerChange(index, field, newDate);
  };

  const handlePortfolioSelect = (portfolio: Portfolio) => {
    setSelectedPortfolioIds(prev => {
      const newIds = prev.includes(portfolio.id)
        ? prev.filter(id => id !== portfolio.id)
        : [...prev, portfolio.id];

      const selectedPortfolios = portfolios.filter(p => newIds.includes(p.id));
      onStateChange({
        type: 'portfolio',
        ids: newIds,
        portfolios: selectedPortfolios,
        careers: careers  // 현재 경력 정보도 함께 전달
      });
      return newIds;
    });
  };

  const handleAddCareer = () => {
    const newCareer: Career = {
      company: '',
      position: '',
      isCurrent: false,
      startDate: '',
      endDate: '',
      description: '',
      achievement: ''
    };
    setCareers([...careers, newCareer]);
    onStateChange({
      type: 'career',
      ids: [...careers, newCareer].map((_, index) => `career_${index}`),
      careers: [...careers, newCareer]
    });
  };

  const handleCareerChange = (index: number, field: keyof Career, value: string | boolean) => {
    const newCareers = [...careers];
    newCareers[index] = {
      ...newCareers[index],
      [field]: value
    };
    setCareers(newCareers);
    onStateChange({
      type: 'career',
      ids: newCareers.map((_, index) => `career_${index}`),
      careers: newCareers
    });
  };

  const handleRemoveCareer = (index: number) => {
    const newCareers = careers.filter((_, i) => i !== index);
    setCareers(newCareers);
    onStateChange({
      type: 'career',
      ids: newCareers.map((_, index) => `career_${index}`),
      careers: newCareers
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = portfolios.map(portfolio => portfolio.id);
      setSelectedPortfolioIds(allIds);
      onStateChange({
        type: 'portfolio',
        ids: allIds,
        portfolios: portfolios,
        careers: careers
      });
    } else {
      setSelectedPortfolioIds([]);
      onStateChange({
        type: 'portfolio',
        ids: [],
        portfolios: [],
        careers: careers
      });
    }
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
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'portfolio' | 'career')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
        <TabsTrigger value="career">경력</TabsTrigger>
      </TabsList>
      <TabsContent value="portfolio">
        <Card>
          <CardHeader>
            <CardTitle>포트폴리오 선택</CardTitle>
            <CardDescription>
              기존 포트폴리오를 선택해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedPortfolioIds.length === portfolios.length && portfolios.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-center">프로젝트명</TableHead>
                  <TableHead className="text-center hidden md:table-cell">기간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <TableRow
                    key={portfolio.id}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedPortfolioIds.includes(portfolio.id) ? 'bg-muted' : ''
                      }`}
                    onClick={() => handlePortfolioSelect(portfolio)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPortfolioIds.includes(portfolio.id)}
                        onCheckedChange={() => handlePortfolioSelect(portfolio)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-center">{portfolio.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">{formatDateRange(portfolio.duration.startDate, portfolio.duration.endDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="career">
        <Card className='gap-1'>
          <CardHeader>
            <CardTitle>경력 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {careers.map((career, index) => (
              <Card key={index} className="p-3 gap-1 h-50 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold">경력 {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCareer(index)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`company-${index}`} className="text-xs">회사명</Label>
                    <Input
                      id={`company-${index}`}
                      value={career.company}
                      onChange={(e) => handleCareerChange(index, 'company', e.target.value)}
                      placeholder="회사명"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`position-${index}`} className="text-xs">직급</Label>
                    <Input
                      id={`position-${index}`}
                      value={career.position}
                      onChange={(e) => handleCareerChange(index, 'position', e.target.value)}
                      placeholder="직급"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`startDate-${index}`} className="text-xs">시작일</Label>
                    <div className="flex gap-1">
                      <Input
                        id={`startDate-year-${index}`}
                        value={career.startDate.split('.')[0] || ''}
                        onChange={(e) => handleDateChange(index, 'startDate', 'year', e.target.value)}
                        placeholder="YY"
                        className="h-7 text-xs w-12"
                      />
                      <Input
                        id={`startDate-month-${index}`}
                        value={career.startDate.split('.')[1] || ''}
                        onChange={(e) => handleDateChange(index, 'startDate', 'month', e.target.value)}
                        placeholder="MM"
                        className="h-7 text-xs w-12"
                      />
                      <Input
                        id={`startDate-day-${index}`}
                        value={career.startDate.split('.')[2] || ''}
                        onChange={(e) => handleDateChange(index, 'startDate', 'day', e.target.value)}
                        placeholder="DD"
                        className="h-7 text-xs w-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`endDate-${index}`} className="text-xs">종료일</Label>
                    <div className="flex gap-1">
                      <Input
                        id={`endDate-year-${index}`}
                        value={career.endDate.split('.')[0] || ''}
                        onChange={(e) => handleDateChange(index, 'endDate', 'year', e.target.value)}
                        placeholder="YY"
                        disabled={career.isCurrent}
                        className="h-7 text-xs w-12"
                      />
                      <Input
                        id={`endDate-month-${index}`}
                        value={career.endDate.split('.')[1] || ''}
                        onChange={(e) => handleDateChange(index, 'endDate', 'month', e.target.value)}
                        placeholder="MM"
                        disabled={career.isCurrent}
                        className="h-7 text-xs w-12"
                      />
                      <Input
                        id={`endDate-day-${index}`}
                        value={career.endDate.split('.')[2] || ''}
                        onChange={(e) => handleDateChange(index, 'endDate', 'day', e.target.value)}
                        placeholder="DD"
                        disabled={career.isCurrent}
                        className="h-7 text-xs w-12"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`isCurrent-${index}`}
                      defaultChecked={career.isCurrent}
                      onCheckedChange={(checked) => {
                        handleCareerChange(index, 'isCurrent', checked as boolean);
                        if (checked) {
                          handleCareerChange(index, 'endDate', '');
                        }
                      }}
                    />
                    <Label htmlFor={`isCurrent-${index}`} className="text-sm">재직중</Label>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Label htmlFor={`description-${index}`} className="text-xs">주요 업무</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={career.description}
                    onChange={(e) => handleCareerChange(index, 'description', e.target.value)}
                    placeholder="주요 업무"
                    className="h-16 text-xs resize-none"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <Label htmlFor={`achievement-${index}`} className="text-xs">주요 성과</Label>
                  <Textarea
                    id={`achievement-${index}`}
                    value={career.achievement}
                    onChange={(e) => handleCareerChange(index, 'achievement', e.target.value)}
                    placeholder="주요 성과"
                    className="h-16 text-xs resize-none"
                  />
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full h-8 text-xs"
              onClick={handleAddCareer}
            >
              <Plus className="h-3 w-3 mr-1" />
              경력 추가
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
