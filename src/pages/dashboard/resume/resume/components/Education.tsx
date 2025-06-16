import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Education as EducationType } from './types';

interface EducationProps {
  educations: EducationType[];
  setEducations: React.Dispatch<React.SetStateAction<EducationType[]>>;
}

const Education: React.FC<EducationProps> = ({ educations, setEducations }) => {
  const handleAddEducation = () => {
    setEducations(prev => [...prev, { school: '', major: '', startDate: '', endDate: '', degree: '', note: '' }]);
  };

  const parseDate = (date: string) => {
    if (!date) return { year: '', month: '' };
    return {
      year: date.slice(0, 2),
      month: date.slice(2, 4)
    };
  };

  return (
    <Card className="gap-1 mt-0 py-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>학력 및 교육 사항</CardTitle>
        <Button type="button" size="sm" onClick={handleAddEducation}>
          추가
        </Button>
      </CardHeader>
      <CardContent>
        {educations.length > 0 && (
          <div className="space-y-3">
            {educations.map((edu, idx) => {
              const startDate = parseDate(edu.startDate);
              const endDate = parseDate(edu.endDate);

              return (
                <div key={idx} className="bg-white border rounded-md shadow-sm p-4 mb-4 group relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setEducations(prev => prev.filter((_, i) => i !== idx))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-xs">학교/기관명</Label>
                      <Input
                        value={edu.school}
                        onChange={e => {
                          const newEdus = [...educations];
                          newEdus[idx].school = e.target.value;
                          setEducations(newEdus);
                        }}
                        className="h-9 text-xs"
                        placeholder="학교 또는 기관명"
                      />
                      <Label className="text-xs">학위/수료</Label>
                      <Select
                        value={edu.degree}
                        onValueChange={(value) => {
                          const newEdus = [...educations];
                          newEdus[idx].degree = value;
                          setEducations(newEdus);
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs w-full">
                          <SelectValue placeholder="선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="졸업예정">졸업예정</SelectItem>
                          <SelectItem value="졸업">졸업</SelectItem>
                          <SelectItem value="중퇴">중퇴</SelectItem>
                          <SelectItem value="수료예정">수료예정</SelectItem>
                          <SelectItem value="수료">수료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                      <div className="space-y-2">
                        <Label className="text-xs">시작일</Label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            className="h-9 text-xs w-1/2"
                            placeholder="YY"
                            maxLength={2}
                            value={startDate.year}
                            onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[idx].startDate = e.target.value + startDate.month;
                              setEducations(newEdus);
                            }}
                          />
                          <Input
                            type="text"
                            className="h-9 text-xs w-1/2"
                            placeholder="MM"
                            maxLength={2}
                            value={startDate.month}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 12) {
                                alert('12월까지만 입력 가능합니다.');
                                e.target.value = '12';
                              }
                              const newEdus = [...educations];
                              newEdus[idx].startDate = startDate.year + e.target.value;
                              setEducations(newEdus);
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">종료일</Label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            className="h-9 text-xs w-1/2"
                            placeholder="YY"
                            maxLength={2}
                            value={endDate.year}
                            onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[idx].endDate = e.target.value + endDate.month;
                              setEducations(newEdus);
                            }}
                          />
                          <Input
                            type="text"
                            className="h-9 text-xs w-1/2"
                            placeholder="MM"
                            maxLength={2}
                            value={endDate.month}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 12) {
                                alert('12월까지만 입력 가능합니다.');
                                e.target.value = '12';
                              }
                              const newEdus = [...educations];
                              newEdus[idx].endDate = endDate.year + e.target.value;
                              setEducations(newEdus);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                      <Label className="text-xs">전공/과정명</Label>
                      <Input
                        value={edu.major}
                        onChange={e => {
                          const newEdus = [...educations];
                          newEdus[idx].major = e.target.value;
                          setEducations(newEdus);
                        }}
                        className="h-9 text-xs"
                        placeholder="전공 또는 과정명"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                      <Label className="text-xs">비고</Label>
                      <Input
                        value={edu.note}
                        onChange={e => {
                          const newEdus = [...educations];
                          newEdus[idx].note = e.target.value;
                          setEducations(newEdus);
                        }}
                        className="h-9 text-xs"
                        placeholder="비고(선택)"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Education; 