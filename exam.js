// 시험 준비 모듈 (면접 훈련과 같은 stage 렌더 구조)
// 비전트리 병합 시 바꿀 곳: exLearnerId() → unlockedStudent, exLoad()/exSave() → /api/exam/*
// ponytail: 저장은 브라우저 localStorage(기기별). 병합 때 Supabase exam_ 테이블로 옮긴다.

const EX_REVIEW_DAYS = [1, 3, 7];
const EX_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/* ---------- 계획 엔진 (DOM 없음) ---------- */

function exRound5(n) { return Math.floor(n / 5) * 5; }

function exAddDays(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function exToday() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// 점수 격차가 큰 영역에 시간을 더 준다: 가중치 = 1 + max(0, 목표 - 현재)
function exAllocate(pack, dailyMinutes, scores, target) {
  const general = Math.max(10, exRound5(dailyMinutes * 0.125));
  const pool = dailyMinutes - general;
  const weights = {};
  let total = 0;
  for (const s of pack.sections) {
    weights[s.id] = 1 + Math.max(0, target - scores[s.id]);
    total += weights[s.id];
  }
  const sections = {};
  let used = 0;
  for (const s of pack.sections) {
    sections[s.id] = Math.max(5, exRound5(pool * weights[s.id] / total));
    used += sections[s.id];
  }
  const top = pack.sections.reduce((a, b) => (weights[b.id] > weights[a.id] ? b : a)).id;
  sections[top] += pool - used; // 반올림 차이는 최우선 영역에 몰아 합계를 맞춘다
  return { general, sections, weights };
}

function exPriority(gap) {
  if (gap >= 2) return "최우선";
  if (gap >= 1) return "우선";
  return "유지";
}

// 마지막 주는 항상 실전 적응, 나머지 기간은 기반/응답 확장으로 나눈다.
function exPhaseOf(week, weeks) {
  return week === weeks - 1 ? 2 : Math.min(2, Math.floor((week * 3) / weeks));
}

function exBuildPlan(pack, input) {
  const { startDate, weeks, studyDays, dailyMinutes, target, scores } = input;
  const alloc = exAllocate(pack, dailyMinutes, scores, target);
  const days = [];
  for (let i = 0; i < weeks * 7; i++) {
    const week = Math.floor(i / 7);
    const pos = i % 7;
    const type = pos < studyDays - 1 ? "study" : pos === studyDays - 1 ? "check" : "rest";
    days.push({ date: exAddDays(startDate, i), week, phase: exPhaseOf(week, weeks), type, activities: [] });
  }
  // 마지막 날은 새 내용 없이 복습. 그날이 점검일이면 실전형 점검을 하루 앞당긴다.
  const last = days[days.length - 1];
  if (last.type === "check") days[days.length - 2].type = "check";
  last.type = "final";

  let k = 0;
  for (const day of days) {
    const act = (key, section, tpl, minutes, extra = {}) => ({
      id: `${day.date}:${key}`, section, tasks: tpl.tasks || [], title: tpl.title, minutes,
      steps: tpl.steps, output: tpl.output, kind: extra.kind || "exam", ...extra
    });
    if (day.type === "study") {
      const g = pack.general;
      day.activities.push(act("general", "general", g, alloc.general, { kind: "general", ref: g.passages[k % g.passages.length] }));
      for (const s of pack.sections) {
        const tpl = s.rotation[k % s.rotation.length];
        day.activities.push(act(s.id, s.id, { ...tpl, steps: [s.leads[day.phase], ...tpl.steps] }, alloc.sections[s.id]));
      }
      k++;
    } else if (day.type === "check") {
      const tpl = pack.checks[day.phase];
      day.activities.push(act("check", "review", tpl, dailyMinutes, tpl.link ? { link: tpl.link } : {}));
    } else if (day.type === "final") {
      day.activities.push(act("final", "review", pack.final, dailyMinutes));
    }
  }

  return {
    exam_pack_id: pack.id, pack_version: pack.version, generated_at: new Date().toISOString(),
    start_date: startDate, weeks, study_days_per_week: studyDays, daily_minutes: dailyMinutes,
    target, scores, diagnosed_at: input.diagnosedAt || "", diagnostic_tool: input.diagnosticTool || "",
    allocation: alloc, days
  };
}

// 오류 복습: 1일 → 3일 → 7일 간격, 다시 틀리면 처음부터.
function exReviewNext(item, correct, today) {
  if (!correct) return { ...item, stage: 0, due: exAddDays(today, EX_REVIEW_DAYS[0]) };
  const stage = item.stage + 1;
  if (stage >= EX_REVIEW_DAYS.length) return { ...item, stage, due: null, mastered: true };
  return { ...item, stage, due: exAddDays(today, EX_REVIEW_DAYS[stage]) };
}

if (typeof module !== "undefined") {
  module.exports = { exAllocate, exBuildPlan, exPhaseOf, exReviewNext, exAddDays };
}

/* ---------- 화면 ---------- */

let examState = { stage: "overview", day: null, data: {}, errorDraft: null };
const examRoot = typeof document !== "undefined" ? document.getElementById("examRoot") : null;

function exEsc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function exLearnerId() {
  return (typeof examLearner !== "undefined" && examLearner) || "";
}

function exLoad() {
  try { return JSON.parse(localStorage.getItem("exam:v1:" + exLearnerId())) || {}; } catch { return {}; }
}

function exSave() {
  try { localStorage.setItem("exam:v1:" + exLearnerId(), JSON.stringify(examState.data)); } catch { /* 저장 실패 시 화면 상태만 유지 */ }
}

function exPack() {
  return EXAM_PACKS[examState.data.plan?.exam_pack_id] || EXAM_PACKS.toefl_ibt_2026;
}

function exSectionName(pack, id) {
  if (id === "general") return "시편·잠언";
  if (id === "review") return "점검";
  const s = pack.sections.find((x) => x.id === id);
  return s ? `${s.ko} ${s.name}` : id;
}

function exDayProgress(day) {
  const done = examState.data.done || {};
  const n = day.activities.length;
  return n ? day.activities.filter((a) => done[a.id]).length / n : null;
}

function initExam() {
  if (!examRoot) return;
  if (!exLearnerId()) {
    examRoot.innerHTML = `<p class="exam-locked">위의 <strong>학습자</strong> 칸에 이름을 넣고 <strong>열기</strong>를 누르면 시작합니다.</p>`;
    return;
  }
  examState = { stage: "day", day: null, data: exLoad(), errorDraft: null };
  if (!examState.data.plan) examState.stage = "setup";
  renderExam();
}

function renderExam() {
  if (!examRoot) return;
  const s = examState;
  const tabs = s.data.plan
    ? `<nav class="exam-tabs" aria-label="시험 준비 메뉴">${[["day", "오늘"], ["overview", "전체 계획"], ["errors", "오류·복습"], ["setup", "다시 설정"]]
        .map(([k, l]) => `<button type="button" class="exam-tab${s.stage === k ? " is-active" : ""}"${s.stage === k ? ' aria-current="page"' : ""} data-ex-action="go" data-ex-id="${k}">${l}</button>`).join("")}</nav>`
    : "";
  let body = "";
  if (s.stage === "setup") body = renderExamSetup();
  if (s.stage === "overview") body = renderExamOverview();
  if (s.stage === "day") body = renderExamDay();
  if (s.stage === "errors") body = renderExamErrors();
  examRoot.innerHTML = tabs + body;
}

function renderExamSetup() {
  const pack = exPack();
  const p = examState.data.plan;
  const scale = pack.score_scale;
  const opts = (sel) => {
    let html = "";
    for (let v = scale.min; v <= scale.max; v += scale.increment) {
      html += `<option value="${v}"${v === sel ? " selected" : ""}>${v.toFixed(1)}</option>`;
    }
    return html;
  };
  const scores = p?.scores || { reading: 3, listening: 3, writing: 1.5, speaking: 2 };
  return `
    <form class="exam-setup" data-ex-form="setup">
      <h2 class="exam-h is-first">${p ? "계획 다시 설정" : "계획 만들기"}</h2>
      <p class="exam-hint">현재 점수와 공부 가능한 시간을 넣으면 기간에 맞는 계획을 만듭니다. ${p ? "다시 만들어도 체크 기록과 오류 기록은 남습니다." : ""}</p>
      <fieldset>
        <legend>시험과 기간</legend>
        <div class="exam-fields">
        <label class="exam-span">시험<select name="pack">${Object.values(EXAM_PACKS).map((x) => `<option value="${x.id}">${exEsc(x.name)} (${x.version})</option>`).join("")}</select></label>
        <label>시작일<input type="date" name="startDate" required value="${p?.start_date || exToday()}"></label>
        <label>기간(주)<input type="number" name="weeks" min="1" max="12" required value="${p?.weeks || 3}"></label>
        <label>주당 공부일<select name="studyDays">${[5, 6, 7].map((n) => `<option value="${n}"${n === (p?.study_days_per_week || 6) ? " selected" : ""}>${n}일</option>`).join("")}</select></label>
        <label>하루 공부 시간(분)<input type="number" name="dailyMinutes" min="60" max="240" step="5" required value="${p?.daily_minutes || 120}"></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>진단 점수 (${scale.min}–${scale.max})</legend>
        <div class="exam-fields">
        ${pack.sections.map((x) => `<label>${x.ko} ${x.name}<select name="score_${x.id}">${opts(scores[x.id])}</select></label>`).join("")}
        <label>목표 점수<select name="target">${opts(p?.target ?? 4)}</select></label>
        <label>진단일<input type="date" name="diagnosedAt" value="${p?.diagnosed_at || ""}"></label>
        <label class="exam-span">진단 도구<input type="text" name="diagnosticTool" placeholder="예: ETS 모의고사, 교사 평가" value="${exEsc(p?.diagnostic_tool || "")}"></label>
        </div>
      </fieldset>
      <p class="exam-note">시작일이 월요일이면 월–금 학습, 토요일 주간 점검, 일요일 휴식으로 배치됩니다.</p>
      <button type="submit" class="exam-primary">${p ? "계획 다시 만들기" : "계획 만들기"}</button>
    </form>`;
}

function renderExamOverview() {
  const pack = exPack();
  const p = examState.data.plan;
  const alloc = p.allocation;
  const allDays = p.days.filter((d) => d.activities.length);
  const doneCount = allDays.reduce((n, d) => n + d.activities.filter((a) => examState.data.done?.[a.id]).length, 0);
  const actCount = allDays.reduce((n, d) => n + d.activities.length, 0);
  const rows = pack.sections.map((s) => {
    const gap = Math.max(0, p.target - p.scores[s.id]);
    const min = alloc.sections[s.id];
    return `<li><span class="exam-alloc-name">${s.ko} <small>${s.name}</small></span>
      <span class="exam-bar"><i style="width:${(min / p.daily_minutes) * 100}%"></i></span>
      <span class="exam-alloc-min">${min}분</span>
      <span class="exam-pri is-${gap >= 2 ? "high" : gap >= 1 ? "mid" : "low"}">${exPriority(gap)}</span>
      <small class="exam-alloc-score">${p.scores[s.id].toFixed(1)} → ${p.target.toFixed(1)}</small></li>`;
  }).join("");
  const weeks = [];
  for (let w = 0; w < p.weeks; w++) {
    const days = p.days.filter((d) => d.week === w);
    const ph = pack.phases[days[0].phase];
    weeks.push(`
      <section class="exam-week">
        <header><strong>${w + 1}주 차 · ${ph.label}</strong><small>${ph.goal} — ${ph.outputs}</small></header>
        <div class="exam-days">${days.map(exDayCell).join("")}</div>
      </section>`);
  }
  return `
    <div class="exam-summary">
      <div><small>시험</small><strong>${exEsc(pack.name)} ${pack.version}</strong></div>
      <div><small>기간</small><strong>${p.start_date} ~ ${p.days[p.days.length - 1].date}</strong></div>
      <div><small>주당 / 하루</small><strong>${p.study_days_per_week}일 · ${p.daily_minutes}분</strong></div>
      <div><small>진행</small><strong>${actCount ? Math.round((doneCount / actCount) * 100) : 0}% <span class="exam-sub">${doneCount}/${actCount}개</span></strong></div>
    </div>
    <h2 class="exam-h">하루 시간 배분 <small>${p.daily_minutes}분</small></h2>
    <ul class="exam-alloc">
      <li><span class="exam-alloc-name">일반 영어 <small>시편·잠언</small></span>
        <span class="exam-bar is-general"><i style="width:${(alloc.general / p.daily_minutes) * 100}%"></i></span>
        <span class="exam-alloc-min">${alloc.general}분</span><span></span><small></small></li>
      ${rows}
    </ul>
    <p class="exam-note">점수 격차가 큰 영역에 시간을 더 배정합니다. 강점 영역도 매일 유지 연습이 들어갑니다.</p>
    ${weeks.join("")}
    ${renderExamFooter(pack)}`;
}

function exDayCell(day) {
  const d = new Date(day.date + "T00:00:00Z");
  const label = { study: "학습", check: "주간 점검", rest: "휴식", final: "마무리" }[day.type];
  const prog = exDayProgress(day);
  const done = prog === 1 ? " is-done" : "";
  const today = day.date === exToday() ? " is-today" : "";
  return `<button type="button" class="exam-day is-${day.type}${done}${today}"${today ? ' aria-current="date"' : ""} data-ex-action="day" data-ex-id="${day.date}">
    <span>${d.getUTCMonth() + 1}/${d.getUTCDate()} (${EX_WEEKDAYS[d.getUTCDay()]})</span>
    <small>${label}</small>
    ${prog === null ? "" : `<i class="exam-day-bar"><b style="width:${prog * 100}%"></b></i>`}
  </button>`;
}

function exDayStatus(day) {
  if (!day.activities.length) return "";
  const done = examState.data.done || {};
  const count = day.activities.filter((a) => done[a.id]).length;
  const left = day.activities.filter((a) => !done[a.id]).reduce((n, a) => n + a.minutes, 0);
  return count === day.activities.length
    ? `<p class="exam-daystatus is-done" role="status">오늘 할 일을 모두 마쳤습니다.</p>`
    : `<p class="exam-daystatus" role="status"><strong>${count}/${day.activities.length}</strong> 완료 · 남은 시간 약 ${left}분</p>`;
}

function exCurrentDay() {
  const p = examState.data.plan;
  const t = examState.day || exToday();
  if (t < p.days[0].date) return p.days[0];
  return p.days.find((d) => d.date === t) || p.days[p.days.length - 1];
}

function renderExamDay() {
  const pack = exPack();
  const p = examState.data.plan;
  const day = exCurrentDay();
  const i = p.days.indexOf(day);
  const done = examState.data.done || {};
  const outputs = examState.data.outputs || {};
  const ph = pack.phases[day.phase];
  const d = new Date(day.date + "T00:00:00Z");
  const acts = day.activities.map((a) => `
    <article class="exam-act${done[a.id] ? " is-done" : ""}">
      <header>
        <label class="exam-check"><input type="checkbox" data-ex-done="${a.id}"${done[a.id] ? " checked" : ""}><span>${exEsc(a.title)}</span></label>
        <span class="exam-act-meta">
          <span class="exam-kind is-${a.kind}">${a.kind === "general" ? "일반 영어" : "시험 대비"}</span>
          ${exSectionName(pack, a.section)} · ${a.minutes}분
        </span>
      </header>
      ${a.ref ? `<p class="exam-ref">본문 <strong>${exEsc(a.ref)}</strong> <small>가지고 있는 영어 성경 번역본으로 읽고 듣습니다.</small></p>` : ""}
      <div class="exam-collapsible"><div>
      ${a.tasks.length > 1 ? `<p class="exam-tasks">${a.tasks.map((t) => exEsc(pack.sections.flatMap((s) => s.tasks).find((x) => x.id === t)?.name || t)).join(" · ")}</p>` : ""}
      <ol class="exam-steps">${a.steps.map((st, n) => `<li${n === 0 && a.kind === "exam" && a.section !== "review" ? ' class="is-lead"' : ""}>${exEsc(st)}</li>`).join("")}</ol>
      ${a.link ? `<p><a href="${exEsc(a.link)}" target="_blank" rel="noopener">ETS 공식 연습 자료 열기</a></p>` : ""}
      </div></div>
      <label class="exam-output"><span>산출물 · ${exEsc(a.output)} <small>자동 저장</small></span><textarea rows="3" data-ex-output="${a.id}">${exEsc(outputs[a.id] || "")}</textarea></label>
      ${a.section !== "general" ? `<button type="button" class="exam-link" data-ex-action="log-error" data-ex-id="${a.section}">오류 기록에 추가</button>` : ""}
    </article>`).join("");
  return `
    <div class="exam-dayhead">
      <button type="button" class="exam-nav" data-ex-action="day" data-ex-id="${p.days[i - 1]?.date || ""}"${i ? "" : " disabled"}>← 이전</button>
      <div><h2>${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${EX_WEEKDAYS[d.getUTCDay()]})</h2>
        <small>${day.week + 1}주 차 · ${ph.label} — ${ph.goal}</small></div>
      <button type="button" class="exam-nav" data-ex-action="day" data-ex-id="${p.days[i + 1]?.date || ""}"${i < p.days.length - 1 ? "" : " disabled"}>다음 →</button>
    </div>
    ${exDayStatus(day)}
    ${day.type === "rest" ? `<p class="exam-rest">휴식일입니다. 밀린 과제가 있다면 1개만 보충합니다.</p>` : acts}`;
}

function renderExamErrors() {
  const pack = exPack();
  const errors = examState.data.errors || [];
  const today = exToday();
  const due = errors.filter((e) => !e.mastered && e.due <= today);
  const draft = examState.errorDraft || {};
  const allTasks = pack.sections.flatMap((s) => s.tasks.map((t) => ({ ...t, section: s.id })));
  const card = (e, actions) => `
    <article class="exam-err">
      <header><span>${exSectionName(pack, e.section)}${e.task ? ` · ${exEsc(allTasks.find((t) => t.id === e.task)?.name || e.task)}` : ""}</span>
        <small>${e.mastered ? "익힘" : `복습 ${e.stage + 1}/${EX_REVIEW_DAYS.length} · ${e.due}`}</small></header>
      <p class="exam-err-orig">${exEsc(e.original)}</p>
      ${e.corrected ? `<p class="exam-err-fix">${exEsc(e.corrected)}</p>` : ""}
      ${e.tags.length ? `<p class="exam-err-tags">${e.tags.map((t) => `<span>${exEsc(t)}</span>`).join("")}</p>` : ""}
      ${e.note ? `<p class="exam-err-note">${exEsc(e.note)}</p>` : ""}
      ${actions}
    </article>`;
  return `
    <h2 class="exam-h">오늘 복습할 오류 <small>${due.length}개</small></h2>
    ${due.length ? due.map((e) => card(e, `<div class="exam-err-actions">
        <button type="button" data-ex-action="review-ok" data-ex-id="${e.id}">맞혔어요</button>
        <button type="button" data-ex-action="review-miss" data-ex-id="${e.id}">또 틀렸어요</button></div>`)).join("") : `<p class="exam-hint">오늘 다시 풀 오류가 없습니다.</p>`}
    <h2 class="exam-h">오류 기록하기</h2>
    <form class="exam-errform" data-ex-form="error">
      <label>영역<select name="section">${pack.sections.map((s) => `<option value="${s.id}"${draft.section === s.id ? " selected" : ""}>${s.ko} ${s.name}</option>`).join("")}<option value="review"${draft.section === "review" ? " selected" : ""}>점검</option></select></label>
      <label>과제 유형<select name="task">${exTaskOptions(pack, draft.section || pack.sections[0].id)}</select></label>
      <label class="is-wide">내 답 (원문 그대로)<textarea name="original" rows="2" required></textarea></label>
      <label class="is-wide">고친 답<textarea name="corrected" rows="2"></textarea></label>
      <fieldset class="is-wide exam-tagpick"><legend>오류 유형</legend><div class="exam-fields">${pack.error_tags.map((t) => `<label><input type="checkbox" name="tags" value="${exEsc(t)}">${exEsc(t)}</label>`).join("")}</div></fieldset>
      <label class="is-wide">짧은 설명<input type="text" name="note" placeholder="왜 틀렸는지 한 줄"></label>
      <button type="submit" class="exam-primary">기록하기</button>
    </form>
    <h2 class="exam-h">전체 오류 기록 <small>${errors.length}개</small></h2>
    ${errors.slice().reverse().map((e) => card(e, "")).join("") || `<p class="exam-hint">문제를 풀다 틀린 답을 원문 그대로 적어 두면 1일·3일·7일 뒤에 다시 보여 줍니다.</p>`}`;
}

function exTaskOptions(pack, sectionId) {
  const tasks = pack.sections.find((s) => s.id === sectionId)?.tasks || [];
  return `<option value="">선택 안 함</option>${tasks.map((t) => `<option value="${t.id}">${exEsc(t.name)}</option>`).join("")}`;
}

function renderExamFooter(pack) {
  return `<footer class="exam-footer">
    <p>이 계획은 점수 향상을 보장하지 않습니다. 자가 점검 결과는 추정치이며 공식 점수가 아닙니다.</p>
    <p>시험 정보 출처 (확인일 ${pack.last_verified}, 버전 ${pack.version}): ${pack.sources.map((s) => `<a href="${exEsc(s.url)}" target="_blank" rel="noopener">${exEsc(s.label)}</a>`).join(" · ")}</p>
  </footer>`;
}

function exDo(action, id) {
  const s = examState;
  if (action === "go") { s.stage = id; if (id === "day") s.day = null; }
  if (action === "day" && id) { s.stage = "day"; s.day = id; }
  if (action === "log-error") { s.stage = "errors"; s.errorDraft = { section: id }; }
  if (action === "review-ok" || action === "review-miss") {
    s.data.errors = s.data.errors.map((e) => (e.id === id ? exReviewNext(e, action === "review-ok", exToday()) : e));
    exSave();
  }
  renderExam();
  if (action === "log-error") examRoot.querySelector("[data-ex-form=error]")?.scrollIntoView({ behavior: "smooth" });
}

if (examRoot) {
  examRoot.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-ex-action]");
    if (!btn || btn.disabled) return;
    const card = btn.dataset.exAction.startsWith("review-") && btn.closest(".exam-err");
    if (card && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.style.pointerEvents = "none";
      card.animate(
        [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${btn.dataset.exAction === "review-ok" ? 12 : -12}px) scale(0.98)` }],
        { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      ).finished.then(() => exDo(btn.dataset.exAction, btn.dataset.exId));
      return;
    }
    exDo(btn.dataset.exAction, btn.dataset.exId);
  });

  examRoot.addEventListener("change", (event) => {
    if (event.target.name === "section" && event.target.form?.dataset.exForm === "error") {
      event.target.form.task.innerHTML = exTaskOptions(exPack(), event.target.value);
      return;
    }
    const id = event.target.dataset.exDone;
    if (!id) return;
    examState.data.done = { ...examState.data.done, [id]: event.target.checked };
    exSave();
    event.target.closest(".exam-act")?.classList.toggle("is-done", event.target.checked);
    const status = examRoot.querySelector(".exam-daystatus");
    if (status) status.outerHTML = exDayStatus(exCurrentDay());
  });

  examRoot.addEventListener("input", (event) => {
    const id = event.target.dataset.exOutput;
    if (!id) return;
    examState.data.outputs = { ...examState.data.outputs, [id]: event.target.value };
    exSave();
  });

  examRoot.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = new FormData(event.target);
    if (event.target.dataset.exForm === "setup") {
      const pack = EXAM_PACKS[f.get("pack")];
      const scores = {};
      for (const sec of pack.sections) scores[sec.id] = Number(f.get("score_" + sec.id));
      examState.data.plan = exBuildPlan(pack, {
        startDate: f.get("startDate"), weeks: Number(f.get("weeks")), studyDays: Number(f.get("studyDays")),
        dailyMinutes: Number(f.get("dailyMinutes")), target: Number(f.get("target")), scores,
        diagnosedAt: f.get("diagnosedAt"), diagnosticTool: String(f.get("diagnosticTool")).trim()
      });
      examState.stage = "overview";
    } else if (event.target.dataset.exForm === "error") {
      const today = exToday();
      examState.data.errors = [...(examState.data.errors || []), {
        id: Date.now().toString(36), section: f.get("section"), task: f.get("task"),
        original: f.get("original"), corrected: f.get("corrected"), tags: f.getAll("tags"),
        note: f.get("note"), created: today, stage: 0, due: exAddDays(today, EX_REVIEW_DAYS[0])
      }];
      examState.errorDraft = null;
    }
    exSave();
    renderExam();
  });
}
