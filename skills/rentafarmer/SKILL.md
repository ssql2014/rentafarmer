---
name: rentafarmer
description: Use when a user wants AI guidance for RentAFarmer 云种菜意向咨询: recommend vegetable varieties from requested crops, current season, plot area, lease duration, sunlight, soil, water, budget, and hand off to WeChat for human confirmation.
---

# RentAFarmer Skill

用于处理“用户用中文告诉 AI 想种什么菜，AI 先给出种植意向建议，再引导加微信由主理人确认”的任务。

## 工作流

1. 把用户自然语言拆成结构化字段：蔬菜品种、面积、租赁时长、地区、光照、土壤、水源、大棚、预算。
2. 根据当前月份、地块条件和用户点名品种判断适配度。
3. 输出推荐品种、建议面积、成熟周期、预计产量、预估费用、主要农事任务和推荐原因。
4. 输出服务配置：有机方式管护、不打农药、24 小时视频监控、当地农民服务。
5. 输出成熟后处理方式：自行采摘、邮寄、委托主理人代为销售。
6. 不直接引导付款；确认意向后加微信，由主理人核地块、农时、视频监控、配送、合同和最终报价。
7. 对高风险作业进入人工复核：农药、机械、无人机、危险地形、高金额订单。

## 本地 CLI

在项目根目录运行：

```bash
node bin/rentafarmer.js recommend "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土，租赁时长 4 个月"
node bin/rentafarmer.js parse "广东，60 平方米，半日照，想种生菜，租期 2 个月"
```

微信环境变量：

```bash
RENTAFARMER_WECHAT=your-wechat-id
```

## 输出要求

- 用中文回复业务结果。
- 明确写出推荐品种、面积、租赁时长、成熟周期、预计产量、费用预估和主理人确认点。
- 明确写出有机管护、不打农药、24 小时视频监控和当地农民服务。
- 明确写出成熟后处理方式：自行采摘、邮寄、委托代卖。
- 涉及认养时写成消费权益或服务权益，不承诺收益。
- 有机方式管护不等同于有机产品认证；认证级有机产品需要核验证书。
- 涉及村干部时写成协理、见证、调解，不写成个人收款代理。
- 下一步写成“加微信由主理人确认”，不要写成直接支付。
