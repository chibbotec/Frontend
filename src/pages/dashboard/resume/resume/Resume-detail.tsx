import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ResumeFormData } from './components/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const apiUrl = import.meta.env.VITE_API_URL || '';

const ResumeDetail: React.FC = () => {
  const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/v1/resume/${spaceId}/resume/${id}`, {
          withCredentials: true
        });
        setResume(response.data);
      } catch (error) {
        console.error('이력서 상세 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId && id) {
      fetchResumeDetail();
    }
  }, [spaceId, id]);

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
    <div className="p-6">
      <div className="mb-5 gap-2">
        <div className="pt-2 gap-0">
          <div className="space-y-6">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로 돌아가기
            </Button>

            {/* 기본 정보 */}
            <div className="m-0 gap-1">
              <div className="m-0 gap-1">
                <h1 className="border-0 text-[1rem] md:text-[1.5rem] font-extrabold leading-tight text-black px-0 h-[48px] py-2">
                  {resume.title}
                </h1>
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
                        <label className="text-sm font-medium">이름</label>
                        <p className="text-sm">{resume.name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">지원직무</label>
                        <p className="text-sm">{resume.position}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">신입/경력</label>
                        <p className="text-sm">{resume.careerType}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">이메일</label>
                        <p className="text-sm">{resume.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">연락처</label>
                        <p className="text-sm">{resume.phone}</p>
                      </div>
                    </div>
                  </div>
                  {resume.links.length > 0 && (
                    <div>
                      <div className="mb-1">
                        <label className="text-sm font-medium">링크</label>
                      </div>
                      {resume.links.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-1 w-full">
                          <p className="text-sm">{link.type}: {link.url}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 기술 정보 */}
            <Card className='gap-1'>
              <CardHeader>
                <CardTitle>기술 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">기술스택</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {resume.techStack.map((tech, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {resume.techSummary && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">기술역량요약</label>
                      <p className="text-sm whitespace-pre-wrap">{resume.techSummary}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 경력 */}
            {resume.careerType === '경력' && resume.careers.length > 0 && (
              <Card className='gap-1 mt-0 py-3'>
                <CardHeader>
                  <CardTitle>경력</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.careers.map((career, index) => (
                      <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4 md:col-span-1">
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold">{career.company}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium">입사일</label>
                                <p className="text-xs">
                                  {career.startDate ? format(new Date(career.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">퇴사일</label>
                                <p className="text-xs">
                                  {career.isCurrent ? '현재' : career.endDate ? format(new Date(career.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-end justify-between gap-2">
                              <div className="w-1/2">
                                <label className="text-xs font-medium">직급</label>
                                <p className="text-xs">{career.position || '-'}</p>
                              </div>
                              <div className="w-1/2 text-right text-xs text-gray-500">
                                {(() => {
                                  const start = career.startDate ? new Date(career.startDate) : null;
                                  const end = career.isCurrent || !career.endDate ? new Date() : new Date(career.endDate);
                                  if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                                    return (
                                      <div className="flex flex-col items-end">
                                        <span>경력 : {months}개월</span>
                                        <span>{format(start, 'yyyy.MM.dd')} ~ {format(end, 'yyyy.MM.dd')}</span>
                                      </div>
                                    );
                                  }
                                  return (
                                    <div className="flex flex-col items-end">
                                      <span>경력 : -</span>
                                      <span>-</span>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                            {career.description && (
                              <div>
                                <label className="text-xs font-medium">직무내용</label>
                                <p className="text-xs whitespace-pre-wrap">{career.description}</p>
                              </div>
                            )}
                            {career.achievement && (
                              <div>
                                <label className="text-xs font-medium">주요 성과</label>
                                <p className="text-xs whitespace-pre-wrap">• {career.achievement}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 프로젝트 */}
            {resume.projects.length > 0 && (
              <Card className='gap-1 mt-0 py-3'>
                <CardHeader>
                  <CardTitle>프로젝트</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.projects.map((project, index) => (
                      <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4 md:col-span-1">
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold">{project.name}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium">시작일</label>
                                <p className="text-xs">
                                  {project.startDate ? format(new Date(project.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">종료일</label>
                                <p className="text-xs">
                                  {project.endDate ? format(new Date(project.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">역할</label>
                              <p className="text-xs">{project.memberRole || '-'}</p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">팀 구성</label>
                              <p className="text-xs">{project.memberCount}명 ({project.memberRole})</p>
                            </div>
                          </div>
                          <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                            <div>
                              <label className="text-xs font-medium">프로젝트 설명</label>
                              <p className="text-xs whitespace-pre-wrap">{project.description}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium">기술 스택</label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {project.techStack.map((tech, techIndex) => (
                                  <span key={techIndex} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium">주요역할 및 성과</label>
                              <ul className="text-xs list-disc pl-4 space-y-1">
                                {project.role.split('\n').map((line, index) => (
                                  <li key={index}>{line}</li>
                                ))}
                              </ul>
                            </div>
                            {(project.githubLink || project.deployLink) && (
                              <div className="space-y-2">
                                <label className="text-xs font-medium">링크</label>
                                <div className="flex flex-col gap-1">
                                  {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                      GitHub
                                    </a>
                                  )}
                                  {project.deployLink && (
                                    <a href={project.deployLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                      배포 링크
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 학력 */}
            {resume.educations.length > 0 && (
              <Card className='gap-1 mt-0 py-3'>
                <CardHeader>
                  <CardTitle>학력</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.educations.map((education, index) => (
                      <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4 md:col-span-1">
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold">{education.school}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium">입학일</label>
                                <p className="text-xs">
                                  {education.startDate ? format(new Date(education.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">졸업일</label>
                                <p className="text-xs">
                                  {education.endDate ? format(new Date(education.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">전공</label>
                              <p className="text-xs">{education.major || '-'}</p>
                            </div>
                            {education.degree && (
                              <div className="space-y-2">
                                <label className="text-xs font-medium">학위</label>
                                <p className="text-xs">{education.degree}</p>
                              </div>
                            )}
                            {education.note && (
                              <div className="space-y-2">
                                <label className="text-xs font-medium">비고</label>
                                <p className="text-xs">{education.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 자격증 및 수상경력 */}
            {resume.certificates.length > 0 && (
              <Card className='gap-1 mt-0 py-3'>
                <CardHeader>
                  <CardTitle>자격증 및 수상경력</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.certificates.map((certificate, index) => (
                      <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4 md:col-span-1">
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold">{certificate.name}</h3>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">취득일</label>
                              <p className="text-xs">
                                {certificate.date ? format(new Date(certificate.date), 'yyyy.MM.dd', { locale: ko }) : '-'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4 md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">발행처</label>
                              <p className="text-xs">{certificate.organization || '-'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
              >
                목록으로
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;