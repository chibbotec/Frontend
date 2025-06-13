import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResumeFormData, Career as CareerType, Project as ProjectType, Education as EducationType, Certificate as CertificateType } from './components/types';
import BasicInfo from './components/BasicInfo';
import TechInfo from './components/TechInfo';
import Career from './components/Career';
import Project from './components/Project';
import Education from './components/Education';
import Certificate from './components/Certificate';
import CoverLetter from './components/Coverletter';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/authorization/login-form';

// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';

const ResumeCreate: React.FC = () => {
    const navigate = useNavigate();
    const { spaceId, id } = useParams<{ spaceId: string; id: string }>();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const isEditMode = !!id;
    const resumeData = location.state?.resumeData;
    const { isGuest, login } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        if (isGuest) {
            setIsLoginModalOpen(true);
        }
    }, [isGuest]);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 기본 정보
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [careerType, setCareerType] = useState<'신입' | '경력'>('신입');
    const [position, setPosition] = useState('');
    const [techStack, setTechStack] = useState<Set<string>>(new Set());
    const [newTech, setNewTech] = useState('');
    const [techSummary, setTechSummary] = useState<string[]>([]);

    // 링크
    const [links, setLinks] = useState<{ type: string; url: string }[]>([
        { type: 'github', url: '' },
        { type: 'notion', url: '' },
        { type: 'blog', url: '' },
    ]);

    // 경력
    const [careers, setCareers] = useState<CareerType[]>([]);

    // 프로젝트
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [projectTechInputs, setProjectTechInputs] = useState<string[]>([]);

    // 학력 및 교육 사항
    const [educations, setEducations] = useState<EducationType[]>([]);

    // 자격증 및 수상경력
    const [certificates, setCertificates] = useState<CertificateType[]>([]);

    // 자기소개서
    const [coverLetters, setCoverLetters] = useState<{ title: string; content: string }[]>([]);

    const hasLoadedProjects = useRef(false);

    useEffect(() => {
        if (hasLoadedProjects.current) return;
        hasLoadedProjects.current = true;

        // 수정 모드일 경우 navigation state에서 데이터 가져오기
        if (isEditMode && resumeData) {
            setTitle(resumeData.title || '');
            setName(resumeData.name || '');
            setEmail(resumeData.email || '');
            setPhone(resumeData.phone || '');
            setCareerType(resumeData.careerType || '신입');
            setPosition(resumeData.position || '');
            setTechStack(new Set(resumeData.techStack || []));
            setTechSummary(resumeData.techSummary ? resumeData.techSummary.split('\n') : []);
            setLinks(resumeData.links || [
                { type: 'github', url: '' },
                { type: 'notion', url: '' },
                { type: 'blog', url: '' },
            ]);
            setCareers(resumeData.careers || []);
            setProjects(resumeData.projects || []);
            setEducations(resumeData.educations || []);
            setCertificates(resumeData.certificates || []);
            setCoverLetters(resumeData.coverLetters || []);
            return;
        }

        // AI 생성 데이터가 있을 때만 파싱
        const aiGeneratedData = searchParams.get('data');
        const portfoliosData = searchParams.get('portfolios');
        const careersData = searchParams.get('careers');

        // AI 생성 데이터가 있을 때만 파싱
        if (aiGeneratedData && aiGeneratedData !== 'undefined') {
            try {
                const data = JSON.parse(aiGeneratedData);
                console.log('Parsed AI data:', data); // 디버깅용 로그

                setTitle('AI 생성 이력서');
                setPosition(data.position || '');

                // 포트폴리오 데이터 설정
                if (portfoliosData) {
                    const parsedPortfolios = JSON.parse(portfoliosData);
                    console.log('Parsed portfolios:', parsedPortfolios); // 디버깅용 로그
                    if (Array.isArray(parsedPortfolios)) {
                        const formattedProjects = parsedPortfolios.map((portfolio: any) => ({
                            name: portfolio.name,
                            description: portfolio.description,
                            techStack: Array.isArray(portfolio.techStack) ? portfolio.techStack : (typeof portfolio.techStack === 'string' ? portfolio.techStack.split(',').map((tech: string) => tech.trim()) : []),
                            role: portfolio.role || '',
                            startDate: portfolio.startDate || '',
                            endDate: portfolio.endDate || '',
                            memberCount: portfolio.memberCount || 0,
                            memberRoles: Array.isArray(portfolio.memberRoles) ? portfolio.memberRoles.join(', ') : (portfolio.memberRoles || ''),
                            githubLink: portfolio.githubLink || '',
                            deployLink: portfolio.deployLink || ''
                        }));
                        console.log('Formatted projects:', formattedProjects); // 디버깅용 로그
                        setProjects(formattedProjects);
                    }
                }

                // 경력 데이터 설정
                if (careersData) {
                    const parsedCareers = JSON.parse(careersData);
                    console.log('Parsed careers:', parsedCareers); // 디버깅용 로그
                    if (Array.isArray(parsedCareers)) {
                        setCareers(parsedCareers);
                        if (parsedCareers.length > 0) {
                            setCareerType('경력');
                        }
                    }
                }

                // 기술 스택 설정
                if (data.tech_stack) {
                    setTechStack(new Set(data.tech_stack.tech_stack || []));
                    setTechSummary(data.tech_stack.tech_summary || []);
                }

                // 자기소개서 설정
                if (data.cover_letter) {
                    setCoverLetters(data.cover_letter.coverLetter.map((item: any) => ({
                        title: item.title,
                        content: item.content
                    })));
                }

                setLinks([
                    { type: 'github', url: '' },
                    { type: 'notion', url: '' },
                    { type: 'blog', url: '' },
                ]);
                setEducations([]);
                setCertificates([]);

            } catch (error) {
                console.error('AI 생성 데이터 파싱 중 오류 발생:', error);
            }
        } else {
            setTitle('새 이력서');
            setPosition('');
            setCareerType('신입');
            setTechStack(new Set());
            setTechSummary([]);
            setCoverLetters([]);
            setLinks([
                { type: 'github', url: '' },
                { type: 'notion', url: '' },
                { type: 'blog', url: '' },
            ]);
            setProjects([]);
            setCareers([]);
            setEducations([]);
            setCertificates([]);
        }
    }, [searchParams, resumeData, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isGuest) {
            setIsLoginModalOpen(true);
            return;
        }

        const formData: ResumeFormData = {
            title,
            name,
            email,
            phone,
            careerType,
            position,
            techStack: Array.from(techStack),
            techSummary: techSummary.join('\n'),
            links,
            careers: careers.map(career => ({
                ...career,
                startDate: career.startDate ? formatDate(new Date(career.startDate)) : '',
                endDate: career.endDate ? formatDate(new Date(career.endDate)) : ''
            })),
            projects: projects.map(project => ({
                ...project,
                role: project.role,
                startDate: project.startDate ? formatDate(new Date(project.startDate)) : '',
                endDate: project.endDate ? formatDate(new Date(project.endDate)) : ''
            })),
            educations: educations.map(education => ({
                ...education,
                startDate: education.startDate ? formatDate(new Date(education.startDate)) : '',
                endDate: education.endDate ? formatDate(new Date(education.endDate)) : ''
            })),
            certificates: certificates.map(certificate => ({
                ...certificate,
                date: certificate.date ? formatDate(new Date(certificate.date)) : ''
            })),
            coverLetters: coverLetters
        };

        try {
            if (isEditMode) {
                // 수정 모드일 경우 PUT 요청
                await axios.put(`${apiUrl}/api/v1/resume/${spaceId}/resume/${id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            } else {
                // 생성 모드일 경우 POST 요청
                await axios.post(`${apiUrl}/api/v1/resume/${spaceId}/resume`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
            navigate(`/space/${spaceId}/resume/resumes`);
        } catch (error) {
            console.error('이력서 저장 중 오류 발생:', error);
            // TODO: 에러 처리 UI 추가
        }
    };

    if (isGuest) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">이력서 작성</h2>
                <p className="text-muted-foreground mb-4">
                    이력서를 작성하려면 로그인이 필요합니다.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-5 gap-2">
                <div className="pt-2 gap-0">
                    <form onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // textarea에서는 엔터 허용, 그 외는 막기
                                if (
                                    e.target instanceof HTMLInputElement ||
                                    e.target instanceof HTMLSelectElement
                                ) {
                                    e.preventDefault();
                                }
                            }
                        }}
                        className="space-y-6">
                        <BasicInfo
                            title={title}
                            setTitle={setTitle}
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            careerType={careerType}
                            setCareerType={setCareerType}
                            position={position}
                            setPosition={setPosition}
                            links={links}
                            setLinks={setLinks}
                        />

                        <TechInfo
                            techStack={techStack}
                            setTechStack={setTechStack}
                            newTech={newTech}
                            setNewTech={setNewTech}
                            techSummary={techSummary}
                            setTechSummary={setTechSummary}
                            position={position}
                            projects={projects}
                            careers={careers}
                        />

                        {careerType === '경력' && (
                            <Career
                                careers={careers}
                                setCareers={setCareers}
                            />
                        )}

                        <Project
                            projects={projects}
                            setProjects={setProjects}
                            projectTechInputs={projectTechInputs}
                            setProjectTechInputs={setProjectTechInputs}
                            setTechStack={setTechStack}
                        />

                        <Education
                            educations={educations}
                            setEducations={setEducations}
                        />

                        <Certificate
                            certificates={certificates}
                            setCertificates={setCertificates}
                        />

                        <CoverLetter
                            coverLetters={coverLetters}
                            setCoverLetters={setCoverLetters}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(`/space/${spaceId}/resume/resumes`)}
                            >
                                취소
                            </Button>
                            <Button type="submit">{isEditMode ? '수정' : '저장'}</Button>
                        </div>
                    </form>
                </div>
            </div>
            <LoginForm
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={login}
            />
        </div>
    );
};

export default ResumeCreate;
