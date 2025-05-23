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
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  portfolios,
  onAddProject,
}) => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);

  const handleCheckboxChange = (portfolioId: string) => {
    setSelectedPortfolios((prev) =>
      prev.includes(portfolioId)
        ? prev.filter((id) => id !== portfolioId)
        : [...prev, portfolioId]
    );
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
        const project = {
          name: portfolio.title,
          description: portfolio.contents.description,
          techStack: portfolio.contents.techStack.split(',').map(tech => tech.trim()),
          role: portfolio.contents.roles.join('\n'),
          startDate: portfolio.duration.startDate.split('T')[0],
          endDate: portfolio.duration.endDate.split('T')[0],
          memberCount: 1, // 기본값
          memberRole: 'Fullstack', // 기본값
          githubLink: '',
          deployLink: ''
        };
        onAddProject(project);
      }
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>포트폴리오 불러오기</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {portfolios.publicPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md"
              >
                <Checkbox
                  id={portfolio.id}
                  checked={selectedPortfolios.includes(portfolio.id)}
                  onCheckedChange={() => handleCheckboxChange(portfolio.id)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={portfolio.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {portfolio.title}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(portfolio.duration.startDate, portfolio.duration.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
