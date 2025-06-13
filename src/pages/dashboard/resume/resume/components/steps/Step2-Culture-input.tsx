import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Step2CultureInputProps {
  onStateChange: (field: string, value: string[]) => void;
  initialState: {
    additionalInfo: string[];
  };
}

export const Step2CultureInput: React.FC<Step2CultureInputProps> = ({
  onStateChange,
  initialState
}) => {
  const [additionalInfo, setAdditionalInfo] = useState<string[]>(initialState.additionalInfo || []);

  React.useEffect(() => {
    setAdditionalInfo(initialState.additionalInfo || []);
  }, [initialState.additionalInfo]);

  const handleInfoChange = (index: number, value: string) => {
    const newInfo = [...additionalInfo];
    newInfo[index] = value;
    setAdditionalInfo(newInfo);
    onStateChange('additionalInfo', newInfo);
  };

  const handleAddInfo = () => {
    if (additionalInfo.length < 5) {
      const newInfo = [...additionalInfo, ''];
      setAdditionalInfo(newInfo);
      onStateChange('additionalInfo', newInfo);
    }
  };

  const handleRemoveInfo = (index: number) => {
    const newInfo = additionalInfo.filter((_, i) => i !== index);
    setAdditionalInfo(newInfo);
    onStateChange('additionalInfo', newInfo);
  };

  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-base">
          추가 정보 <span className="text-sm font-normal text-muted-foreground">(최대 5개)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
        <div className="space-y-3">
          {additionalInfo.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              추가 정보를 입력해주세요
            </div>
          ) : (
            additionalInfo.map((info, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  placeholder="추가 정보를 입력해주세요."
                  value={info}
                  onChange={(e) => handleInfoChange(index, e.target.value)}
                  className="h-[100px] resize-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveInfo(index)}
                  className="h-8 w-8 shrink-0"
                >
                  <X size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
        {additionalInfo.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddInfo}
            className="w-full sticky bottom-0 bg-background"
          >
            <Plus size={14} className="mr-1" />
            추가 정보 입력
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
