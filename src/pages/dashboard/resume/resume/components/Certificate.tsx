import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Certificate as CertificateType } from './types';

interface CertificateProps {
  certificates: CertificateType[];
  setCertificates: React.Dispatch<React.SetStateAction<CertificateType[]>>;
}

const Certificate: React.FC<CertificateProps> = ({ certificates, setCertificates }) => {
  const [openDatePopovers, setOpenDatePopovers] = useState<boolean[]>([]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddCertificate = () => {
    setCertificates(prev => [...prev, { type: '자격증', name: '', date: '', organization: '' }]);
    setOpenDatePopovers(prev => [...prev, false]);
  };

  return (
    <Card className="gap-1 mt-0 py-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>자격증 및 수상경력</CardTitle>
        <Button type="button" size="sm" onClick={handleAddCertificate}>
          추가
        </Button>
      </CardHeader>
      <CardContent>
        {certificates.length > 0 && (
          <div className="space-y-3">
            {certificates.map((cert, idx) => (
              <div key={idx} className="bg-white border rounded-md shadow-sm p-4 mb-4 group relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setCertificates(prev => prev.filter((_, i) => i !== idx))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <Label className="text-xs">구분</Label>
                    <Select
                      value={cert.type}
                      onValueChange={(value: '자격증' | '수상경력') => {
                        const newCerts = [...certificates];
                        newCerts[idx].type = value;
                        setCertificates(newCerts);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs w-full">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="자격증">자격증</SelectItem>
                        <SelectItem value="수상경력">수상경력</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                    <Label className="text-xs">{cert.type === '자격증' ? '자격증명' : '수상내역'}</Label>
                    <Input
                      value={cert.name}
                      onChange={e => {
                        const newCerts = [...certificates];
                        newCerts[idx].name = e.target.value;
                        setCertificates(newCerts);
                      }}
                      className="h-9 text-xs"
                      placeholder={cert.type === '자격증' ? '자격증명을 입력하세요' : '수상내역을 입력하세요'}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                    <Label className="text-xs">취득/수상일</Label>
                    <Popover open={openDatePopovers[idx]} onOpenChange={(open) => {
                      const newPopovers = [...openDatePopovers];
                      newPopovers[idx] = open;
                      setOpenDatePopovers(newPopovers);
                    }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-9 text-xs w-full justify-start text-left font-normal"
                        >
                          {cert.date ? (
                            format(new Date(cert.date), 'yyyy.MM.dd', { locale: ko })
                          ) : (
                            <span>날짜 선택</span>
                          )}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={cert.date ? new Date(cert.date) : undefined}
                          onSelect={(date) => {
                            const newCerts = [...certificates];
                            newCerts[idx].date = date ? formatDate(date) : '';
                            setCertificates(newCerts);
                            const newPopovers = [...openDatePopovers];
                            newPopovers[idx] = false;
                            setOpenDatePopovers(newPopovers);
                          }}
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2 md:col-span-1 md:border-l md:border-gray-200 md:pl-6">
                    <Label className="text-xs">주관기관</Label>
                    <Input
                      value={cert.organization}
                      onChange={e => {
                        const newCerts = [...certificates];
                        newCerts[idx].organization = e.target.value;
                        setCertificates(newCerts);
                      }}
                      className="h-9 text-xs"
                      placeholder="주관기관을 입력하세요"
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

export default Certificate; 