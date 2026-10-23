// 명세서 9장 검증 기준 자체 점검: node exam-check.js
const assert = require("node:assert");
const { EXAM_PACKS } = require("./exam-packs.js");
const { exAllocate, exBuildPlan, exReviewNext } = require("./exam.js");

const pack = EXAM_PACKS.toefl_ibt_2026;
const taskIds = new Set(pack.sections.flatMap((s) => s.tasks.map((t) => t.id)));
const scores = { reading: 3, listening: 3, writing: 1.5, speaking: 2 };

// 명세 예시 학습자: 쓰기 > 말하기 > 읽기 = 듣기
const a = exAllocate(pack, 120, scores, 4);
assert.deepStrictEqual(a.sections, { reading: 20, listening: 20, writing: 35, speaking: 30 });
assert.strictEqual(a.general, 15);

for (const weeks of [1, 2, 3, 8, 12]) {
  for (const studyDays of [5, 6, 7]) {
    for (const daily of [60, 90, 120, 185, 240]) {
      const p = exBuildPlan(pack, { startDate: "2026-10-26", weeks, studyDays, dailyMinutes: daily, target: 4, scores });
      const tag = `${weeks}주 ${studyDays}일 ${daily}분`;
      assert.strictEqual(p.days.length, weeks * 7, tag + " 기간");
      const working = p.days.filter((d) => d.type !== "rest");
      // 마지막 날은 휴식일이었다면 복습일로 바뀌므로 학습일 수는 같거나 하루 많다
      assert.ok(working.length - weeks * studyDays <= 1 && working.length >= weeks * studyDays, tag + " 학습일 수");
      assert.strictEqual(p.days.at(-1).type, "final", tag + " 마지막 날 복습");
      for (const d of p.days.filter((x) => x.type === "study")) {
        assert.strictEqual(d.activities.reduce((n, x) => n + x.minutes, 0), daily, tag + " 하루 합계 " + d.date);
        assert.ok(d.activities.every((x) => x.minutes >= 5), tag + " 최소 시간");
        assert.ok(pack.sections.every((s) => d.activities.some((x) => x.section === s.id)), tag + " 강점 영역 유지 연습");
      }
      for (const d of p.days) {
        for (const x of d.activities) {
          assert.ok(x.output && x.steps.length, tag + " 산출물/완료 기준");
          assert.ok(x.tasks.every((t) => taskIds.has(t)), tag + " 과제 유형 " + x.tasks);
        }
      }
      // 마지막 주에 실전형 점검이 있다
      assert.ok(p.days.some((d) => d.week === weeks - 1 && d.type === "check" && d.phase === 2), tag + " 실전형 점검");
    }
  }
}

// 모든 과제 유형에 풀이 전략과 연습 문제가 있다
for (const id of taskIds) {
  const g = pack.guides[id];
  assert.ok(g && g.strategy.length && g.practice.prompt && g.practice.answer && g.practice.explain, "가이드 " + id);
}

// 복습 간격 1 → 3 → 7, 틀리면 처음으로
let e = { stage: 0, due: "2026-10-24" };
e = exReviewNext(e, true, "2026-10-24"); assert.deepStrictEqual([e.stage, e.due], [1, "2026-10-27"]);
e = exReviewNext(e, true, "2026-10-27"); assert.deepStrictEqual([e.stage, e.due], [2, "2026-11-03"]);
assert.strictEqual(exReviewNext(e, false, "2026-11-03").due, "2026-11-04");
assert.strictEqual(exReviewNext(e, true, "2026-11-03").mastered, true);

console.log("ok");
