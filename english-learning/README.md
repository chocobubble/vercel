# 영어 학습 앱

미국 여행 준비를 위한 대화형 영어 받아쓰기 및 문법 학습 앱

## 📁 프로젝트 구조

```
english-learning/
├── index.html              # 메인 페이지
├── css/
│   └── style.css          # 스타일시트
├── js/
│   └── app.js             # 앱 로직
└── data/
    ├── scenarios.json     # 대화 시나리오 데이터
    ├── grammar.json       # 문법 학습 데이터
    └── quiz.json          # 객관식 문제 데이터
```

## 🎯 사용법

### 학습 모드 선택
- **대화 연습**: 받아쓰기 연습
- **문법 공부**: 문법 설명 읽기
- **문제 풀기**: 객관식 문제 풀이

### 대화 연습 모드
1. **시나리오 선택**: 상단 버튼으로 대화 상황 선택
2. **문장 듣기**: 🔊 버튼 클릭 또는 스페이스바
3. **받아쓰기**: 들은 문장을 텍스트 박스에 입력
4. **정답 확인**: Enter 키 또는 "정답 확인" 버튼
5. **다음 문장**: "다음 문장" 버튼 또는 N 키

### 문법 공부 모드
1. **문법 주제**: 고급 문법 개념 학습
2. **설명 읽기**: 한국어 설명과 예문 확인
3. **네비게이션**: 이전/다음 버튼으로 주제 이동

### 문제 풀기 모드
1. **객관식 문제**: 문법, 어휘, 표현 문제 풀이
2. **보기 선택**: 4개의 보기 중 정답 선택
3. **정답 확인**: 정답 여부와 상세 설명 확인
4. **다음 문제**: 다음 문제로 이동

### 대화 시나리오 추가
`data/scenarios.json`에 다음 형식으로 추가:

```json
{
  "scenario_name": {
    "title": "시나리오 제목",
    "description": "시나리오 설명",
    "difficulty": "beginner|intermediate|advanced",
    "dialogue": [
      {
        "speaker": "Staff|Customer",
        "text": "영어 문장",
        "korean": "한국어 번역",
        "vocabulary": [
          { "word": "단어", "meaning": "뜻" }
        ],
        "grammar": "문법 설명"
      }
    ]
  }
}
```

### 문법 주제 추가
`data/grammar.json`에 다음 형식으로 추가:

```json
{
  "topic": "문법 주제명",
  "explanation": "한국어 설명",
  "examples": [
    {
      "sentence": "영어 예문",
      "korean": "한국어 번역",
      "note": "설명 노트"
    }
  ]
}
```

### 객관식 문제 추가
`data/quiz.json`에 다음 형식으로 추가:

```json
{
  "question": "문제 내용",
  "options": [
    "보기 1",
    "보기 2",
    "보기 3",
    "보기 4"
  ],
  "answer": 0,
  "explanation": "정답 설명"
}
```
(answer는 0부터 시작하는 인덱스)
