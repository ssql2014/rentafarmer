const cropCatalog = [
  {
    crop: "番茄",
    aliases: ["番茄", "西红柿", "圣女果"],
    months: [3, 4, 5, 6, 7, 8],
    sunlight: "全日照",
    soil: ["壤土", "沙壤土"],
    days: 95,
    yieldKgPerFen: 450,
    minAreaFen: 0.5,
    laborDaysPerFen: 4,
    tasks: ["整地起垄", "移栽定植", "搭架绑蔓", "水肥管理", "病虫巡检", "采摘配送"],
    reason: "适合家庭认养，采收周期长，过程照片和成熟配送体验清楚。"
  },
  {
    crop: "黄瓜",
    aliases: ["黄瓜", "青瓜"],
    months: [3, 4, 5, 6, 7, 8],
    sunlight: "全日照",
    soil: ["壤土", "沙壤土"],
    days: 70,
    yieldKgPerFen: 650,
    minAreaFen: 0.5,
    laborDaysPerFen: 3.5,
    tasks: ["整地施肥", "播种或移栽", "搭架引蔓", "滴灌追肥", "采摘分拣"],
    reason: "见效快、复购强，适合做第一期云种菜样板。"
  },
  {
    crop: "生菜",
    aliases: ["生菜", "油麦菜", "小青菜", "青菜", "叶菜"],
    months: [1, 2, 3, 4, 5, 9, 10, 11, 12],
    sunlight: "半日照",
    soil: ["壤土", "沙壤土", "黏土"],
    days: 35,
    yieldKgPerFen: 260,
    minAreaFen: 0.3,
    laborDaysPerFen: 1.5,
    tasks: ["整地做畦", "播种", "浇水保墒", "除草", "采收打包"],
    reason: "周期短，适合低客单试单和亲子体验。"
  },
  {
    crop: "辣椒",
    aliases: ["辣椒", "青椒", "朝天椒"],
    months: [3, 4, 5, 6, 7],
    sunlight: "全日照",
    soil: ["壤土", "沙壤土"],
    days: 110,
    yieldKgPerFen: 300,
    minAreaFen: 0.5,
    laborDaysPerFen: 4.5,
    tasks: ["育苗移栽", "水肥管理", "整枝打杈", "病虫巡检", "分批采摘"],
    reason: "适合长期代管，分批采摘能增加用户参与感。"
  },
  {
    crop: "甜玉米",
    aliases: ["玉米", "甜玉米"],
    months: [4, 5, 6, 7],
    sunlight: "全日照",
    soil: ["壤土", "沙壤土", "黏土"],
    days: 85,
    yieldKgPerFen: 520,
    minAreaFen: 1,
    laborDaysPerFen: 2,
    tasks: ["整地", "播种", "间苗补苗", "追肥", "收获配送"],
    reason: "管理动作标准，适合合作社集中履约。"
  },
  {
    crop: "萝卜",
    aliases: ["萝卜", "白萝卜", "红萝卜"],
    months: [8, 9, 10, 11],
    sunlight: "全日照",
    soil: ["沙壤土", "壤土"],
    days: 65,
    yieldKgPerFen: 750,
    minAreaFen: 0.5,
    laborDaysPerFen: 1.5,
    tasks: ["深翻整地", "播种", "间苗", "水肥管理", "采收分拣"],
    reason: "秋冬茬稳定，收获物直观，适合家庭储菜。"
  },
  {
    crop: "白菜",
    aliases: ["白菜", "大白菜", "娃娃菜"],
    months: [8, 9, 10, 11],
    sunlight: "全日照",
    soil: ["壤土", "黏土"],
    days: 75,
    yieldKgPerFen: 900,
    minAreaFen: 0.5,
    laborDaysPerFen: 2,
    tasks: ["整地", "移栽或直播", "水肥管理", "病虫巡检", "采收配送"],
    reason: "秋冬需求强，标准化程度高。"
  },
  {
    crop: "菠菜",
    aliases: ["菠菜"],
    months: [1, 2, 3, 9, 10, 11, 12],
    sunlight: "半日照",
    soil: ["壤土", "沙壤土", "黏土"],
    days: 40,
    yieldKgPerFen: 280,
    minAreaFen: 0.3,
    laborDaysPerFen: 1.5,
    tasks: ["整地", "播种", "浇水", "除草", "采收打包"],
    reason: "耐冷，适合秋冬和早春快周期订单。"
  }
];

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0
});

const LAND_RENT_PER_MU_YEAR = 2000;
const LABOR_COST_PER_DAY = 200;

const areaContacts = [
  {
    id: "pingyang-aojiang-fengli",
    area: "浙江省温州市平阳县鳌江镇凤里社区",
    name: "平阳鳌江主理人",
    role: "地块核验、农户协调、微信客户对接",
    wechatId: process.env.RENTAFARMER_PINGYANG_WECHAT || process.env.RENTAFARMER_WECHAT || "rentafarmer-pingyang",
    match: ["浙江", "温州", "平阳", "鳌江", "凤里"]
  },
  {
    id: "default",
    area: "默认服务区",
    name: "总调度主理人",
    role: "意向登记、区域分流、人工复核",
    wechatId: process.env.RENTAFARMER_WECHAT || "rentafarmer-service",
    match: []
  }
];

export function parseInquiry(text = "", date = new Date()) {
  const source = String(text).trim();
  const crops = cropCatalog
    .filter((item) => item.aliases.some((alias) => source.includes(alias)))
    .map((item) => item.crop);
  const areaMatch = source.match(/(\d+(?:\.\d+)?)\s*(亩|分|平方米|平米|m2|㎡)/i);
  const budgetMatch = source.match(/(?:预算|费用|价格|控制在|不超过)\D*(\d+(?:\.\d+)?)/);
  const lease = parseLease(source);
  const month = date.getMonth() + 1;

  return {
    rawText: source,
    requestedCrops: [...new Set(crops)],
    area: areaMatch ? Number(areaMatch[1]) : null,
    unit: areaMatch ? normalizeUnit(areaMatch[2]) : null,
    areaFen: areaMatch ? toFen(Number(areaMatch[1]), areaMatch[2]) : null,
    budget: budgetMatch ? Number(budgetMatch[1]) : null,
    lease,
    region: detectRegion(source),
    plot: {
      sunlight: /半阴|半日照|树荫|阴/.test(source) ? "半日照" : "全日照",
      soil: detectSoil(source),
      water: /滴灌|水源方便|浇水方便/.test(source)
        ? "方便"
        : /缺水|浇水不便|无水/.test(source)
          ? "不便"
          : "未说明",
      greenhouse: /大棚|温室|棚/.test(source)
    },
    month
  };
}

export function recommendPlan(text = "", options = {}) {
  const inquiry = parseInquiry(text, options.date ? new Date(options.date) : new Date());
  const contact = resolveAreaContact(inquiry);
  const totalAreaFen = inquiry.areaFen ?? defaultAreaFen(inquiry.requestedCrops.length);
  const candidates = scoreCrops(inquiry);
  const requestedGood = candidates.filter((item) => inquiry.requestedCrops.includes(item.crop) && item.suitability >= 70);
  const targetCount = Math.min(3, Math.max(1, inquiry.requestedCrops.length || 2));
  const selected = [...requestedGood];
  for (const candidate of candidates) {
    if (selected.length >= targetCount) break;
    if (!selected.some((item) => item.crop === candidate.crop) && !inquiry.requestedCrops.includes(candidate.crop)) {
      selected.push(candidate);
    }
  }
  if (selected.length === 0) selected.push(candidates[0]);
  const areaPlan = allocateArea(selected, totalAreaFen);
  const recommendations = selected.map((item, index) => {
    const areaFen = areaPlan[index];
    const cost = estimateCost(item, areaFen, inquiry);
    return {
      crop: item.crop,
      suitability: item.suitability,
      areaFen,
      areaText: formatFen(areaFen),
      estimatedCost: cost.total,
      estimatedCostText: money.format(cost.total),
      costBreakdown: cost,
      cycleDays: item.days,
      cycleText: `${item.days} 天左右`,
      expectedYieldKg: estimateYield(item, areaFen),
      expectedYieldText: formatKg(estimateYield(item, areaFen)),
      tasks: item.tasks,
      reasons: item.reasons
    };
  });
  const totalCost = recommendations.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalLandRent = recommendations.reduce((sum, item) => sum + item.costBreakdown.landRent, 0);
  const totalLaborDays = recommendations.reduce((sum, item) => sum + item.costBreakdown.laborDays, 0);
  const totalLaborCost = recommendations.reduce((sum, item) => sum + item.costBreakdown.laborCost, 0);
  const totalYieldKg = recommendations.reduce((sum, item) => sum + item.expectedYieldKg, 0);
  const maxCycleDays = Math.max(...recommendations.map((item) => item.cycleDays));
  const total = {
    areaFen: Number(totalAreaFen.toFixed(2)),
    areaText: formatFen(totalAreaFen),
    estimatedCost: totalCost,
    estimatedCostText: money.format(totalCost),
    costBreakdown: {
      landRent: totalLandRent,
      landRentText: money.format(totalLandRent),
      laborDays: totalLaborDays,
      laborCost: totalLaborCost,
      laborCostText: money.format(totalLaborCost)
    },
    expectedYieldKg: totalYieldKg,
    expectedYieldText: formatKg(totalYieldKg),
    maxCycleDays,
    maxCycleText: `${maxCycleDays} 天左右`
  };
  const notRecommended = inquiry.requestedCrops
    .filter((crop) => !recommendations.some((item) => item.crop === crop))
    .map((crop) => {
      const scored = candidates.find((item) => item.crop === crop);
      return {
        crop,
        reason: scored?.reasons.join("；") || "当前地块或季节条件不优先推荐。"
      };
    });

  return {
    mode: "wechat_handoff",
    pricing: {
      landRentPerMuYear: LAND_RENT_PER_MU_YEAR,
      landRentPerMuYearText: money.format(LAND_RENT_PER_MU_YEAR),
      laborCostPerDay: LABOR_COST_PER_DAY,
      laborCostPerDayText: money.format(LABOR_COST_PER_DAY)
    },
    inquiry,
    recommendations,
    notRecommended,
    strategy: buildStrategy(inquiry, recommendations, total, contact),
    serviceFeatures: [
      "有机方式管护，不打农药，优先采用人工除草、物理防虫和生物防治。",
      "地块接入 24 小时视频监控，用户可远程查看种植过程。",
      "当地农民提供日常种植、浇水、除草、采摘和配送协助，区域主理人负责客户对接。"
    ],
    harvestOptions: ["成熟后自行到地块采摘", "由主理人安排采摘并邮寄", "委托当地主理人代为销售"],
    total,
    nextStep: {
      action: "add_wechat",
      areaContact: contact,
      wechatId: contact.wechatId,
      message: buildWechatMessage(inquiry, recommendations, total, contact)
    },
    compliance: [
      "当前输出是种植意向建议，不构成最终报价。",
      "确认意向后进入微信主理人核地、核农时、核配送和合同边界。",
      "认养按农事服务或消费权益处理，不承诺保本、固定收益或回购。",
      "有机方式管护不等同于有机产品认证；如需认证，应由主理人核验证书。"
    ]
  };
}

function scoreCrops(inquiry) {
  return cropCatalog
    .map((item) => {
      const reasons = [];
      let score = 50;

      if (item.months.includes(inquiry.month) || inquiry.plot.greenhouse) {
        score += 30;
        reasons.push(inquiry.plot.greenhouse ? "有大棚条件，可放宽季节限制" : `${inquiry.month} 月适合安排${item.crop}`);
      } else {
        score -= 25;
        reasons.push(`${inquiry.month} 月不是${item.crop}的优先种植窗口`);
      }

      if (item.sunlight === inquiry.plot.sunlight || item.sunlight === "半日照") {
        score += 15;
        reasons.push(`光照条件匹配：${inquiry.plot.sunlight}`);
      } else {
        score -= 10;
        reasons.push(`需要${item.sunlight}，当前按${inquiry.plot.sunlight}估算`);
      }

      if (item.soil.includes(inquiry.plot.soil)) {
        score += 10;
        reasons.push(`土壤条件可接受：${inquiry.plot.soil}`);
      } else {
        score -= 8;
        reasons.push(`土壤需人工改良后再种${item.crop}`);
      }

      if (inquiry.requestedCrops.includes(item.crop)) {
        score += 18;
        reasons.push("用户已点名该品种");
      }

      if (inquiry.plot.water === "不便" && ["黄瓜", "番茄", "辣椒"].includes(item.crop)) {
        score -= 12;
        reasons.push("浇水不便会增加管护成本");
      }

      return {
        ...item,
        suitability: Math.max(0, Math.min(100, score)),
        reasons
      };
    })
    .sort((a, b) => b.suitability - a.suitability);
}

function allocateArea(crops, totalAreaFen) {
  if (crops.length === 1) return [Number(Math.max(crops[0].minAreaFen, totalAreaFen).toFixed(2))];
  const base = totalAreaFen / crops.length;
  return crops.map((crop) => Number(Math.max(crop.minAreaFen, base).toFixed(2)));
}

function estimateCost(crop, areaFen, inquiry) {
  const leaseDays = inquiry.lease.days ?? crop.days;
  const landRent = Math.round((areaFen / 10) * LAND_RENT_PER_MU_YEAR * (leaseDays / 365));
  const waterFactor = inquiry.plot.water === "不便" ? 1.15 : 1;
  const greenhouseFactor = inquiry.plot.greenhouse ? 1.1 : 1;
  const laborDays = Math.max(1, Math.ceil(crop.laborDaysPerFen * areaFen * waterFactor * greenhouseFactor));
  const laborCost = laborDays * LABOR_COST_PER_DAY;
  return {
    landRent,
    landRentText: money.format(landRent),
    laborDays,
    laborCost,
    laborCostText: money.format(laborCost),
    total: landRent + laborCost,
    totalText: money.format(landRent + laborCost),
    formula: `土地年租 ${money.format(LAND_RENT_PER_MU_YEAR)}/亩/年，人工 ${money.format(LABOR_COST_PER_DAY)}/天`
  };
}

function estimateYield(crop, areaFen) {
  const raw = crop.yieldKgPerFen * areaFen;
  return Math.round(raw / 5) * 5;
}

function formatKg(kg) {
  if (kg >= 1000) return `${Number((kg / 1000).toFixed(2))} 吨`;
  return `${kg} 公斤`;
}

function defaultAreaFen(cropCount) {
  return cropCount > 1 ? cropCount : 1;
}

function detectRegion(text) {
  if (/凤里|鳌江|平阳|温州|浙江/.test(text)) return "浙江平阳鳌江";
  if (/广东|广西|海南|福建|云南|深圳|广州|南方/.test(text)) return "华南";
  if (/东北|黑龙江|吉林|辽宁|内蒙古|北方/.test(text)) return "北方";
  if (/四川|重庆|湖北|湖南|江西|浙江|江苏|安徽|河南|山东|中部/.test(text)) return "中东部";
  return "未说明";
}

function detectSoil(text) {
  if (/沙土|沙壤/.test(text)) return "沙壤土";
  if (/黏土|粘土|黄泥/.test(text)) return "黏土";
  return "壤土";
}

function normalizeUnit(unit) {
  if (unit === "亩") return "亩";
  if (["平方米", "平米", "m2", "㎡"].includes(unit)) return "平方米";
  return "分";
}

function toFen(area, unit) {
  const normalized = normalizeUnit(unit);
  if (normalized === "亩") return Number((area * 10).toFixed(2));
  if (normalized === "平方米") return Number((area / 66.7).toFixed(2));
  return Number(area.toFixed(2));
}

function parseLease(text) {
  if (!text) return { provided: false, days: null, text: "未提供，需客户补充" };
  const halfYear = /(半年|半年度)/.test(text);
  if (halfYear) return { provided: true, days: 180, text: "半年" };
  const season = /(一季|一茬|一季菜|一茬菜)/.test(text);
  if (season) return { provided: true, days: 120, text: "一季" };
  const match =
    text.match(/(?:租赁时长|租期|租|包|认养|代管|时长)\D*(\d+(?:\.\d+)?)\s*(年|个月|月|天|日)/) ||
    text.match(/(\d+(?:\.\d+)?)\s*(年|个月|月|天|日)\s*(?:租期|租赁|认养|代管|包地|服务)/);
  if (!match) return { provided: false, days: null, text: "未提供，需客户补充" };
  const value = Number(match[1]);
  const unit = match[2];
  const days = unit === "年" ? value * 365 : unit === "个月" || unit === "月" ? value * 30 : value;
  return { provided: true, days: Math.round(days), text: `${Number(value.toFixed(1))} ${unit}` };
}

function formatFen(areaFen) {
  if (areaFen >= 10) return `${Number((areaFen / 10).toFixed(2))} 亩`;
  return `${Number(areaFen.toFixed(2))} 分`;
}

function resolveAreaContact(inquiry) {
  const source = `${inquiry.rawText} ${inquiry.region}`;
  return areaContacts.find((contact) => contact.match.some((item) => source.includes(item))) || areaContacts.at(-1);
}

function buildStrategy(inquiry, recommendations, total, contact) {
  const crops = recommendations.map((item) => item.crop).join(" + ");
  const leaseAdvice = inquiry.lease.provided
    ? `按 ${inquiry.lease.text} 租期先排一茬，主理人复核后再决定是否续种或轮作。`
    : "客户未提供租赁时长，报价前必须先补充租期，否则无法锁定农时和服务成本。";
  return [
    `主推 ${crops}，按 ${total.areaText} 做分区种植，最长成熟周期约 ${total.maxCycleText}。`,
    `预计总产量约 ${total.expectedYieldText}，成熟后可自采、邮寄或委托代卖。`,
    leaseAdvice,
    `由${contact.name}作为主理人接口，加微信核地块、视频监控、采摘/邮寄/代卖和最终报价。`
  ];
}

function buildWechatMessage(inquiry, recommendations, total, contact) {
  const crops = recommendations.map((item) => `${item.crop}${item.areaText}`).join("、");
  const yieldText = recommendations.map((item) => `${item.crop}${item.expectedYieldText}`).join("、");
  return [
    "你好，我想确认云种菜方案。",
    `需求：${inquiry.rawText || "未填写"}`,
    `AI 建议：${crops}`,
    `成熟周期：最长约 ${Math.max(...recommendations.map((item) => item.cycleDays))} 天`,
    `预计产量：${yieldText}`,
    `租赁时长：${inquiry.lease.text}`,
    `预估费用：${total.estimatedCostText}`,
    `费用组成：土地租金 ${total.costBreakdown.landRentText}；人工费用 ${total.costBreakdown.laborCostText}（约 ${total.costBreakdown.laborDays} 天）。`,
    "服务要求：有机方式管护、不打农药、24 小时视频监控、当地农民服务。",
    "成熟后选项：自行采摘、邮寄、或委托代为销售。",
    `请转给${contact.name}，加微信对接客户，帮我核地块、农时、监控、采摘/邮寄/代卖和最终报价。`
  ].join("\n");
}

export function formatRecommendation(plan) {
  const lines = [
    "RentAFarmer 种植意向建议",
    `地块信息：${plan.inquiry.region}，${plan.inquiry.plot.sunlight}，${plan.inquiry.plot.soil}，水源${plan.inquiry.plot.water}`,
    `建议面积：${plan.total.areaText}`,
    `租赁时长：${plan.inquiry.lease.text}`,
    `最长成熟周期：${plan.total.maxCycleText}`,
    `预计总产量：${plan.total.expectedYieldText}`,
    `预估费用：${plan.total.estimatedCostText}`,
    `费用组成：土地租金 ${plan.total.costBreakdown.landRentText}；人工费用 ${plan.total.costBreakdown.laborCostText}（约 ${plan.total.costBreakdown.laborDays} 天）。`,
    `策略建议：${plan.strategy.join("；")}`,
    `服务特色：${plan.serviceFeatures.join("；")}`,
    `成熟后处理：${plan.harvestOptions.join(" / ")}`,
    "",
    "推荐品种："
  ];

  for (const item of plan.recommendations) {
    lines.push(
      `- ${item.crop}：${item.areaText}，${item.estimatedCostText}（土地 ${item.costBreakdown.landRentText}，人工 ${item.costBreakdown.laborCostText}/${item.costBreakdown.laborDays} 天），成熟周期约 ${item.cycleDays} 天，预计产量 ${item.expectedYieldText}，适配度 ${item.suitability}/100`
    );
    lines.push(`  原因：${item.reasons.join("；")}`);
  }

  if (plan.notRecommended.length > 0) {
    lines.push("", "暂不优先推荐：");
    for (const item of plan.notRecommended) {
      lines.push(`- ${item.crop}：${item.reason}`);
    }
  }

  lines.push(
    "",
    `下一步：加微信 ${plan.nextStep.wechatId}，由${plan.nextStep.areaContact.name}承接客户，发送以下信息进入主理人确认：`
  );
  lines.push(plan.nextStep.message);
  return lines.join("\n");
}

export function createOrder(text) {
  return recommendPlan(text);
}

export function parseRequest(text = "") {
  return parseInquiry(text);
}

export function formatOrderSummary(order) {
  return formatRecommendation(order);
}
