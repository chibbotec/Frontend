import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TechInfoProps {
  techStack: string[];
  setTechStack: React.Dispatch<React.SetStateAction<string[]>>;
  newTech: string;
  setNewTech: (value: string) => void;
  techSummary: string;
  setTechSummary: (value: string) => void;
}

const TechInfo: React.FC<TechInfoProps> = ({
  techStack,
  setTechStack,
  newTech,
  setNewTech,
  techSummary,
  setTechSummary
}) => {
  return (
    <Card className='gap-1'>
      <CardHeader>
        <CardTitle>기술 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="techStack" className="text-sm font-medium">기술스택</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.map((tech, index) => (
                <span key={index} className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                  {tech}
                  <button
                    type="button"
                    onClick={() => setTechStack(prev => prev.filter((_, i) => i !== index))}
                    className="ml-1 hover:text-destructive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="기술 스택 입력"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTech.trim()) {
                    e.preventDefault();
                    if (!techStack.includes(newTech.trim())) {
                      setTechStack(prev => [...prev, newTech.trim()]);
                    }
                    setNewTech('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newTech.trim() && !techStack.includes(newTech.trim())) {
                    setTechStack(prev => [...prev, newTech.trim()]);
                    setNewTech('');
                  }
                }}
              >
                추가
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="techSummary" className="text-sm font-medium">기술역량요약</label>
            <Textarea
              id="techSummary"
              value={techSummary}
              onChange={(e) => setTechSummary(e.target.value)}
              placeholder="기술역량을 요약해주세요"
              required
              className="text-xs resize-none h-40"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechInfo; 