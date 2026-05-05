import test from "node:test";
import assert from "node:assert/strict";
import { parseInquiry, recommendPlan } from "./core.js";

test("parseInquiry extracts multiple crops, area, and plot conditions", () => {
  const inquiry = parseInquiry("我想种番茄和黄瓜，地块 2 分，全日照，沙壤土，浇水方便", new Date("2026-05-05"));
  assert.deepEqual(inquiry.requestedCrops, ["番茄", "黄瓜"]);
  assert.equal(inquiry.area, 2);
  assert.equal(inquiry.unit, "分");
  assert.equal(inquiry.plot.soil, "沙壤土");
  assert.equal(inquiry.plot.water, "方便");
});

test("recommendPlan returns recommendations and WeChat handoff", () => {
  const plan = recommendPlan("我想种番茄和黄瓜，地块 2 分，全日照，沙壤土", { date: "2026-05-05" });
  assert.equal(plan.mode, "wechat_handoff");
  assert.ok(plan.recommendations.length >= 1);
  assert.ok(plan.total.estimatedCost > 0);
  assert.equal(plan.nextStep.action, "add_wechat");
  assert.match(plan.nextStep.message, /人工/);
});

test("recommendPlan replaces requested crops when season is unsuitable", () => {
  const plan = recommendPlan("地块 3 分，黏土，浇水不便，想种白菜、萝卜", { date: "2026-05-05" });
  assert.ok(plan.notRecommended.some((item) => item.crop === "萝卜"));
  assert.ok(plan.recommendations.every((item) => item.suitability >= 70));
});
