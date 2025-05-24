import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Link as LinkIcon, Github, ExternalLink } from 'lucide-react';
import { ResumeFormData } from './components/types';

const apiUrl = import.meta.env.VITE_API_URL || '';

const ResumeDetail: React.FC = () => {
  const { spaceId, resumeId } = useParams<{ spaceId: string; resumeId: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/v1/resume/${spaceId}/resume/${resumeId}`, {
          withCredentials: true
        });
        setResume(response.data);
      } catch (error) {
        console.error('이력서 상세 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId && resumeId) {
      fetchResumeDetail();
    }
  }, [spaceId, resumeId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로 돌아가기
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{resume.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-xl font-semibold mb-2">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">이름</p>
                  <p>{resume.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이메일</p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {resume.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">연락처</p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {resume.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">경력 구분</p>
                  <p>{resume.careerType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">희망 포지션</p>
                  <p>{resume.position}</p>
                </div>
              </div>
            </div>

            {/* 기술 스택 */}
            <div>
              <h3 className="text-xl font-semibold mb-2">기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                {resume.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {resume.techSummary && (
                <p className="mt-2 text-muted-foreground">{resume.techSummary}</p>
              )}
            </div>

            {/* 링크 */}
            {resume.links.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">링크</h3>
                <div className="space-y-2">
                  {resume.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {link.type}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 경력 */}
            {resume.careers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">경력</h3>
                <div className="space-y-4">
                  {resume.careers.map((career, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{career.company}</p>
                          <p className="text-sm text-muted-foreground">{career.position}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(career.startDate)} - {career.isCurrent ? '현재' : formatDate(career.endDate)}
                        </p>
                      </div>
                      {career.description && (
                        <p className="mt-2 text-sm">{career.description}</p>
                      )}
                      {career.achievement && (
                        <p className="mt-1 text-sm text-muted-foreground">{career.achievement}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 프로젝트 */}
            {resume.projects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">프로젝트</h3>
                <div className="space-y-6">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.role}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm">{project.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.techStack.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-4">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            <Github className="h-4 w-4 mr-1" />
                            GitHub
                          </a>
                        )}
                        {project.deployLink && (
                          <a
                            href={project.deployLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            배포 링크
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 학력 */}
            {resume.educations.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">학력</h3>
                <div className="space-y-4">
                  {resume.educations.map((education, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{education.school}</p>
                          <p className="text-sm text-muted-foreground">{education.major}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(education.startDate)} - {formatDate(education.endDate)}
                        </p>
                      </div>
                      {education.degree && (
                        <p className="mt-1 text-sm text-muted-foreground">{education.degree}</p>
                      )}
                      {education.note && (
                        <p className="mt-1 text-sm text-muted-foreground">{education.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자격증 및 수상경력 */}
            {resume.certificates.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">자격증 및 수상경력</h3>
                <div className="space-y-4">
                  {resume.certificates.map((certificate, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{certificate.name}</p>
                          <p className="text-sm text-muted-foreground">{certificate.organization}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(certificate.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeDetail;