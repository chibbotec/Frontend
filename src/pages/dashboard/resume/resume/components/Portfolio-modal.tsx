import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Project as ProjectType } from './types';
import { Globe, Lock } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  duration: {
    startDate: string;
    endDate: string;
  };
  contents: {
    techStack: string;
    summary: string;
    description: string;
    roles: string[];
  };
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    name: string;
    description: string;
    techStack: string[];
    role: string;
    startDate: string;
    endDate: string;
    memberCount: number;
    memberRoles: string;
    githubLink: string;
    deployLink: string;
  }) => void;
  setTechStack: React.Dispatch<React.SetStateAction<Set<string>>>;
  existingProjects: ProjectType[];
}

const apiUrl = import.meta.env.VITE_API_URL || '';

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
  setTechStack,
  existingProjects
}) => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [portfolios, setPortfolios] = useState<{
    publicPortfolios: Portfolio[];
    privatePortfolios: Portfolio[];
  }>({
    publicPortfolios: [],
    privatePortfolios: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!isOpen) return; // 모달이 열려있을 때만 데이터를 가져옵니다

      try {
        setLoading(true);
        const spaceId = window.location.pathname.split('/')[2];

        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
          {
            withCredentials: true
          }
        );

        if (response.data.publicPortfolios && response.data.privatePortfolios) {
          setPortfolios({
            publicPortfolios: response.data.publicPortfolios,
            privatePortfolios: response.data.privatePortfolios
          });
        }
      } catch (error) {
        console.error('포트폴리오 목록을 불러오는데 실패했습니다:', error);
        setPortfolios({
          publicPortfolios: [],
          privatePortfolios: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [isOpen]); // isOpen이 변경될 때마다 데이터를 가져옵니다

  const isProjectAlreadyAdded = (portfolioTitle: string) => {
    return existingProjects.some(project => project.name === portfolioTitle);
  };

  const handleCheckboxChange = (portfolioId: string) => {
    setSelectedPortfolios((prev) =>
      prev.includes(portfolioId)
        ? prev.filter((id) => id !== portfolioId)
        : [...prev, portfolioId]
    );
  };

  const handleClose = () => {
    setSelectedPortfolios([]); // Reset checkboxes
    onClose();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy.MM.dd', { locale: ko });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
  };

  const handleAdd = () => {
    // 선택된 포트폴리오의 정보를 프로젝트 형식으로 변환
    selectedPortfolios.forEach((portfolioId) => {
      const portfolio = [...portfolios.publicPortfolios, ...portfolios.privatePortfolios].find(
        (p) => p.id === portfolioId
      );

      if (portfolio) {
        const techStackArray = portfolio.contents.techStack.split(',').map(tech => tech.trim());
        const project = {
          name: portfolio.title,
          description: portfolio.contents.summary,
          techStack: techStackArray,
          role: portfolio.contents.roles.join('\n'),
          startDate: portfolio.duration.startDate.split('T')[0],
          endDate: portfolio.duration.endDate.split('T')[0],
          memberCount: 1, // 기본값
          memberRoles: 'Fullstack', // 기본값
          githubLink: '',
          deployLink: ''
        };
        onAddProject(project);

        // Add tech stack to TechInfo
        setTechStack(prev => {
          const newSet = new Set(prev);
          techStackArray.forEach(tech => newSet.add(tech));
          return newSet;
        });
      }
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>포트폴리오 불러오기</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {/* 공개 포트폴리오 */}
            {portfolios.publicPortfolios.map((portfolio) => {
              const isAlreadyAdded = isProjectAlreadyAdded(portfolio.title);
              return (
                <div
                  key={portfolio.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md"
                >
                  <Checkbox
                    id={portfolio.id}
                    checked={selectedPortfolios.includes(portfolio.id)}
                    onCheckedChange={() => handleCheckboxChange(portfolio.id)}
                    disabled={isAlreadyAdded}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        <Globe className="h-3 w-3" />
                        공개
                      </span>
                      <label
                        htmlFor={portfolio.id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isAlreadyAdded ? 'text-blue-600' : ''}`}
                      >
                        {portfolio.title}
                      </label>
                      {isAlreadyAdded && (
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                          추가됨
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(portfolio.duration.startDate, portfolio.duration.endDate)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 개인 포트폴리오 */}
            {portfolios.privatePortfolios.map((portfolio) => {
              const isAlreadyAdded = isProjectAlreadyAdded(portfolio.title);
              return (
                <div
                  key={portfolio.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md"
                >
                  <Checkbox
                    id={portfolio.id}
                    checked={selectedPortfolios.includes(portfolio.id)}
                    onCheckedChange={() => handleCheckboxChange(portfolio.id)}
                    disabled={isAlreadyAdded}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                        <Lock className="h-3 w-3" />
                        개인
                      </span>
                      <label
                        htmlFor={portfolio.id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isAlreadyAdded ? 'text-blue-600' : ''}`}
                      >
                        {portfolio.title}
                      </label>
                      {isAlreadyAdded && (
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                          추가됨
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(portfolio.duration.startDate, portfolio.duration.endDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleAdd} disabled={selectedPortfolios.length === 0}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioModal;
