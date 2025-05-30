import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import axios from 'axios';

interface Duration {
  startDate: string;
  endDate: string;
}

interface Portfolio {
  id: string;
  title: string;
  duration: Duration;
}

interface ApplyPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (portfolios: Portfolio[]) => void;
  spaceId: string;
}

const apiUrl = import.meta.env.VITE_API_URL || '';

// Mock data for portfolios
/*
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: '1',
    title: '프로젝트 A 포트폴리오',
    duration: {
      startDate: '2024-03-20',
      endDate: '2024-03-20'
    }
  },
  {
    id: '2',
    title: '프로젝트 B 포트폴리오',
    duration: {
      startDate: '2024-03-19',
      endDate: '2024-03-19'
    }
  },
  {
    id: '3',
    title: '프로젝트 C 포트폴리오',
    duration: {
      startDate: '2024-03-18',
      endDate: '2024-03-18'
    }
  },
];
*/

export const ApplyPortfolioModal: React.FC<ApplyPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  spaceId,
}) => {
  const [selectedPortfolios, setSelectedPortfolios] = useState<Portfolio[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/v1/resume/${spaceId}/portfolio`,
          {
            withCredentials: true
          }
        );

        // 공개 + 비공개 포트폴리오 모두 가져오기
        const allPortfolios = [
          ...(response.data.publicPortfolios || []),
          ...(response.data.privatePortfolios || [])
        ].map(portfolio => ({
          id: portfolio.id,
          title: portfolio.title,
          duration: portfolio.duration
        }));

        // 중복 제거: id를 기준으로 중복된 항목 제거
        const uniquePortfolios = allPortfolios.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as Portfolio[]);

        setPortfolios(uniquePortfolios);
      } catch (error) {
        console.error('포트폴리오 목록을 불러오는데 실패했습니다:', error);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && spaceId) {
      fetchPortfolios();
    }
  }, [isOpen, spaceId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const togglePortfolio = (portfolio: Portfolio) => {
    setSelectedPortfolios(prev => {
      const isSelected = prev.some(p => p.id === portfolio.id);
      if (isSelected) {
        return prev.filter(p => p.id !== portfolio.id);
      } else {
        return [...prev, portfolio];
      }
    });
  };

  const handleAdd = () => {
    onSelect(selectedPortfolios);
    onClose();
    setSelectedPortfolios([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>포트폴리오 선택</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : portfolios.length > 0 ? (
            portfolios.map((portfolio) => {
              const isSelected = selectedPortfolios.some(p => p.id === portfolio.id);
              return (
                <Card
                  key={portfolio.id}
                  className={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'border-primary' : ''}`}
                  onClick={() => togglePortfolio(portfolio)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{portfolio.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(portfolio.duration.startDate)} ~ {formatDate(portfolio.duration.endDate)}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">작성된 포트폴리오가 없습니다.</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleAdd} disabled={selectedPortfolios.length === 0}>
            추가 ({selectedPortfolios.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 