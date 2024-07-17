import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);


  const onDrop = useCallback((acceptedFiles) => {
    // 파일 드롭시 selectedFile에 반영
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  const handleFileChange = (event) => {
    //파일 선택시 selectedFile에 반영
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
  if (selectedFile) {
    setLoading(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const { data: { text } } = await Tesseract.recognize(
            e.target.result, // 데이터 URL
            'eng+kor', // 영어와 한글
            {
              logger: (m) => console.log(m),
            }
          );
          setRecognizedText(text);
        } catch (error) {
          console.error('텍스트 추출 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      };
      fileReader.readAsDataURL(selectedFile); // 파일을 데이터 URL로 읽기
    } catch (error) {
      console.error('파일 읽기 중 오류 발생:', error);
      setLoading(false);
    }
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>OCR with Tesseract.js</h1>
      <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>파일을 이곳에 드롭하세요...</p> :
            <p>파일을 드래그 앤 드롭하거나 여기를 클릭하여 파일을 선택하세요</p>
        }
      </div>
      <button onClick={handleFileUpload} disabled={!selectedFile || loading}>
        {loading ? '처리 중...' : '업로드 및 변환'}
      </button>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {recognizedText}
      </pre>
    </div>
  );
}

export default App;
