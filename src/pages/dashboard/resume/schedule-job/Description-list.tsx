import React, { useState, useMemo, useEffect } from 'react';
import { MainPageCalendar } from '@/components/ui/calendar-main';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DescriptionCreateModal } from './component/Description-create-modal';
import { DescriptionDetailModal } from './component/Description-detail-modal';
import { DescriptionEditModal } from './component/Description-edit-modal';
import { useSpace } from '@/context/SpaceContext';
import axios from 'axios';

interface Schedule {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

interface JobDescription {
  id: string;
  url: string | null;
  isManualInput: boolean;
  company: string;
  position: string;
  mainTasks: string[];
  requirements: string[];
  career: string;
  resumeRequirements: string[];
  recruitmentProcess: string[];
  spaceId: number;
  createdAt: string;
  updatedAt: string;
  publicGrade: string;
}

const DescriptionList = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedulesForSelected, setSchedulesForSelected] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const { currentSpace } = useSpace();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // API 기본 URL
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const fetchJobDescriptions = async () => {
    if (!currentSpace?.id) return;

    try {
      setLoading(true);
      const response = await axios.get<JobDescription[]>(
        `${apiUrl}/api/v1/resume/${currentSpace.id}/job-description`,
        { withCredentials: true }
      );
      setJobDescriptions(response.data);
    } catch (error) {
      console.error('채용 공고 목록을 불러오는데 실패했습니다:', error);
      setJobDescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, [currentSpace?.id]);

  // 더미 일정 데이터
  const dummySchedules: Schedule[] = [
    { date: '2025-05-04', title: '스터디 모임', time: '14:00', location: '스터디룸 A' },
    { date: '2025-05-04', title: '기술 면접', time: '10:00', location: '회의실 B' },
    { date: '2025-05-04', title: '이력서 피드백', time: '11:30', location: '온라인' },
    { date: '2025-05-04', title: '코딩 테스트', time: '15:30', location: '스터디룸 C' },
    { date: '2025-05-04', title: '포트폴리오 리뷰', time: '16:00', location: '회의실 A' },
    { date: '2025-05-04', title: '취업 상담', time: '17:00', location: '온라인' },
    { date: '2025-05-10', title: '이력서 제출', time: '15:00', location: '온라인' },
  ];

  // 선택된 날짜의 일정 필터링
  const selectedDateStr = selectedDate ? selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '') : '';
  const filteredSchedules = dummySchedules.filter(s => s.date === selectedDateStr);

  // 일정이 있는 날짜들을 Date 객체로 변환
  const markedDates = useMemo(() => {
    const uniqueDates = [...new Set(dummySchedules.map(s => s.date))];
    return uniqueDates.map(dateStr => new Date(dateStr));
  }, [dummySchedules]);

  return (
    <div className="container mx-auto p-4 gap-4">
      {/* Main container with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[350px]">
        {/* Left container - Calendar */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xl font-semibold mb-4">일정</p>
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <MainPageCalendar
                selectedDate={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                markedDates={markedDates}
              />
            </div>
          </div>
        </div>

        {/* Right container - Schedule List */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[350px]">
          <div className="font-semibold mb-2 text-gray-900">
            {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : '-'}
          </div>
          <div className="flex-1 overflow-y-auto max-h-[280px]">
            <ul className="text-gray-700 text-sm space-y-1">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((s, i) => (
                  <li key={i}>
                    <div className="bg-gray-100 rounded p-3 mb-2 shadow">
                      <div className="font-semibold text-gray-900">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.time}</div>
                      <div className="text-sm text-gray-700 mt-1">{s.location}</div>
                      <div className="flex gap-2 justify-end mt-2">
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="h-[280px] flex items-center justify-center">
                  <div className="bg-gray-50 rounded p-3 text-gray-400 text-center w-full h-full flex items-center justify-center">일정이 없습니다.</div>
                </li>
              )}
            </ul>
          </div>
          <div className="flex justify-end gap-1 mt-2 pt-2 border-t">
            <button className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">일정 추가</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 rounded-lg shadow p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">채용 공고</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            채용공고등록
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4 min-w-min">
            {loading ? (
              <div className="w-full text-center py-4">로딩 중...</div>
            ) : jobDescriptions.length > 0 ? (
              jobDescriptions.map((job) => (
                <Card
                  key={job.id}
                  className="flex-none w-48 md:w-64 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedJob(job);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm md:text-lg">{job.company}</h3>
                      <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${job.publicGrade === 'PUBLIC'
                        ? 'bg-blue-100 text-blue-700'
                        : job.publicGrade === 'GROUP'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {job.publicGrade === 'PUBLIC'
                          ? '전체'
                          : job.publicGrade === 'GROUP'
                            ? '그룹'
                            : '개인'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5 md:space-y-2 text-[10px] md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 whitespace-nowrap">채용 직무</span>
                      <span className="font-medium ml-2">{job.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 whitespace-nowrap">경력</span>
                      <span className="font-medium ml-2">{job.career}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 whitespace-nowrap">등록날짜</span>
                      <span className="font-medium ml-2">{new Date(job.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full text-center py-4">등록된 채용 공고가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      <DescriptionCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        spaceId={currentSpace?.id ? String(currentSpace.id) : ''}
        onCreated={fetchJobDescriptions}
      />
      <DescriptionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        jobDescription={selectedJob}
        onDeleted={fetchJobDescriptions}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />
      <DescriptionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        jobDescription={selectedJob}
        onUpdated={fetchJobDescriptions}
      />
    </div>
  );
};

export default DescriptionList;
