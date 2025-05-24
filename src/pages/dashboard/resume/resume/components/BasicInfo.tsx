import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';

interface BasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  careerType: '신입' | '경력';
  setCareerType: (value: '신입' | '경력') => void;
  position: string;
  setPosition: (value: string) => void;
  links: { type: string; url: string }[];
  setLinks: React.Dispatch<React.SetStateAction<{ type: string; url: string }[]>>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  title,
  setTitle,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  careerType,
  setCareerType,
  position,
  setPosition,
  links,
  setLinks
}) => {
  return (
    <>
      <div className="m-0 gap-1">
        <div className="m-0 gap-1">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="이력서 기본"
            required
            className="border-0 text-[1rem] md:text-[1.5rem] placeholder:text-black font-extrabold leading-tight text-black focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none h-[48px] py-2"
          />
        </div>
      </div>
      <Card className='gap-1'>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 flex flex-col items-start">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">이름</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    required
                    className="placeholder:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">지원직무</label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="지원직무"
                    required
                    className="placeholder:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="careerType" className="text-sm font-medium">신입/경력</label>
                  <Select value={careerType} onValueChange={(value: '신입' | '경력') => setCareerType(value)}>
                    <SelectTrigger className="w-full placeholder:text-sm text-xs">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="신입">신입</SelectItem>
                      <SelectItem value="경력">경력</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">이메일</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    required
                    className="placeholder:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">연락처</label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="연락처를 입력하세요"
                    required
                    className="placeholder:text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1">
                <label htmlFor="link" className="text-sm font-medium">링크</label>
              </div>
              {links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mt-1 w-full">
                  <div className="w-2/5">
                    <Select
                      defaultValue={link.type || "github"}
                      onValueChange={(value) => {
                        const newLinks = [...links];
                        newLinks[index] = { ...newLinks[index], type: value };
                        setLinks(newLinks);
                      }}
                    >
                      <SelectTrigger className="w-full placeholder:text-sm text-xs">
                        <SelectValue placeholder="종류" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="github">
                          <span className="flex items-center space-x-2">
                            <FaGithub className="w-4 h-4" />
                            <span>GitHub</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="notion">
                          <span className="flex items-center space-x-2">
                            <SiNotion className="w-4 h-4" />
                            <span>Notion</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="blog">
                          <span className="flex items-center space-x-2">
                            <span className="w-4 h-4 inline-block">📝</span>
                            <span>Blog</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5">
                    <Input
                      id={`linkUrl-${index}`}
                      placeholder="링크 주소 입력"
                      className="w-full placeholder:text-sm"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                        setLinks(newLinks);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BasicInfo; 