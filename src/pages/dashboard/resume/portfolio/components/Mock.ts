const mockData = {
  "id": "6831f0adb8489b6aca2eaf3d",
  "spaceId": 56,
  "title": "StockNote",
  "author": {
      "id": 17,
      "nickname": "kknaks"
  },
  "duration": {
      "startDate": "2025-04-01T00:00:00",
      "endDate": "2025-05-01T00:00:00"
  },
  "githubLink": "https://github.com/BackEndSchoolPlus3th/StockNote_BE",
  "deployLink": "https://github.com/BackEndSchoolPlus3th/StockNote_BE",
  "memberCount": 4,
  "memberRoles": "PM",
  "contents": {
      "techStack": "Spring Boot, MySQL, Redis, Elasticsearch, WebSocket, OAuth2, React/Vue (프론트엔드), Kafka (추가 가능), Docker, AWS S3 (추가 가능)",
      "summary": "이 프로젝트는 주식 투자 포트폴리오 관리 시스템으로, 사용자 맞춤 포트폴리오 생성, 실시간 주가 및 관심 종목 관리, 게시글 및 댓글 기능, 알림 서비스, 검색 및 통계 분석을 통합하여 투자 경험을 향상시키는 플랫폼입니다. 다양한 API 연동과 실시간 데이터 처리, 사용자 중심 UI를 구현하여 효율적이고 직관적인 투자 환경을 제공합니다.",
      "description": "본 시스템은 사용자들이 주식 포트폴리오를 효율적으로 관리하고 투자 결정을 지원하는 것을 목적으로 개발되었습니다. 주식 데이터 API, Elasticsearch를 활용한 검색 및 통계, Redis를 통한 캐싱과 실시간 인기 투표, WebSocket 기반의 실시간 가격 알림, SNS 로그인 OAuth2 인증, 게시글 및 댓글, 좋아요, 알림 등 다양한 도메인 기능을 통합하여 사용자 경험을 극대화합니다. 서버는 Spring Boot 프레임워크로 구성되어 있으며, 데이터 저장은 MySQL, 캐시와 실시간 데이터 처리는 Redis, 검색은 Elasticsearch를 사용합니다. 클라이언트는 React 또는 Vue 기반 프론트엔드와 연동되어 직관적 UI를 제공합니다. 또한, 주기적 주가 데이터 다운로드와 분석, 관심 종목 자동 추천 등 부가 기능도 포함되어 있어 투자 효율성을 높입니다.",
      "roles": [
          "Spring Boot와 JPA를 사용해서 서버 구조 설계 및 REST API 구현하여 클라이언트와 서버 간 데이터 교환 효율성 향상",
          "Elasticsearch를 활용한 검색 기능 개발하여 게시글, 종목, 포트폴리오 검색 속도 50% 향상",
          "JWT 기반 인증 및 권한 부여 구현하여 사용자 인증 신뢰성 확보 및 보안 강화",
          "Redis를 이용한 캐시 및 토큰 저장소 구축하여 API 응답속도 30% 개선 및 세션 관리 효율화",
          "WebSocket과 SSE를 활용한 실시간 알림 시스템 개발하여 사용자 경험 향상 및 알림 지연 시간 70% 감소",
          "Python 스크립트 자동 다운로드 및 데이터 처리 자동화하여 주식 데이터 수집 시간 60% 단축",
          "OAuth2 로그인 및 소셜 인증 구현하여 회원가입 및 로그인 편의성 40% 향상",
          "커스텀 예외처리 및 글로벌 에러 핸들러 설계로 시스템 안정성 및 유지보수성 강화"
      ],
      "features": {
          "회원관리": [
              "OAuth2 기반 SNS 로그인 지원으로 간편한 회원가입과 로그인 제공",
              "회원 프로필 수정 및 관심 종목 관리 기능 포함"
          ],
          "포트폴리오": [
              "포트폴리오 생성, 조회, 수정, 삭제 기능 제공",
              "다수의 관심 종목 등록 및 실시간 가격 업데이트 지원",
              "포트폴리오별 자산 현황 및 수익률 계산"
          ],
          "주식 데이터": [
              "외부 주식 API 연동으로 실시간 가격, 차트, 거래량 제공",
              "종목 검색, 관심 종목 등록/삭제, 관심 종목 리스트 조회"
          ],
          "게시판": [
              "게시글 작성, 수정, 삭제, 상세 조회 기능",
              "카테고리별 게시글 필터링 및 인기글 조회",
              "댓글 작성, 수정, 삭제, 댓글별 알림 기능 포함"
          ],
          "투표 및 인기순위": [
              "실시간 인기 투표 기능으로 관심 종목 투표 집계",
              "Redis 기반 투표 통계 및 매일 초기화",
              "투표 결과를 실시간 WebSocket 알림으로 전달"
          ],
          "알림": [
              "댓글 알림, 키워드 알림 실시간 SSE 전송",
              "읽음 처리 및 알림 목록 조회 기능",
              "키워드 기반 관심 게시글 알림"
          ],
          "검색 및 통계": [
              "Elasticsearch 기반 게시글, 관심 종목 검색",
              "포트폴리오 통계, 인기글, 댓글 수집 및 분석"
          ],
          "시스템 아키텍처": [
              "API 서버, 검색 서버, 캐시 서버, 데이터 저장소, 실시간 통신 채널로 구성",
              "서비스 간 REST API, WebSocket, SSE를 통한 통신",
              "클라우드 배포 및 Docker 컨테이너 활용"
          ]
      },
      "architecture": {
          "communication": "서비스 간 REST API, WebSocket, SSE를 통해 실시간 데이터 및 알림 전달, 내부 데이터 연동은 MySQL, Elasticsearch, Redis를 활용하여 빠른 응답성과 확장성 확보",
          "deployment": "Docker 컨테이너 기반 배포, 클라우드 환경(AWS)에서 오케스트레이션 및 확장 가능, CI/CD 파이프라인 구축"
      }
  },
  "thumbnailUrl": null,
  "publicAccess": false,
  "githubRepos": [
      {
          "name": "BackEndSchoolPlus3th/StockNote_BE",
          "url": "https://github.com/BackEndSchoolPlus3th/StockNote_BE",
          "description": "[토성팀] 사용자 맞춤형 주식포트폴리오 커뮤니티 플랫폼 ",
          "language": "Java",
          "lineCount": 3383,
          "byteSize": null,
          "selectedDirectories": [
              "src",
              "src/main",
              "src/main/java",
              "src/main/java/org",
              "src/main/java/org/com",
              "src/main/java/org/com/stocknote",
              "src/main/java/org/com/stocknote/config",
              "src/main/java/org/com/stocknote/config/AppConfig.java",
              "src/main/java/org/com/stocknote/config/CorsConfig.java",
              "src/main/java/org/com/stocknote/config/ModuleConfig.java",
              "src/main/java/org/com/stocknote/config/QuerydslConfig.java",
              "src/main/java/org/com/stocknote/config/RedisConfig.java",
              "src/main/java/org/com/stocknote/config/RestTemplateConfig.java",
              "src/main/java/org/com/stocknote/config/StockScheduler.java",
              "src/main/java/org/com/stocknote/config/SwaggerConfig.java",
              "src/main/java/org/com/stocknote/config/WebConfig.java",
              "src/main/java/org/com/stocknote/config/WebSocketAuthInterceptor.java",
              "src/main/java/org/com/stocknote/config/WebSocketConfig.java",
              "src/main/java/org/com/stocknote/domain",
              "src/main/java/org/com/stocknote/domain/comment",
              "src/main/java/org/com/stocknote/domain/comment/controller",
              "src/main/java/org/com/stocknote/domain/comment/controller/CommentController.java",
              "src/main/java/org/com/stocknote/domain/comment/dto",
              "src/main/java/org/com/stocknote/domain/comment/dto/CommentDetailResponse.java",
              "src/main/java/org/com/stocknote/domain/comment/dto/CommentRequest.java",
              "src/main/java/org/com/stocknote/domain/comment/dto/CommentUpdateDto.java",
              "src/main/java/org/com/stocknote/domain/comment/entity",
              "src/main/java/org/com/stocknote/domain/comment/entity/Comment.java",
              "src/main/java/org/com/stocknote/domain/comment/repository",
              "src/main/java/org/com/stocknote/domain/comment/repository/CommentRepository.java",
              "src/main/java/org/com/stocknote/domain/comment/service",
              "src/main/java/org/com/stocknote/domain/comment/service/CommentService.java",
              "src/main/java/org/com/stocknote/domain/hashtag",
              "src/main/java/org/com/stocknote/domain/hashtag/entity",
              "src/main/java/org/com/stocknote/domain/hashtag/entity/Hashtag.java",
              "src/main/java/org/com/stocknote/domain/hashtag/repository",
              "src/main/java/org/com/stocknote/domain/hashtag/repository/HashtagRepository.java",
              "src/main/java/org/com/stocknote/domain/hashtag/service",
              "src/main/java/org/com/stocknote/domain/hashtag/service/HashtagService.java",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/controller",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/controller/HashtagAutocompleteController.java",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/RedisSortedSetService.java",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/service",
              "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/service/HashtagAutocompleteService.java",
              "src/main/java/org/com/stocknote/domain/keyword",
              "src/main/java/org/com/stocknote/domain/keyword/controller",
              "src/main/java/org/com/stocknote/domain/keyword/controller/KeywordController.java",
              "src/main/java/org/com/stocknote/domain/keyword/dto",
              "src/main/java/org/com/stocknote/domain/keyword/dto/KeywordRequest.java",
              "src/main/java/org/com/stocknote/domain/keyword/dto/KeywordResponse.java",
              "src/main/java/org/com/stocknote/domain/keyword/entity",
              "src/main/java/org/com/stocknote/domain/keyword/entity/Keyword.java",
              "src/main/java/org/com/stocknote/domain/keyword/repository",
              "src/main/java/org/com/stocknote/domain/keyword/repository/KeywordRepository.java",
              "src/main/java/org/com/stocknote/domain/keyword/service",
              "src/main/java/org/com/stocknote/domain/keyword/service/KeywordService.java",
              "src/main/java/org/com/stocknote/domain/like",
              "src/main/java/org/com/stocknote/domain/like/controller",
              "src/main/java/org/com/stocknote/domain/like/controller/LikeController.java",
              "src/main/java/org/com/stocknote/domain/like/entity",
              "src/main/java/org/com/stocknote/domain/like/entity/Like.java",
              "src/main/java/org/com/stocknote/domain/like/repository",
              "src/main/java/org/com/stocknote/domain/like/repository/LikeRepository.java",
              "src/main/java/org/com/stocknote/domain/like/service",
              "src/main/java/org/com/stocknote/domain/like/service/LikeService.java",
              "src/main/java/org/com/stocknote/domain/member",
              "src/main/java/org/com/stocknote/domain/member/controller",
              "src/main/java/org/com/stocknote/domain/member/controller/MemberController.java",
              "src/main/java/org/com/stocknote/domain/member/dto",
              "src/main/java/org/com/stocknote/domain/member/dto/ChangeNameRequest.java",
              "src/main/java/org/com/stocknote/domain/member/dto/MemberDto.java",
              "src/main/java/org/com/stocknote/domain/member/dto/MyCommentResponse.java",
              "src/main/java/org/com/stocknote/domain/member/dto/MyPostResponse.java",
              "src/main/java/org/com/stocknote/domain/member/entity",
              "src/main/java/org/com/stocknote/domain/member/entity/AuthProvider.java",
              "src/main/java/org/com/stocknote/domain/member/entity/Member.java",
              "src/main/java/org/com/stocknote/domain/member/entity/Role.java",
              "src/main/java/org/com/stocknote/domain/member/repository",
              "src/main/java/org/com/stocknote/domain/member/repository/MemberRepository.java",
              "src/main/java/org/com/stocknote/domain/member/service",
              "src/main/java/org/com/stocknote/domain/member/service/MemberService.java",
              "src/main/java/org/com/stocknote/domain/memberStock",
              "src/main/java/org/com/stocknote/domain/memberStock/entity",
              "src/main/java/org/com/stocknote/domain/memberStock/entity/MemberStock.java",
              "src/main/java/org/com/stocknote/domain/memberStock/repository",
              "src/main/java/org/com/stocknote/domain/memberStock/repository/MemberStockRepository.java",
              "src/main/java/org/com/stocknote/domain/notification",
              "src/main/java/org/com/stocknote/domain/notification/controller",
              "src/main/java/org/com/stocknote/domain/notification/controller/CommentNotificationController.java",
              "src/main/java/org/com/stocknote/domain/notification/controller/KeywordNotificationController.java",
              "src/main/java/org/com/stocknote/domain/notification/controller/NotificationController.java",
              "src/main/java/org/com/stocknote/domain/notification/controller/SseController.java",
              "src/main/java/org/com/stocknote/domain/notification/dto",
              "src/main/java/org/com/stocknote/domain/notification/dto/CommentNotificationResponse.java",
              "src/main/java/org/com/stocknote/domain/notification/dto/KeywordNotificationResponse.java",
              "src/main/java/org/com/stocknote/domain/notification/entity",
              "src/main/java/org/com/stocknote/domain/notification/entity/CommentNotification.java",
              "src/main/java/org/com/stocknote/domain/notification/entity/KeywordNotification.java",
              "src/main/java/org/com/stocknote/domain/notification/repository",
              "src/main/java/org/com/stocknote/domain/notification/repository/CommentNotificationRepository.java",
              "src/main/java/org/com/stocknote/domain/notification/repository/KeywordNotificationRepository.java",
              "src/main/java/org/com/stocknote/domain/notification/service",
              "src/main/java/org/com/stocknote/domain/notification/service/CommentNotificationService.java",
              "src/main/java/org/com/stocknote/domain/notification/service/KeywordNotificationElasticService.java",
              "src/main/java/org/com/stocknote/domain/notification/service/KeywordNotificationService.java",
              "src/main/java/org/com/stocknote/domain/notification/service/NotificationService.java",
              "src/main/java/org/com/stocknote/domain/notification/service/SseEmitterService.java",
              "src/main/java/org/com/stocknote/domain/portfolio",
              "src/main/java/org/com/stocknote/domain/portfolio/note",
              "src/main/java/org/com/stocknote/domain/portfolio/note/controller",
              "src/main/java/org/com/stocknote/domain/portfolio/note/controller/NoteController.java",
              "src/main/java/org/com/stocknote/domain/portfolio/note/dto",
              "src/main/java/org/com/stocknote/domain/portfolio/note/dto/NoteResponse.java",
              "src/main/java/org/com/stocknote/domain/portfolio/note/entity",
              "src/main/java/org/com/stocknote/domain/portfolio/note/entity/Note.java",
              "src/main/java/org/com/stocknote/domain/portfolio/note/repository",
              "src/main/java/org/com/stocknote/domain/portfolio/note/repository/NoteRepository.java",
              "src/main/java/org/com/stocknote/domain/portfolio/note/service",
              "src/main/java/org/com/stocknote/domain/portfolio/note/service/NoteService.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/controller",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/controller/CashController.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/controller/PortfolioController.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/request",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/request/PortfolioPatchRequest.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/request/PortfolioRequest.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/response",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/response/PortfolioResponse.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/entity",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/entity/Portfolio.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/repository",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/repository/PortfolioRepository.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/service",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolio/service/PortfolioService.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/controller",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/controller/PfStockController.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/request",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/request/PfStockPatchRequest.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/request/PfStockRequest.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/response",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/response/PfStockResponse.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/entity",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/entity/PfStock.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/repository",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/repository/PfStockRepository.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/PfStockService.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/TempStockInfoService.java",
              "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/TempStockService.java",
              "src/main/java/org/com/stocknote/domain/post",
              "src/main/java/org/com/stocknote/domain/post/controller",
              "src/main/java/org/com/stocknote/domain/post/controller/PostController.java",
              "src/main/java/org/com/stocknote/domain/post/dto",
              "src/main/java/org/com/stocknote/domain/post/dto/PostCreateDto.java",
              "src/main/java/org/com/stocknote/domain/post/dto/PostModifyDto.java",
              "src/main/java/org/com/stocknote/domain/post/dto/PostResponseDto.java",
              "src/main/java/org/com/stocknote/domain/post/dto/PostSearchConditionDto.java",
              "src/main/java/org/com/stocknote/domain/post/dto/PostStockResponse.java",
              "src/main/java/org/com/stocknote/domain/post/entity",
              "src/main/java/org/com/stocknote/domain/post/entity/Post.java",
              "src/main/java/org/com/stocknote/domain/post/entity/PostCategory.java",
              "src/main/java/org/com/stocknote/domain/post/repository",
              "src/main/java/org/com/stocknote/domain/post/repository/PostRepository.java",
              "src/main/java/org/com/stocknote/domain/post/repository/PostSearchRepository.java",
              "src/main/java/org/com/stocknote/domain/post/repository/PostSearchRepositoryImpl.java",
              "src/main/java/org/com/stocknote/domain/post/service",
              "src/main/java/org/com/stocknote/domain/post/service/PostService.java",
              "src/main/java/org/com/stocknote/domain/searchDoc",
              "src/main/java/org/com/stocknote/domain/searchDoc/controller",
              "src/main/java/org/com/stocknote/domain/searchDoc/controller/SearchDocController.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/KeywordDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/MemberDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/PortfolioDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/PortfolioStockDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/PostDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/document/StockDoc.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/request",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/request/SearchKeyword.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/response",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchedStockResponse.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchPortfolioResponse.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchPortfolioStockResponse.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/KeywordDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/MemberDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/PortfolioDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/PortfolioStockDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/PostDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/repository/StockDocRepository.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/service",
              "src/main/java/org/com/stocknote/domain/searchDoc/service/KeywordDocService.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/service/SearchDocService.java",
              "src/main/java/org/com/stocknote/domain/searchDoc/service/StockDocService.java",
              "src/main/java/org/com/stocknote/domain/stock",
              "src/main/java/org/com/stocknote/domain/stock/controller",
              "src/main/java/org/com/stocknote/domain/stock/controller/StockController.java",
              "src/main/java/org/com/stocknote/domain/stock/dto",
              "src/main/java/org/com/stocknote/domain/stock/dto/request",
              "src/main/java/org/com/stocknote/domain/stock/dto/request/StockAddRequest.java",
              "src/main/java/org/com/stocknote/domain/stock/entity",
              "src/main/java/org/com/stocknote/domain/stock/entity/Stock.java",
              "src/main/java/org/com/stocknote/domain/stock/repository",
              "src/main/java/org/com/stocknote/domain/stock/repository/StockRepository.java",
              "src/main/java/org/com/stocknote/domain/stock/service",
              "src/main/java/org/com/stocknote/domain/stock/service/price",
              "src/main/java/org/com/stocknote/domain/stock/service/price/StockPriceProcessor.java",
              "src/main/java/org/com/stocknote/domain/stock/service/StockService.java",
              "src/main/java/org/com/stocknote/domain/stockApi",
              "src/main/java/org/com/stocknote/domain/stockApi/controller",
              "src/main/java/org/com/stocknote/domain/stockApi/controller/StockApiController.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/ChartApiResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/ChartResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/CurrentIndexResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/SectorResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockDailyResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockInfoResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockPriceResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockTimeResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/response/VolumeResponse.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/StockDetailDto.java",
              "src/main/java/org/com/stocknote/domain/stockApi/dto/StockIndexDto.java",
              "src/main/java/org/com/stocknote/domain/stockApi/service",
              "src/main/java/org/com/stocknote/domain/stockApi/service/StockApiService.java",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/controller",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/controller/StockTokenController.java",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/dto",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/dto/StockTokenRequestDto.java",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/dto/StockTokenResponseDto.java",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/service",
              "src/main/java/org/com/stocknote/domain/stockApi/stockToken/service/StockTokenService.java",
              "src/main/java/org/com/stocknote/domain/stockApi/type",
              "src/main/java/org/com/stocknote/domain/stockApi/type/PeriodType.java",
              "src/main/java/org/com/stocknote/domain/stockVote",
              "src/main/java/org/com/stocknote/domain/stockVote/controller",
              "src/main/java/org/com/stocknote/domain/stockVote/controller/StockVoteController.java",
              "src/main/java/org/com/stocknote/domain/stockVote/dto",
              "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteListResponse.java",
              "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteRequest.java",
              "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteResponse.java",
              "src/main/java/org/com/stocknote/domain/stockVote/entity",
              "src/main/java/org/com/stocknote/domain/stockVote/entity/StockVote.java",
              "src/main/java/org/com/stocknote/domain/stockVote/entity/VoteStatistics.java",
              "src/main/java/org/com/stocknote/domain/stockVote/repository",
              "src/main/java/org/com/stocknote/domain/stockVote/repository/StockVoteRepository.java",
              "src/main/java/org/com/stocknote/domain/stockVote/service",
              "src/main/java/org/com/stocknote/domain/stockVote/service/StockVoteService.java",
              "src/main/java/org/com/stocknote/domain/stockVote/type",
              "src/main/java/org/com/stocknote/domain/stockVote/type/VoteType.java",
              "src/main/java/org/com/stocknote/global",
              "src/main/java/org/com/stocknote/global/aop",
              "src/main/java/org/com/stocknote/global/aop/EmailAspect.java",
              "src/main/java/org/com/stocknote/global/aop/InjectEmail.java",
              "src/main/java/org/com/stocknote/global/base",
              "src/main/java/org/com/stocknote/global/base/BaseEntity.java",
              "src/main/java/org/com/stocknote/global/cache",
              "src/main/java/org/com/stocknote/global/cache/service",
              "src/main/java/org/com/stocknote/global/cache/service/CacheService.java",
              "src/main/java/org/com/stocknote/global/error",
              "src/main/java/org/com/stocknote/global/error/ErrorCode.java",
              "src/main/java/org/com/stocknote/global/error/ErrorResponse.java",
              "src/main/java/org/com/stocknote/global/event",
              "src/main/java/org/com/stocknote/global/event/SseEmitters.java",
              "src/main/java/org/com/stocknote/global/exception",
              "src/main/java/org/com/stocknote/global/exception/CustomException.java",
              "src/main/java/org/com/stocknote/global/exception/ExceptionControllerAdvice.java",
              "src/main/java/org/com/stocknote/global/faker",
              "src/main/java/org/com/stocknote/global/faker/DummyDataGenerator.java",
              "src/main/java/org/com/stocknote/global/faker/InitService.java",
              "src/main/java/org/com/stocknote/global/globalDto",
              "src/main/java/org/com/stocknote/global/globalDto/GlobalResponse.java",
              "src/main/java/org/com/stocknote/global/globalDto/GlobalResponseCode.java",
              "src/main/java/org/com/stocknote/global/log",
              "src/main/java/org/com/stocknote/global/log/LogResetScheduler.java",
              "src/main/java/org/com/stocknote/global/util",
              "src/main/java/org/com/stocknote/global/util/SecurityUtil.java",
              "src/main/java/org/com/stocknote/oauth",
              "src/main/java/org/com/stocknote/oauth/controller",
              "src/main/java/org/com/stocknote/oauth/controller/AuthController.java",
              "src/main/java/org/com/stocknote/oauth/entity",
              "src/main/java/org/com/stocknote/oauth/entity/OAuth2UserInfo.java",
              "src/main/java/org/com/stocknote/oauth/entity/PrincipalDetails.java",
              "src/main/java/org/com/stocknote/oauth/service",
              "src/main/java/org/com/stocknote/oauth/service/CustomOAuth2UserService.java",
              "src/main/java/org/com/stocknote/oauth/service/OAuth2TokenService.java",
              "src/main/java/org/com/stocknote/oauth/token",
              "src/main/java/org/com/stocknote/oauth/token/controller",
              "src/main/java/org/com/stocknote/oauth/token/controller/TokenController.java",
              "src/main/java/org/com/stocknote/oauth/token/entity",
              "src/main/java/org/com/stocknote/oauth/token/entity/Token.java",
              "src/main/java/org/com/stocknote/oauth/token/service",
              "src/main/java/org/com/stocknote/oauth/token/service/TokenService.java",
              "src/main/java/org/com/stocknote/oauth/token/TokenAuthenticationFilter.java",
              "src/main/java/org/com/stocknote/oauth/token/TokenExceptionFilter.java",
              "src/main/java/org/com/stocknote/oauth/token/TokenProvider.java",
              "src/main/java/org/com/stocknote/oauth/token/TokenResponse.java",
              "src/main/java/org/com/stocknote/security",
              "src/main/java/org/com/stocknote/security/CustomAccessDeniedHandler.java",
              "src/main/java/org/com/stocknote/security/CustomAuthenticationEntryPoint.java",
              "src/main/java/org/com/stocknote/security/OAuth2SuccessHandler.java",
              "src/main/java/org/com/stocknote/security/SaveRequestFilter.java",
              "src/main/java/org/com/stocknote/security/SecurityConfig.java",
              "src/main/java/org/com/stocknote/security/SecurityUtils.java",
              "src/main/java/org/com/stocknote/StockNoteApplication.java",
              "src/main/java/org/com/stocknote/websocket",
              "src/main/java/org/com/stocknote/websocket/service",
              "src/main/java/org/com/stocknote/websocket/service/WebSocketService.java",
              "src/main/resources",
              "src/main/resources/application-dev.yml",
              "src/main/resources/application-prod.yml",
              "src/main/resources/application-secret.yml.default",
              "src/main/resources/application-test.yml",
              "src/main/resources/application.yml",
              "src/main/resources/elasticsearch",
              "src/main/resources/elasticsearch/logstash",
              "src/main/resources/elasticsearch/logstash/config",
              "src/main/resources/elasticsearch/logstash/config/keyword.conf",
              "src/main/resources/elasticsearch/logstash/config/member.conf",
              "src/main/resources/elasticsearch/logstash/config/pfstock.conf",
              "src/main/resources/elasticsearch/logstash/config/portfolio.conf",
              "src/main/resources/elasticsearch/logstash/config/post.conf",
              "src/main/resources/elasticsearch/logstash/config/stock.conf",
              "src/main/resources/elasticsearch/logstash/docker-compose.yml.default",
              "src/main/resources/elasticsearch/logstash/mysql.env",
              "src/main/resources/elasticsearch/logstash/pipeline",
              "src/main/resources/elasticsearch/logstash/pipeline/logstash.yml",
              "src/main/resources/elasticsearch/logstash/pipeline/piplines.yml",
              "src/main/resources/elasticsearch/mappings.json",
              "src/main/resources/elasticsearch/settings.json",
              "src/main/resources/scripts",
              "src/main/resources/scripts/stock_download.py",
              "src/test",
              "src/test/java",
              "src/test/java/org",
              "src/test/java/org/com",
              "src/test/java/org/com/stocknote",
              "src/test/java/org/com/stocknote/portfolio",
              "src/test/java/org/com/stocknote/portfolio/pfListTest.java",
              "src/test/java/org/com/stocknote/StockNoteApplicationTests.java"
          ]
      }
  ],
  "savedFiles": [
      {
          "id": "17481032410950",
          "name": "QuerydslConfig.java",
          "path": "src/main/java/org/com/stocknote/config/QuerydslConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410951",
          "name": "CorsConfig.java",
          "path": "src/main/java/org/com/stocknote/config/CorsConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410952",
          "name": "ModuleConfig.java",
          "path": "src/main/java/org/com/stocknote/config/ModuleConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410953",
          "name": "AppConfig.java",
          "path": "src/main/java/org/com/stocknote/config/AppConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410954",
          "name": "RestTemplateConfig.java",
          "path": "src/main/java/org/com/stocknote/config/RestTemplateConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410955",
          "name": "StockScheduler.java",
          "path": "src/main/java/org/com/stocknote/config/StockScheduler.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410956",
          "name": "RedisConfig.java",
          "path": "src/main/java/org/com/stocknote/config/RedisConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410957",
          "name": "SwaggerConfig.java",
          "path": "src/main/java/org/com/stocknote/config/SwaggerConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410958",
          "name": "WebSocketAuthInterceptor.java",
          "path": "src/main/java/org/com/stocknote/config/WebSocketAuthInterceptor.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "17481032410959",
          "name": "WebSocketConfig.java",
          "path": "src/main/java/org/com/stocknote/config/WebSocketConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109510",
          "name": "CommentController.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/controller/CommentController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109511",
          "name": "WebConfig.java",
          "path": "src/main/java/org/com/stocknote/config/WebConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109512",
          "name": "CommentRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/dto/CommentRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109513",
          "name": "CommentDetailResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/dto/CommentDetailResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109514",
          "name": "CommentUpdateDto.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/dto/CommentUpdateDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109515",
          "name": "Comment.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/entity/Comment.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109516",
          "name": "CommentService.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/service/CommentService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109517",
          "name": "CommentRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/comment/repository/CommentRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109518",
          "name": "Hashtag.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtag/entity/Hashtag.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109519",
          "name": "HashtagRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtag/repository/HashtagRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109520",
          "name": "HashtagService.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtag/service/HashtagService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109521",
          "name": "HashtagAutocompleteController.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/controller/HashtagAutocompleteController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109522",
          "name": "RedisSortedSetService.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/RedisSortedSetService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109523",
          "name": "HashtagAutocompleteService.java",
          "path": "src/main/java/org/com/stocknote/domain/hashtagAutocomplete/service/HashtagAutocompleteService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109524",
          "name": "KeywordController.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/controller/KeywordController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109525",
          "name": "KeywordRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/dto/KeywordRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109526",
          "name": "KeywordResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/dto/KeywordResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109527",
          "name": "Keyword.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/entity/Keyword.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109528",
          "name": "KeywordRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/repository/KeywordRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109529",
          "name": "KeywordService.java",
          "path": "src/main/java/org/com/stocknote/domain/keyword/service/KeywordService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109530",
          "name": "Like.java",
          "path": "src/main/java/org/com/stocknote/domain/like/entity/Like.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109531",
          "name": "LikeController.java",
          "path": "src/main/java/org/com/stocknote/domain/like/controller/LikeController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109532",
          "name": "MemberController.java",
          "path": "src/main/java/org/com/stocknote/domain/member/controller/MemberController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109533",
          "name": "LikeService.java",
          "path": "src/main/java/org/com/stocknote/domain/like/service/LikeService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109534",
          "name": "LikeRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/like/repository/LikeRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109535",
          "name": "ChangeNameRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/member/dto/ChangeNameRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109536",
          "name": "MyPostResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/member/dto/MyPostResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109537",
          "name": "MemberDto.java",
          "path": "src/main/java/org/com/stocknote/domain/member/dto/MemberDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109638",
          "name": "MyCommentResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/member/dto/MyCommentResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109639",
          "name": "AuthProvider.java",
          "path": "src/main/java/org/com/stocknote/domain/member/entity/AuthProvider.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109640",
          "name": "Member.java",
          "path": "src/main/java/org/com/stocknote/domain/member/entity/Member.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109641",
          "name": "Role.java",
          "path": "src/main/java/org/com/stocknote/domain/member/entity/Role.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109642",
          "name": "MemberRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/member/repository/MemberRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109643",
          "name": "MemberService.java",
          "path": "src/main/java/org/com/stocknote/domain/member/service/MemberService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109644",
          "name": "MemberStock.java",
          "path": "src/main/java/org/com/stocknote/domain/memberStock/entity/MemberStock.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109645",
          "name": "MemberStockRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/memberStock/repository/MemberStockRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109646",
          "name": "CommentNotificationController.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/controller/CommentNotificationController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109647",
          "name": "KeywordNotificationController.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/controller/KeywordNotificationController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109648",
          "name": "NotificationController.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/controller/NotificationController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109649",
          "name": "CommentNotificationResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/dto/CommentNotificationResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109650",
          "name": "SseController.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/controller/SseController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109651",
          "name": "KeywordNotificationResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/dto/KeywordNotificationResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109652",
          "name": "CommentNotification.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/entity/CommentNotification.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109653",
          "name": "KeywordNotification.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/entity/KeywordNotification.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109654",
          "name": "CommentNotificationRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/repository/CommentNotificationRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109655",
          "name": "KeywordNotificationRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/repository/KeywordNotificationRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109656",
          "name": "KeywordNotificationElasticService.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/service/KeywordNotificationElasticService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109657",
          "name": "CommentNotificationService.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/service/CommentNotificationService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109658",
          "name": "KeywordNotificationService.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/service/KeywordNotificationService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109659",
          "name": "NotificationService.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/service/NotificationService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109660",
          "name": "NoteController.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/note/controller/NoteController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109661",
          "name": "NoteResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/note/dto/NoteResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109662",
          "name": "SseEmitterService.java",
          "path": "src/main/java/org/com/stocknote/domain/notification/service/SseEmitterService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109663",
          "name": "Note.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/note/entity/Note.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109664",
          "name": "NoteRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/note/repository/NoteRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109665",
          "name": "NoteService.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/note/service/NoteService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109666",
          "name": "CashController.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/controller/CashController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109667",
          "name": "PortfolioController.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/controller/PortfolioController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109668",
          "name": "PortfolioRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/request/PortfolioRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109669",
          "name": "PortfolioPatchRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/request/PortfolioPatchRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109670",
          "name": "PortfolioResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/dto/response/PortfolioResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109671",
          "name": "Portfolio.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/entity/Portfolio.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109672",
          "name": "PortfolioRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/repository/PortfolioRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109673",
          "name": "PortfolioService.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolio/service/PortfolioService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109674",
          "name": "PfStockController.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/controller/PfStockController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109675",
          "name": "PfStockPatchRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/request/PfStockPatchRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109676",
          "name": "PfStockRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/request/PfStockRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109677",
          "name": "PfStockResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/dto/response/PfStockResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109678",
          "name": "PfStock.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/entity/PfStock.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109679",
          "name": "PfStockRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/repository/PfStockRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109680",
          "name": "PfStockService.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/PfStockService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109681",
          "name": "TempStockInfoService.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/TempStockInfoService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109682",
          "name": "TempStockService.java",
          "path": "src/main/java/org/com/stocknote/domain/portfolio/portfolioStock/service/TempStockService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109683",
          "name": "PostController.java",
          "path": "src/main/java/org/com/stocknote/domain/post/controller/PostController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109684",
          "name": "PostCreateDto.java",
          "path": "src/main/java/org/com/stocknote/domain/post/dto/PostCreateDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109685",
          "name": "PostResponseDto.java",
          "path": "src/main/java/org/com/stocknote/domain/post/dto/PostResponseDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109686",
          "name": "PostModifyDto.java",
          "path": "src/main/java/org/com/stocknote/domain/post/dto/PostModifyDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109687",
          "name": "PostSearchConditionDto.java",
          "path": "src/main/java/org/com/stocknote/domain/post/dto/PostSearchConditionDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109688",
          "name": "PostStockResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/post/dto/PostStockResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109689",
          "name": "Post.java",
          "path": "src/main/java/org/com/stocknote/domain/post/entity/Post.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109690",
          "name": "PostSearchRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/post/repository/PostSearchRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109691",
          "name": "PostRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/post/repository/PostRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109692",
          "name": "PostSearchRepositoryImpl.java",
          "path": "src/main/java/org/com/stocknote/domain/post/repository/PostSearchRepositoryImpl.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109693",
          "name": "SearchDocController.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/controller/SearchDocController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109694",
          "name": "PostService.java",
          "path": "src/main/java/org/com/stocknote/domain/post/service/PostService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109695",
          "name": "KeywordDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/KeywordDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109696",
          "name": "PortfolioDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/PortfolioDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109697",
          "name": "MemberDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/MemberDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109698",
          "name": "PortfolioStockDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/PortfolioStockDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "174810324109699",
          "name": "PostDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/PostDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096100",
          "name": "StockDoc.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/document/StockDoc.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096101",
          "name": "SearchKeyword.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/dto/request/SearchKeyword.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096102",
          "name": "SearchedStockResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchedStockResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096103",
          "name": "SearchPortfolioResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchPortfolioResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096104",
          "name": "PostCategory.java",
          "path": "src/main/java/org/com/stocknote/domain/post/entity/PostCategory.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096105",
          "name": "KeywordDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/KeywordDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096106",
          "name": "SearchPortfolioStockResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/dto/response/SearchPortfolioStockResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096107",
          "name": "MemberDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/MemberDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096108",
          "name": "PortfolioDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/PortfolioDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096109",
          "name": "PostDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/PostDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096110",
          "name": "PortfolioStockDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/PortfolioStockDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096111",
          "name": "StockDocRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/repository/StockDocRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096112",
          "name": "KeywordDocService.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/service/KeywordDocService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096113",
          "name": "SearchDocService.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/service/SearchDocService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096114",
          "name": "StockDocService.java",
          "path": "src/main/java/org/com/stocknote/domain/searchDoc/service/StockDocService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096115",
          "name": "StockController.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/controller/StockController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096116",
          "name": "StockAddRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/dto/request/StockAddRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096117",
          "name": "Stock.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/entity/Stock.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096118",
          "name": "StockRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/repository/StockRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096119",
          "name": "StockPriceProcessor.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/service/price/StockPriceProcessor.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096120",
          "name": "StockService.java",
          "path": "src/main/java/org/com/stocknote/domain/stock/service/StockService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096121",
          "name": "StockApiController.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/controller/StockApiController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096122",
          "name": "ChartApiResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/ChartApiResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096123",
          "name": "ChartResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/ChartResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096124",
          "name": "CurrentIndexResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/CurrentIndexResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096125",
          "name": "SectorResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/SectorResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096126",
          "name": "StockDailyResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockDailyResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096127",
          "name": "StockInfoResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockInfoResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096128",
          "name": "StockPriceResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockPriceResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096129",
          "name": "StockResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096130",
          "name": "StockTimeResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/StockTimeResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096131",
          "name": "VolumeResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/response/VolumeResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096132",
          "name": "StockDetailDto.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/StockDetailDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096133",
          "name": "StockIndexDto.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/dto/StockIndexDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096134",
          "name": "StockApiService.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/service/StockApiService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096135",
          "name": "StockTokenController.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/stockToken/controller/StockTokenController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096136",
          "name": "StockTokenRequestDto.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/stockToken/dto/StockTokenRequestDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096137",
          "name": "PeriodType.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/type/PeriodType.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096138",
          "name": "StockTokenResponseDto.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/stockToken/dto/StockTokenResponseDto.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096139",
          "name": "StockTokenService.java",
          "path": "src/main/java/org/com/stocknote/domain/stockApi/stockToken/service/StockTokenService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096140",
          "name": "StockVoteController.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/controller/StockVoteController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096141",
          "name": "StockVoteListResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteListResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096142",
          "name": "StockVoteRequest.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteRequest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096143",
          "name": "StockVoteResponse.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/dto/StockVoteResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096144",
          "name": "StockVote.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/entity/StockVote.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096145",
          "name": "VoteStatistics.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/entity/VoteStatistics.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096146",
          "name": "StockVoteRepository.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/repository/StockVoteRepository.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096147",
          "name": "StockVoteService.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/service/StockVoteService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096148",
          "name": "VoteType.java",
          "path": "src/main/java/org/com/stocknote/domain/stockVote/type/VoteType.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096149",
          "name": "EmailAspect.java",
          "path": "src/main/java/org/com/stocknote/global/aop/EmailAspect.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096150",
          "name": "BaseEntity.java",
          "path": "src/main/java/org/com/stocknote/global/base/BaseEntity.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096151",
          "name": "InjectEmail.java",
          "path": "src/main/java/org/com/stocknote/global/aop/InjectEmail.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096152",
          "name": "CacheService.java",
          "path": "src/main/java/org/com/stocknote/global/cache/service/CacheService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096153",
          "name": "ErrorResponse.java",
          "path": "src/main/java/org/com/stocknote/global/error/ErrorResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096154",
          "name": "ErrorCode.java",
          "path": "src/main/java/org/com/stocknote/global/error/ErrorCode.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096155",
          "name": "SseEmitters.java",
          "path": "src/main/java/org/com/stocknote/global/event/SseEmitters.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096156",
          "name": "CustomException.java",
          "path": "src/main/java/org/com/stocknote/global/exception/CustomException.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096157",
          "name": "ExceptionControllerAdvice.java",
          "path": "src/main/java/org/com/stocknote/global/exception/ExceptionControllerAdvice.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096158",
          "name": "DummyDataGenerator.java",
          "path": "src/main/java/org/com/stocknote/global/faker/DummyDataGenerator.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096159",
          "name": "InitService.java",
          "path": "src/main/java/org/com/stocknote/global/faker/InitService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096160",
          "name": "GlobalResponse.java",
          "path": "src/main/java/org/com/stocknote/global/globalDto/GlobalResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096161",
          "name": "GlobalResponseCode.java",
          "path": "src/main/java/org/com/stocknote/global/globalDto/GlobalResponseCode.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096162",
          "name": "LogResetScheduler.java",
          "path": "src/main/java/org/com/stocknote/global/log/LogResetScheduler.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096163",
          "name": "SecurityUtil.java",
          "path": "src/main/java/org/com/stocknote/global/util/SecurityUtil.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096164",
          "name": "AuthController.java",
          "path": "src/main/java/org/com/stocknote/oauth/controller/AuthController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096165",
          "name": "PrincipalDetails.java",
          "path": "src/main/java/org/com/stocknote/oauth/entity/PrincipalDetails.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096166",
          "name": "OAuth2UserInfo.java",
          "path": "src/main/java/org/com/stocknote/oauth/entity/OAuth2UserInfo.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096167",
          "name": "CustomOAuth2UserService.java",
          "path": "src/main/java/org/com/stocknote/oauth/service/CustomOAuth2UserService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096168",
          "name": "OAuth2TokenService.java",
          "path": "src/main/java/org/com/stocknote/oauth/service/OAuth2TokenService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096169",
          "name": "TokenController.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/controller/TokenController.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096170",
          "name": "Token.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/entity/Token.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096171",
          "name": "TokenService.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/service/TokenService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096172",
          "name": "TokenAuthenticationFilter.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/TokenAuthenticationFilter.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096173",
          "name": "TokenExceptionFilter.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/TokenExceptionFilter.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096174",
          "name": "TokenProvider.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/TokenProvider.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096175",
          "name": "TokenResponse.java",
          "path": "src/main/java/org/com/stocknote/oauth/token/TokenResponse.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096176",
          "name": "CustomAccessDeniedHandler.java",
          "path": "src/main/java/org/com/stocknote/security/CustomAccessDeniedHandler.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096177",
          "name": "CustomAuthenticationEntryPoint.java",
          "path": "src/main/java/org/com/stocknote/security/CustomAuthenticationEntryPoint.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096178",
          "name": "OAuth2SuccessHandler.java",
          "path": "src/main/java/org/com/stocknote/security/OAuth2SuccessHandler.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096179",
          "name": "SaveRequestFilter.java",
          "path": "src/main/java/org/com/stocknote/security/SaveRequestFilter.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096180",
          "name": "SecurityConfig.java",
          "path": "src/main/java/org/com/stocknote/security/SecurityConfig.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096181",
          "name": "StockNoteApplication.java",
          "path": "src/main/java/org/com/stocknote/StockNoteApplication.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096182",
          "name": "SecurityUtils.java",
          "path": "src/main/java/org/com/stocknote/security/SecurityUtils.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096183",
          "name": "WebSocketService.java",
          "path": "src/main/java/org/com/stocknote/websocket/service/WebSocketService.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096184",
          "name": "application-dev.yml",
          "path": "src/main/resources/application-dev.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096185",
          "name": "application-prod.yml",
          "path": "src/main/resources/application-prod.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096186",
          "name": "application-secret.yml.default",
          "path": "src/main/resources/application-secret.yml.default",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096187",
          "name": "application-test.yml",
          "path": "src/main/resources/application-test.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096188",
          "name": "application.yml",
          "path": "src/main/resources/application.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096189",
          "name": "keyword.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/keyword.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096190",
          "name": "member.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/member.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096191",
          "name": "pfstock.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/pfstock.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096192",
          "name": "portfolio.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/portfolio.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096193",
          "name": "post.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/post.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096194",
          "name": "stock.conf",
          "path": "src/main/resources/elasticsearch/logstash/config/stock.conf",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096195",
          "name": "docker-compose.yml.default",
          "path": "src/main/resources/elasticsearch/logstash/docker-compose.yml.default",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096196",
          "name": "mysql.env",
          "path": "src/main/resources/elasticsearch/logstash/mysql.env",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096197",
          "name": "logstash.yml",
          "path": "src/main/resources/elasticsearch/logstash/pipeline/logstash.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096198",
          "name": "piplines.yml",
          "path": "src/main/resources/elasticsearch/logstash/pipeline/piplines.yml",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096199",
          "name": "mappings.json",
          "path": "src/main/resources/elasticsearch/mappings.json",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096200",
          "name": "settings.json",
          "path": "src/main/resources/elasticsearch/settings.json",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096201",
          "name": "stock_download.py",
          "path": "src/main/resources/scripts/stock_download.py",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096202",
          "name": "pfListTest.java",
          "path": "src/test/java/org/com/stocknote/portfolio/pfListTest.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      },
      {
          "id": "1748103241096203",
          "name": "StockNoteApplicationTests.java",
          "path": "src/test/java/org/com/stocknote/StockNoteApplicationTests.java",
          "repository": "BackEndSchoolPlus3th/StockNote_BE",
          "savedPath": "./repository/data/56_17_BackEndSchoolPlus3th-StockNote_BE"
      }
  ],
  "createdAt": "2025-05-25T01:15:41.842",
  "updatedAt": "2025-05-25T01:15:41.842"
};

export default mockData;