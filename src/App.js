import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { OpenAI } from 'openai';


// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // 여기에 OpenAI API 키를 입력합니다.
  dangerouslyAllowBrowser: true, // 브라우저에서 API를 호출할 수 있도록 설정
});

// 텍스트 요약 함수
async function summarizeText(text) {
  console.log('summarizeText in')
  try {
    const summaryResponse = await openai.chat.completions.create(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
              role: "system",
              content: "당신은 인사담당자입니다. 제출한 서류의 내용을 확인해서 사용자가 어떤 근태 관련 신청서를 작성하면 좋을지 추천해주세요. ",
          },
          { role: 'user', content: `인사담당자에게 사용자가 제출하는 서류의 내용은 다음과 같습니다. ${text}` }
        ],
      }
    );
    return summaryResponse.choices[0].message.content;
  } catch (error) {
    console.error('텍스트 요약 중 오류 발생:', error);
  if (error.response && error.response.data) {
    const { code, message } = error.response.data.error;
    if (code === 'insufficient_quota') {
      return '요청 가능한 할당량을 초과했습니다. 플랜과 결제 세부 정보를 확인하세요.';
    }
  }
    return '요약을 생성할 수 없습니다.';
  }
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [summary, setSummary] = useState(''); // 요약 텍스트 상태 추가
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // 파일 드롭시 selectedFile에 반영
    setSelectedFile(acceptedFiles[0]);

    //새로운 파일 드롭시 추출 text 초기화
    setRecognizedText('');
    //새로운 파일 드롭시 요약 내용 초기화
    setSummary('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // 파일 업로드 및 텍스트 인식 함수
  const handleFileUpload = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        if (selectedFile.type === 'application/pdf') {
          // PDF 파일 처리
          const pdf = await pdfjsLib.getDocument(URL.createObjectURL(selectedFile)).promise;
          const numPages = pdf.numPages;

          console.log('total pdf page : ', numPages)


          // 모든 페이지 병렬 처리
          const pageTexts = await Promise.all(
            Array.from({ length: numPages }, async (_, i) => {
              console.log('pdf page : ', i)
              const page = await pdf.getPage(i + 1);
              const scale = 0.7; // 해상도 조정 (1보다 작으면 해상도 낮춤)
              const viewport = page.getViewport({ scale });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              await page.render(renderContext).promise;
              const imageData = canvas.toDataURL('image/png');

              // Tesseract를 사용하여 이미지 데이터에서 텍스트 추출
              const { data: { text } } = await Tesseract.recognize(
                imageData,
                'eng+kor',
                // {
                //   logger: (m) => console.log(m),
                // }
              );
              return text;
            })
          );

          setRecognizedText(pageTexts.join('\n')); // 모든 페이지의 텍스트를 하나로 합침
        } else {
          // 이미지 파일 처리
          const { data: { text } } = await Tesseract.recognize(
            URL.createObjectURL(selectedFile),
            'eng+kor',
            // {
            //   logger: (m) => console.log(m),
            // }
          );

          setRecognizedText(text);

          // 텍스트 요약 함수 호출
          // 텍스트 요약 함수 호출
        console.log('Calling summarization API');
        const summarizedText = await summarizeText(text);
        setSummary(summarizedText);
        console.log('Summarized Text:', summarizedText);
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
        {loading ? '처리 중...' : '텍스트로 변환 및 요약 api 호출'}
      </button>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {recognizedText}
      </pre>
      <h2>요약</h2>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {summary}
      </pre>
    </div>
  );
}

export default App;