import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Project as ProjectType } from './types';
import PortfolioModal from './Portfolio-modal';

interface ProjectProps {
  projects: ProjectType[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  projectTechInputs: string[];
  setProjectTechInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setTechStack: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const Project: React.FC<ProjectProps> = ({
  projects,
  setProjects,
  projectTechInputs,
  setProjectTechInputs,
  setTechStack
}) => {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [openStartDatePopovers, setOpenStartDatePopovers] = useState<boolean[]>([]);
  const [openEndDatePopovers, setOpenEndDatePopovers] = useState<boolean[]>([]);

  const handleAddProject = () => {
    setProjects([
      ...projects,
      {
        name: '',
        description: '',
        techStack: [],
        role: '',
        startDate: '',
        endDate: '',
        memberCount: 0,
        memberRole: '',
        githubLink: '',
        deployLink: ''
      }
    ]);
    setProjectTechInputs([...projectTechInputs, '']);
    setOpenStartDatePopovers(prev => [...prev, false]);
    setOpenEndDatePopovers(prev => [...prev, false]);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddProjectFromPortfolio = (projectData: {
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
  }) => {
    setProjects([...projects, projectData]);
    setProjectTechInputs([...projectTechInputs, '']);
  };

  const handleCancelProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <Card className='gap-1 mt-0 py-3'>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>프로젝트</CardTitle>
        <div className="flex flex-row items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsPortfolioModalOpen(true)}>
            프로젝트 불러오기
          </Button>
          <Button type="button" size="sm" onClick={handleAddProject}>
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4 group relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCancelProject(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Container - 1/3 width */}
                  <div className="space-y-4 md:col-span-1">
                    <div>
                      <Input
                        id="project-name"
                        value={project.name}
                        onChange={e => {
                          const newProjects = [...projects];
                          newProjects[index].name = e.target.value;
                          setProjects(newProjects);
                        }}
                        placeholder="프로젝트명"
                        className="border-0 text-xl md:text-2xl placeholder:text-black font-extrabold leading-tight text-black focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                      />
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">시작일</label>
                          <Popover open={openStartDatePopovers[index]} onOpenChange={(open) => {
                            const newPopovers = [...openStartDatePopovers];
                            newPopovers[index] = open;
                            setOpenStartDatePopovers(newPopovers);
                          }}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-9 text-xs w-full justify-start text-left font-normal"
                              >
                                {project.startDate ? (
                                  format(new Date(project.startDate), 'yyyy.MM.dd', { locale: ko })
                                ) : (
                                  <span>시작일 선택</span>
                                )}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={project.startDate ? new Date(project.startDate) : undefined}
                                onSelect={(date) => {
                                  const newProjects = [...projects];
                                  newProjects[index].startDate = date ? formatDate(date) : '';
                                  setProjects(newProjects);
                                  const newPopovers = [...openStartDatePopovers];
                                  newPopovers[index] = false;
                                  setOpenStartDatePopovers(newPopovers);
                                }}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">종료일</label>
                          <Popover open={openEndDatePopovers[index]} onOpenChange={(open) => {
                            const newPopovers = [...openEndDatePopovers];
                            newPopovers[index] = open;
                            setOpenEndDatePopovers(newPopovers);
                          }}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-9 text-xs w-full justify-start text-left font-normal"
                              >
                                {project.endDate ? (
                                  format(new Date(project.endDate), 'yyyy.MM.dd', { locale: ko })
                                ) : (
                                  <span>종료일 선택</span>
                                )}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={project.endDate ? new Date(project.endDate) : undefined}
                                onSelect={(date) => {
                                  const newProjects = [...projects];
                                  newProjects[index].endDate = date ? formatDate(date) : '';
                                  setProjects(newProjects);
                                  const newPopovers = [...openEndDatePopovers];
                                  newPopovers[index] = false;
                                  setOpenEndDatePopovers(newPopovers);
                                }}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-4 items-center mb-6">
                        <div>
                          <Label htmlFor={`memberCount-${index}`} className="text-xs">참여인원</Label>
                          <Select
                            value={project.memberCount ? String(project.memberCount) : ''}
                            onValueChange={value => {
                              const newProjects = [...projects];
                              newProjects[index].memberCount = Number(value);
                              setProjects(newProjects);
                            }}
                          >
                            <SelectTrigger className="h-6 text-xs mt-1 w-full" id={`memberCount-${index}`}>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">개인</SelectItem>
                              <SelectItem value="2">2명</SelectItem>
                              <SelectItem value="3">3명</SelectItem>
                              <SelectItem value="4">4명</SelectItem>
                              <SelectItem value="5">5명</SelectItem>
                              <SelectItem value="6">6명 이상</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`memberRole-${index}`} className="text-xs">역할</Label>
                          <Select
                            value={project.memberRole || ''}
                            onValueChange={value => {
                              const newProjects = [...projects];
                              newProjects[index].memberRole = value;
                              setProjects(newProjects);
                            }}
                          >
                            <SelectTrigger className="h-6 text-xs mt-1 w-full" id={`memberRole-${index}`}>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PO">PO</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                              <SelectItem value="Fullstack">Fullstack</SelectItem>
                              <SelectItem value="Backend">Backend</SelectItem>
                              <SelectItem value="Frontend">Frontend</SelectItem>
                              <SelectItem value="Publisher">Publisher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <FaGithub className="w-4 h-4" />
                        <span>GitHub</span>
                        <Input
                          className="h-7 text-xs w-auto"
                          placeholder="링크 입력"
                          value={project.githubLink || ''}
                          onChange={e => {
                            const newProjects = [...projects];
                            newProjects[index].githubLink = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Deploy</span>
                        <Input
                          className="h-7 text-xs w-auto"
                          placeholder="링크 입력"
                          value={project.deployLink || ''}
                          onChange={e => {
                            const newProjects = [...projects];
                            newProjects[index].deployLink = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Container - 2/3 width */}
                  <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                    <div>
                      <label className="text-xs font-medium mb-1 block">프로젝트 소개</label>
                      <Textarea
                        value={project.description}
                        onChange={e => {
                          const newProjects = [...projects];
                          newProjects[index].description = e.target.value;
                          setProjects(newProjects);
                        }}
                        placeholder="프로젝트 소개"
                        className="text-xs resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">기술스택</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.map((tech, techIndex) => (
                          <span key={techIndex} className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                            {tech}
                            <button
                              type="button"
                              onClick={() => {
                                const newProjects = [...projects];
                                newProjects[index].techStack = newProjects[index].techStack.filter((_, i) => i !== techIndex);
                                setProjects(newProjects);
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={projectTechInputs[index]}
                          onChange={(e) => {
                            const newInputs = [...projectTechInputs];
                            newInputs[index] = e.target.value;
                            setProjectTechInputs(newInputs);
                          }}
                          placeholder="기술 스택 입력"
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && projectTechInputs[index].trim()) {
                              e.preventDefault();
                              const newProjects = [...projects];
                              const techToAdd = projectTechInputs[index].trim();
                              if (!newProjects[index].techStack.includes(techToAdd)) {
                                newProjects[index].techStack = [...newProjects[index].techStack, techToAdd];
                                setProjects(newProjects);
                                setTechStack(prev => {
                                  const newSet = new Set(prev);
                                  newSet.add(techToAdd);
                                  return newSet;
                                });
                              }
                              const newInputs = [...projectTechInputs];
                              newInputs[index] = '';
                              setProjectTechInputs(newInputs);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (projectTechInputs[index].trim()) {
                              const newProjects = [...projects];
                              const techToAdd = projectTechInputs[index].trim();
                              if (!newProjects[index].techStack.includes(techToAdd)) {
                                newProjects[index].techStack = [...newProjects[index].techStack, techToAdd];
                                setProjects(newProjects);
                                setTechStack(prev => {
                                  const newSet = new Set(prev);
                                  newSet.add(techToAdd);
                                  return newSet;
                                });
                              }
                              const newInputs = [...projectTechInputs];
                              newInputs[index] = '';
                              setProjectTechInputs(newInputs);
                            }
                          }}
                        >
                          추가
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">주요역할 및 성과</label>
                      <Textarea
                        value={project.role}
                        onChange={e => {
                          const newProjects = [...projects];
                          newProjects[index].role = e.target.value;
                          setProjects(newProjects);
                        }}
                        placeholder="프로젝트 주요역할 및 성과"
                        className="text-xs h-32 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onAddProject={handleAddProjectFromPortfolio}
        setTechStack={setTechStack}
        existingProjects={projects}
        portfolios={{
          publicPortfolios: [
            {
              id: "682ee0cc4b14a0335ab40457",
              title: "여기있개",
              duration: {
                startDate: "2025-05-22T00:00:00",
                endDate: "2025-05-23T00:00:00"
              },
              contents: {
                techStack: "Spring Boot, Spring Security, Spring WebFlux, PostgreSQL, PostGIS, Kafka, AWS S3, JPA/Hibernate, Lombok, Jackson, React (클라이언트 연동 예상), Docker, Gradle",
                summary: "이 프로젝트는 마이크로서비스 기반의 반려동물 실종 및 발견 게시판 시스템으로, REST API, Kafka, S3, WebFlux, Spring Security를 활용하여 확장성과 보안성을 갖춘 서비스를 구현하였습니다.",
                description: "이 시스템은 반려동물 실종 및 발견 게시글을 효율적으로 관리하는 플랫폼입니다. 사용자 인증과 권한 부여를 위해 Spring Security와 JWT를 사용하며, 게시글 등록, 수정, 삭제, 조회 기능을 REST API로 제공합니다.",
                roles: [
                  "Spring Boot와 WebFlux를 사용해서 API Gateway 및 인증 필터 구현하여 서비스 요청 인증 및 라우팅 안정성 확보",
                  "JWT 토큰 검증 및 재발급 로직 개발하여 인증 보안 강화 및 사용자 세션 관리 효율성 향상"
                ]
              }
            }
          ],
          privatePortfolios: []
        }}
      />
    </Card>
  );
};

export default Project; 