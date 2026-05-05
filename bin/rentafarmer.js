#!/usr/bin/env node
import { formatRecommendation, parseInquiry, recommendPlan } from "../src/core.js";

const [command, ...args] = process.argv.slice(2);

if (!command || ["-h", "--help", "help"].includes(command)) {
  console.log(`rentafarmer CLI

用法：
  rentafarmer recommend "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土"
  rentafarmer parse "广东，60 平方米，半日照，想种生菜"

命令：
  recommend  根据蔬菜品种、季节和地块条件生成建议方案
  plan       recommend 的别名
  parse      仅输出结构化意向 JSON

环境变量：
  RENTAFARMER_WECHAT=your-wechat-id
`);
  process.exit(0);
}

const text = args.join(" ").trim();
if (!text) {
  console.error("缺少需求文本。示例：rentafarmer recommend \"我想种 1 分地番茄，地块全日照\"");
  process.exit(1);
}

if (command === "parse") {
  console.log(JSON.stringify(parseInquiry(text), null, 2));
} else if (command === "recommend" || command === "plan") {
  const plan = recommendPlan(text);
  console.log(formatRecommendation(plan));
  console.log("\nJSON:");
  console.log(JSON.stringify(plan, null, 2));
} else {
  console.error(`未知命令：${command}`);
  process.exit(1);
}
