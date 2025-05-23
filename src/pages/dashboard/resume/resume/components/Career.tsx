import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
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
            {careers.map((career, index) => (
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
                        className="border-0 text-xl md:text-2xl placeholder:text-black font-extrabold leading-tight text-black focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        placeholder="회사명"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <label className="text-xs font-medium">입사일</label>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-9 text-xs w-full justify-start text-left font-normal"
                            >
                              {career.startDate ? (
                                format(new Date(career.startDate), 'yyyy.MM.dd', { locale: ko })
                              ) : (
                                <span>입사일 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={career.startDate ? new Date(career.startDate) : undefined}
                              onSelect={(date) => {
                                const newCareers = [...careers];
                                newCareers[index].startDate = date ? date.toISOString().split('T')[0] : '';
                                setCareers(newCareers);
                              }}
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>
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
                                if (e.target.checked) newCareers[index].endDate = '';
                                setCareers(newCareers);
                              }}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={`isCurrent-${index}`} className="text-xs">재직중</Label>
                          </div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-9 text-xs w-full justify-start text-left font-normal"
                              disabled={career.isCurrent}
                            >
                              {career.endDate ? (
                                format(new Date(career.endDate), 'yyyy.MM.dd', { locale: ko })
                              ) : (
                                <span>퇴사일 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={career.endDate ? new Date(career.endDate) : undefined}
                              onSelect={(date) => {
                                const newCareers = [...careers];
                                newCareers[index].endDate = date ? date.toISOString().split('T')[0] : '';
                                setCareers(newCareers);
                              }}
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>
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
                          const start = career.startDate ? new Date(career.startDate) : null;
                          const end = career.isCurrent || !career.endDate ? new Date() : new Date(career.endDate!);
                          if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                            return (
                              <div className="flex flex-col items-end">
                                <span>경력 : {months}개월</span>
                                <span>{format(start, 'yyyy.MM.dd')} ~ {format(end, 'yyyy.MM.dd')}</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex flex-col items-end">
                                <span>경력 : -</span>
                                <span>-</span>
                              </div>
                            );
                          }
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Career; 