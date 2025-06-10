import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { ResumeFormData } from './components/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Mail, Phone, Users, Calendar, UserCog, Globe, Briefcase, Printer } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { mockResumeDetailList } from '@/mock-data/Resume-detail-mock';
import { useAuth } from '@/context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL || '';

const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center w-full text-xs cursor-grab hover:bg-gray-100 transition-colors"
    >
      {children}
    </div>
  );
};

const ResumeDetail: React.FC = () => {
  const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [sectionVisibility, setSectionVisibility] = useState({
    career: true,
    projects: true,
    education: true,
    certificates: true,
    coverLetters: true
  });
  const [sections, setSections] = useState([
    { id: 'basic-info', title: '기본 정보', visible: true },
    { id: 'tech-info', title: '기술 역량', visible: true },
  ]);
  const [isSorting, setIsSorting] = useState(false);
  const { isGuest } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (section: keyof typeof sectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #pdf-content, #pdf-content * {
          visibility: visible;
        }
        #pdf-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        @page {
          margin: 1cm;
        }
        /* 인쇄 시 반응형 레이아웃 유지 */
        @media print {
          .grid {
            display: grid !important;
          }
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .md\\:col-span-1 {
            grid-column: span 1 / span 1 !important;
          }
          .md\\:col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const handleEdit = () => {
    navigate(`/space/${spaceId}/resume/resumes/${id}/edit`, {
      state: { resumeData: resume }
    });
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${apiUrl}/api/v1/resume/${spaceId}/resume/${id}`, {
          withCredentials: true
        });
        navigate(`/space/${spaceId}/resume/resumes`);
      } catch (error) {
        console.error('이력서 삭제에 실패했습니다:', error);
        alert('이력서 삭제에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        if (isGuest) {
          // 게스트 모드일 경우 항상 mock 데이터의 첫 번째 이력서를 보여줌
          const mockResumeId = "1"; // mockResumeDetailList의 첫 번째 이력서 ID
          setResume(mockResumeDetailList[mockResumeId] as ResumeFormData);
        } else {
          const response = await axios.get(`${apiUrl}/api/v1/resume/${spaceId}/resume/${id}`, {
            withCredentials: true
          });
          setResume(response.data);
        }
      } catch (error) {
        console.error('이력서를 불러오는데 실패했습니다:', error);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId && id) {
      fetchResume();
    }
  }, [spaceId, id, isGuest]);

  useEffect(() => {
    const newSections = [
      { id: 'basic-info', title: '기본 정보 *', visible: true },
      { id: 'tech-info', title: '기술 역량 *', visible: true },
    ];

    // 선택적 섹션들 추가
    if (resume?.careers && resume.careers.length > 0) {
      newSections.push({ id: 'career', title: '경력', visible: true });
    }
    if (resume?.projects && resume.projects.length > 0) {
      newSections.push({ id: 'projects', title: '프로젝트 경험', visible: true });
    }
    if (resume?.educations && resume.educations.length > 0) {
      newSections.push({ id: 'education', title: '학력 및 교육이력', visible: true });
    }
    if (resume?.certificates && resume.certificates.length > 0) {
      newSections.push({ id: 'certificates', title: '자격증 및 수상경력', visible: true });
    }
    if (resume?.coverLetters && resume.coverLetters.length > 0) {
      newSections.push({ id: 'coverLetters', title: '자기소개서', visible: true });
    }

    setSections(newSections);
  }, [resume]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>이력서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6">
      <div className="mb-5 gap-2">
        <div className="pt-2 gap-0">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
              className="w-full sm:w-auto self-start"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
              {!isGuest && (
                <div className='grid grid-cols-2 sm:flex gap-2'>
                  <Button
                    variant="ghost"
                    onClick={handleEdit}
                    className="w-full sm:w-auto"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    수정하기
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="w-full sm:w-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제하기
                  </Button>
                </div>
              )}
              <Button
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 좌측 컨테이너 - 메인 컨텐츠 */}
            <div className="md:col-span-3 space-y-4">
              <div ref={pdfRef} id="pdf-content" className="space-y-4">
                {sections.map((section) => {
                  if (!section.visible) return null;

                  switch (section.id) {
                    case 'basic-info':
                      return (
                        <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id={section.id}>
                          <CardHeader>
                            <CardTitle className='text-2xl font-bold'>기본 정보</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                              <div className="space-y-4 flex flex-col items-start">
                                <div className="flex w-full gap-4">
                                  <div className="flex items-end gap-2 w-1/3">
                                    <p className="text-md md:text-lg font-bold">{resume.name}</p>
                                    <p className="text-md">({resume.careerType})</p>
                                  </div>
                                  <div className="space-y-2 w-2/3">
                                    <p className="md:text-lg font-bold">{resume.position}</p>
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-4 w-full">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3 h-3 text-gray-700" />
                                    <p className="text-sm md:text-md">{resume.email}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-gray-700" />
                                    <p className="text-sm md:text-md">{resume.phone}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="gap-1 w-full items-center">
                                {resume.links.map((link, index) => {
                                  if (!link.url || link.url === "null") return null;
                                  return (
                                    <div key={index} className="flex items-center space-x-4 w-full">
                                      {link.type === "github" && <FaGithub className="w-4 h-4" />}
                                      {link.type === "notion" && <SiNotion className="w-4 h-4" />}
                                      {link.type === "blog" && <span className="w-4 h-4 inline-block">📝</span>}
                                      <span className="text-lg">{link.url}</span>
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline"
                                      >
                                        [링크]
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    case 'tech-info':
                      return (
                        <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id={section.id}>
                          <CardHeader>
                            <CardTitle className='text-2xl font-bold'>기술 역량</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xl font-medium">기술 스택</label>
                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                  {resume.techStack.map((tech, index) => (
                                    <span key={index} className="px-2 py-0.5 text-sm bg-gray-100 rounded">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <label className="text-xl font-medium">역량 요약</label>
                              <ul className="text-sm list-disc pl-4 space-y-1 mt-2">
                                {resume.techSummary.split('\n').map((line, idx) => (
                                  <li key={idx}>{line}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    case 'career':
                      if (resume.careerType === '경력' && resume.careers.length > 0 && sectionVisibility.career) {
                        return (
                          <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id="career">
                            <CardHeader>
                              <CardTitle className='text-2xl font-bold'>경력</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {resume.careers.map((career, index) => (
                                  <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="space-y-4 md:col-span-1">
                                        <h3 className="text-lg md:text-xl font-bold">{career.company}</h3>

                                        <div className="items-start gap-1 flex">
                                          <Calendar className="w-4 h-4" />
                                          <p className="text-sm md:text-md font-bold">
                                            {career.startDate ? format(new Date(career.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                            <span> ~ </span>
                                            {career.isCurrent ? '재직 중' : career.endDate ? format(new Date(career.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                          </p>
                                        </div>
                                        <div className="items-center gap-1 flex justify-between">
                                          <div className="flex items-center gap-1">
                                            <Briefcase className="w-5 h-5 text-gray-700" />
                                            <label className="text-sm md:text-md font-medium">역할:</label>
                                            <p className="text-sm md:text-md font-medium">{career.position || '-'}</p>
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {(() => {
                                              const start = career.startDate ? new Date(career.startDate) : null;
                                              const end = career.isCurrent || !career.endDate ? new Date() : new Date(career.endDate);
                                              if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                                                const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                                                return <span>경력 : {months}개월</span>;
                                              }
                                              return <span>경력 : -</span>;
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                                        {career.description && (
                                          <div>
                                            <label className="text-sm md:text-md font-bold">직무내용</label>
                                            <p className="text-xs md:text-sm whitespace-pre-wrap mt-1">{career.description}</p>
                                          </div>
                                        )}
                                        {career.achievement && (
                                          <div>
                                            <label className="text-sm md:text-md font-bold">주요 성과</label>
                                            <ul className="list-disc pl-4 space-y-1 mt-1">
                                              {career.achievement.split('\n').map((line, idx) => (
                                                <li key={idx} className="text-xs md:text-sm">{line}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    case 'projects':
                      if (resume.projects.length > 0 && sectionVisibility.projects) {
                        return (
                          <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id="projects">
                            <CardHeader>
                              <CardTitle className='text-2xl font-bold'>프로젝트 경험</CardTitle>
                            </CardHeader>
                            <CardContent className='p-3 md:p-4'>
                              <div className="space-y-4">
                                {resume.projects.map((project, index) => (
                                  <div key={index} className="bg-white border rounded-md shadow-sm p-3 md:p-4 mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="space-y-4 md:col-span-1">
                                        <div>
                                          <h3 className="text-lg md:text-xl font-bold">{project.name}</h3>
                                        </div>

                                        <div className="items-start gap-1 flex">
                                          <Calendar className="w-4 h-4" />
                                          <p className="text-sm md:text-sm font-bold">
                                            {project.startDate ? format(new Date(project.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                            <span> ~ </span>
                                            {project.endDate ? format(new Date(project.endDate), 'yyyy.MM.dd', { locale: ko }) : '현재'}
                                          </p>
                                        </div>


                                        <div className="flex items-center gap-4">
                                          <div className="items-center gap-1 flex">
                                            <Users className="w-4 h-4" strokeWidth={3} />
                                            <label className="text-sm md:text-sm font-medium">팀원: </label>
                                            <p className="text-sm md:text-sm font-medium">{project.memberCount ? `${project.memberCount}명` : '-'}</p>
                                          </div>
                                          <div className="items-center gap-1 flex flex-1">
                                            <UserCog className="w-4 h-4" strokeWidth={3} />
                                            <label className="text-sm md:text-sm font-medium">역할: </label>
                                            <p className="text-sm md:text-sm font-medium">{project.memberRoles || '-'}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-lg font-bold">기술 스택</label>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {project.techStack.map((tech, techIndex) => (
                                              <span key={techIndex} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                                                {tech}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        {(project.githubLink && project.githubLink !== "null") || (project.deployLink && project.deployLink !== "null") ? (
                                          <div className="space-y-2">
                                            <label className="text-sm md:text-lg font-bold">관련 링크</label>
                                            <div className='grid grid-cols-2'>
                                              <div className="items-center gap-1 flex">
                                                {project.githubLink && project.githubLink !== "null" && (
                                                  <>
                                                    <FaGithub className="w-4 h-4" />
                                                    <a
                                                      href={project.githubLink}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-sm text-blue-600 hover:underline"
                                                    >
                                                      [GitHub]
                                                    </a>
                                                  </>
                                                )}
                                              </div>
                                              <div className="items-center gap-1 flex">
                                                {project.deployLink && project.deployLink !== "null" && (
                                                  <>
                                                    <Globe className="w-4 h-4" />
                                                    <a
                                                      href={project.deployLink}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-sm text-blue-600 hover:underline"
                                                    >
                                                      [Site]
                                                    </a>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                      <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                                        <div>
                                          <label className="text-lg md:text-xl font-bold">프로젝트 설명</label>
                                          <p className="text-xs md:text-sm whitespace-pre-wrap mt-1">{project.description}</p>
                                        </div>

                                        <div>
                                          <label className="text-lg md:text-xl font-bold ">주요역할 및 성과</label>
                                          <ul className="text-xs md:text-sm list-disc pl-4 space-y-1 mt-1">
                                            {project.role.map((line: string, idx: number) => (
                                              <li key={idx}>{line}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    case 'education':
                      if (resume.educations.length > 0 && sectionVisibility.education) {
                        return (
                          <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id="education">
                            <CardHeader>
                              <CardTitle className='text-2xl font-bold'>학력 및 교육이력</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">교육기관</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">기간</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">전공</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">수료여부</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">비고</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {resume.educations.map((education, index) => (
                                      <tr key={index} className="even:bg-gray-50 hover:bg-blue-50 transition">
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{education.school}</td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">
                                          {education.startDate ? format(new Date(education.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                          <span> ~ </span>
                                          {education.endDate ? format(new Date(education.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                        </td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{education.major || '-'}</td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{education.degree || '-'}</td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{education.note || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    case 'certificates':
                      if (resume.certificates.length > 0 && sectionVisibility.certificates) {
                        return (
                          <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id="certificates">
                            <CardHeader>
                              <CardTitle className='text-2xl font-bold'>자격증 및 수상경력</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">구분</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">취득일</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">자격명/수상경력</th>
                                      <th className="px-2 md:px-4 py-3 font-bold border-b text-gray-700 text-center text-xs md:text-sm">주관기관</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {resume.certificates.map((certificate, index) => (
                                      <tr key={index} className="even:bg-gray-50 hover:bg-blue-50 transition">
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{certificate.type}</td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">
                                          {certificate.date ? format(new Date(certificate.date), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                        </td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{certificate.name || '-'}</td>
                                        <td className="px-2 md:px-4 py-2 border-b text-center text-xs md:text-sm">{certificate.organization || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    case 'coverLetters':
                      if (resume.coverLetters?.length > 0 && sectionVisibility.coverLetters) {
                        return (
                          <Card key={`card-${section.id}`} className='gap-2 break-inside-avoid' id="coverLetters">
                            <CardHeader>
                              <CardTitle className='text-2xl font-bold'>자기소개서</CardTitle>
                            </CardHeader>
                            <CardContent className='p-3 md:p-4'>
                              <div className="space-y-6">
                                {resume.coverLetters.map((coverLetter, index) => (
                                  <div key={index} className="bg-white border rounded-md shadow-sm p-4">
                                    <h3 className="text-lg font-bold mb-4">{coverLetter.title}</h3>
                                    <div className="whitespace-pre-wrap text-sm">
                                      {coverLetter.content}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>

            {/* 우측 컨테이너 - 목차 */}
            <div className="hidden md:block md:col-span-1">
              <Card className="sticky top-4 gap-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">이력서</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-600"
                    onClick={() => setIsSorting((prev) => !prev)}
                  >
                    {isSorting ? '완료' : '순서변경'}
                  </Button>
                </CardHeader>
                <CardContent className="pt-1">
                  {isSorting ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={sections.map(section => section.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <nav className="space-y-2">
                          {sections.map((section) => (
                            <SortableItem id={section.id} key={section.id}>
                              <div className="flex items-center w-full text-xs">
                                <span className="flex-1">
                                  {section.title}
                                </span>
                              </div>
                            </SortableItem>
                          ))}
                        </nav>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <div key={section.id} className="flex items-center w-full text-xs">
                          <span className="flex-1">
                            {section.title}
                          </span>
                          {section.id !== 'basic-info' && section.id !== 'tech-info' && (
                            <Switch
                              checked={section.visible}
                              onCheckedChange={() => {
                                setSections(sections.map(s =>
                                  s.id === section.id ? { ...s, visible: !s.visible } : s
                                ));
                              }}
                              className="scale-75"
                            />
                          )}
                        </div>
                      ))}
                    </nav>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ResumeDetail;