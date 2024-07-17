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

          // 모든 페이지 병렬 처리
          const pageTexts = await Promise.all(
            Array.from({ length: numPages }, async (_, i) => {
              const page = await pdf.getPage(i + 1); // 각 페이지를 비동기적으로 가져옴
              const scale = 1; // 해상도 조정 (1보다 작으면 해상도 낮춤)
              const viewport = page.getViewport({ scale }); // 페이지를 뷰포트에 맞게 렌더링
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              await page.render(renderContext).promise; // 페이지를 캔버스에 렌더링
              const imageData = canvas.toDataURL('image/png'); // 캔버스를 이미지 데이터로 변환

              // Tesseract를 사용하여 이미지 데이터에서 텍스트 추출
              const { data: { text } } = await Tesseract.recognize(
                imageData,
                'eng+kor',
                {
                  logger: (m) => console.log(m),
                }
              );
              return text; // 추출된 텍스트 반환
            })
          );

          setRecognizedText(pageTexts.join('\n')); // 모든 페이지의 텍스트를 하나로 합침
        } else {
          // 이미지 파일 처리
          const { data: { text } } = await Tesseract.recognize(
            URL.createObjectURL(selectedFile),
            'eng+kor',
            {
              logger: (m) => console.log(m),
            }
          );
          setRecognizedText(text);
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
