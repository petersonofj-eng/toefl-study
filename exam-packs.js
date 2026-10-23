// 시험 콘텐츠 팩. 시험 형식이 바뀌면 덮어쓰지 말고 새 id/version으로 추가한다.
const EXAM_PACKS = {
  toefl_ibt_2026: {
    id: "toefl_ibt_2026",
    name: "TOEFL iBT",
    version: "2026-01",
    valid_from: "2026-01-21",
    last_verified: "2026-10-23",
    score_scale: { min: 1, max: 6, increment: 0.5 },
    sources: [
      { label: "ETS 시험 구성", url: "https://www.ets.org/toefl/test-takers/ibt/about/content.html" },
      { label: "ETS 점수 안내", url: "https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html" },
      { label: "ETS 연습 자료", url: "https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/preparing-students.html" }
    ],
    phases: [
      { key: "foundation", label: "기반", goal: "기초 문장 구성과 과제 유형 이해", outputs: "주어·동사 표시, 짧은 완전문, 이메일 초안, 따라 말하기 녹음" },
      { key: "expand", label: "응답 확장", goal: "짧은 응답을 논리적으로 확장", outputs: "이메일·토론 답안, 답-이유-예시 인터뷰, 오류 기록" },
      { key: "practice", label: "실전 적응", goal: "시간 제한과 과제 전환에 적응", outputs: "시간 제한 과제, 수정본, 실전형 점검" }
    ],
    sections: [
      {
        id: "reading", name: "Reading", ko: "읽기",
        tasks: [
          { id: "complete_words", name: "Complete the Words" },
          { id: "read_daily_life", name: "Read in Daily Life" },
          { id: "read_academic", name: "Read an Academic Passage" }
        ],
        leads: [
          "시간 제한 없이 정답 근거 찾기에 집중한다",
          "한 세트를 마칠 때마다 걸린 시간을 기록한다",
          "실제 시험 시간에 맞춰 짧은 세트를 연속으로 푼다"
        ],
        rotation: [
          { tasks: ["complete_words"], title: "Complete the Words 연습", steps: ["빈칸 단어를 문맥으로 완성한다 (10문항)", "틀린 단어의 품사·철자를 확인한다", "헷갈린 단어 5개를 예문과 함께 적는다"], output: "틀린 단어와 틀린 이유" },
          { tasks: ["read_daily_life"], title: "Read in Daily Life 연습", steps: ["공지·이메일·광고 같은 일상 글 1세트를 푼다", "정답 근거 문장에 밑줄을 긋는다", "오답은 오류 기록에 남긴다"], output: "오답 근거" },
          { tasks: ["read_academic"], title: "Read an Academic Passage 연습", steps: ["학술 지문 1세트를 푼다", "문단마다 중심 내용을 한 줄로 적는다", "오답은 오류 기록에 남긴다"], output: "문단 요약과 오답 근거" }
        ]
      },
      {
        id: "listening", name: "Listening", ko: "듣기",
        tasks: [
          { id: "choose_response", name: "Listen and Choose a Response" },
          { id: "conversation", name: "Listen to a Conversation" },
          { id: "announcement", name: "Listen to an Announcement" },
          { id: "academic_talk", name: "Listen to an Academic Talk" }
        ],
        leads: [
          "들으면서 핵심 단어만 메모하는 연습을 한다",
          "한 세트를 마칠 때마다 걸린 시간을 기록한다",
          "실제 시험 순서대로 유형을 바꿔 가며 연속으로 푼다"
        ],
        rotation: [
          { tasks: ["choose_response"], title: "Listen and Choose a Response 연습", steps: ["짧은 말을 듣고 알맞은 응답을 고른다 (10문항)", "틀린 문항은 다시 듣고 화자의 의도를 적는다"], output: "놓친 화자 의도" },
          { tasks: ["conversation"], title: "Listen to a Conversation 연습", steps: ["대화 1세트를 푼다", "대화의 목적을 한 문장으로 적는다", "오답은 오류 기록에 남긴다"], output: "대화 목적과 오답 근거" },
          { tasks: ["announcement"], title: "Listen to an Announcement 연습", steps: ["안내 방송 1세트를 푼다", "날짜·장소·요청 사항을 메모와 비교한다", "오답은 오류 기록에 남긴다"], output: "놓친 세부 정보" },
          { tasks: ["academic_talk"], title: "Listen to an Academic Talk 연습", steps: ["강의 1세트를 푼다", "강의 요지를 한 문장으로 적는다", "오답은 오류 기록에 남긴다"], output: "강의 요지와 오답 근거" }
        ]
      },
      {
        id: "writing", name: "Writing", ko: "쓰기",
        tasks: [
          { id: "build_sentence", name: "Build a Sentence" },
          { id: "write_email", name: "Write an Email" },
          { id: "academic_discussion", name: "Write for an Academic Discussion" }
        ],
        leads: [
          "먼저 Build a Sentence 5문항으로 어순과 주어-동사를 연습한다",
          "답을 '주장 → 이유 → 예시' 구조로 확장한다",
          "실제 제한 시간에 맞춰 쓰고, 끝난 뒤 우선순위 오류 1–3개만 고친다"
        ],
        rotation: [
          { tasks: ["build_sentence", "write_email"], title: "Write an Email", steps: ["상황·받는 사람·요청 사항을 먼저 표시한다", "인사 → 목적 → 요청 사항 → 마무리 순서로 쓴다", "문장마다 주어와 동사가 있는지 확인한다"], output: "이메일 답안" },
          { tasks: ["build_sentence", "academic_discussion"], title: "Write for an Academic Discussion", steps: ["교수 질문과 두 학생 의견을 읽고 내 입장을 한 문장으로 정한다", "이유 1개와 예시 1개를 덧붙인다", "다른 학생 의견과 무엇이 다른지 한 문장 쓴다"], output: "토론 답안" }
        ]
      },
      {
        id: "speaking", name: "Speaking", ko: "말하기",
        tasks: [
          { id: "listen_repeat", name: "Listen and Repeat" },
          { id: "interview", name: "Take an Interview" }
        ],
        leads: [
          "짧은 문장을 정확히 따라 말하고 녹음한다",
          "인터뷰 질문에 '직접 답 → 이유 → 짧은 예시'로 답한다",
          "실제 응답 시간에 맞춰 녹음하고 다시 들어 본다"
        ],
        rotation: [
          { tasks: ["listen_repeat", "interview"], title: "Listen and Repeat + Take an Interview", steps: ["문장 7개를 듣고 따라 말한다", "인터뷰 질문 2개에 답하며 녹음한다", "녹음을 듣고 멈춘 곳·틀린 문장을 1–3개 적는다"], output: "녹음을 듣고 고칠 점" }
        ]
      }
    ],
    // 일반 영어 훈련: 시험 대비와 구분해서 표시한다.
    general: {
      title: "시편·잠언 영어 본문 읽기·듣기",
      steps: [
        "본문을 보지 않고 오디오를 한 번 듣는다",
        "중심 내용을 한국어 또는 쉬운 영어로 한 문장 적는다",
        "본문에서 주어와 동사를 표시한다",
        "짧은 문장 3개를 듣고 따라 말한다",
        "본문을 영어 1–2문장으로 바꾸어 쓴다"
      ],
      output: "중심 내용 한 문장과 영어 요약",
      note: "학습자가 가진 번역본을 사용합니다. 본문을 플랫폼에 올릴 때는 KJV·WEB·BSB처럼 퍼블릭 도메인 번역본만 사용합니다.",
      passages: [
        "Psalm 1", "Proverbs 1", "Psalm 19", "Proverbs 3", "Psalm 23", "Proverbs 4",
        "Psalm 34", "Proverbs 10", "Psalm 46", "Proverbs 12", "Psalm 90", "Proverbs 15",
        "Psalm 103", "Proverbs 16", "Psalm 121", "Proverbs 18", "Psalm 139", "Proverbs 25"
      ]
    },
    // 주간 점검일 (단계별)
    checks: [
      { title: "주간 정리: 답안 수정과 오류 분류", steps: ["이번 주 쓴 답안 2개를 다시 고쳐 쓴다", "녹음 1개를 다시 하고 지난 녹음과 비교한다", "이번 주 오답을 오류 기록에 유형별로 정리한다"], output: "수정본과 오류 유형 요약" },
      { title: "시간 제한 미니 세트", steps: ["읽기·듣기 짧은 세트를 시간을 재며 푼다", "이메일 또는 토론 답안 1개를 제한 시간 안에 쓴다", "인터뷰 질문 2개에 답하며 녹음한다", "내용 누락과 문장 오류를 따로 기록한다"], output: "내용 누락 / 문장 오류 목록" },
      { title: "실전형 점검 (ETS 공식 연습 자료)", steps: ["ETS 공식 연습 자료로 네 영역을 실제 순서·시간대로 푼다", "영역별 결과를 기록한다 (추정치이며 공식 점수가 아님)", "가장 많이 틀린 유형 2개를 오류 기록에 남긴다"], output: "영역별 추정 결과와 약한 유형", link: "https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/preparing-students.html" }
    ],
    final: { title: "마무리 복습 (새 내용 없음)", steps: ["오류 기록에서 '연습 중' 항목을 모두 다시 풀어 본다", "가장 잘 쓴 답안과 녹음을 다시 읽고 듣는다", "시험 당일 순서와 시간을 확인한다"], output: "시험 당일 체크리스트" },
    // AI 피드백 요청에 넣는 영역별 기준 (명세서 8장)
    feedback: {
      writing: "과제 요구를 충족했는지 → 문장이 완결됐는지 → 어순 → 기본 문법 → 명료성 → 목적·독자에 맞는지 순서로 본다.",
      speaking: "학생이 말한 내용을 받아 적은 것이다. 내용 전달, 문장 완결성, 말을 끊김 없이 이어 갔는지, 따라 말하기 정확도를 구분해서 본다. 발음은 글로 판단할 수 없으니 평가하지 않는다. 원어민 억양을 목표로 삼지 않는다.",
      reading: "학생이 적은 오답 근거다. 왜 틀렸는지 분석이 맞는지 확인하고, 오답 원인을 어휘 추론·세부 정보 누락·연결 관계·시간 관리 중에서 골라 주고, 다음에 쓸 풀이 전략을 한 가지 제안한다. 영어 문장이 있으면 문법도 본다.",
      listening: "학생이 적은 오답 근거다. 왜 틀렸는지 분석이 맞는지 확인하고, 오답 원인을 화자 의도·세부 정보 누락·요지·시간 관리 중에서 골라 주고, 다음에 쓸 듣기 전략을 한 가지 제안한다. 영어 문장이 있으면 문법도 본다.",
      general: "성경 본문을 읽고 쓴 중심 내용과 영어 요약이다. 중심 내용을 잘 잡았는지와 영어 문장의 문법·자연스러움만 본다. 신앙적 해석은 평가하지 않는다.",
      review: "주간 점검 기록이다. 영어 문장이 있으면 문법을 보고, 정리한 약점이 다음 주 계획으로 이어지도록 한 가지 조언한다."
    },
    error_tags: ["어순", "주어-동사 일치", "시제", "관사·전치사", "어휘 추론", "세부 정보 누락", "화자 의도", "연결 관계", "내용 누락", "시간 관리", "발음 이해도"]
  }
};

if (typeof module !== "undefined") module.exports = { EXAM_PACKS };
