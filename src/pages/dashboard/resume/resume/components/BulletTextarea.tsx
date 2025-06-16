import React, { KeyboardEvent } from 'react';

interface BulletTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const BulletTextarea: React.FC<BulletTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lines = value.split('\n');
      const currentLineIndex = value.substring(0, start).split('\n').length - 1;
      const currentLine = lines[currentLineIndex];

      // 현재 라인의 내용만 유지하고 새로운 불릿 라인 추가
      const newValue = value.slice(0, start) + '\n• ';

      onChange(newValue);

      // 커서를 새로운 불릿 다음으로 이동
      setTimeout(() => {
        const newPosition = start + 3;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const lines = newValue.split('\n');

    // 첫 번째 라인에만 불릿 추가
    if (lines.length === 1 && !lines[0].startsWith('• ') && lines[0].trim()) {
      onChange('• ' + lines[0]);
      return;
    }

    // 그 외의 경우는 입력값 그대로 사용
    onChange(newValue);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || '• 여기에 입력하세요...'}
      className={className}
      spellCheck={false}
    />
  );
};

export default BulletTextarea; 