import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CoverLetter {
  title: string;
  content: string;
}

interface CoverLetterProps {
  coverLetters: CoverLetter[];
  setCoverLetters: React.Dispatch<React.SetStateAction<CoverLetter[]>>;
}

const CoverLetter: React.FC<CoverLetterProps> = ({
  coverLetters,
  setCoverLetters,
}) => {
  const handleAddCoverLetter = () => {
    setCoverLetters([
      ...coverLetters,
      {
        title: '',
        content: ''
      }
    ]);
  };

  const handleCancelCoverLetter = (index: number) => {
    setCoverLetters(coverLetters.filter((_, i) => i !== index));
  };

  return (
    <Card className='gap-1 mt-0 py-3'>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>자기소개서</CardTitle>
        <Button type="button" size="sm" onClick={handleAddCoverLetter}>
          추가
        </Button>
      </CardHeader>
      <CardContent>
        {coverLetters.length > 0 && (
          <div className="space-y-3">
            {coverLetters.map((coverLetter, index) => (
              <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4 group relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCancelCoverLetter(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`cover-letter-title-${index}`} className="text-xs font-medium">
                      제목
                    </Label>
                    <input
                      id={`cover-letter-title-${index}`}
                      value={coverLetter.title}
                      onChange={e => {
                        const newCoverLetters = [...coverLetters];
                        newCoverLetters[index].title = e.target.value;
                        setCoverLetters(newCoverLetters);
                      }}
                      placeholder="자기소개서 제목"
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cover-letter-content-${index}`} className="text-xs font-medium">
                      내용
                    </Label>
                    <Textarea
                      id={`cover-letter-content-${index}`}
                      value={coverLetter.content}
                      onChange={e => {
                        const newCoverLetters = [...coverLetters];
                        newCoverLetters[index].content = e.target.value;
                        setCoverLetters(newCoverLetters);
                      }}
                      placeholder="자기소개서 내용을 작성해주세요"
                      className="mt-1 min-h-[200px] text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoverLetter;
