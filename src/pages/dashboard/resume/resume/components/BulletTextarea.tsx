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

      if (currentLine === '• ') {
        const beforeCurrentLine = lines.slice(0, currentLineIndex).join('\n');
        const afterCurrentLine = lines.slice(currentLineIndex + 1).join('\n');
        const newValue =
          beforeCurrentLine +
          (beforeCurrentLine ? '\n' : '') +
          (afterCurrentLine ? '\n' + afterCurrentLine : '');
        onChange(newValue);

        setTimeout(() => {
          const newPosition = beforeCurrentLine.length + (beforeCurrentLine ? 1 : 0);
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        const newValue = value.slice(0, start) + '\n• ' + value.slice(end);
        onChange(newValue);

        setTimeout(() => {
          textarea.setSelectionRange(start + 3, start + 3);
        }, 0);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    newValue = newValue.split('\n').map(line => {
      if (line.trim() && !line.startsWith('• ')) {
        return '• ' + line;
      }
      return line;
    }).join('\n');
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