import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    //파일 선택시 selectedFile에 반영
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      setLoading(true); //loading 상태 변경
      try {
        const { data: { text } } = await Tesseract.recognize( //image to text 변환 with Tesseract
          selectedFile,
          'eng+kor', // 영어와 한글
          {logger: (m) => console.log(m)} //처리상태 log 조회(선택사항)
        );
        //추출한 text recognizedText에 반영
        setRecognizedText(text);
      } catch (error) {
        console.error('텍스트 추출 중 오류 발생:', error);
      } finally {
        setLoading(false);  //loading 상태 변경
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>OCR with Tesseract.js</h1>
      <input type="file" onChange={handleFileChange} />
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
