import React from 'react';
import axios from 'axios';
import {Wand2, Loader2, ArrowLeft, Save, Eye, Download} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface TestCaseGeneratorProps {
  apiBaseUrl: string;
  spaceId: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  selectedLanguages: string[];
  spjChecked: boolean;
  onSuccess: (testCaseId: string, fileList: any[]) => void;
  onError: (message: string) => void;
}

interface TestCaseRequestData {
  problem_description: string;
  input_description: string;
  output_description: string;
  selected_languages: string[];
  spj: boolean;
  test_case_types: string[];
  sample_solution?: {
    language: string;
    code: string;
  };
}

interface TestCase {
  [key: string]: string;
}

// TestCaseType 인터페이스 추가
interface TestCaseType {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({
                                                               apiBaseUrl,
                                                               description,
                                                               inputDescription,
                                                               outputDescription,
                                                               selectedLanguages,
                                                               spjChecked,
                                                               spaceId,
                                                               onSuccess,
                                                               onError
                                                             }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sampleLanguage, setSampleLanguage] = React.useState<string>("");
  const [sampleCode, setSampleCode] = React.useState<string>("");
  const [currentView, setCurrentView] = React.useState<"form" | "results">("form");
  const [generatedTestCases, setGeneratedTestCases] = React.useState<TestCase[]>([]);
  const [testCaseId, setTestCaseId] = React.useState<string>("");

  // 테스트 케이스 유형을 상태로 관리
  const [testCaseTypes, setTestCaseTypes] = React.useState<TestCaseType[]>([
    {id: 'basic', name: '기본 케이스', description: '문제 예시와 유사한 기본 테스트 케이스', checked: true},
    {id: 'boundary', name: '경계 케이스', description: '최소, 최대 값 등의 경계 조건 케이스', checked: true},
    {id: 'special', name: '특수 케이스', description: '예외 상황이나 특별한 패턴 케이스', checked: true},
    {id: 'large', name: '대규모 케이스', description: '성능 테스트를 위한 대용량 데이터 케이스', checked: false},
  ]);

  const generateTestCases = async () => {
    // 필수 필드 체크
    if (!description || !inputDescription || !outputDescription || selectedLanguages.length === 0) {
      onError('문제 설명, 입력 설명, 출력 설명을 모두 입력하고 적어도 하나의 프로그래밍 언어를 선택해주세요.');
      return;
    }

    // 최소 하나의 테스트 케이스 유형이 선택되었는지 확인
    const selectedTestCaseTypes = testCaseTypes.filter(type => type.checked);
    if (selectedTestCaseTypes.length === 0) {
      onError('최소 하나 이상의 테스트 케이스 유형을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);

      const testCaseId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // AI 서버로 전송할 데이터 구성
      const requestData: TestCaseRequestData = {
        problem_description: description,
        input_description: inputDescription,
        output_description: outputDescription,
        sample_solution: sampleLanguage && sampleCode 
          ? { language: sampleLanguage, code: sampleCode }
          : { language: "text", code: "// 샘플 코드가 제공되지 않았습니다." }, // 기본값 제공
        selected_languages: selectedLanguages,
        spj: spjChecked,
        test_case_types: testCaseTypes
          .filter(type => type.checked)
          .map(type => type.id)
      };


      // 샘플 코드 정보가 있으면 추가
      if (sampleLanguage && sampleCode) {
        requestData.sample_solution = {
          language: sampleLanguage,
          code: sampleCode
        };
      }

      // AI 서버에 테스트 케이스 생성 요청
      const response = await axios.post(
          `${apiBaseUrl}/api/v1/ai/${spaceId}/problems/${testCaseId}/generate-testcases`,
          requestData,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
      );
      console.log('생성된 테스트 케이스:', response.data);
      // 성공 시 테스트케이스 ID 및 정보 전달
      if (response.data) {
        console.log('생성된 테스트 케이스:', response);
        const {test_case_id, info, testcases} = response.data;
        console.log('생성된 테스트 케이스 ID:', test_case_id);
        // 테스트 케이스 ID와 생성된 테스트 케이스 정보 저장
        setTestCaseId(testCaseId);
        if (testcases && Array.isArray(testcases)) {
          setGeneratedTestCases(testcases);
        }

        // 결과 화면으로 전환
        setCurrentView("results");
      }
    } catch (error) {
      console.error('테스트 케이스 생성에 실패했습니다:', error);
      onError('테스트 케이스 생성에 실패했습니다. 문제 설명을 더 상세하게 작성해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setCurrentView("form");
  };

  const handleSaveTestCases = async () => {
    try {
      // 테스트 케이스가 생성되었는지 확인
      if (!generatedTestCases || generatedTestCases.length === 0) {
        onError('생성된 테스트 케이스가 없습니다. 테스트 케이스를 다시 생성해주세요.');
        return;
      }

      // 테스트 케이스 ID 확인
      if (!testCaseId) {
        onError('테스트 케이스 ID가 유효하지 않습니다. 다시 시도해주세요.');
        return;
      }

      // 백엔드 서버에 테스트 케이스 저장 요청 - responseType: 'blob'으로 설정하여 이진 데이터로 받기
      const saveResponse = await axios.post(
          `${apiBaseUrl}/api/v1/ai/${spaceId}/problems/${testCaseId}/save-testcases`,
          {
            test_case_id: testCaseId,
            testcases: generatedTestCases // 생성된 테스트 케이스 그대로 전송
          },
          {
            responseType: 'blob', // 중요: 응답을 Blob으로 받아야 함
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
      );

      // 응답 확인
      if (saveResponse.status === 200 || saveResponse.status === 201) {
        console.log('테스트 케이스 백엔드 저장 성공');

        // Blob 데이터를 File 객체로 변환
        const blob = new Blob([saveResponse.data], { type: 'application/zip' });
        const file = new File([blob], `testcase_${testCaseId}.zip`, { type: 'application/zip' });

        // 파일 목록 생성 (입/출력 파일명 추출) - 부모 컴포넌트에 전달하기 위함
        const fileList = generatedTestCases.map((testCase, index) => {
          const inputKey = Object.keys(testCase).find(k => k.endsWith('.in')) || '';
          const outputKey = Object.keys(testCase).find(k => k.endsWith('.out')) || '';

          return {
            input_name: inputKey,
            output_name: outputKey,
            score: Math.floor(100 / generatedTestCases.length) // 점수 균등 분배
          };
        });

        // 부모 컴포넌트의 파일 업로드 input 요소 찾기
        const fileInput = document.getElementById('test-case-upload') as HTMLInputElement;

        if (fileInput) {
          // 파일 입력 요소에 파일 할당 (DataTransfer 사용)
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;

          // 파일 변경 이벤트 발생시키기
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);

          console.log('테스트 케이스 파일이 자동으로 업로드되었습니다.');
        } else {
          console.error('테스트 케이스 업로드 입력 요소를 찾을 수 없습니다.');

          // 파일 입력 요소를 찾지 못한 경우 직접 다운로드하는 대체 방법 제공
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `testcase_${testCaseId}.zip`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }

        // 부모 컴포넌트에 성공 콜백 호출 (ID와 파일 목록 전달)
        onSuccess(testCaseId, fileList);

        // 시트(모달) 닫기
        const closeButton = document.querySelector('[data-sheet-close]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      } else {
        throw new Error('테스트 케이스 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('테스트 케이스 저장 중 오류가 발생했습니다:', error);
      onError('테스트 케이스 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 설명 내용이 너무 길 경우 줄임 처리를 위한 함수
  const truncateText = (text: string, maxLength = 150) => {
    if (!text) return '(작성 필요)';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 체크박스 상태 변경 핸들러
  const handleTestCaseTypeChange = (id: string, checked: boolean) => {
    setTestCaseTypes(prevTypes =>
        prevTypes.map(type =>
            type.id === id ? {...type, checked} : type
        )
    );
  };

  // 선택된 언어가 있는지 확인
  const hasLanguages = selectedLanguages.length > 0;

  // 모든 필수 필드가 입력되었는지 확인
  const isFormValid = !!description && !!inputDescription && !!outputDescription && hasLanguages;

  // 테스트 케이스 폼 화면
  const renderTestCaseForm = () => (
      <>
        <SheetHeader>
          <SheetTitle>AI 테스트 케이스 생성</SheetTitle>
          <SheetDescription>
            문제 설명, 입력 및 출력 설명을 바탕으로 AI가 테스트 케이스를 자동으로 생성합니다.
            이 기능을 사용하기 전에 문제 설명과 입력/출력 설명을 상세하게 작성해주세요.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">AI가 분석할 내용</h3>
            <div className="rounded-md border p-3">
              <p className="text-sm font-semibold">문제 설명</p>
              <p className="text-sm text-muted-foreground">
                {truncateText(description)}
              </p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-sm font-semibold">입력 설명</p>
              <p className="text-sm text-muted-foreground">
                {truncateText(inputDescription)}
              </p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-sm font-semibold">출력 설명</p>
              <p className="text-sm text-muted-foreground">
                {truncateText(outputDescription)}
              </p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-sm font-semibold">사용 가능한 언어</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {hasLanguages ?
                    selectedLanguages.map(lang => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                    )) :
                    <p className="text-sm text-muted-foreground">(언어 선택 필요)</p>
                }
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">정답 코드 샘플 (선택사항)</h3>
            <p className="text-sm text-muted-foreground">
              문제에 대한 정답 코드를 제공하면 AI가 더 정확한 테스트 케이스를 생성할 수 있습니다.
            </p>

            <div className="space-y-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="sample-language">샘플 코드 언어</Label>
                <Select
                    value={sampleLanguage}
                    onValueChange={setSampleLanguage}
                >
                  <SelectTrigger id="sample-language">
                    <SelectValue placeholder="언어 선택"/>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="sample-code">샘플 정답 코드</Label>
                <Textarea
                    id="sample-code"
                    placeholder="정답 코드를 입력하세요"
                    className="font-mono text-sm"
                    rows={8}
                    value={sampleCode}
                    onChange={(e) => setSampleCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">생성할 테스트 케이스 유형 선택</h3>
            <div className="space-y-3">
              {testCaseTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-2">
                    <Checkbox
                        id={`test-case-type-${type.id}`}
                        checked={type.checked}
                        onCheckedChange={(checked) => handleTestCaseTypeChange(type.id, checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                          htmlFor={`test-case-type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button
              onClick={generateTestCases}
              disabled={loading || !isFormValid || !testCaseTypes.some(type => type.checked)}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
            테스트 케이스 생성
          </Button>
        </SheetFooter>
      </>
  );

  // 테스트 케이스 결과 화면
  const renderTestCaseResults = () => (
      <>
        <SheetHeader>
          <div className="flex items-center">
            <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1"/>
              뒤로
            </Button>
            <SheetTitle>생성된 테스트 케이스</SheetTitle>
          </div>
          <SheetDescription>
            AI가 생성한 테스트 케이스입니다. 내용을 확인한 후 적용 버튼을 클릭하면 문제에 테스트 케이스가 등록됩니다.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">미리보기</TabsTrigger>
              <TabsTrigger value="raw">원본 데이터</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 gap-4">
                  {generatedTestCases.map((testCase, index) => {
                    const inputKey = Object.keys(testCase).find(k => k.endsWith('.in')) || '';
                    const outputKey = Object.keys(testCase).find(k => k.endsWith('.out')) || '';
                    const input = testCase[inputKey] || '';
                    const output = testCase[outputKey] || '';

                    return (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">테스트 케이스 #{index + 1}</CardTitle>
                            <CardDescription>
                              {inputKey} / {outputKey}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">입력</Label>
                                <pre
                                    className="mt-1 p-2 bg-muted rounded-md text-xs whitespace-pre-wrap break-all max-h-[150px] overflow-auto">
                                                            {input}
                                                        </pre>
                              </div>
                              <div>
                                <Label className="text-xs">출력</Label>
                                <pre
                                    className="mt-1 p-2 bg-muted rounded-md text-xs whitespace-pre-wrap break-all max-h-[150px] overflow-auto">
                                                            {output}
                                                        </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw">
              <ScrollArea className="h-[500px]">
                            <pre
                                className="p-4 bg-muted rounded-md overflow-auto text-xs whitespace-pre-wrap">
                                {JSON.stringify({testcases: generatedTestCases}, null, 2)}
                            </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          <Button
              variant="outline"
              className="mr-auto"
              onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2"/>
            테스트 케이스 다시 생성
          </Button>
          <Button
              onClick={handleSaveTestCases}
              className="gap-2"
          >
            <Save className="h-4 w-4"/>
            테스트 케이스 적용
          </Button>
        </SheetFooter>
      </>
  );

  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4"/>
            <span>테스트 케이스 생성</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right"
                      className="w-[600px] sm:w-[750px] md:w-[900px] lg:w-[1000px] overflow-y-auto">
          {currentView === "form" ? renderTestCaseForm() : renderTestCaseResults()}
        </SheetContent>
      </Sheet>
  );
};

export default TestCaseGenerator;