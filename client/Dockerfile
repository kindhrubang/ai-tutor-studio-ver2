# Node.js 기본 이미지 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 프로덕션 환경을 위한 서버 설치
RUN npm install -g serve

# 서버 실행
CMD ["serve", "-s", "build", "-l", "3000"]

# 포트 3000 노출
EXPOSE 3000