import React, { useState, useMemo, useEffect } from 'react';
import { MainPageCalendar } from '@/components/ui/calendar-main';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DescriptionCreateModal } from './component/Description-create-modal';
import { DescriptionDetailModal } from './component/Description-detail-modal';
import { DescriptionEditModal } from './component/Description-edit-modal';
import { SortableProcessCard, ProcessCard } from './component/Drag-and-Drop-card';
import { useSpace } from '@/context/SpaceContext';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ApplyDetailModal } from './component/Apply-detail-modal';
import { ApplyCreateModal } from './component/Apply-create-modal';

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

interface JobApplicationResponse {
  id: string;
  userId: number;
  spaceId: number;
  company: string;
  position: string;
  platform: string;
  processStatus: string;
  resume: {
    id: string;
    title: string;
  };
  portfolios: Array<{
    id: string;
    title: string;
  }>;
  files: Array<{
    oringinalFileName: string;
    uuidFileName: string;
  }>;
}

interface ApplicationStatus {
  id: string;
  label: string;
  section: string;
}

const APPLICATION_STATUSES: ApplicationStatus[] = [
  { id: 'RESUME', label: '지원서', section: 'resume' },
  { id: 'DOCUMENT', label: '서류', section: 'document' },
  { id: 'CODING', label: '코딩테스트', section: 'coding' },
  { id: 'INTERVIEW1', label: '1차면접', section: 'interview1' },
  { id: 'INTERVIEW2', label: '2차면접', section: 'interview2' },
  { id: 'PASS', label: '합격', section: 'pass' },
  { id: 'FAIL', label: '불합격', section: 'fail' },
];

const initialCards: ProcessCard[] = [
  {
    id: "1",
    company: "테크 컴퍼니",
    position: "프론트엔드 개발자",
    platform: "잡코리아",
    status: "서류 검토중",
    date: "2024-03-20",
    section: "resume",
    resume: { id: "1", title: "프론트엔드 개발자 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "2",
    company: "AI 스타트업",
    position: "백엔드 개발자",
    platform: "사람인",
    status: "서류 전형",
    date: "2024-03-21",
    section: "document",
    resume: { id: "2", title: "백엔드 개발자 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "3",
    company: "핀테크 기업",
    position: "풀스택 개발자",
    platform: "원티드",
    status: "코딩테스트",
    date: "2024-03-22",
    section: "coding",
    resume: { id: "3", title: "풀스택 개발자 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "4",
    company: "게임 회사",
    position: "게임 클라이언트",
    platform: "잡코리아",
    status: "1차 면접",
    date: "2024-03-23",
    section: "interview1",
    resume: { id: "4", title: "게임 클라이언트 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "5",
    company: "보안 기업",
    position: "보안 엔지니어",
    platform: "사람인",
    status: "2차 면접",
    date: "2024-03-24",
    section: "interview2",
    resume: { id: "5", title: "보안 엔지니어 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "6",
    company: "클라우드 기업",
    position: "DevOps 엔지니어",
    platform: "원티드",
    status: "최종합격",
    date: "2024-03-25",
    section: "pass",
    resume: { id: "6", title: "DevOps 엔지니어 이력서" },
    portfolio: [],
    files: []
  },
  {
    id: "7",
    company: "블록체인 스타트업",
    position: "블록체인 개발자",
    platform: "잡코리아",
    status: "불합격",
    date: "2024-03-26",
    section: "fail",
    resume: { id: "7", title: "블록체인 개발자 이력서" },
    portfolio: [],
    files: []
  }
];

const DroppableSection: React.FC<{
  id: string;
  title: string;
  cards: ProcessCard[];
  showDivider?: boolean;
  onCardClick?: (card: ProcessCard) => void;
  onAddCard?: (section: string) => void;
  showAddButton?: boolean;
}> = ({ id, title, cards, showDivider = true, onCardClick, onAddCard, showAddButton = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleCardClick = (card: ProcessCard) => {
    console.log('Card clicked in DroppableSection:', card);
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div className="col-span-1 relative pr-2 h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{title}</div>
        {showAddButton && (
          <button
            onClick={() => onAddCard?.(id)}
            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            + 추가
          </button>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={`h-[calc(100%-2.5rem)] rounded-lg transition-colors ${isOver ? 'bg-blue-50' : ''}`}
      >
        <div className="h-full p-2">
          {cards.length > 0 ? (
            <div className="h-full">
              <SortableContext
                items={cards.map(card => card.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {cards.map((card) => (
                    <SortableProcessCard
                      key={card.id}
                      card={card}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              {showAddButton ? "지원서를 추가해주세요" : ""}
            </div>
          )}
        </div>
      </div>
      {showDivider && <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-200"></div>}
    </div>
  );
};

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
  const [cards, setCards] = useState<ProcessCard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isApplyDetailModalOpen, setIsApplyDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ProcessCard | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const activeCard = cards.find(card => card.id === active.id);
      const overCard = cards.find(card => card.id === over.id);
      const overSection = over.id as string;

      if (activeCard) {
        // 같은 섹션 내에서 순서 변경
        if (overCard && activeCard.section === overCard.section) {
          const oldIndex = cards.findIndex(card => card.id === active.id);
          const newIndex = cards.findIndex(card => card.id === over.id);
          setCards(arrayMove(cards, oldIndex, newIndex));
        }
        // 다른 섹션으로 이동
        else if (['resume', 'document', 'coding', 'interview1', 'interview2', 'pass', 'fail'].includes(overSection)) {
          const newStatus = APPLICATION_STATUSES.find(status => status.section === overSection)?.id;
          if (newStatus) {
            try {
              const apiUrl = import.meta.env.VITE_API_URL || '';
              await axios.patch(
                `${apiUrl}/api/v1/resume/${currentSpace?.id}/job-application/${activeCard.id}/process`,
                newStatus,
                {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'text/plain',
                  },
                }
              );

              setCards(cards.map(card =>
                card.id === active.id
                  ? { ...card, section: overSection, status: newStatus }
                  : card
              ));
            } catch (error) {
              console.error('상태 변경에 실패했습니다:', error);
              // 실패 시 원래 상태로 되돌리기
              setCards(cards);
            }
          }
        }
      }
    }
    setActiveId(null);
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const getCardsBySection = (section: string) => {
    return cards.filter(card => card.section === section);
  };

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

  const fetchJobApplications = async () => {
    if (!currentSpace?.id) return;

    try {
      setLoading(true);
      const response = await axios.get<JobApplicationResponse[]>(
        `${apiUrl}/api/v1/resume/${currentSpace.id}/job-application`,
        { withCredentials: true }
      );

      // Map API response to ProcessCard format
      const mappedCards = response.data.map(app => ({
        id: app.id,
        company: app.company,
        position: app.position,
        platform: app.platform,
        status: app.processStatus,
        date: new Date().toISOString().split('T')[0], // You might want to add a date field to your backend
        section: app.processStatus.toLowerCase(),
        resume: app.resume,
        portfolio: app.portfolios,
        files: app.files.map(f => new File([], f.oringinalFileName))
      }));

      setCards(mappedCards);
    } catch (error) {
      console.error('지원서 목록을 불러오는데 실패했습니다:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
    fetchJobApplications();
  }, [currentSpace?.id]);

  const handleCardClick = (card: ProcessCard) => {
    console.log('Card clicked in DescriptionList:', card);
    setSelectedCard(card);
    setIsApplyDetailModalOpen(true);
  };

  const handleStatusChange = (cardId: string, newStatus: string) => {
    console.log('Status change requested:', { cardId, newStatus });
    const newSection = APPLICATION_STATUSES.find(status => status.id === newStatus)?.section;
    if (newSection) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, status: newStatus, section: newSection }
            : card
        )
      );
    }
  };

  const handleAddCard = (section: string) => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (newCard: ProcessCard) => {
    setCards(prevCards => [...prevCards, newCard]);
  };

  return (
    <div className="container mx-auto p-4 gap-4">
      {/* Main container with responsive grid */}
      <div className="grid grid-cols-1 gap-4 rounded-lg shadow p-4 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-h-[350px] relative">
            <DroppableSection
              id="resume"
              title="지원서 목록"
              cards={getCardsBySection('resume')}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
              showAddButton={true}
            />
            <DroppableSection
              id="document"
              title="서류전형"
              cards={getCardsBySection('document')}
              onCardClick={handleCardClick}
            />
            <DroppableSection
              id="coding"
              title="코딩테스트/과제"
              cards={getCardsBySection('coding')}
              onCardClick={handleCardClick}
            />
            <DroppableSection
              id="interview1"
              title="1차 면접"
              cards={getCardsBySection('interview1')}
              onCardClick={handleCardClick}
            />
            <DroppableSection
              id="interview2"
              title="2차 면접"
              cards={getCardsBySection('interview2')}
              onCardClick={handleCardClick}
            />
            <div className="col-span-1">
              <div className="flex flex-col gap-4 h-full">
                <div className="h-1/2">
                  <DroppableSection
                    id="pass"
                    title="최종합격"
                    cards={getCardsBySection('pass')}
                    showDivider={false}
                    onCardClick={handleCardClick}
                  />
                </div>
                <div className="h-1/2">
                  <DroppableSection
                    id="fail"
                    title="불합격"
                    cards={getCardsBySection('fail')}
                    showDivider={false}
                    onCardClick={handleCardClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <SortableProcessCard
                card={cards.find(card => card.id === activeId) || initialCards[0]}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
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
      {selectedCard && (
        <ApplyDetailModal
          isOpen={isApplyDetailModalOpen}
          onClose={() => {
            console.log('Modal closing');
            setIsApplyDetailModalOpen(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
          onStatusChange={handleStatusChange}
          spaceId={currentSpace?.id?.toString() || ''}
          onDeleted={fetchJobApplications}
        />
      )}

      <ApplyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        spaceId={currentSpace?.id?.toString() || ''}
      />
    </div>
  );
};

export default DescriptionList;
