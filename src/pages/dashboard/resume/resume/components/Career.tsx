import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Career as CareerType } from './types';

interface CareerProps {
  careers: CareerType[];
  setCareers: React.Dispatch<React.SetStateAction<CareerType[]>>;
}

const Career: React.FC<CareerProps> = ({ careers, setCareers }) => {
  const handleAddCareer = () => {
    setCareers([
      ...careers,
      { period: '', company: '', position: '', isCurrent: false, startDate: '', endDate: '', description: '', achievement: '' }
    ]);
  };

  const formatDate = (year: string, month: string) => {
    if (!year || !month) return '';
    return `20${year}-${month.padStart(2, '0')}-01`;
  };

  const parseDate = (date: string) => {
    if (!date) return { year: '', month: '' };
    return {
      year: date.slice(0, 2),
      month: date.slice(2, 4)
    };
  };

  return (
    <Card className='gap-1 mt-0 py-3'>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>경력</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={handleAddCareer}
        >
          추가
        </Button>
      </CardHeader>
      <CardContent>
        {careers.length > 0 && (
          <div className="space-y-3">
            {careers.map((career, index) => {
              const startDate = parseDate(career.startDate);
              const endDate = parseDate(career.endDate);

              return (
                <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4 group relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newCareers = careers.filter((_, i) => i !== index);
                      setCareers(newCareers);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Container - 1/3 width */}
                    <div className="space-y-4 md:col-span-1">
                      <div>
                        <Input
                          value={career.company}
                          onChange={e => {
                            const newCareers = [...careers];
                            newCareers[index].company = e.target.value;
                            setCareers(newCareers);
                          }}
                          className="border-0 text-xl md:text-xl placeholder:text-gray font-extrabold leading-tight text-black focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                          placeholder="회사명을 입력해주세요."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <label className="text-xs font-medium">입사일</label>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="h-9 text-xs w-1/2"
                              placeholder="YY"
                              maxLength={2}
                              value={startDate.year}
                              onChange={(e) => {
                                const newCareers = [...careers];
                                newCareers[index].startDate = e.target.value + startDate.month;
                                setCareers(newCareers);
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
                                const newCareers = [...careers];
                                newCareers[index].startDate = startDate.year + e.target.value;
                                setCareers(newCareers);
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium">퇴사일</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`isCurrent-${index}`}
                                checked={career.isCurrent || false}
                                onChange={e => {
                                  const newCareers = [...careers];
                                  newCareers[index].isCurrent = e.target.checked;
                                  setCareers(newCareers);
                                }}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`isCurrent-${index}`} className="text-xs">재직중</Label>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="h-9 text-xs w-1/2"
                              placeholder="YY"
                              maxLength={2}
                              value={endDate.year}
                              onChange={(e) => {
                                const newCareers = [...careers];
                                newCareers[index].endDate = e.target.value + endDate.month;
                                setCareers(newCareers);
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
                                const newCareers = [...careers];
                                newCareers[index].endDate = endDate.year + e.target.value;
                                setCareers(newCareers);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <div className="w-1/2">
                          <div className="flex items-center">
                            <label className="text-xs font-medium">직급</label>
                          </div>
                          <Input
                            value={career.position || ''}
                            onChange={e => {
                              const newCareers = [...careers];
                              newCareers[index].position = e.target.value;
                              setCareers(newCareers);
                            }}
                            className="h-7 text-xs w-full"
                            placeholder="직급"
                          />
                        </div>
                        <div className="w-1/2 text-right text-xs text-gray-500">
                          {(() => {
                            if (!career.startDate) return (
                              <div className="flex flex-col items-end">
                                <span>경력 : -</span>
                                <span>-</span>
                              </div>
                            );

                            const startYear = parseInt(career.startDate.slice(0, 2));
                            const startMonth = parseInt(career.startDate.slice(2, 4));
                            const endYear = career.isCurrent ? new Date().getFullYear() % 100 : parseInt(career.endDate.slice(0, 2));
                            const endMonth = career.isCurrent ? new Date().getMonth() + 1 : parseInt(career.endDate.slice(2, 4));

                            const months = (endYear - startYear) * 12 + (endMonth - startMonth);

                            return (
                              <div className="flex flex-col items-end">
                                <span>경력 : {months}개월</span>
                                <span>{startDate.year}.{startDate.month} ~ {career.isCurrent ? '현재' : `${endDate.year}.${endDate.month}`}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    {/* Right Container - 2/3 width */}
                    <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                      <div>
                        <Label className="text-xs">직무내용</Label>
                        <Textarea
                          value={career.description}
                          onChange={e => {
                            const newCareers = [...careers];
                            newCareers[index].description = e.target.value;
                            setCareers(newCareers);
                          }}
                          placeholder="직무 내용"
                          className="text-xs h-20 resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">주요 성과</Label>
                        <Textarea
                          value={career.achievement || ''}
                          onChange={e => {
                            const newCareers = [...careers];
                            newCareers[index].achievement = e.target.value;
                            setCareers(newCareers);
                          }}
                          placeholder="주요 성과"
                          className="text-xs h-20 resize-none"
                          rows={2}
                        />
                      </div>
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

export default Career; 