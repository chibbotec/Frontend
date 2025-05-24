import React, { useState } from 'react';
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
  portfolios: {
    publicPortfolios: Portfolio[];
    privatePortfolios: Portfolio[];
  };
  onAddProject: (project: {
    name: string;
    description: string;
    techStack: string[];
    role: string;
    startDate: string;
    endDate: string;
    memberCount: number;
    memberRole: string;
    githubLink: string;
    deployLink: string;
  }) => void;
  setTechStack: React.Dispatch<React.SetStateAction<Set<string>>>;
  existingProjects: ProjectType[];
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  portfolios,
  onAddProject,
  setTechStack,
  existingProjects
}) => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);

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
          description: portfolio.contents.description,
          techStack: techStackArray,
          role: portfolio.contents.roles.join('\n'),
          startDate: portfolio.duration.startDate.split('T')[0],
          endDate: portfolio.duration.endDate.split('T')[0],
          memberCount: 1, // 기본값
          memberRole: 'Fullstack', // 기본값
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
                      <label
                        htmlFor={portfolio.id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isAlreadyAdded ? 'text-blue-600' : ''
                          }`}
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
