// Submission.tsx 수정본
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface SubmissionProps {
  spaceId: string;
  problemId: string;
  code: string;
  language: string;
  onResult: (result: any) => void;
  onSubmissionId: (id: string) => void;
  theme?: string;
  submitRef: React.MutableRefObject<(() => void) | null>;
}

const Submission: React.FC<SubmissionProps> = ({
  spaceId,
  problemId,
  code,
  language,
  onResult,
  onSubmissionId,
  theme = 'light',
  submitRef
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // 코드 제출 함수
  const submitCode = async () => {
    try {
      console.log('=== submitCode 함수 실행 시작 ===');
      console.log('제출 데이터 확인 단계');

      if (!code.trim()) {
        setError('코드를 입력해주세요.');
        console.log('코드 없음: 제출 취소');
        return;
      }

      // 제출 데이터 생성
      const submitData = {
        problem_id: problemId,
        language: language,
        code: code,
        // contest_id: null
      };

      // 로그를 다양한 방식으로 시도
      console.log('제출 데이터:', submitData);
      console.log('제출 URL:', `${API_BASE_URL}/api/v1/coding-test/${spaceId}/submission`);
      console.log('인증 토큰:', localStorage.getItem('accessToken'));

      // 브라우저 경고창 사용 (디버깅용)
      // alert('제출 데이터 준비 완료');

      console.log('=== axios 요청 시작 ===');
      setSubmitting(true);
      setError(null);



      const response = await axios.post(
        `${API_BASE_URL}/api/v1/coding-test/${spaceId}/submission`,
        submitData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log('서버 응답:', response.data);

      const id = response.data.data.submission_id;
      setSubmissionId(id);
      onSubmissionId(id);

      // 채점 결과 폴링 시작
      console.log('채점 결과 폴링 시작:', id);
      startPolling(id);
    } catch (error: any) { // 명시적으로 any 타입 지정
      console.error('코드 제출 오류:', error);
      // 오류 상세 정보도 콘솔에 출력
      if (error.response) {
        console.log('오류 응답:', error.response.data);
        console.log('오류 상태:', error.response.status);
      } else if (error.request) {
        console.log('요청 오류 (응답 없음):', error.request);
      } else {
        console.log('기타 오류:', error.message);
      }
      setError('코드 제출에 실패했습니다.');
    } finally {
      console.log('제출 ID:');
      console.log('=== submitCode 함수 실행 종료 ===');
      setSubmitting(false);
    }
  };
  // ref에 함수 할당
  useEffect(() => {
    submitRef.current = submitCode;
    return () => {
      submitRef.current = null;
    };
  }, [code, language, problemId, spaceId, submitRef]);

  // 채점 결과 폴링 함수
  const startPolling = (id: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    console.log('폴링 시작:', id);

    // 2초마다 결과 확인
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/coding-test/${spaceId}/submission/${id}`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        const result = response.data.data;
        console.log('폴링 결과:', result);
        onResult(result);

        // 채점이 완료되면 폴링 중지
        // 중요: result.result가 0일 때도 완료로 처리해야 함 (0은 ACCEPTED 상태)
        if (result.result === 0 || result.result === -1 || result.result === -2 ||
          result.result === 1 || result.result === 2 || result.result === 3 ||
          result.result === 4 || result.result === 5 || result.result === 8) {
          console.log('폴링 종료. 최종 결과:', result.result);
          clearInterval(interval);
          setPollingInterval(null);
        } else {
          console.log('아직 채점 중 (PENDING/JUDGING). 폴링 계속...');
        }
      } catch (error) {
        console.error('제출 결과 조회 오류:', error);
        clearInterval(interval);
        setPollingInterval(null);
        setError('제출 결과를 불러오는데 실패했습니다.');
      }
    }, 2000);

    setPollingInterval(interval);
  };

  // 컴포넌트가 언마운트될 때 폴링 중지
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className={`${theme === 'dark' || theme === 'monokai' ? 'text-white' : ''}`}>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {submitting && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>제출 중...</p>
        </div>
      )}

      {!submissionId && !submitting && !error && (
        <div className="flex items-center justify-center h-full">
          <p className={`${theme === 'dark' || theme === 'monokai' ? 'text-gray-300' : 'text-gray-500'}`}>
            코드를 제출하면 채점 결과가 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default Submission;