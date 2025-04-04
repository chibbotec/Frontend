// CodeMirror.tsx - 테마 변경 문제 해결
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Upload } from 'lucide-react';

// CodeMirror 6 관련 import
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightSpecialChars } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { foldGutter } from '@codemirror/language';
import { indentOnInput, bracketMatching, foldKeymap } from '@codemirror/language';
import { EditorState, Extension } from '@codemirror/state';

// 테마 관련 import
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// 언어 지원
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { go } from '@codemirror/lang-go';

// shadcn 컴포넌트
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeEditorProps {
  value: string;
  onChange: (newCode: string) => void;
  language: string;
  onLanguageChange?: (newLanguage: string) => void;
  languages?: string[];
  theme?: string;
  onThemeChange?: (newTheme: string) => void;
  onReset?: () => void;
  mode?: string;
}

// 테마 정의
const monokaiTheme = () => {
  // 모노카이 테마의 구문 강조 스타일
  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: '#F92672' },
    { tag: tags.operator, color: '#F92672' },
    { tag: tags.typeName, color: '#66D9EF', fontStyle: 'italic' },
    { tag: tags.function(tags.variableName), color: '#66D9EF' },
    { tag: tags.string, color: '#E6DB74' },
    { tag: tags.comment, color: '#75715E' },
    { tag: tags.number, color: '#AE81FF' },
    { tag: tags.className, color: '#A6E22E' },
    { tag: tags.definition(tags.propertyName), color: '#FD971F' },
    { tag: tags.punctuation, color: '#F8F8F2' }
  ]);

  // 테마와 구문 강조를 함께 반환
  return [
    EditorView.theme({
      "&": {
        backgroundColor: "#272822",
        color: "#F8F8F2"
      },
      ".cm-content": { caretColor: "#F8F8F0" },
      ".cm-cursor": { borderLeftColor: "#F8F8F0" },
      ".cm-selectionBackground, .cm-selectionBackground.cm-selection": { backgroundColor: "#49483E" },
      ".cm-activeLine": { backgroundColor: "#3E3D32" },
      ".cm-activeLineGutter": { backgroundColor: "#3E3D32" },
      ".cm-gutters": {
        backgroundColor: "#272822",
        color: "#75715E",
        border: "none"
      },
      ".cm-lineNumbers": { color: "#75715E" }
    }, { dark: true }),
    syntaxHighlighting(highlightStyle)
  ];
};

const materialTheme = () => {
  // 머티리얼 테마의 구문 강조 스타일
  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: '#C792EA' },
    { tag: tags.operator, color: '#89DDFF' },
    { tag: tags.typeName, color: '#82AAFF', fontStyle: 'italic' },
    { tag: tags.function(tags.variableName), color: '#82AAFF' },
    { tag: tags.string, color: '#C3E88D' },
    { tag: tags.comment, color: '#546E7A' },
    { tag: tags.number, color: '#F78C6C' },
    { tag: tags.className, color: '#FFCB6B' },
    { tag: tags.definition(tags.propertyName), color: '#F07178' },
    { tag: tags.punctuation, color: '#EEFFFF' }
  ]);

  // 테마와 구문 강조를 함께 반환
  return [
    EditorView.theme({
      "&": {
        backgroundColor: "#263238",
        color: "#EEFFFF"
      },
      ".cm-content": { caretColor: "#FFCC00" },
      ".cm-cursor": { borderLeftColor: "#FFCC00" },
      ".cm-selectionBackground, .cm-selectionBackground.cm-selection": { backgroundColor: "#2C3B41" },
      ".cm-activeLine": { backgroundColor: "#1E2A30" },
      ".cm-activeLineGutter": { backgroundColor: "#1E2A30" },
      ".cm-gutters": {
        backgroundColor: "#263238",
        color: "#546E7A",
        border: "none"
      },
      ".cm-lineNumbers": { color: "#546E7A" }
    }, { dark: true }),
    syntaxHighlighting(highlightStyle)
  ];
};

const solarizedLightTheme = () => {
  // 솔라라이즈드 테마의 구문 강조 스타일
  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: '#859900' },
    { tag: tags.operator, color: '#859900' },
    { tag: tags.typeName, color: '#268BD2', fontStyle: 'italic' },
    { tag: tags.function(tags.variableName), color: '#268BD2' },
    { tag: tags.string, color: '#2AA198' },
    { tag: tags.comment, color: '#93A1A1' },
    { tag: tags.number, color: '#D33682' },
    { tag: tags.className, color: '#B58900' },
    { tag: tags.definition(tags.propertyName), color: '#CB4B16' },
    { tag: tags.punctuation, color: '#657B83' }
  ]);

  // 테마와 구문 강조를 함께 반환
  return [
    EditorView.theme({
      "&": {
        backgroundColor: "#FDF6E3",
        color: "#657B83"
      },
      ".cm-content": { caretColor: "#657B83" },
      ".cm-cursor": { borderLeftColor: "#657B83" },
      ".cm-selectionBackground, .cm-selectionBackground.cm-selection": { backgroundColor: "#EEE8D5" },
      ".cm-activeLine": { backgroundColor: "#EEE8D5" },
      ".cm-activeLineGutter": { backgroundColor: "#EEE8D5" },
      ".cm-gutters": {
        backgroundColor: "#EEE8D5",
        color: "#93A1A1",
        border: "none"
      },
      ".cm-lineNumbers": { color: "#93A1A1" }
    }),
    syntaxHighlighting(highlightStyle)
  ];
};

// 언어 확장 가져오기
const getLanguageExtension = (lang: string) => {
  switch (lang) {
    case 'C':
    case 'C++':
      return cpp();
    case 'Java':
      return java();
    case 'Python2':
    case 'Python3':
      return python();
    case 'JavaScript':
      return javascript();
    case 'Go':
      return go();
    default:
      return cpp(); // 기본값
  }
};

// 테마 확장 가져오기
const getThemeExtensions = (themeName: string): Extension[] => {
  switch (themeName) {
    case 'monokai':
      return monokaiTheme();
    case 'material':
      return materialTheme();
    case 'solarized':
    default:
      return solarizedLightTheme();
  }
};

// 기본 확장 (모든 에디터 인스턴스에 공통으로 적용)
const getBaseExtensions = (
  // doc: string,
  onChange: (v: string) => void,
  language: string,
  theme: string
): Extension[] => [
    lineNumbers(),
    highlightActiveLine(),
    highlightSpecialChars(),
    foldGutter(),
    indentOnInput(),
    bracketMatching(),
    keymap.of([...defaultKeymap, ...foldKeymap]),
    getLanguageExtension(language),
    ...getThemeExtensions(theme),
    EditorView.updateListener.of(update => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    })
  ];

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  onLanguageChange,
  languages = ['C', 'C++', 'Java', 'Python2'],
  theme = 'solarized',
  onThemeChange,
  onReset,
  // mode
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  // 테마 옵션
  const themes = [
    { label: '모노카이', value: 'monokai' },
    { label: '솔라라이즈드 라이트', value: 'solarized' },
    { label: '머티리얼', value: 'material' }
  ];

  // 에디터 상태 추적을 위한 ref 추가
  const isInitializedRef = useRef(false);

  // 에디터 생성/재생성 함수
  const createEditor = () => {
    if (!editorRef.current) return;

    const hasEditor = editorRef.current.querySelector('.cm-editor');

    // 기존 에디터가 있으면 제거
  if (hasEditor || editorView) {
    console.log('기존 에디터 제거');
    if (editorView) editorView.destroy();
    
    // DOM 요소 내부 비우기
    while (editorRef.current.firstChild) {
      editorRef.current.removeChild(editorRef.current.firstChild);
    }
  }

    // 새 에디터 생성
    console.log('새 에디터 생성:', currentLanguage, currentTheme);
    const state = EditorState.create({
      doc: value,
      // extensions: getBaseExtensions(value, onChange, currentLanguage, currentTheme)
      extensions: getBaseExtensions(onChange, currentLanguage, currentTheme)
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    setEditorView(view);
    isInitializedRef.current = true;
  };

  // useEffect 로직 통합 - 단일 useEffect로 관리
  useEffect(() => {
    // 이미 초기화 되었는지 확인 (Strict Mode에서 두 번째 호출 방지)
    if (!isInitializedRef.current) {
      console.log('에디터 초기화...');
      createEditor();
    } else {
      console.log('에디터 재생성:', currentLanguage, currentTheme);
      createEditor();
    }

    return () => {
      if (editorView) {
        editorView.destroy();
      }
    };
  }, [currentLanguage, currentTheme]); // 언어나 테마가 변경될 때만 에디터 재생성

  // 다른 useEffect에서 createEditor() 호출 제거
  useEffect(() => {
    if (currentTheme !== theme) {
      console.log('테마 props 변경됨:', theme);
      setCurrentTheme(theme);
      // createEditor() 호출 제거
    }
  }, [theme]);

  useEffect(() => {
    if (currentLanguage !== language) {
      console.log('언어 props 변경됨:', language);
      setCurrentLanguage(language);
      // createEditor() 호출 제거
    }
  }, [language]);

  // 값 변경 시 에디터 업데이트 (외부에서 값이 변경된 경우)
  useEffect(() => {
    if (editorView && editorView.state.doc.toString() !== value) {
      console.log('외부 값 변경됨');
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  // 언어 변경 핸들러
  const handleLanguageChange = (newLanguage: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    // 부모 컴포넌트가 language prop을 업데이트하면 useEffect가 트리거됨
  };

  // 테마 변경 핸들러
  const handleThemeChange = (newTheme: string) => {
    console.log('테마 변경 요청:', newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else {
      // onThemeChange가 없는 경우 직접 상태를 변경
      setCurrentTheme(newTheme);
      // setTimeout 제거 - useEffect에서 처리
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            onChange(event.target.result);

            if (editorView) {
              editorView.dispatch({
                changes: {
                  from: 0,
                  to: editorView.state.doc.length,
                  insert: event.target.result
                }
              });
            }
          }
        };
        reader.readAsText(file, 'UTF-8');
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span>언어:</span>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="언어 선택" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReset}
                  disabled={!onReset}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>기본 코드로 초기화</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFileUpload}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>파일 업로드</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <span>테마:</span>
          <Select value={currentTheme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="테마 선택" />
            </SelectTrigger>
            <SelectContent>
              {themes.map(item => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        ref={editorRef}
        id="code-editor-container"
        className="border rounded-md overflow-hidden"
        style={{ height: 'auto', minHeight: '200px' }}
      />
    </div>
  );
};

export default React.memo(CodeEditor);