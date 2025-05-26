import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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


// API 기본 URL
const apiUrl = import.meta.env.VITE_API_URL || '';


const ResumeCreate: React.FC = () => {
    const navigate = useNavigate();
    const { spaceId } = useParams<{ spaceId: string }>();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            coverLetters
        };

        try {
            const response = await axios.post(`${apiUrl}/api/v1/resume/${spaceId}/resume`,
                formData
                , {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                });

            if (response.status === 200 || response.status === 201) {
                navigate(`/space/${spaceId}/resume/resumes`);
            }
        } catch (error) {
            console.error('이력서 생성 중 오류 발생:', error);
            // TODO: 에러 처리 UI 추가
        }
    };

    return (
        <div className="p-6">
            <div className="mb-5 gap-2">
                <div className="pt-2 gap-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <Button type="submit">저장</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResumeCreate;
