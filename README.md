# ai-tutor-studio-ver2

## 시스템 환경변수 설정

LLM_API_KEY : OPENAI API KEY 입력

## client 실행 명령어

node.js 설치

cd client : 클라이언트 폴더로 이동

npm install : 클라이언트 설치

npm start : 클라이언트 실행 , 주소 <http://localhost:3000>

## server 실행 명령어

where python : 파이썬 경로 확인

python -m venv venv : 가상환경 생성

venv\Scripts\activate : 가상환경 실행(윈도우)

pip install -r requirements.txt : 서버 및 의존성 설치

python -m uvicorn main:app --reload : 서버 실행 , 주소 <http://localhost:8000>
