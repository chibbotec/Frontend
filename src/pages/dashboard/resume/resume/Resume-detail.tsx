import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ResumeFormData } from './components/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
// import mockData from './components/Mock';
import { Mail, Phone, Users, Calendar, UserCog, Globe, Briefcase, Printer } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';


const apiUrl = import.meta.env.VITE_API_URL || '';

const ResumeDetail: React.FC = () => {
  const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

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
        #pdf-content .card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 1rem !important;
        }
        @page {
          margin: 1cm;  /* 상하좌우 여백을 1cm로 설정 */
          /* 또는 각 방향별로 다르게 설정할 수 있습니다 */
          /* margin-top: 1cm; */
          /* margin-right: 1.5cm; */
          /* margin-bottom: 1cm; */
          /* margin-left: 1.5cm; */
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

  // useEffect(() => {
  //   setResume(mockData as any);
  //   setLoading(false);
  // }, []);

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
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                목록으로 돌아가기
              </Button>
              <Button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
            {/* PDF로 저장할 영역 */}
            <div ref={pdfRef} id="pdf-content" className="space-y-4">
              {/* 기본 정보 */}
              <div className="mb-5 gap-1">
                <div className="m-0 gap-1">
                  <span className="border-0 text-xl md:text-3xl font-extrabold">
                    {resume.title}
                  </span>
                </div>
              </div>
              <Card className='gap-2'>
                <CardHeader>
                  <CardTitle className='text-2xl font-bold'>기본 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 flex flex-col items-start">
                      <div className="flex w-full gap-4">
                        <div className="flex items-end gap-2 w-1/3">
                          <p className="text-xl md:text-2xl font-bold">{resume.name}</p>
                          <p className="text-m">({resume.careerType})</p>
                        </div>
                        <div className="space-y-2 w-2/3">
                          <p className="md:text-xl font-bold">{resume.position}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-700" />
                          <p className="md:text-lg">{resume.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-700" />
                          <p className="md:text-lg">{resume.phone}</p>
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
                              className="text-sm text-blue-600 hover:underline"
                            >
                              [바로가기]
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 기술 정보 */}
              <Card className='gap-2'>
                <CardHeader>
                  <CardTitle className='text-2xl font-bold'>기술 정보</CardTitle>
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

              {/* 경력 */}
              {resume.careerType === '경력' && resume.careers.length > 0 && (
                <Card className='gap-2'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold'>경력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resume.careers.map((career, index) => (
                        <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4 print-avoid-break">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4 md:col-span-1">
                              <h3 className="text-lg md:text-xl font-bold">{career.company}</h3>

                              <div className="items-start gap-1 flex justify-end">
                                <Calendar className="w-4 h-4" />
                                <p className="text-sm md:text-md font-bold">
                                  {career.startDate ? format(new Date(career.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                  <span> ~ </span>
                                  {career.isCurrent ? '재직 중' : career.endDate ? format(new Date(career.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                </p>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                {(() => {
                                  const start = career.startDate ? new Date(career.startDate) : null;
                                  const end = career.isCurrent || !career.endDate ? new Date() : new Date(career.endDate);
                                  if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                                    return (
                                      <div className="flex flex-col items-end">
                                        <span>경력 : {months}개월</span>
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

                              <div className="items-center gap-1 flex">
                                <Briefcase className="w-5 h-5 text-gray-700" />
                                <label className="text-sm md:text-md font-medium">역할:</label>
                                <p className="text-sm md:text-md font-medium">{career.position || '-'}</p>
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
                                  <p className="text-xs md:text-sm whitespace-pre-wrap mt-1">• {career.achievement}</p>
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
                <Card className='gap-2'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold'>프로젝트 경험</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resume.projects.map((project, index) => (
                        <div key={index} className="bg-white border rounded-md shadow-sm p-4 mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4 md:col-span-1">
                              <div>
                                <h3 className="text-lg md:text-xl font-bold">{project.name}</h3>
                              </div>

                              <div className="items-start gap-1 flex justify-end">
                                <Calendar className="w-4 h-4" />
                                <p className="text-sm md:text-md font-bold">
                                  {project.startDate ? format(new Date(project.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                  <span> ~ </span>
                                  {project.endDate ? format(new Date(project.endDate), 'yyyy.MM.dd', { locale: ko }) : '현재'}
                                </p>
                              </div>


                              <div className='grid grid-cols-2 gap-1'>
                                <div className="items-center gap-1 flex">
                                  <Users className="w-5 h-5" strokeWidth={3} />
                                  <label className="text-sm md:text-md font-medium">총 팀원: </label>
                                  <p className="text-sm md:text-md font-medium">{project.memberCount ? `${project.memberCount}명` : '-'}</p>
                                </div>
                                <div className="items-center gap-1 flex">
                                  <UserCog className="w-5 h-5" strokeWidth={3} />
                                  <label className="text-sm md:text-md font-medium">역할: </label>
                                  <p className="text-sm md:text-md font-medium">{project.memberRole || '-'}</p>
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
                                  {project.role.split('\n').map((line, idx) => (
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
              )}

              {/* 학력 */}
              {resume.educations.length > 0 && (
                <Card className='gap-2'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold'>학력 및 교육이력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/5">교육기관명</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/4">기간</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/4">전공</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/6">수료여부</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/4">비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resume.educations.map((education, index) => (
                            <tr key={index} className="even:bg-gray-50 hover:bg-blue-50 transition">
                              <td className="px-4 py-2 border-b text-center w-1/5">{education.school}</td>
                              <td className="px-4 py-2 border-b text-center w-1/6">
                                {education.startDate ? format(new Date(education.startDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                                <span> ~ </span>
                                {education.endDate ? format(new Date(education.endDate), 'yyyy.MM.dd', { locale: ko }) : '-'}
                              </td>
                              <td className="px-4 py-2 border-b text-center w-1/4">{education.major || '-'}</td>
                              <td className="px-4 py-2 border-b text-center w-1/6">{education.degree || '-'}</td>
                              <td className="px-4 py-2 border-b text-center w-1/4">{education.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 자격증 및 수상경력 */}
              {resume.certificates.length > 0 && (
                <Card className='gap-2'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold'>자격증 및 수상경력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/5">구분</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/5">취득일</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/3">자격명/수상경력</th>
                            <th className="px-4 py-3 font-bold border-b text-gray-700 text-center w-1/3">주관기관</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resume.certificates.map((certificate, index) => (
                            <tr key={index} className="even:bg-gray-50 hover:bg-blue-50 transition">
                              <td className="px-4 py-2 border-b text-center w-1/5">{certificate.type}</td>
                              <td className="px-4 py-2 border-b text-center w-1/5">
                                {certificate.date ? format(new Date(certificate.date), 'yyyy.MM.dd', { locale: ko }) : '-'}
                              </td>
                              <td className="px-4 py-2 border-b text-center w-1/3">{certificate.name || '-'}</td>
                              <td className="px-4 py-2 border-b text-center w-1/3">{certificate.organization || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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