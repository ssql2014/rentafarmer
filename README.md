# RentAFarmer

RentAFarmer 是一个 Codex skill 和轻量演示项目。用户用中文说明想种的一种或多种蔬菜，AI 根据当前季节、地块面积、光照、土壤、水源和预算生成种植意向建议。用户确认意向后，加微信进入人工核地块、核农时和最终报价。

## Skill 用法

在 Codex 中使用该 skill 时，让用户提供：

- 想种的蔬菜品种，一种或多种
- 地块面积
- 地区或县域
- 光照、土壤、水源、大棚条件
- 预算和配送需求

AI 输出推荐品种、面积、费用预估、周期和微信承接话术。

## 运行演示网站

```bash
npm start
```

打开 `http://localhost:4321`。

## 使用 CLI / Script

```bash
node scripts/recommend.mjs "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土"
node bin/rentafarmer.js recommend "广东，60 平方米，半日照，想种生菜和菠菜"
node bin/rentafarmer.js parse "北方 1 亩地，想种甜玉米和辣椒，有水源，预算 3000"
```

## 微信人工承接

默认微信号是 `rentafarmer-service`。可以用环境变量替换：

```bash
RENTAFARMER_WECHAT=your-wechat-id
```

当前版本不直接引导支付，先让人工确认地块、农时、配送和合同边界。

## API

```http
POST /api/plan
Content-Type: application/json

{
  "text": "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土"
}
```

返回推荐品种、面积、费用预估、周期、合规边界和微信承接话术。
