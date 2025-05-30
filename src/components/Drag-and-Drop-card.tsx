import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface ProcessCard {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  date: string;
  section: string;
}

interface SortableProcessCardProps {
  card: ProcessCard;
}

export const SortableProcessCard: React.FC<SortableProcessCardProps> = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

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
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow gap-1 py-1 px-0">
        <CardHeader className="">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xs">{card.company}</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="font-medium ml-2">{card.position}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium ml-2">{card.platform}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium ml-2">{card.date}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 