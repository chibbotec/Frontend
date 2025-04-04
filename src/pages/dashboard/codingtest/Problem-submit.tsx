import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from "lucide-react";

// shadcn UI 컴포넌트
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Submission from '@/pages/dashboard/codingtest/Submmission';
import SimpleCodeEditor from '@/pages/dashboard/codingtest/Code-editor';


import { useSidebar } from "@/components/ui/sidebar";

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// 인터페이스 정의
interface Problem {
  id: string;
  _id: string;
  title: string;
  description: string;
  input_description: string;
  output_description: string;
  time_limit: number;
  memory_limit: number;
  difficulty: string;
  samples: { input: string; output: string }[];
  languages: string[];
  template: Record<string, string>;
  hint: string;
  source: string;
  rule_type: string;
  io_mode: {
    io_mode: string;
    input?: string;
    output?: string;
  };
  spj: boolean;
}

interface LanguageOption {
  name: string;
  description: string;
  content_type?: string;
  config?: {
    template?: string;
  };
}

const ProblemSubmit: React.FC = () => {
  const { spaceId, problemId } = useParams<{ spaceId: string; problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [editorTheme, setEditorTheme] = useState<string>('light');
  const [containerBgColor, setContainerBgColor] = useState<string>('bg-blue-50');
  const [pendingLanguage, setPendingLanguage] = useState<string>('');
  const submitCodeRef = useRef<(() => void) | null>(null);
  const sidebar = useSidebar();


  // 페이지 마운트 시 사이드바 접기
  useEffect(() => {
    console.log('Sidebar state:', {
      sidebar: !!sidebar,
      isMobile: sidebar?.isMobile,
      open: sidebar?.open
    });

    if (sidebar) {
      // 모바일이 아니고, 사이드바가 열려있다면
      if (!sidebar.isMobile && sidebar.open) {
        console.log('Attempting to close sidebar');
        sidebar.setOpen(false);
        sidebar.toggleSidebar();
      }
    }

    return () => {
      if (sidebar && !sidebar.isMobile && !sidebar.open) {
        console.log('Attempting to open sidebar');
        sidebar.setOpen(true)
        sidebar.toggleSidebar();
      }
    };
  }, [sidebar]);

  // 문제 데이터 가져오기
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/${spaceId}/problems/${problemId}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        setProblem(response.data.data);
        console.log("받은 문제 데이터:", response.data.data);

        // 언어가 있으면 첫 번째 언어 선택
        if (response.data.data.languages && response.data.data.languages.length > 0) {
          setSelectedLanguage(response.data.data.languages[0]);

          // 선택된 언어의 템플릿 코드가 있으면 설정
          const template = response.data.data.template?.[response.data.data.languages[0]];
          if (template) {
            setCode(template);
          }
        }
      } catch (error) {
        console.error('문제 데이터 로드 오류:', error);
        setDialogMessage('문제를 불러오는데 실패했습니다.');
        setShowDialog(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/languages`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setLanguages(response.data.data.languages);
        console.log(languages);
      } catch (error) {
        console.error('언어 목록 로드 오류:', error);
      }
    };

    fetchProblemData();
    fetchLanguages();
  }, [spaceId, problemId]);

  // 언어 변경 핸들러 수정
  const handleLanguageChange = (value: string) => {
    // 현재 코드가 템플릿과 다른지 확인
    const currentTemplateCode = problem?.template?.[selectedLanguage];
    const isCodeModified = code && currentTemplateCode && code !== currentTemplateCode;

    // 사용자가 코드를 수정했고, 언어를 변경하려는 경우 확인 대화상자 표시
    if (isCodeModified) {
      setDialogMessage('언어를 변경하면 작성한 코드가 초기화됩니다. 계속하시겠습니까?');
      setPendingLanguage(value); // 변경하려는 언어 임시 저장
      setShowDialog(true);
      return;
    }

    // 바로 언어 변경 진행
    applyLanguageChange(value);
  };

  // 언어 변경을 실제로 적용하는 함수
  const applyLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    console.log(`언어 변경: ${language}`);
    console.log(`템플릿:`, problem?.template?.[language]);

    // 선택된 언어의 템플릿 코드가 있으면 설정
    if (problem?.template && language in problem.template) {
      setCode(problem.template[language]);
    } else {
      // 템플릿이 없으면 빈 코드
      setCode('');
    }
  };

  // handleSubmitCode 함수 수정
  const handleSubmitCode = () => {
    console.log("1. 제출 버튼 클릭됨!");

    if (!code.trim()) {
      setDialogMessage('코드를 입력해주세요.');
      setShowDialog(true);
      console.log("2. 코드 없음으로 제출 취소");
      return;
    }
    // 제출 상태를 true로 설정
  setSubmitting(true);

    // 더 상세한 디버깅 정보
    console.log("3. submitCodeRef 상태:", submitCodeRef.current ? "함수 있음" : "함수 없음");

    if (submitCodeRef.current) {
      try {
        console.log("4. 제출 함수 호출 직전");

        // 함수 호출 시도 전 상태 저장
        const beforeState = {
          code: code.length,
          language: selectedLanguage,
          problem: problemId
        };
        console.log("5. 호출 전 상태:", beforeState);

        // 함수 직접 호출
        submitCodeRef.current();

        console.log("6. 제출 함수 호출 후");
      } catch (error) {
        console.error("7. 제출 중 오류 발생:", error);
      }
    } else {
      console.error("8. submitCodeRef.current가 null입니다");
    }
  };

  // 결과 핸들러
  const handleSubmissionResult = (result: any) => {
    console.log('결과 업데이트:', result);
    setSubmissionResult(result);
    setSubmitting(false);
  };

  // 제출 ID 핸들러
  const handleSubmissionId = (id: string) => {
    setLastSubmissionId(id);
  };

  // 난이도에 따른 배지 색상
  const getDifficultyBadgeClass = (difficulty: string) => {
    if (editorTheme === 'dark' || editorTheme === 'monokai') {
      // 다크 테마일 때
      switch (difficulty) {
        case 'Low': return 'bg-green-900 text-green-100';
        case 'Mid': return 'bg-yellow-900 text-yellow-100';
        case 'High': return 'bg-red-900 text-red-100';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      // 라이트 테마일 때
      switch (difficulty) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Mid': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // 제출 결과에 따른 배지 색상
  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Wrong Answer': return 'bg-red-100 text-red-800';
      case 'Time Limit Exceeded': return 'bg-yellow-100 text-yellow-800';
      case 'Memory Limit Exceeded': return 'bg-orange-100 text-orange-800';
      case 'Runtime Error': return 'bg-purple-100 text-purple-800';
      case 'Compilation Error': return 'bg-blue-100 text-blue-800';
      case 'Waiting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultText = (resultCode: number | null | undefined): string => {
    if (resultCode === null || resultCode === undefined) {
      return 'Waiting';
    }

    switch (resultCode) {
      case 0: return 'Accepted';
      case -1: return 'Wrong Answer';
      case -2: return 'Compilation Error';
      case 1:
      case 2: return 'Time Limit Exceeded';
      case 3: return 'Memory Limit Exceeded';
      case 4: return 'Runtime Error';
      case 5: return 'System Error';
      case 6: return 'Waiting';
      case 7: return 'Judging';
      case 8: return 'Partially Accepted';
      default: return 'Waiting';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">문제를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleThemeChange = (theme: string) => {
    setEditorTheme(theme);

    // 테마에 따른 배경색 설정
    switch (theme) {
      case 'light':
        setContainerBgColor('bg-blue-50');
        break;
      case 'dark':
        setContainerBgColor('bg-slate-900');
        break;
      case 'material':
        setContainerBgColor('bg-indigo-50');
        break;
      case 'monokai':
        setContainerBgColor('bg-zinc-900');
        break;
      default:
        setContainerBgColor('bg-blue-50');
    }
  };

  return (
    <div className={`w-full h-full ${containerBgColor} transition-colors duration-300`}>
      <div className="flex items-center justify-between m-4 ">
        <h1 className={`text-2xl font-bold ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white' : 'text-black'}`}>
          {problem.title}
        </h1>
        <div className="flex items-center gap-3">

          <Tabs
            value={editorTheme}
            onValueChange={handleThemeChange}
            className={`w-auto ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white' : ''}`}
          >
            <TabsList className={`${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-700 border-gray-600' : ''}`}>
              <TabsTrigger
                value="light"
                className={`${editorTheme === 'light' ? 'bg-blue-100' : ''} ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300' : ''}`}
              >
                Light
              </TabsTrigger>
              <TabsTrigger
                value="dark"
                className={`${editorTheme === 'dark' ? 'bg-gray-700' : ''} ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300' : ''}`}
              >
                Dark
              </TabsTrigger>
              <TabsTrigger
                value="material"
                className={`${editorTheme === 'material' ? 'bg-indigo-100' : ''} ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300' : ''}`}
              >
                Material
              </TabsTrigger>
              <TabsTrigger
                value="monokai"
                className={`${editorTheme === 'monokai' ? 'bg-zinc-700' : ''} ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300' : ''}`}
              >
                Monokai
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className={`w-[140px] ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
              <SelectValue placeholder="언어 선택" className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white' : ''} />
            </SelectTrigger>
            <SelectContent className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-800 text-white border-gray-700' : ''}>
              {problem.languages.map(lang => (
                <SelectItem
                  key={lang}
                  value={lang}
                  className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : ''}
                >
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={editorTheme === 'dark' || editorTheme === 'monokai' ? 'default' : 'default'}
            onClick={() => navigate(`/space/${spaceId}/problemList`)}
            className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white hover:bg-gray-700' : ''}
          >
            목록으로
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-1 h-[80vh] mx-3 overflow-hidden">
        {/* 왼쪽: 문제 설명 */}
        <div className="w-full lg:w-1/3">
          <Card className={`h-full flex flex-col ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
            <CardHeader className="flex-shrink-0">
              <div>
                <CardDescription className={`${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-300' : ''}`}>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyBadgeClass(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'border-gray-600 text-gray-300' : ''}
                    >
                      시간 제한: {problem.time_limit}ms
                    </Badge>
                    <Badge
                      variant="outline"
                      className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'border-gray-600 text-gray-300' : ''}
                    >
                      메모리 제한: {problem.memory_limit}MB
                    </Badge>
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-6 pb-8" style={{ height: 'calc(100vh - 240px)' }}>
              <div>
                <h3 className="text-lg font-bold mb-2">문제 설명</h3>
                <div className="whitespace-pre-wrap">{problem.description}</div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold mb-2">입력 설명</h3>
                <div className="whitespace-pre-wrap">{problem.input_description}</div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold mb-2">출력 설명</h3>
                <div className="whitespace-pre-wrap">{problem.output_description}</div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-bold mb-2">예제</h3>
                {problem.samples.map((sample, index) => (
                  <div key={index} className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">예제 입력 {index + 1}</h4>
                        <pre className={`p-3 rounded-md ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'} font-mono whitespace-pre-wrap`}>
                          {sample.input}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">예제 출력 {index + 1}</h4>
                        <pre className={`p-3 rounded-md ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'} font-mono whitespace-pre-wrap`}>
                          {sample.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {problem.hint && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-bold mb-2">힌트</h3>
                    <div className="whitespace-pre-wrap">{problem.hint}</div>
                  </div>
                </>
              )}

              {problem.source && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-bold mb-2">출처</h3>
                    <div>{problem.source}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 코드 에디터 & 제출 결과 */}
        <div className="w-full lg:w-2/3 h-full overflow-hidden">
          <Card className={`h-full flex flex-col ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
            <CardHeader className="flex-shrink-0">
              <div className="flex justify-between items-center">
                <CardTitle className={`${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white' : ''}`}>
                  코드 제출
                </CardTitle>
                <Button
                  onClick={handleSubmitCode}
                  disabled={submitting || !selectedLanguage}
                  variant={editorTheme === 'dark' || editorTheme === 'monokai' ? 'ghost' : 'default'}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  제출하기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden pt-0 px-3">
              {/* 코드 에디터 (2/3 높이) */}
              <div className="h-full my-0 overflow-hidden">
                <div className="h-full border rounded-md overflow-y-auto">
                  {/* <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage.toLowerCase()}
                  /> */}
                  <SimpleCodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage.toLowerCase()}
                    theme={editorTheme}
                  />
                </div>
              </div>

              {/* 채점 결과 (1/3 높이) */}
              <div className={`h-1/4 overflow-y-auto border rounded-md my-4 p-4 ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-lg font-medium ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-white' : ''}`}>
                    채점 결과
                  </h3>
                  {lastSubmissionId && submissionResult && (
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>제출 ID:</h4>
                      <p className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-300' : ''}>{lastSubmissionId}</p>
                    </div>
                  )}
                </div>

                {/* Submission 컴포넌트 사용 */}
                <Submission
                  spaceId={spaceId || ''}
                  problemId={problemId || ''}
                  code={code}
                  language={selectedLanguage}
                  onResult={handleSubmissionResult}
                  onSubmissionId={handleSubmissionId}
                  theme={editorTheme}
                  submitRef={submitCodeRef}
                />

                {/* 제출 결과가 있을 때만 표시 */}
                {lastSubmissionId && submissionResult && (
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div>
                        <h4 className={`font-medium mb-1 ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>실행 시간</h4>
                        <p className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-300' : ''}>
                          {submissionResult.statistic_info?.time_cost || 0} ms
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>메모리 사용량</h4>
                        <p className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-300' : ''}>
                          {submissionResult.statistic_info?.memory_cost || 0} KB
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>언어</h4>
                        <p className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-300' : ''}>
                          {submissionResult.language}
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>상태</h4>
                        <Badge className={getResultBadgeClass(getResultText(submissionResult.result))}>
                          {getResultText(submissionResult.result)}
                        </Badge>
                      </div>
                    </div>

                    {submissionResult.info && (
                      <>
                        <Separator className={editorTheme === 'dark' || editorTheme === 'monokai' ? 'bg-gray-600' : ''} />
                        <div>
                          <h4 className={`font-medium mb-2 ${editorTheme === 'dark' || editorTheme === 'monokai' ? 'text-gray-200' : ''}`}>상세 정보</h4>
                          <pre className={`p-3 rounded-md font-mono whitespace-pre-wrap text-xs ${editorTheme === 'dark' || editorTheme === 'monokai'
                            ? 'bg-gray-800 text-gray-300 border border-gray-700'
                            : 'bg-white border'
                            }`}>
                            {typeof submissionResult.info === 'string'
                              ? submissionResult.info
                              : JSON.stringify(submissionResult.info, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>알림</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              취소
            </Button>
            <Button onClick={() => {
              if (pendingLanguage) {
                applyLanguageChange(pendingLanguage);
                setPendingLanguage('');
              }
              setShowDialog(false);
            }}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemSubmit;