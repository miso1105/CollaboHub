# CollaboHub
**팀 협업 및 실시간 이벤트 플랫폼**

![Image](https://github.com/user-attachments/assets/ca6f9f81-9eee-40c6-a65d-65547770cc72)

## ERD

[ERD link](https://www.erdcloud.com/p/Ec5CFhFuLthghK9nc)
![Image](https://github.com/user-attachments/assets/c5793cfa-c40c-4ed8-951d-66319e02581f)

## 기술 스택
Node.js, Express, Postman, Figma

## 프로젝트 구조
```
project/
├── .github/                    # GitHub 설정 및 PR
├── src/                        # Express 서버 코드
│   ├── config/                 # 환경 설정 및 DB, Socket.io 설정 
│   ├── controllers/            # 요청 처리 컨트롤러
│   ├── dtos/                   # 요청 / 응답 DTO 객체
│   ├── lib/                    # 커스텀 에러 및 유틸리티 함수 모음
│   ├── middlewares/            # 인증, 에러처리 미들웨어
│   ├── public/                 # 클라이언트 정적 파일 (JS)
│   ├── repositories/           # DB 접근 및 쿼리 실행
│   ├── routes/                 # API 라우터 
│   ├── services/               # 비즈니스 로직 처리 계층
│   └── views/                  # Nunjucks 기반 템플릿 뷰
├── app.js                      # Express 앱 설정 (라우터, 미들웨어 등록)
├── server.js                   # 서버 실행 및 Socket 연결 
└── README.md                  
```

## 와이어 프레임
[Figma link](https://www.figma.com/design/xFtggBveg7y1Pvt0JPB6WL/%EB%B0%95%EB%AF%B8%EC%86%8C-s-team-library?t=AafkHU3tyM9MYdiq-1)
