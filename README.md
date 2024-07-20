OCR_Optical Character Recognition(광학 문자 인식)


##  텍스트 이미지를 기계가 읽을 수 있는 텍스트 포맷으로 변환하는 과정



# OCR(Optical Character Recognition) 작동 방식 및 절차

### 1. 이미지 전처리 (Image Preprocessing)
- **그레이스케일 변환**: 컬러 이미지를 흑백 이미지로 변환하여 처리 속도를 높이고 불필요한 정보 제거.
- **노이즈 제거**: 이미지에 포함된 잡음(노이즈)을 제거하여 인식 정확도를 높임. (예: 블러링, 이진화)
- **기울기 보정**: 이미지가 기울어진 경우 이를 바로 잡아 인식률을 향상시킴.
- **이진화 (Binarization)**: 이미지의 픽셀 값을 흑백으로 변환하여 문자와 배경을 구분.

### 2. 문자 영역 검출 (Text Area Detection)
- **경계 상자 (Bounding Box) 검출**: 이미지에서 문자 영역을 감싸는 경계 상자를 탐지.
- **연결 성분 분석 (Connected Component Analysis)**: 연속된 픽셀 집합을 분석하여 문자 영역을 검출.

### 3. 문자 분할 (Character Segmentation)
- **라인 분할 (Line Segmentation)**: 텍스트 라인을 개별적으로 분할.
- **단어 분할 (Word Segmentation)**: 텍스트 라인에서 단어를 개별적으로 분할.
- **문자 분할 (Character Segmentation)**: 단어에서 개별 문자를 분할.

### 4. 특징 추출 (Feature Extraction)
- **문자 모양 분석**: 각 문자 이미지의 특징을 추출. 예: 윤곽선, 교차점, 곡선 정보 등.
- **패턴 매칭**: 추출된 특징을 이용하여 사전 정의된 문자 패턴과 비교.

### 5. 문자 인식 (Character Recognition)
- **클래스 분류**: 특징 추출 단계에서 얻은 정보를 바탕으로 각 문자를 특정 문자 클래스로 분류.
- **딥러닝 모델**: 현대 OCR 시스템에서는 주로 CNN(Convolutional Neural Network)이나 RNN(Recurrent Neural Network) 같은 딥러닝 모델을 사용하여 문자를 인식.

### 6. 후처리 (Post-Processing)
- **오타 교정 (Spell Checking)**: 인식된 텍스트에서 오타를 교정.
- **문맥 분석 (Context Analysis)**: 문맥을 분석하여 인식 오류를 수정.

### 7. 출력 (Output)
- **텍스트 데이터 저장**: 인식된 텍스트를 파일, 데이터베이스, 애플리케이션 등 다양한 형식으로 저장하거나 출력.


# JavaScript OCR 라이브러리

| 라이브러리        | 소스         | 설명                                                                                             | 주요 기능 및 강점                                                | GitHub/정보 페이지 링크                                              |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Tesseract.js | HP와 Google | 100개 이상의 언어, 자동 텍스트 방향 및 스크립트 감지를 지원<br>각 언어에 대한 자신만의 트레이닝 데이터를 생성하고 해당 데이터를 통해 인식능력 강화 가능<br> | 여러 언어 지원, 브라우저 및 Node.js에서 작동, 필기 및 인쇄된 텍스트 인식 제공, 비동기 처리 | [Tesseract.js GitHub](https://github.com/naptha/tesseract.js) |
| OCRAD.js     | -          | 가볍고 기본적인 OCR 기능을 갖추고 있습니다.                                                                     | 웹 애플리케이션에 쉽게 통합, 가볍고 빠름, 기본 텍스트 인식 지원                     | [OCRAD.js GitHub](https://github.com/antimatter15/ocrad.js)   |
| jsOCR        | -          | jsOCR은 브라우저에서 직접 작동하는 JavaScript OCR 라이브러리입니다. 기본적인 OCR 작업을 위한 간단하고 가벼운 라이브러리입니다.              | 가볍고 사용하기 쉬움, 브라우저 호환 가능                                   | [jsOCR GitHub](https://github.com/cdglabs/jsocr)              |



# JavaScript  PDF to Text 라이브러리

| 라이브러리                         | 소스/배포자  | 설명                                            | 주요 기능 및 강점                                  | GitHub/정보 페이지 링크                                       |
| ----------------------------- | ------- | --------------------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| pdf-lib                       | Hopding | PDF 문서의 생성, 수정 및 텍스트 추출을 위한 JavaScript 라이브러리. | Node.js 및 브라우저 환경에서 사용 가능, 텍스트 추출 및 수정 지원.  | [pdf-lib GitHub](https://github.com/Hopding/pdf-lib)   |
| pdfjs-dist (Mozilla's PDF.js) | Mozilla | 웹 표준 기반 PDF 파싱 및 렌더링 플랫폼.                     | PDF에서 텍스트 내용을 추출할 수 있으며, 웹 애플리케이션에서 널리 사용됨. | [pdfjs-dist GitHub](https://github.com/mozilla/pdf.js) |


# JavaScript Libraries for Converting PDF to Text

| 라이브러리                         | 소스/배포자     | 설명                                                                            | 주요 기능 및 강점                                                   | GitHub/정보 페이지 링크                                              |
| ----------------------------- | ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| pdf-lib                       | Hopding    | PDF 문서의 생성, 수정 및 텍스트 추출을 위한 JavaScript 라이브러리. 텍스트가 인코딩된 PDF 문서에서만 텍스트를 추출 가능. | Node.js 및 브라우저 환경에서 사용 가능, 텍스트 추출 및 수정 지원.                   | [pdf-lib GitHub](https://github.com/Hopding/pdf-lib)          |
| pdfjs-dist (Mozilla's PDF.js) | Mozilla    | 웹 표준 기반 PDF 파싱 및 렌더링 플랫폼.                                                     | PDF에서 텍스트 내용을 추출할 수 있으며, 웹 애플리케이션에서 널리 사용됨. 이미지에서 텍스트 추출 불가. | [pdfjs-dist GitHub](https://github.com/mozilla/pdf.js)        |
| Tesseract.js                  | HP와 Google | OCR 라이브러리로, 이미지를 포함한 PDF에서 텍스트를 추출할 수 있음.                                     | 여러 언어 지원, 브라우저 및 Node.js에서 작동, 필기 및 인쇄된 텍스트 인식 제공, 비동기 처리    | [Tesseract.js GitHub](https://github.com/naptha/tesseract.js) |




Tesseract 자체는 PDF 파일을 직접 처리하지 않지만 
PDF 파일에 포함된 이미지를 포함하여 이미지에서 텍스트를 추출하는 데 사용 가능.

PDF 페이지에서 이미지를 추출합니다.
Tesseract를 사용하여 추출된 이미지에 대해 OCR을 수행



1단계: PDF에서 이미지 추출
pdf-lib를 사용하여 PDF 파일을 조작
pdfjs-dist를 사용하여 PDF 페이지를 렌더링하고 이미지를 추출



2단계: 추출된 이미지에 대해 OCR 수행
이미지에서 텍스트 추출을 위해 Tesseract 사용




auther jiwon kim
since 2024.07.19.

version1