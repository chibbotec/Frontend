const mockData = {
  "id": "6831c37bb8489b6aca2eaf3a",
  "spaceId": 56,
  "author": {
      "id": 17,
      "nickname": "kknaks"
  },
  "createdAt": "2025-05-24T22:02:51.631",
  "updatedAt": "2025-05-24T22:02:51.631",
  "title": "신입지원 이력서 Sample",
  "name": "김코딩",
  "email": "test@test.com",
  "phone": "010-1111-2222",
  "careerType": "경력",
  "position": "Backend Developer",
  "techStack": [
      "Java",
      "Java Collections Framework",
      "Java Time API",
      "객체지향 프로그래밍",
      "콘솔 기반 사용자 인터페이스",
      "커스텀 인터페이스 및 추상 클래스",
      "Java Standard Library",
      "LocalDate / Calendar API",
      "Scanner (입력 처리)",
      "Custom ArrayList 구현",
      "ANSI Escape Codes (터미널 색상 및 스타일)",
      "객체지향 프로그래밍(OOP)",
      "커맨드 패턴",
      "ArrayList",
      "배열"
  ],
  "techSummary": "Java 언어를 기반으로 가계부 애플리케이션의 핵심 기능을 설계 및 구현하였으며, 사용자 금융 데이터의 저장/조회 기능을 성공적으로 제공하였습니다.\nJava Collections Framework와 커스텀 ArrayList 구현을 통해 데이터 목록 관리 성능을 향상시켰으며, 확장성을 확보하였습니다.\n객체지향 프로그래밍(OOP) 원칙을 적용하여 Finance, Wallet 등 도메인 객체를 설계하고, 유지보수성과 재사용성을 높였습니다.\nJava Time API를 활용해 금융 데이터의 시간 관련 기능을 효과적으로 처리하였습니다.\n커맨드 패턴을 적용하여 수입/지출/설정 등 메뉴별 기능을 분리함으로써 코드의 유지보수 용이성을 크게 향상시켰습니다.\n콘솔 기반 인터페이스를 직접 설계하여 사용자 친화적인 메뉴 및 입력 처리 기능을 개발하였고, 자동 데이터 생성 메서드를 통해 테스트 및 초기 데이터 세팅을 자동화하여 개발 효율성을 높였습니다.\n커스텀 인터페이스와 추상 클래스를 활용해 코드의 확장성과 유연성을 강화하였습니다.",
  "links": [
      {
          "type": "github",
          "url": "https://github.com/test"
      },
      {
          "type": "notion",
          "url": "https://notion.test.com"
      },
      {
          "type": "blog",
          "url": "https://blog.test.com"
      }
  ],
  "careers": [
    {
        "company": "회사명",
        "position": "책임",
        "startDate": "2022-01-01",
        "endDate": "2023-01-01",
        "isCurrent": true, // 재직중이면 true
        "description": "담당 업무 및 역할",
        "achievement": "주요 성과"
    },
    {
        "company": "회사명",
        "position": "대리",
        "startDate": "2022-01-01",
        "endDate": "2023-01-01",
        "isCurrent": false, // 재직중이면 true
        "description": "담당 업무 및 역할",
        "achievement": "주요 성과"
    }
  ],
  "projects": [
      {
          "name": "여기있개",
          "description": "이 가계부 프로그램은 사용자들이 수입과 지출을 효율적으로 관리할 수 있도록 설계된 Java 기반 데스크탑 애플리케이션입니다. 계좌별 자산 현황과 거래 내역을 기록하고, 다양한 통계와 보고서를 제공하여 재무 상태를 쉽게 파악할 수 있습니다. 사용자 친화적인 메뉴 구조와 데이터 자동 생성 기능을 통해 사용 편의성을 높였으며, 객체지향 설계와 컬렉션 활용으로 유지보수성과 확장성을 확보하였습니다.",
          "techStack": [
              "Java",
              "Java Collections Framework",
              "Java Time API",
              "객체지향 프로그래밍",
              "콘솔 기반 사용자 인터페이스",
              "컬렉션(ArrayList",
              "배열)",
              "커스텀 인터페이스 및 추상 클래스"
          ],
          "role": "Java를 사용해서 가계부 애플리케이션 핵심 기능 구현하여 사용자 금융 데이터 관리 기능 제공\n객체지향 프로그래밍을 활용해서 Finance, Wallet 등 도메인 객체 설계 및 데이터 저장/조회 기능 구현\n커맨드 패턴을 적용해서 수입/지출/설정 등 메뉴별 기능 분리 및 유지보수 용이성 향상\n커스텀 ArrayList 구현으로 데이터 목록 관리 성능 개선 및 확장성 확보\n콘솔 인터페이스를 설계하여 사용자 친화적 메뉴 및 입력 처리 기능 개발\n자동 데이터 생성 메서드로 테스트 및 초기 데이터 세팅 자동화하여 개발 효율성 향상",
          "startDate": "2025-05-01",
          "endDate": "2025-05-03",
          "memberCount": 1,
          "memberRoles": "PO",
          "githubLink": "test.com",
          "deployLink": "test.com"
      },
      {
          "name": "StockNote",
          "description": "이 프로젝트는 학생들이 공부 습관을 체계적으로 관리하고 동기 부여를 받을 수 있도록 설계된 터미널 기반 애플리케이션입니다. 주요 문제는 학생들이 일상적인 공부 계획을 잊거나 지속하기 어려운 점이며, 이를 해결하기 위해 할 일 목록, 성과 조회, 아이템 구매 및 활용 기능을 통합하였습니다. 사용자들은 매일의 할 일 완료 여부를 기록하고, 주간 또는 일별 성과를 시각적으로 확인할 수 있으며, 아이템을 구매하거나 사용할 수 있어 학습 동기를 유지할 수 있습니다. 시스템은 Java 언어로 개발되어 있으며, 사용자 친화적인 텍스트 인터페이스를 제공하여 복잡한 설정 없이도 쉽게 사용할 수 있도록 구현하였습니다. 또한, 데이터는 내부 ArrayList와 LocalDate를 활용하여 관리하며, 시스템 아키텍처는 모듈화되어 확장성과 유지보수성을 고려하였습니다.",
          "techStack": [
              "Java",
              "Java Standard Library",
              "LocalDate / Calendar API",
              "Scanner (입력 처리)",
              "Custom ArrayList 구현",
              "ANSI Escape Codes (터미널 색상 및 스타일)"
          ],
          "role": "Java 기반 객체지향 프로그래밍을 사용해서 ToDoList 관리 기능 구현하여 사용자 일정 및 진행률 시각화 지원\n컬렉션 프레임워크를 활용해서 ArrayList 커스터마이징 구현하여 동적 데이터 저장 및 조회 성능 향상\n날짜 및 시간 API를 사용해서 주간 및 일별 일정 조회 기능 구현하여 사용자 일정 조회 편의성 제공\n콘솔 UI 출력 포맷팅을 위해 ANSI 이스케이프 시퀀스와 포맷 문자열 활용하여 가독성 높은 인터페이스 설계\n아이템 및 골드 관리 로직을 구현해서 게임 내 자원 시스템 설계 및 사용자 인센티브 제공\n커맨드 패턴을 적용해서 다양한 사용자 명령 처리 구조 설계하여 유지보수성과 확장성 확보\n입력 검증 및 예외처리 로직을 구현해서 사용자 입력 안정성 강화 및 프로그램 안정성 향상\n날짜 계산 및 주간 조회 기능을 위해 Calendar API 활용하여 정확한 일정 범위 계산 구현",
          "startDate": "2025-05-07",
          "endDate": "2025-05-08",
          "memberCount": 1,
          "memberRole": null,
          "githubLink": "",
          "deployLink": ""
      }
  ],
  "educations": [
      {
          "school": "멋쟁이사자처럼",
          "major": "백엔드 스쿨 플러스",
          "startDate": "2025-05-01",
          "endDate": "2025-05-02",
          "degree": "수료",
          "note": null
      }
  ],
  "certificates": [
      {
          "type": "자격증",
          "name": "정보처리기사",
          "date": "2025-05-01",
          "organization": "한국산업인력공단"
      }
  ],
  "coverLetters": [
      {
          "title": "멋쟁이사자처럼",
          "content": "백엔드 스쿨 플러스"
      }
  ]
};

export default mockData;