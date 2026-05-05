import test from "node:test";
import assert from "node:assert/strict";
import { parseInquiry, recommendPlan } from "./core.js";

test("parseInquiry extracts multiple crops, area, and plot conditions", () => {
  const inquiry = parseInquiry("我想种番茄和黄瓜，地块 2 分，全日照，沙壤土，浇水方便，租赁时长 4 个月", new Date("2026-05-05"));
  assert.deepEqual(inquiry.requestedCrops, ["番茄", "黄瓜"]);
  assert.equal(inquiry.area, 2);
  assert.equal(inquiry.unit, "分");
  assert.equal(inquiry.plot.soil, "沙壤土");
  assert.equal(inquiry.plot.water, "方便");
  assert.equal(inquiry.lease.provided, true);
  assert.equal(inquiry.lease.days, 120);
});

test("recommendPlan returns recommendations and WeChat handoff", () => {
  const plan = recommendPlan("我想种番茄和黄瓜，地块 2 分，全日照，沙壤土，租赁时长 4 个月", { date: "2026-05-05" });
  assert.equal(plan.mode, "wechat_handoff");
  assert.ok(plan.recommendations.length >= 1);
  assert.ok(plan.total.estimatedCost > 0);
  assert.equal(plan.pricing.landRentPerMuYear, 2000);
  assert.equal(plan.pricing.laborCostPerDay, 200);
  assert.ok(plan.total.costBreakdown.landRent > 0);
  assert.ok(plan.total.costBreakdown.laborCost > 0);
  assert.ok(plan.total.expectedYieldKg > 0);
  assert.ok(plan.total.maxCycleDays > 0);
  assert.ok(plan.strategy.some((item) => item.includes("主推")));
  assert.ok(plan.strategy.some((item) => item.includes("主理人接口")));
  assert.equal(plan.nextStep.action, "add_wechat");
  assert.match(plan.nextStep.message, /主理人/);
  assert.match(plan.nextStep.message, /租赁时长/);
  assert.match(plan.nextStep.message, /预计产量/);
  assert.ok(plan.serviceFeatures.some((item) => item.includes("不打农药")));
  assert.ok(plan.serviceFeatures.some((item) => item.includes("24 小时视频监控")));
  assert.ok(plan.harvestOptions.some((item) => item.includes("自行")));
  assert.ok(plan.harvestOptions.some((item) => item.includes("邮寄")));
  assert.ok(plan.harvestOptions.some((item) => item.includes("销售")));
});

test("recommendPlan replaces requested crops when season is unsuitable", () => {
  const plan = recommendPlan("地块 3 分，黏土，浇水不便，想种白菜、萝卜", { date: "2026-05-05" });
  assert.ok(plan.notRecommended.some((item) => item.crop === "萝卜"));
  assert.ok(plan.recommendations.every((item) => item.suitability >= 70));
});

test("recommendPlan routes Pingyang Aojiang Fengli inquiries to area contact", () => {
  const plan = recommendPlan("浙江省平阳县鳌江镇凤里社区，地块 2 分，全日照，想种番茄和生菜", {
    date: "2026-05-05"
  });
  assert.equal(plan.nextStep.areaContact.id, "pingyang-aojiang-fengli");
  assert.match(plan.nextStep.message, /平阳鳌江主理人/);
});
