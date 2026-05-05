#!/usr/bin/env node
import { formatRecommendation, recommendPlan } from "../src/core.js";

const text = process.argv.slice(2).join(" ").trim();

if (!text) {
  console.error('用法：node scripts/recommend.mjs "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土"');
  process.exit(1);
}

const plan = recommendPlan(text);
console.log(formatRecommendation(plan));
