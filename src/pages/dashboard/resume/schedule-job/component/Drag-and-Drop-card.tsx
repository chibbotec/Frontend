import React from 'react';
import { Card } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Search } from 'lucide-react';

export interface ProcessCard {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  date: string;
  section: string;
  resume: {
    id: string;
    title: string;
  };
  portfolio: Array<{
    id: string;
    title: string;
  }>;
  files: File[];
}

interface SortableProcessCardProps {
  card: ProcessCard;
  onClick?: (card: ProcessCard) => void;
}

export const SortableProcessCard: React.FC<SortableProcessCardProps> = ({ card, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('Button clicked - event:', e);
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked in SortableProcessCard:', card);
    if (onClick) {
      console.log('Calling onClick handler');
      onClick(card);
    } else {
      console.log('No onClick handler provided');
    }
  };

  const truncatedCompany = card.company.length > 6
    ? `${card.company.slice(0, 5)}...`
    : card.company;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <Card className="hover:shadow-md transition-shadow py-2 px-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-xs font-medium" title={card.company}>
              {truncatedCompany}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleButtonClick}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
