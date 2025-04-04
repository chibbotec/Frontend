import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import CryptoJS from 'crypto-js';
import { Loader2, X, Plus, Upload, Minus } from "lucide-react";

// shadcn UI 컴포넌트
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

// 기존 TextEditor 컴포넌트 대신 CodeMirror 사용
import CodeEditor from '@/pages/dashboard/codingtest/CodeMirror';

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ProblemCreationProps {
  problemId?: string; // 문제 편집 시 사용
  contestId?: string; // 대회 문제 생성 시 사용
  onSuccess?: (problemId: string) => void;
}

// 인터페이스 정의
interface LanguageOption {
  name: string;
  description: string;
  content_type?: string;
  config?: {
    template?: string;
  };
}

// // 테스트 케이스 파일 타입 정의
// interface TestCaseFile {
//   input_name: string;
//   output_name: string;
//   score: number;
// }


// 폼 스키마 정의
const formSchema = z.object({
  _id: z.string().min(1, { message: "표시 ID를 입력해주세요" }),
  title: z.string().min(1, { message: "문제 제목을 입력해주세요" }),
  description: z.string().min(1, { message: "문제 설명을 입력해주세요" }),
  input_description: z.string().min(1, { message: "입력 설명을 입력해주세요" }),
  output_description: z.string().min(1, { message: "출력 설명을 입력해주세요" }),
  time_limit: z.number().min(1, { message: "시간 제한을 입력해주세요" }),
  memory_limit: z.number().min(1, { message: "메모리 제한을 입력해주세요" }),
  difficulty: z.string(),
  visible: z.boolean(),
  languages: z.array(z.string()).min(1, { message: "최소 하나의 언어를 선택해주세요" }),
  samples: z.array(
    z.object({
      input: z.string().min(1, { message: "입력 샘플을 입력해주세요" }),
      output: z.string().min(1, { message: "출력 샘플을 입력해주세요" })
    })
  ),
  hint: z.string().optional(),
  source: z.string().optional(),
  spj: z.boolean(),
  rule_type: z.string(),
  io_mode: z.object({
    io_mode: z.string(),
    input: z.string().optional(),
    output: z.string().optional()
  }),
  test_case_id: z.string().optional(),
  test_case_score: z.array(z.any()).optional()
});

const ProblemCreation: React.FC<ProblemCreationProps> = ({
  problemId: propsProblemId,  // props로 받은 경우
  onSuccess
}) => {
  const { spaceId, problemId: routeProblemId } = useParams<{ spaceId: string; problemId: string }>();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: '',
      title: '',
      description: '',
      input_description: '',
      output_description: '',
      time_limit: 1000,
      memory_limit: 256,
      difficulty: 'Mid',
      visible: true,
      languages: [],
      samples: [{ input: '', output: '' }],
      hint: '',
      source: '',
      spj: false,
      rule_type: 'ACM',
      io_mode: { io_mode: 'Standard IO', input: 'input.txt', output: 'output.txt' }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "samples"
  });

  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  // const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [spjChecked, setSpjChecked] = useState<boolean>(false);
  const [ioMode, setIoMode] = useState<string>('Standard IO');
  const [testCaseUploaded, setTestCaseUploaded] = useState<boolean>(false);
  const [testCaseId, setTestCaseId] = useState<string>('');
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Record<string, { checked: boolean; code: string; mode: string }>>({});
  const [spjCode, setSpjCode] = useState<string>('');
  const [spjLanguage, setSpjLanguage] = useState<string>('C');
  const [spjCompileOk, setSpjCompileOk] = useState<boolean>(false);
  const [compilingSpj, setCompilingSpj] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');


  // props와 route 파라미터 중 하나를 사용
  const actualProblemId = propsProblemId || routeProblemId;
  const isEdit = !!actualProblemId;
  const title = isEdit ? '문제 수정' : '문제 생성';
  const buttonText = isEdit ? '저장' : '생성';

  useEffect(() => {
    fetchLanguages();
    // fetchTags();

    if (isEdit && actualProblemId) {
      fetchProblemData(actualProblemId);
    }
  }, [actualProblemId, spaceId]);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/languages`, {
        withCredentials: true
      });

      const languagesData = response.data.data.languages;
      setLanguages(languagesData);

      // 코드 템플릿 초기화
      const templates: Record<string, { checked: boolean; code: string; mode: string }> = {};
      languagesData.forEach((lang: LanguageOption) => {
        templates[lang.name] = {
          checked: false,
          code: lang.config?.template || '',
          mode: lang.content_type || 'text/x-csrc'
        };
      });

      setTemplates(templates);
    } catch (error) {
      console.error('언어 목록을 불러오는데 실패했습니다:', error);
      setDialogMessage('언어 목록을 불러오는데 실패했습니다');
      setShowDialog(true);
    }
  };

  // const fetchTags = async () => {
  //   try {
  //     // const response = await axios.get(`${API_BASE_URL}/api/v1/coding-test/problem-tags`, {
  //     //   withCredentials: true,
  //     //   headers: {
  //     //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //     //   }
  //     // });
  //     // setAllTags(response.data.data.map((tag: any) => tag.name));
  //   } catch (error) {
  //     console.error('태그 목록을 불러오는데 실패했습니다:', error);
  //   }
  // };

  // 난이도 숫자값을 문자열로 변환
  const mapDifficultyFromNumber = (difficultyValue?: number): string => {
    const difficultyMap: Record<number, string> = {
      1: 'Low',
      2: 'Mid',
      3: 'High'
    };
    return difficultyMap[difficultyValue || 2] || 'Mid';
  };

  // // 난이도 문자열을 숫자값으로 변환
  // const mapDifficultyToNumber = (difficulty: string): number => {
  //   const difficultyMap: Record<string, number> = {
  //     'Low': 1,
  //     'Mid': 2,
  //     'High': 3
  //   };
  //   return difficultyMap[difficulty] || 2;
  // };

  const fetchProblemData = async (id: string) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/v1/coding-test/${spaceId}/problems/${id}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const problemData = response.data.data;

      form.reset({
        _id: problemData._id,
        title: problemData.title,
        description: problemData.description,
        input_description: problemData.input_description,
        output_description: problemData.output_description,
        time_limit: problemData.time_limit,
        memory_limit: problemData.memory_limit,
        difficulty: mapDifficultyFromNumber(problemData.difficulty),
        visible: problemData.visible,
        languages: problemData.languages,
        samples: problemData.samples || [{ input: '', output: '' }],
        hint: problemData.hint,
        source: problemData.source,
        spj: problemData.spj,
        rule_type: problemData.rule_type,
        io_mode: problemData.io_mode
      });

      if (problemData.template) {
        const newTemplates = { ...templates };
        Object.keys(problemData.template).forEach(lang => {
          if (newTemplates[lang]) {
            newTemplates[lang] = {
              ...newTemplates[lang],
              checked: true,
              code: problemData.template[lang]
            };
          }
        });
        setTemplates(newTemplates);
      }

      setSpjChecked(problemData.spj);
      setIoMode(problemData.io_mode?.io_mode || 'Standard IO');
      setTestCaseUploaded(!!problemData.test_case_id);
      setTestCaseId(problemData.test_case_id || '');
      setSelectedTags(problemData.tags || []);
      setSpjCode(problemData.spj_code || '');
      setSpjLanguage(problemData.spj_language || 'C');
      setSpjCompileOk(problemData.spj_compile_ok || false);

    } catch (error) {
      console.error('문제 데이터를 불러오는데 실패했습니다:', error);
      setDialogMessage('문제 데이터를 불러오는데 실패했습니다');
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClose = (removedTag: string) => {
    const newTags = selectedTags.filter(tag => tag !== removedTag);
    setSelectedTags(newTags);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputConfirm = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput]);
    }
    setInputVisible(false);
    setTagInput('');
  };

  const handleIOModeChange = (value: string) => {
    setIoMode(value);
  };

  const handleSpjChange = (checked: boolean) => {
    setSpjChecked(checked);
    if (testCaseUploaded) {
      setShowDialog(true);
      setDialogMessage('문제 판단 방식을 변경하면 테스트 케이스를 다시 업로드해야 합니다.');
    }
  };

  const confirmSpjChange = () => {
    setTestCaseUploaded(false);
    setTestCaseId('');
    setShowDialog(false);
  };

  const cancelSpjChange = () => {
    setSpjChecked(!spjChecked);
    setShowDialog(false);
  };

  // SPJ 언어 변경 핸들러
  const handleSpjLanguageChange = (value: string) => {
    setSpjLanguage(value);
    setSpjCompileOk(false); // 언어 변경 시 컴파일 확인 상태 초기화
  };

  // SPJ 코드 변경 핸들러
  const handleSpjCodeChange = (code: string) => {
    setSpjCode(code);
    setSpjCompileOk(false); // 코드 변경 시 컴파일 확인 상태 초기화
  };

  // SPJ 컴파일 핸들러
  const handleCompileSpj = async () => {
    if (!spjCode) {
      setDialogMessage('Special Judge 코드를 입력해주세요');
      setShowDialog(true);
      return;
    }

    try {
      setCompilingSpj(true);
      // const response = await axios.post(
      //   `${API_BASE_URL}/api/v1/admin/compile_spj`,
      //   {
      //     spj_code: spjCode,
      //     spj_language: spjLanguage
      //   },
      //   {
      //     withCredentials: true,
      //     headers: {
      //       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //     }
      //   }
      // );

      setSpjCompileOk(true);
      setDialogMessage('Special Judge 코드가 성공적으로 컴파일되었습니다');
      setShowDialog(true);
    } catch (error: any) {
      console.error('Special Judge 컴파일에 실패했습니다:', error);

      // 에러 메시지 표시
      if (error.response && error.response.data && error.response.data.data) {
        setDialogMessage(`Special Judge 컴파일에 실패했습니다: ${error.response.data.data}`);
      } else {
        setDialogMessage('Special Judge 컴파일에 실패했습니다');
      }
      setShowDialog(true);
    } finally {
      setCompilingSpj(false);
    }
  };

  const handleTestCaseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('spj', String(spjChecked));

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/coding-test/${spaceId}/test_case`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('테스트 케이스 응답:', response.data);
      if (response.data.error) {
        setDialogMessage(response.data.data);
        setShowDialog(true);
        return;
      }

      const fileList = response.data.data.info;
      const testCaseId = response.data.data.id;

      form.setValue('test_case_id', testCaseId);
      form.setValue('test_case_score', fileList.map((file: any) => ({
        ...file,
        score: Math.floor(100 / fileList.length)
      })));

      setTestCaseId(testCaseId);
      setTestCaseUploaded(true);
      setDialogMessage('테스트 케이스가 성공적으로 업로드되었습니다.');
      setShowDialog(true);
    } catch (error) {
      console.error('테스트 케이스 업로드에 실패했습니다:', error);
      setDialogMessage('테스트 케이스 업로드에 실패했습니다.');
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // 템플릿 체크 상태 변경 핸들러
  const handleTemplateCheckChange = (language: string, checked: boolean) => {
    console.log(`템플릿 체크 변경: ${language}, 체크됨: ${checked}`);

    // 현재 언어에 해당하는 기본 템플릿 코드 찾기
    const langObj = languages.find(lang => lang.name === language);
    const defaultTemplate = langObj?.config?.template || '';

    // 함수형 업데이트 사용 (이전 상태에 기반하여 새 상태 계산)
    setTemplates(prev => {
      // 이전 상태와 동일하면 상태 업데이트 방지
      const prevTemplate = prev[language];
      if (prevTemplate?.checked === checked) return prev;

      // 새 코드 결정 
      const newCode = checked && (!prevTemplate?.code || prevTemplate.code === '')
        ? defaultTemplate
        : prevTemplate?.code || '';

      // 변경된 템플릿만 업데이트하여 새 객체 반환
      return {
        ...prev,
        [language]: {
          ...prevTemplate,
          checked: checked,
          code: newCode
        }
      };
    });
  };

  // 템플릿 코드 변경 핸들러
  const handleTemplateCodeChange = (language: string, code: string) => {
    setTemplates(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        code
      }
    }));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // 태그 추가
    const formValues = { ...values };

    if (selectedTags.length === 0) {
      setDialogMessage('최소 하나 이상의 태그를 선택해주세요.');
      setShowDialog(true);
      return;
    }

    if (!testCaseUploaded) {
      setDialogMessage('테스트 케이스가 업로드되지 않았습니다.');
      setShowDialog(true);
      return;
    }

    for (const sample of formValues.samples) {
      if (!sample.input || !sample.output) {
        setDialogMessage('모든 샘플 입력과 출력을 입력해주세요.');
        setShowDialog(true);
        return;
      }
    }

    // SPJ 검증
    if (spjChecked) {
      if (!spjCode) {
        setDialogMessage('Special Judge 코드를 입력해주세요');
        setShowDialog(true);
        return;
      }
      if (!spjCompileOk) {
        setDialogMessage('Special Judge 코드가 컴파일되지 않았습니다');
        setShowDialog(true);
        return;
      }
    }

    try {
      setLoading(true);

      // 코드 템플릿 처리
      const templateData: Record<string, string> = {};
      Object.keys(templates).forEach(lang => {
        if (templates[lang].checked) {
          templateData[lang] = templates[lang].code;
        }
      });

      // 데이터 변환
      const formData = {
        id: formValues._id,
        _id: formValues._id,
        title: formValues.title,
        description: formValues.description,
        input_description: formValues.input_description,
        output_description: formValues.output_description,
        time_limit: formValues.time_limit,
        memory_limit: formValues.memory_limit,
        difficulty: formValues.difficulty,
        visible: formValues.visible,
        tags: selectedTags,
        languages: formValues.languages,
        samples: formValues.samples,
        hint: formValues.hint,
        source: formValues.source,
        spj: formValues.spj,
        rule_type: formValues.rule_type,
        io_mode: formValues.io_mode,
        test_case_id: testCaseId,
        template: templateData,
        spj_language: spjChecked ? spjLanguage : null,
        spj_code: spjChecked ? spjCode : null,
        spj_compile_ok: spjChecked ? spjCompileOk : false,
        spj_version: spjChecked ?
          CryptoJS.MD5(spjLanguage + ':' + spjCode).toString() : null,
        test_case_score: formValues.test_case_score,
        share_submission: false
      };

      // API URL 설정
      let url, method;

      if (isEdit) {
        url = `${API_BASE_URL}/api/v1/coding-test/${spaceId}/problem-details/${actualProblemId}`;
        method = 'put';
      } else {
        url = `${API_BASE_URL}/api/v1/coding-test/${spaceId}/problem-details`;
        method = 'post';
      }


      const response = await axios({
        url,
        method,
        data: formData,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setDialogMessage('문제가 성공적으로 저장되었습니다.');
      setShowDialog(true);

      if (onSuccess) {
        onSuccess(response.data.data.id || actualProblemId || '');
      } else {
        // 성공 후 문제 목록 페이지로 리다이렉트
        navigate(`/dashboard/coding-test/${spaceId}`);
      }
    } catch (error) {
      console.error('문제 저장에 실패했습니다:', error);
      setDialogMessage('문제 저장에 실패했습니다');
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="problem-creation-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>표시 ID</FormLabel>
                        <FormControl>
                          <Input placeholder="표시 ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목</FormLabel>
                        <FormControl>
                          <Input placeholder="문제 제목" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>문제 설명</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="문제 설명"
                          className="min-h-32"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="input_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>입력 설명</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="입력 설명"
                          className="min-h-32"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="output_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>출력 설명</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="출력 설명"
                          className="min-h-32"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">코드 템플릿</h3>
                <Accordion type="single" collapsible className="w-full">
                  {languages.map(lang => (
                    <div key={lang.name} className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Switch
                          checked={templates[lang.name]?.checked || false}
                          onCheckedChange={(checked) => handleTemplateCheckChange(lang.name, checked)}
                        />
                        <Label htmlFor={`template-${lang.name}`}>{lang.name} 템플릿</Label>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={lang.name}>
                          <AccordionTrigger>{lang.name} 코드 편집</AccordionTrigger>
                          <AccordionContent>
                            <CodeEditor
                              key={`editor-${lang.name}`}
                              value={templates[lang.name]?.code || ''}
                              onChange={(code) => handleTemplateCodeChange(lang.name, code)}
                              language={lang.name}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </Accordion>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="time_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시간 제한 (ms)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="memory_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>메모리 제한 (MB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>난이도</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="난이도 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">낮음</SelectItem>
                          <SelectItem value="Mid">중간</SelectItem>
                          <SelectItem value="High">높음</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="visible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>공개 여부</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용 가능한 언어</FormLabel>
                        <div className="relative">
                          <Select
                            onValueChange={(value) => field.onChange([...field.value, value])}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="언어 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map(lang => (
                                <SelectItem
                                  key={lang.name}
                                  value={lang.name}
                                  disabled={field.value.includes(lang.name)}
                                >
                                  {lang.name} ({lang.description})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map(language => (
                            <Badge
                              key={language}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {language}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => field.onChange(field.value.filter(l => l !== language))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleTagClose(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}

                  {inputVisible ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onBlur={handleTagInputConfirm}
                        onKeyDown={(e) => e.key === 'Enter' && handleTagInputConfirm()}
                        className="w-32 h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTagInputConfirm}
                      >
                        추가
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setInputVisible(true)}
                    >
                      <Plus className="h-3 w-3" />
                      새 태그
                    </Button>
                  )}
                </div>

                {selectedTags.length === 0 && (
                  <p className="text-sm text-muted-foreground">최소 하나 이상의 태그를 선택해주세요.</p>
                )}
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">샘플</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md bg-muted/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`samples.${index}.input`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>입력 샘플</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="입력 샘플"
                                className="h-32 font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`samples.${index}.output`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>출력 샘플</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="출력 샘플"
                                className="h-32 font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          샘플 삭제
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append({ input: '', output: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  샘플 추가
                </Button>
              </div>

              <FormField
                control={form.control}
                name="hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>힌트</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="힌트"
                          className="min-h-32"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>출처</FormLabel>
                    <FormControl>
                      <Input placeholder="문제 출처" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="spj"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Special Judge</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleSpjChange(checked);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {spjChecked && (
                  <div className="md:col-span-3">
                    <FormItem>
                      <FormLabel>SPJ 언어</FormLabel>
                      <Select
                        value={spjLanguage}
                        onValueChange={handleSpjLanguageChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="SPJ 언어 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="C++">C++</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                )}

                <div className={`md:col-span-${spjChecked ? 6 : 9}`}>
                  <FormField
                    control={form.control}
                    name="rule_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>문제 유형</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="문제 유형 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACM">ACM</SelectItem>
                            <SelectItem value="OI">OI</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="io_mode.io_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IO 모드</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleIOModeChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="IO 모드 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard IO">Standard IO</SelectItem>
                          <SelectItem value="File IO">File IO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {spjChecked && (
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Special Judge 코드</FormLabel>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="spj-code">
                        <AccordionTrigger className="flex items-center justify-between">
                          <span>Special Judge 코드</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompileSpj();
                            }}
                            disabled={compilingSpj}
                            className="ml-auto mr-4"
                          >
                            {compilingSpj && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            컴파일
                          </Button>
                        </AccordionTrigger>
                        <AccordionContent>
                          <CodeEditor
                            value={spjCode}
                            onChange={handleSpjCodeChange}
                            language={spjLanguage}
                          />

                          <div className="mt-2">
                            {spjCompileOk ? (
                              <Badge variant="default">컴파일 성공</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                컴파일이 필요합니다
                              </Badge>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </FormItem>
                </div>
              )}

              {ioMode === 'File IO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="io_mode.input"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>입력 파일명</FormLabel>
                        <FormControl>
                          <Input placeholder="입력 파일명" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="io_mode.output"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>출력 파일명</FormLabel>
                        <FormControl>
                          <Input placeholder="출력 파일명" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormItem>
                <FormLabel>테스트 케이스</FormLabel>
                <div className="flex items-center gap-4">
                  <Label htmlFor="test-case-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                      <Upload className="h-4 w-4" />
                      <span>테스트 케이스 업로드</span>
                    </div>
                    <Input
                      id="test-case-upload"
                      type="file"
                      className="hidden"
                      onChange={handleTestCaseUpload}
                    />
                  </Label>

                  {testCaseUploaded ? (
                    <Badge variant="default">테스트 케이스가 업로드되었습니다</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      테스트 케이스를 업로드해주세요
                    </Badge>
                  )}
                </div>
              </FormItem>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {buttonText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/codingtest/${spaceId}`)}
                >
                  취소
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>알림</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {dialogMessage === '문제 판단 방식을 변경하면 테스트 케이스를 다시 업로드해야 합니다.' ? (
              <>
                <Button variant="outline" onClick={cancelSpjChange}>취소</Button>
                <Button onClick={confirmSpjChange}>확인</Button>
              </>
            ) : (
              <Button onClick={() => setShowDialog(false)}>확인</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProblemCreation;