import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// PDF.js worker 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // 파일 드롭시 selectedFile에 반영
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        if (selectedFile.type === 'application/pdf') {
          // PDF 파일 처리
          const pdf = await pdfjsLib.getDocument(URL.createObjectURL(selectedFile)).promise;
          const numPages = pdf.numPages;
          let fullText = '';

          for (let pageNum = 1; pageNum <= numPages; pageNum++) { //pdf페이지 순회
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            await page.render(renderContext).promise;
            const imageData = canvas.toDataURL('image/png'); // 캔버스를 이미지 데이터로 변환

            const { data: { text } } = await Tesseract.recognize(
              imageData,
              'eng+kor',
              {
                logger: (m) => console.log(m),
              }
            );
            fullText += text + '\n';
          }
          setRecognizedText(fullText);
        }
      } catch (error) {
        console.error('텍스트 추출 중 오류 발생:', error);
      } finally {
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
        {loading ? '처리 중...' : '업로드 및 인식'}
      </button>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {recognizedText}
      </pre>
    </div>
  );
}

export default App;
