import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "게스트 모드 안내",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-intro.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "스페이스 설정",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-sidebar.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "이력서&포트폴리오 - 이력서",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-resume.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "이력서&포트폴리오 - 포트폴리오",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-portfolio.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "이력서&포트폴리오 - 일정/채용공고",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-schedule.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "기술면접 - 공부하기",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-study.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "기술면접 - 시험보기1",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-contest-1.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "기술면접 - 시험보기2",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-contest-2.png)`
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "기술면접 - 필기노트",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex justify-center">
            <div
              className="w-full h-[500px] bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url(/help/Help-note.png)`
              }}
            />
          </div>
        </div>
      )
    }
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-[800px] border-none shadow-lg [&>button]:hidden bg-transparent gap-0">
        <DialogHeader className="flex flex-row items-center justify-between mb-0">
          <div className="text-xl font-bold text-white"></div>
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={onClose}
          >
            SKIP
          </Button>
        </DialogHeader>
        <div className="relative">
          <div className="space-y-4 py-0">
            {slides[currentSlide].content}
          </div>
          {/* 슬라이드 네비게이션 */}
          <div className="flex justify-between items-center mt-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className="text-white hover:text-white/80 hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-white">
              {currentSlide + 1} / {slides.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              className="text-white hover:text-white/80 hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
