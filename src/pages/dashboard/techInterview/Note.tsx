import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, ArrowLeft, Globe, Lock } from 'lucide-react';

const NoteCreatePreview = () => {
  const [title, setTitle] = useState('새로운 기술 노트');
  const [isPublic, setIsPublic] = useState(false);
  
  // 마크다운 에디터와 미리보기는 샘플 컨텐츠로 대체
  
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">새 노트 작성</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isPublic ? (
              <Globe className="h-4 w-4 text-blue-500" />
            ) : (
              <Lock className="h-4 w-4 text-amber-500" />
            )}
            <Label htmlFor="public-switch-preview" className="text-sm">
              {isPublic ? '공개' : '비공개'}
            </Label>
            <Switch
              id="public-switch-preview"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            저장하기
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="title-preview" className="text-base font-medium">
          제목
        </Label>
        <Input
          id="title-preview"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="노트 제목을 입력하세요"
          className="mt-1"
        />
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
        {/* 에디터 영역 (실제로는 MDEditor 컴포넌트가 사용됨) */}
        <div className="border rounded-md bg-white p-4 h-full">
          <div className="border-b pb-2 mb-2">
            <div className="flex gap-2">
              <div className="bg-gray-200 w-6 h-6 rounded"></div>
              <div className="bg-gray-200 w-6 h-6 rounded"></div>
              <div className="bg-gray-200 w-6 h-6 rounded"></div>
            </div>
          </div>
          <div className="font-mono text-sm text-gray-700">
            <p># 제목</p>
            <p>## 부제목</p>
            <br />
            <p>이것은 **마크다운** _편집기_ 영역입니다.</p>
            <br />
            <p>- 항목 1</p>
            <p>- 항목 2</p>
            <p>- 항목 3</p>
            <br />
            <p>```javascript</p>
            <p>{"function example() {"}</p>
            <p>{"  console.log('Hello world');"}</p>
            <p>{"}"}</p>
            <p>```</p>
          </div>
        </div>

        {/* 미리보기 영역 */}
        <Card className="h-full overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <h1>제목</h1>
              <h2>부제목</h2>
              <p>이것은 <strong>마크다운</strong> <em>편집기</em> 영역입니다.</p>
              <ul>
                <li>항목 1</li>
                <li>항목 2</li>
                <li>항목 3</li>
              </ul>
              <pre className="bg-gray-100 p-2 rounded">
                <code>
                  {"function example() {"}<br />
                  {"  console.log('Hello world');"}<br />
                  {"}"}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoteCreatePreview;