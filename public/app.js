const form = document.querySelector("#request-form");
const input = document.querySelector("#request");
const sample = document.querySelector("#sample");
const result = document.querySelector("#result");
const empty = document.querySelector("#empty-state");
const apiPreview = document.querySelector("#api-preview code");

const samples = [
  "我想种番茄和黄瓜，地块 2 分，全日照，沙壤土，浇水方便，租赁时长 4 个月",
  "广东，60 平方米，半日照，想种生菜和菠菜，亲子体验，租期 2 个月",
  "北方 1 亩地，想种甜玉米和辣椒，有水源，预算 3000，代管半年",
  "地块 3 分，黏土，浇水不便，想种白菜、萝卜，包一季",
  "浙江省平阳县鳌江镇凤里社区，地块 2 分，全日照，想种番茄和生菜，租赁时长 120 天"
];

sample.addEventListener("click", () => {
  input.value = samples[Math.floor(Math.random() * samples.length)];
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading();
  const response = await fetch("/api/plan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });
  renderPlan(await response.json());
});

function setLoading() {
  empty.classList.add("hidden");
  result.classList.remove("hidden");
  result.innerHTML = `<div class="card"><h3>正在解析</h3><p>AI 正在拆解作物、面积、租赁时长、成熟周期、预计产量、地块条件和费用。</p></div>`;
}

function renderPlan(plan) {
  const inquiry = plan.inquiry;
  const first = plan.recommendations[0];
  result.innerHTML = `
    <article class="card highlight-card">
      <h3>服务特色</h3>
      <div class="metric">有机</div>
      <ul>${plan.serviceFeatures.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="card">
      <h3>首推品种</h3>
      <div class="metric">${first.crop}</div>
      <p>${first.areaText}，成熟周期约 ${first.cycleDays} 天，预计产量 ${first.expectedYieldText}，适配度 ${first.suitability}/100。</p>
      <ul>${first.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
    </article>
    <article class="card">
      <h3>租赁时长</h3>
      <div class="metric">${inquiry.lease.provided ? inquiry.lease.text : "待补充"}</div>
      <p>${inquiry.lease.provided ? `客户已提供租赁时长，约 ${inquiry.lease.days} 天。` : "客户还没有提供租赁时长，主理人报价前需要补充确认。"}</p>
    </article>
    <article class="card">
      <h3>成熟周期与产量</h3>
      <div class="metric">${plan.total.maxCycleText}</div>
      <p>预计总产量 ${plan.total.expectedYieldText}。产量按当前面积和作物常规区间估算，最终以主理人核地和实际长势为准。</p>
    </article>
    <article class="card">
      <h3>地块条件</h3>
      <div class="metric">${inquiry.month} 月</div>
      <p>${inquiry.region}，${inquiry.plot.sunlight}，${inquiry.plot.soil}，水源${inquiry.plot.water}。</p>
      <p>系统会按当前月份和地块条件筛选品种。</p>
    </article>
    <article class="card">
      <h3>预估费用</h3>
      <div class="metric">${plan.total.estimatedCostText}</div>
      <p>建议总面积 ${plan.total.areaText}。该金额是意向预估，最终报价由主理人核地后确认。</p>
      <a class="pay-link" href="#compliance">查看承接边界</a>
    </article>
    <article class="card">
      <h3>推荐组合</h3>
      <ul>${plan.recommendations
        .map(
          (item) =>
            `<li>${item.crop}：${item.areaText} / ${item.estimatedCostText} / 成熟约 ${item.cycleDays} 天 / 预计 ${item.expectedYieldText}</li>`
        )
        .join("")}</ul>
    </article>
    <article class="card">
      <h3>下一步</h3>
      <p>区域主理人：${plan.nextStep.areaContact.name}</p>
      <p>负责范围：${plan.nextStep.areaContact.area}</p>
      <p>加微信：${plan.nextStep.wechatId}</p>
      <p>${plan.nextStep.message.replaceAll("\n", "<br>")}</p>
    </article>
    <article class="card">
      <h3>成熟后处理</h3>
      <ul>${plan.harvestOptions.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="card">
      <h3>合规边界</h3>
      <ul>${plan.compliance.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `;
  apiPreview.textContent = JSON.stringify(plan, null, 2);
}
