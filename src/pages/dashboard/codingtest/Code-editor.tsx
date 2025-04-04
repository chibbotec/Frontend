import React, { useEffect, useRef, useState } from 'react';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { material } from '@uiw/codemirror-theme-material';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Extension } from '@codemirror/state';

// 테마 객체 정의
type ThemeType = 'light' | 'dark' | 'material' | 'monokai';

const themes: Record<ThemeType, Extension> = {
  light: [] as unknown as Extension,
  dark: oneDark,
  material: material,
  monokai: monokai
};

// 언어 매핑
const languageExtensions: Record<string, any> = {
  'javascript': javascript(),
  'js': javascript(),
  'typescript': javascript({ typescript: true }),
  'ts': javascript({ typescript: true }),
  'c': cpp(),
  'cpp': cpp(),
  'c++': cpp(),
  'java': java(),
  'python': python(),
  'python2': python(),
  'python3': python(),
  'py': python()
};

interface SimpleCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme: string;
}

const SimpleCodeEditor: React.FC<SimpleCodeEditorProps> = ({
  value,
  onChange,
  language,
  theme = 'light'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(language?.toLowerCase() || 'javascript');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>((theme as ThemeType) || 'light');

  // 에디터 초기화
useEffect(() => {
    if (!editorRef.current) return;
    
    // 이미 에디터가 있다면 삭제
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }
  
    // 언어 확장 결정
    const langExt = languageExtensions[currentLanguage] || javascript();
    
    // 테마 확장 결정
    const themeExt = themes[currentTheme as ThemeType] || themes.light;
  
    // 20줄까지 표시하기 위한 빈 줄 추가
    let initialContent = value;
    const lineCount = (value.match(/\n/g) || []).length + 1;
    
    // 내용의 줄 수가 20줄 미만이면 빈 줄 추가
    if (lineCount < 25) {
      const emptyLines = '\n'.repeat(25 - lineCount);
      initialContent += emptyLines;
    }
  
    // 새 에디터 상태 생성
    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        langExt,
        themeExt,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            // 실제 코드 내용만 상위 컴포넌트에 전달 (빈 줄 제외)
            const content = update.state.doc.toString();
            const actualContent = content.trimEnd();
            onChange(actualContent);
          }
        })
      ]
    });
  
    // 에디터 뷰 생성
    const view = new EditorView({
      state,
      parent: editorRef.current
    });
  
    viewRef.current = view;
  
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [editorRef, currentLanguage, currentTheme]);

  // language prop 변경 시
  useEffect(() => {
    const newLanguage = language?.toLowerCase() || 'javascript';
    if (newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);
    }
  }, [language]);

  // theme prop 변경 시
  useEffect(() => {
    if (theme !== currentTheme && isValidTheme(theme)) {
      setCurrentTheme(theme as ThemeType);
    }
  }, [theme]);

  // theme 값이 유효한지 확인하는 함수
  const isValidTheme = (themeValue: string): themeValue is ThemeType => {
    return ['light', 'dark', 'material', 'monokai'].includes(themeValue);
  };

// value prop 변경 시 (외부에서 코드 변경될 때)
useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString().trimEnd()) {
      // 현재 에디터의 내용 가져오기
      const currentContent = viewRef.current.state.doc.toString();
      
      // 줄 수 계산
      const lineCount = (value.match(/\n/g) || []).length + 1;
      let newContent = value;
      
      // 내용의 줄 수가 20줄 미만이면 빈 줄 추가
      if (lineCount < 25) {
        const emptyLines = '\n'.repeat(25 - lineCount);
        newContent += emptyLines;
      }
      
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: newContent
        }
      });
      viewRef.current.dispatch(transaction);
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      id="simple-code-editor"
      className="w-full h-full"
      style={{ height: '100%' }}
    />
  );
};

export default SimpleCodeEditor;