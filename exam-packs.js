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
      { label: "ETS 연습 자료", url: "https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/preparing-students.html" },
      { label: "ETS 시험 명세(2026)", url: "https://www.ets.org/content/dam/ets-india/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf" },
      { label: "ETS 공식 연습시험 1", url: "https://www.ets.org/content/dam/ets-org/pdfs/toefl/toefl-ibt-full-length-practice-test-1.pdf" }
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
    // 과제 유형별 풀이 전략과 자체 연습 문제 (출처: "TOEFL 2026 분석과 문제풀이 한국어판", 2026-09-14 확인본)
    // limit는 시험 조건, practice는 ETS 기출이 아닌 자체 예제다.
    guides: {
      complete_words: {
        strategy: [
          "빈칸 주변이 아니라 온전한 도입부부터 읽어 주제와 상황을 잡는다",
          "이미 주어진 글자와 빈칸 수로 후보를 좁힌다 (주어진 글자는 바꾸지 않는다)",
          "필요한 품사를 정하고 수 일치·시제·단복수를 확인한다",
          "완성한 문장과 문단 전체를 다시 읽어 문맥과 맞는지 본다"
        ],
        practice: {
          prompt: "밑줄 하나 = 빠진 글자 하나\nThe library lends tablets to students. Borro_ _ _ _ must ret_ _ _ them bef_ _ _ Friday. Stu_ _ _ _ _ who ne_ _ extra ti_ _ should con_ _ _ _ the librarian.",
          answer: "Borrowers / return / before / Students / need / time / contact",
          explain: "must 뒤에는 동사원형 return. Students가 복수라 need에 -s를 붙이지 않는다. 뜻만 보고 고르면 must returning처럼 문법이 틀리기 쉽다."
        }
      },
      read_daily_life: {
        strategy: [
          "내가 받은 글이라고 생각하고 정보 지도를 만든다: 누가 / 누구에게 / 왜 / 무엇이 바뀌었나 / 언제까지 무엇을",
          "글의 목적 문제와 세부 문제를 구분한다. 목적은 글 전체를 덮는 답을 고른다",
          "only · unless · before 같은 조건의 범위와 it · this change가 가리키는 대상을 확인한다",
          "처음 계획과 최종 결정이 다르면 최종 결정을 따른다"
        ],
        practice: {
          prompt: "The photography workshop has moved from Room 204 to Room 310. It will still begin at 3 p.m. on Friday. Participants must bring a charged phone; cameras will be supplied. Please confirm attendance by Thursday noon.\n\nQ. 참석 여부를 알려야 하는 기한은? / 바뀌지 않은 것은?",
          answer: "기한: 목요일 정오 / 바뀌지 않은 것: 시작 시각 (금요일 오후 3시)",
          explain: "행사 시작 시각(금 3시)과 확인 기한(목 정오)을 구별한다. still은 '그대로 유지'를 표시한다."
        }
      },
      read_academic: {
        strategy: [
          "어휘 문제는 그 단어가 있는 문장 안에서 뜻을 정한다 (예: The proposal was sound → 타당한)",
          "NOT · EXCEPT 문제의 정답은 '언급 안 됨'뿐 아니라 '지문과 모순'일 수도 있다",
          "추론은 근거에서 가장 작게 넓힌다. 목적 질문은 그 예시가 주장 안에서 하는 역할을 묻는다",
          "오답 코드로 지운다: U 근거 없는 추가 · C 모순 · R 관계 뒤집기 · S 범위 오류 · D 질문과 무관한 세부"
        ],
        practice: {
          prompt: "The outdoor experiment was postponed because the instruments could not operate reliably in heavy rain.\n\nQ. 이 문장에서 할 수 있는 추론은? (A) 날씨가 측정의 신뢰성에 영향을 주었다 (B) 연구자들이 프로젝트 전체를 취소했다",
          answer: "(A)",
          explain: "(B)는 '연기'를 '취소'로, 실험 하나를 프로젝트 전체로 넓힌 범위 오류(S)·근거 없는 추가(U)다."
        }
      },
      choose_response: {
        strategy: [
          "대개 필기 없이 듣고, 단어 반복보다 말하는 사람의 의도를 먼저 잡는다",
          "바로 답하기뿐 아니라 도움 제안, 정중한 거절, 모르는 이유 설명도 자연스러운 응답이 될 수 있다",
          "질문 속 단어를 그대로 반복하는 보기는 함정인 경우가 많다"
        ],
        practice: {
          prompt: "Could you send me the revised schedule?\n(A) It was a very busy afternoon. (B) Sure, I will email it after lunch. (C) The lunch menu changes daily. (D) I have never met the scheduler.",
          answer: "(B)",
          explain: "요청을 수락하고 다음 행동을 말한다. (C)는 lunch라는 단어만 겹치고 주제가 다르다."
        }
      },
      conversation: {
        strategy: [
          "문제 / 제약 / 결정으로 짧게 필기한다",
          "화자별로 처음 의도, 장애물, 바뀐 계획을 따라간다",
          "마지막 발화 전에 결론을 정하지 않는다. 언급됐지만 거절된 계획이 오답으로 나온다"
        ],
        practice: {
          prompt: "A: Can we meet in the library at four?\nB: I have a lab until four thirty. Could we use the café at five?\nA: It gets noisy then. Let's book a library room for five.\nB: Good idea. I'll reserve one now.\n\nQ. B가 다음에 할 일은?",
          answer: "도서관 방을 예약한다",
          explain: "카페는 거절된 계획, 4시는 처음 계획, 'A가 예약'은 행동의 주체를 바꾼 오답이다."
        }
      },
      announcement: {
        strategy: [
          "변경 / 이유 / 해야 할 행동 / 시간·장소로 필기한다",
          "숫자만 적지 말고 역할을 붙인다 (예: 링크 6시 / 시작 7시)",
          "모두에게 해당하는 지시와 특정 집단에만 해당하는 지시를 구분한다"
        ],
        practice: {
          prompt: "The science club meeting will be held online tonight because the laboratory is being cleaned. Members will receive a meeting link by email at six. The session begins at seven. New members should join ten minutes early for a brief introduction.\n\nQ. 10분 일찍 들어와야 하는 사람은?",
          answer: "신입 회원",
          explain: "'6 / 7 / 10'만 적으면 헷갈린다. '링크 6시 / 시작 7시 / 신입 10분 전'처럼 역할을 붙여 적는다."
        }
      },
      academic_talk: {
        strategy: [
          "핵심 생각 → 설명 → 예시 구조로 필기하되, 비교·과정 같은 다른 구조도 열어 둔다",
          "but · however(대조), as a result(결과), for example(예시) 앞뒤를 비교한다",
          "설명 끝에 붙는 제한 조건(This does not mean…)을 놓치지 않는다",
          "듣기는 앞 문제로 돌아갈 수 없다. 현재 문제의 답을 정하고 넘어간다"
        ],
        practice: {
          prompt: "Rereading makes material feel familiar, but familiarity alone does not show whether a student can recall it. Retrieval practice asks students to produce an answer without looking. … This does not mean rereading is useless; it can help clarify material after an unsuccessful attempt.\n\nQ. '다시 읽기는 쓸모없다'가 오답인 이유는?",
          answer: "마지막 제한 조건: 기억해 내기 어려웠던 뒤에는 다시 읽기도 도움이 된다",
          explain: "제한 조건을 무시하면 범위 오류가 된다. '만점을 보장한다' 같은 보기는 언급되지 않은 결과를 덧붙인 것이다."
        }
      },
      build_sentence: {
        strategy: [
          "평서문 / 직접 의문문 / 간접 의문문 중 무엇인지 먼저 정한다",
          "주어와 주요 동사를 찾고, 주절을 만든 뒤 목적어·수식어를 붙인다",
          "간접 의문문(Could you tell me…) 안은 주어 → 동사 순서다",
          "관계절(who · which · that)이 꾸미는 명사를 확인한다"
        ],
        practice: {
          prompt: "Could you tell me ___ ?\n덩어리: the workshop / when / begins",
          answer: "Could you tell me when the workshop begins?",
          explain: "tell me 뒤 간접 의문문은 주어-동사 순서라 'when does the workshop begin'을 그대로 붙일 수 없다."
        }
      },
      write_email: {
        limit: "시험: 7분",
        strategy: [
          "0:00–1:00 받는 사람 · 목적 · 요구사항을 모두 표시한다",
          "1:00–5:45 요구사항을 하나도 빠짐없이 완전한 문장으로 쓴다",
          "5:45–7:00 누락 · 말투 · 이름 · 시간 · 문법을 점검한다",
          "추상적인 도입을 길게 쓰지 않는다. 단어 수를 억지로 채우지 않는다"
        ],
        practice: {
          prompt: "학습실을 예약했는데 확인서에 시간이 잘못 적혀 있다. 도서관 담당자에게 이메일을 써라: ① 예약 오류 설명 ② 원래 시간이 필요한 이유 ③ 시간 정정 또는 대체 공간 요청",
          answer: "Dear Library Coordinator, I am writing about a problem with my study room reservation. I requested Room 3 for Thursday from 4 to 5 p.m., but the confirmation lists 2 to 3 p.m. instead. Our group needs the later time because two members have classes until 3:30. Could you please change the booking to 4 p.m.? If Room 3 is unavailable, another room with a screen would also work. Thank you for your help. Best regards, Alex",
          explain: "잘못된 시간과 요청한 시간을 모두 쓰고, 이유를 대고, 대안이 있는 요청으로 끝낸다. 요구사항 세 개가 모두 들어 있다."
        }
      },
      academic_discussion: {
        limit: "시험: 10분 · 100단어 이상 권장 (100단어가 고득점을 보장하지는 않음)",
        strategy: [
          "연습 배분: 읽기·계획 2분 → 작성 6분 → 수정 2분",
          "도입 없이 내 답(입장)부터 쓴다",
          "이유 두 개를 나열하기보다 이유 하나를 설명과 예시로 충분히 전개한다",
          "다른 학생 의견에 반응하되, 요약하는 데 글 대부분을 쓰지 않는다"
        ],
        practice: {
          prompt: "Professor: Should universities record all lectures for students to review?\nStudent A: Recordings help students revisit difficult ideas.\nStudent B: Students may stop attending if recordings are always available.",
          answer: "I support recording lectures, provided that universities also give students a reason to participate in class. Student A is right that recordings make difficult material easier to review. A student who is still learning academic English may miss the explanation of a technical term, and replaying that section can help them prepare a better question. Student B raises a reasonable concern about attendance. However, teachers could reserve class time for discussion and feedback that recordings cannot replace.",
          explain: "첫 문장에서 조건이 붙은 입장을 밝히고, 하나의 작동 원리(용어 복습 → 더 좋은 질문)를 충분히 설명한 뒤 반대 의견에 대응한다."
        }
      },
      listen_repeat: {
        limit: "시험: 7문항 · 준비 시간 없이 한 번",
        strategy: [
          "들은 단어를 그대로 말한다. 동의어로 바꾸거나 요약하지 않는다",
          "의미 덩어리로 기억하되 관사 · 동사 어미 · 전치사 같은 작은 단어를 빼지 않는다",
          "한 단어를 놓쳐도 처음부터 다시 시작하지 말고 이어서 말한다",
          "녹음을 듣고 빠진 단어 / 바뀐 단어 / 어순 / 어미를 확인한다"
        ],
        practice: {
          prompt: "누군가 읽어 주거나 음성으로 듣고, 문장을 보지 않고 따라 말한다.\n1. Please return your visitor pass before leaving.\n2. Students who need additional equipment should contact the laboratory assistant.\n3. Although the main entrance is closed, visitors can still enter through the courtyard.",
          answer: "덩어리 예: Students who need / additional equipment / should contact / the laboratory assistant",
          explain: "목표는 원어민 억양이 아니라 문장을 보존하면서 알아듣기 쉽게 말하는 것이다."
        }
      },
      interview: {
        limit: "시험: 4문항 · 준비 시간 없음 · 연습은 30–45초 답변부터",
        strategy: [
          "직접 답 → 충분한 이유 하나 → 구체적 예시 → 시간이 남으면 질문과 다시 연결",
          "모든 답을 '두 가지 이유가 있다'로 시작하지 않는다",
          "어려운 단어보다 정확히 쓸 수 있는 표현을 고른다",
          "외운 이야기를 모든 질문에 억지로 끼워 맞추지 않는다"
        ],
        practice: {
          prompt: "Do you prefer studying alone or with other people? Why?",
          answer: "I usually prefer studying alone when I am learning something new. I need time to identify which parts I actually understand. For example, when I prepare for a biology lesson, I close my notes and explain the process aloud. That helps me find gaps. After that, I meet a friend to compare explanations.",
          explain: "선호를 바로 밝히고, 실제 공부 과정으로 이유를 전개한 뒤 보완 관계(혼자 → 친구)로 마무리한다."
        }
      }
    },
    // AI 피드백 요청에 넣는 영역별 기준 (명세서 8장)
    feedback: {
      writing: "과제 요구를 충족했는지 → 문장이 완결됐는지 → 어순 → 기본 문법 → 명료성 → 목적·독자에 맞는지 순서로 본다.",
      speaking: "학생이 말한 내용을 받아 적은 것이다. 내용 전달, 문장 완결성, 말을 끊김 없이 이어 갔는지, 따라 말하기 정확도를 구분해서 본다. 발음은 글로 판단할 수 없으니 평가하지 않는다. 원어민 억양을 목표로 삼지 않는다.",
      reading: "학생이 적은 오답 근거다. 왜 틀렸는지 분석이 맞는지 확인하고, 오답 원인을 어휘 추론·세부 정보 누락·연결 관계·시간 관리 중에서 골라 주고, 다음에 쓸 풀이 전략을 한 가지 제안한다. 영어 문장이 있으면 문법도 본다.",
      listening: "학생이 적은 오답 근거다. 왜 틀렸는지 분석이 맞는지 확인하고, 오답 원인을 화자 의도·세부 정보 누락·요지·시간 관리 중에서 골라 주고, 다음에 쓸 듣기 전략을 한 가지 제안한다. 영어 문장이 있으면 문법도 본다.",
      general: "성경 본문을 읽고 쓴 중심 내용과 영어 요약이다. 중심 내용을 잘 잡았는지와 영어 문장의 문법·자연스러움만 본다. 신앙적 해석은 평가하지 않는다.",
      review: "주간 점검 기록이다. 영어 문장이 있으면 문법을 보고, 정리한 약점이 다음 주 계획으로 이어지도록 한 가지 조언한다."
    },
    error_tags: [
      "어순", "주어-동사 일치", "시제", "관사·전치사", "철자", "요구사항 누락", "내용 누락",
      "근거 없는 추가(U)", "지문과 모순(C)", "관계 뒤집기(R)", "범위 오류(S)", "질문과 무관한 세부(D)", "어휘 추론",
      "소리를 놓침", "화자 의도", "화자 혼동", "세부 정보 누락", "시간 관리", "발음 이해도"
    ]
  }
};

if (typeof module !== "undefined") module.exports = { EXAM_PACKS };
