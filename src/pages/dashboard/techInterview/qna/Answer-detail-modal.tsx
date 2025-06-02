import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Answer = {
  id: number;
  memberId: number;
  nickname: string;
  comment: string;
  createdAt: string;
};

interface AnswerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: Answer[];
  nickname: string;
}

const AnswerDetailModal = ({ isOpen, onClose, answers, nickname }: AnswerDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{nickname}님의 답변</span>
            <Badge variant="secondary">{answers.length}개의 답변</Badge>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={answer.id} className="p-4 rounded-lg border bg-card">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">
                    답변 {index + 1}
                  </Badge>
                </div>
                <p className="text-sm whitespace-pre-line break-words">{answer.comment}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerDetailModal;
