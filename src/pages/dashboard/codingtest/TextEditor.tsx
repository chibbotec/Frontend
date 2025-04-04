// import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { message, Modal, Button } from 'antd';
// import axios from 'axios';

// interface TextEditorProps {
//   value?: string;
//   onChange?: (value: string) => void;
// }

// const TextEditor: React.FC<TextEditorProps> = ({ value = '', onChange }) => {
//   const [editorValue, setEditorValue] = useState(value);
//   const [uploadVisible, setUploadVisible] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
  
//   useEffect(() => {
//     setEditorValue(value);
//   }, [value]);

//   const handleChange = (content: string) => {
//     setEditorValue(content);
//     if (onChange) {
//       onChange(content);
//     }
//   };

//   const handleImageUpload = () => {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     input.click();

//     input.onchange = async () => {
//       const file = input.files?.[0];
//       if (!file) return;

//       setUploadVisible(true);
//       setUploadLoading(true);

//       const formData = new FormData();
//       formData.append('image', file);

//       try {
//         const response = await axios.post('/api/admin/upload_image', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
        
//         if (response.data.error) {
//           message.error('이미지 업로드에 실패했습니다');
//         } else {
//           const quillEditor = document.querySelector('.ql-editor');
//           const range = document.getSelection()?.getRangeAt(0);
          
//           if (quillEditor && range) {
//             const img = document.createElement('img');
//             img.src = response.data.data;
//             img.style.maxWidth = '100%';
            
//             range.insertNode(img);
//             handleChange(quillEditor.innerHTML);
//           }
          
//           setUploadVisible(false);
//           message.success('이미지가 성공적으로 업로드되었습니다');
//         }
//       } catch (error) {
//         console.error('이미지 업로드 중 오류가 발생했습니다:', error);
//         message.error('이미지 업로드에 실패했습니다');
//       } finally {
//         setUploadLoading(false);
//       }
//     };
//   };

//   const handleFileUpload = () => {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.click();

//     input.onchange = async () => {
//       const file = input.files?.[0];
//       if (!file) return;

//       setUploadVisible(true);
//       setUploadLoading(true);

//       const formData = new FormData();
//       formData.append('file', file);

//       try {
//         const response = await axios.post('/api/admin/upload_file', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
        
//         if (response.data.error) {
//           message.error('파일 업로드에 실패했습니다');
//         } else {
//           const filePath = response.data.file_path;
//           const fileName = response.data.file_name;
//           const fileLink = `<a target="_blank" href="${filePath}">${fileName}</a>`;
          
//           const quillEditor = document.querySelector('.ql-editor');
//           if (quillEditor) {
//             const range = document.getSelection()?.getRangeAt(0);
//             if (range) {
//               const linkContainer = document.createElement('span');
//               linkContainer.innerHTML = fileLink;
//               range.insertNode(linkContainer);
//               handleChange(quillEditor.innerHTML);
//             }
//           }
          
//           setUploadVisible(false);
//           message.success('파일이 성공적으로 업로드되었습니다');
//         }
//       } catch (error) {
//         console.error('파일 업로드 중 오류가 발생했습니다:', error);
//         message.error('파일 업로드에 실패했습니다');
//       } finally {
//         setUploadLoading(false);
//       }
//     };
//   };

//   // Quill 에디터 모듈 설정
//   const modules = {
//     toolbar: {
//       container: [
//         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//         ['bold', 'italic', 'underline', 'strike'],
//         [{ 'color': [] }, { 'background': [] }],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//         [{ 'indent': '-1' }, { 'indent': '+1' }],
//         [{ 'align': [] }],
//         ['link', 'code-block', 'formula'],
//         ['clean']
//       ],
//       handlers: {
//         'image': handleImageUpload
//       }
//     }
//   };

//   // Quill 에디터 포맷 설정
//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'color', 'background',
//     'list', 'bullet',
//     'indent',
//     'align',
//     'link', 'image', 'code-block', 'formula'
//   ];

//   return (
//     <div className="text-editor-container">
//       <ReactQuill
//         theme="snow"
//         value={editorValue}
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//         style={{ height: '250px', marginBottom: '40px' }}
//       />
      
//       <div style={{ marginTop: '8px' }}>
//         <Button onClick={handleImageUpload} style={{ marginRight: '8px' }}>이미지 업로드</Button>
//         <Button onClick={handleFileUpload}>파일 업로드</Button>
//       </div>
      
//       <Modal
//         title="업로드 중..."
//         visible={uploadVisible}
//         footer={null}
//         closable={false}
//       >
//         <p>파일을 업로드하는 중입니다. 잠시만 기다려주세요...</p>
//       </Modal>
//     </div>
//   );
// };

// export default TextEditor;