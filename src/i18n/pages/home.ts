import type { Locale } from "../config";

export type HomeCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  manifesto: string;
  operations: {
    eyebrow: string;
    title: string;
    body: string;
    communityBadge: string;
    imageAlt: string;
    callouts: string[];
    queueLabel: string;
    fields: { request: string; risk: string; action: string; status: string; audit: string };
    cases: Array<{ id: string; label: string; request: string; risk: string; action: string; status: string; audit: string }>;
    cta: string;
  };
  risk: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: Array<{ title: string; body: string }>;
    closing: string;
  };
  platform: {
    eyebrow: string;
    title: string;
    intro: string;
    layers: Array<{
      index: string;
      title: string;
      body: string;
      items: string[];
    }>;
  };
  chains: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ short: string; title: string; body: string }>;
    fusion: string;
    decisions: string[];
  };
  loop: {
    eyebrow: string;
    title: string;
    statement: string;
    lab: { name: string; role: string; items: string[]; link: string };
    bridge: { down: string; up: string };
    product: { name: string; role: string; items: string[]; link: string };
    feedback: string;
  };
  enterprise: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
    diagram: string[];
  };
  ecosystem: { eyebrow: string; title: string; intro: string; viewAll: string };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
};

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    meta: {
      title: "Whitzard — AI Agent Security Infrastructure",
      description:
        "Whitzard evaluates, governs, and protects enterprise AI agents across reasoning, tool use, identity, and data flow.",
    },
    hero: {
      eyebrow: "AI AGENT SECURITY INFRASTRUCTURE",
      title: "Secure autonomy, by design.",
      description:
        "Evaluate and control agent reasoning, tools, identity, and data flow.",
      primary: "Book a Demo",
      secondary: "View the AgentGuard demo",
    },
    manifesto: "Unlock autonomous intelligence within secure boundaries",
    operations: {
      eyebrow: "AGENTGUARD ENTERPRISE",
      title: "Agent security operations center",
      body: "Turn runtime decisions into approval, response, policy, and audit workflows.",
      communityBadge: "Community Edition public interface",
      imageAlt: "AgentGuard Community dashboard showing traffic, approvals, policy matches, and audit events",
      callouts: ["Runtime traffic", "Pending approvals", "Policy matches", "Audit events"],
      queueLabel: "Security event queue",
      fields: { request: "Business request", risk: "Key risk", action: "AgentGuard response", status: "Current status", audit: "Audit evidence" },
      cases: [
        { id: "production", label: "Production change approval", request: "Diagnose an incident, generate a patch, and deploy to production.", risk: "Generated shell commands and irreversible production changes.", action: "Diagnosis and patch generation completed. AgentGuard degraded the command to preview and paused deployment for approval.", status: "Waiting for authorized approval", audit: "Trace · policy decision · change ticket" },
        { id: "egress", label: "Sensitive data egress", request: "Send a customer renewal summary to an approved adviser.", risk: "Derived output retains customer identity and contract lineage.", action: "AgentGuard removed sensitive fields and restricted the destination.", status: "Sanitized payload allowed", audit: "Lineage · field diff · destination" },
        { id: "injection", label: "External instruction injection", request: "Use an external guide to repair a production service.", risk: "Untrusted instructions propagated into a shell command.", action: "AgentGuard denied execution before the shell boundary.", status: "Command blocked; investigation open", audit: "Source label · matched chain rule · denied payload" },
      ],
      cta: "View the technical product demo",
    },
    risk: {
      eyebrow: "A NEW CONTROL PLANE",
      title: "The agent era creates a new security frontier",
      intro: "Once agents connect models, data, and business systems, risk develops across multi-step actions.",
      cards: [
        {
          title: "Autonomous planning",
          body: "Agents revise plans continuously as tasks, tool results, and context change.",
        },
        {
          title: "Delegated authority",
          body: "Agents invoke tools, access data, and act on behalf of users and systems.",
        },
        {
          title: "Runtime risk",
          body: "Harm emerges across plans, permissions, tools, data, and responses.",
        },
      ],
      closing: "Security control must cover the full path from intent to action",
    },
    platform: {
      eyebrow: "AGENTGUARD PLATFORM",
      title: "AgentGuard Security Engine",
      intro: "Connect, judge, respond, and operate across the complete agent runtime.",
      layers: [
        {
          index: "01",
          title: "Secure Connect",
          body: "Bring runtime security into the systems agents already use.",
          items: [
            "Framework hooks",
            "Tool & MCP proxy",
            "Dynamic identity",
            "Trusted sandbox",
          ],
        },
        {
          index: "02",
          title: "Runtime Intelligence",
          body: "Understand and intervene across thought, behavior, and data chains.",
          items: [
            "Thought alignment",
            "Behavior reasoning",
            "Data lineage",
            "Policy decisions",
          ],
        },
        {
          index: "03",
          title: "Evaluate & Operate",
          body: "Turn risk evidence into continuous security operations.",
          items: [
            "Automated red team",
            "Continuous evaluation",
            "Risk profiles",
            "Audit & response",
          ],
        },
        {
          index: "04",
          title: "Model & Data Foundation",
          body: "Improve safety models from research and deployment feedback.",
          items: [
            "Data factory",
            "Model training",
            "Risk knowledge",
            "Feedback optimization",
          ],
        },
      ],
    },
    chains: {
      eyebrow: "THREE-CHAIN INTELLIGENCE",
      title: "Understand the complete runtime trajectory.",
      intro:
        "AgentGuard reasons over three connected views of agent activity, then combines deterministic controls with model intelligence.",
      items: [
        {
          short: "Thought",
          title: "Thought chain alignment",
          body: "Identify and correct unsafe reasoning before it becomes action.",
        },
        {
          short: "Behavior",
          title: "Behavior chain reasoning",
          body: "Reason over multi-step, cross-tool, and cross-agent behavior.",
        },
        {
          short: "Data",
          title: "Data lineage tracking",
          body: "Track where sensitive data comes from, how it is used, and where it flows.",
        },
      ],
      fusion: "Rule Engine × Lightweight Safety Models × In-house Large Model",
      decisions: ["Allow", "Sanitize", "Align", "Degrade", "Approve", "Deny"],
    },
    loop: {
      eyebrow: "FRONTIER AI SAFETY RESEARCH",
      title: "Research drives continuous product evolution",
      statement: "NUWA Lab identifies and evaluates frontier risks, then turns them into AgentGuard evaluation, model, and control capabilities.",
      lab: {
        name: "NUWA Lab",
        role: "Frontier AI Safety Research Engine",
        items: [
          "Frontier risk definition",
          "Evaluation methods & evidence",
          "Safety model research",
        ],
        link: "Explore NUWA Lab",
      },
      bridge: {
        down: "Risk definition → Evaluation evidence → Safety models",
        up: "Deployment evidence → Emerging risks → Research iteration",
      },
      product: {
        name: "AgentGuard",
        role: "Enterprise Agent Security Product Line",
        items: [
          "Runtime security control",
          "Private deployment",
          "Continuous security operations",
        ],
        link: "Explore AgentGuard",
      },
      feedback:
        "Research becomes control. Deployment continuously strengthens research.",
    },
    enterprise: {
      eyebrow: "ENTERPRISE DEPLOYMENT",
      title: "Integrate with leading agent frameworks",
      intro: "Use runtime hooks to protect the existing stack inside the enterprise trust boundary.",
      items: [
        {
          title: "Low-intrusion integration",
          body: "Connect through SDK hooks, sidecars, or gateways while preserving the existing agent stack.",
        },
        {
          title: "Private deployment",
          body: "Keep sensitive runtime data and policy decisions inside your controlled environment.",
        },
        {
          title: "Layered intelligence",
          body: "Coordinate DSL rules, lightweight safety models, and frontier models by risk and latency.",
        },
        {
          title: "Explainable operations",
          body: "Trace decisions and interventions across the complete agent runtime.",
        },
      ],
      diagram: [
        "Agents",
        "AgentGuard Control Layer",
        "Models · Tools · MCP · Data · Sandbox",
      ],
    },
    ecosystem: {
      eyebrow: "WHITZARDAGENT",
      title: "Whitzard Open Ecosystem",
      intro: "Open agent frameworks, evaluation infrastructure, and safety models.",
      viewAll: "View the open ecosystem",
    },
    cta: {
      eyebrow: "BUILD THE BOUNDARY",
      title: "Deploy AI agents with confidence.",
      body: "See how AgentGuard can evaluate, govern, and protect the agent systems you are bringing into production.",
      primary: "Book a Demo",
      secondary: "Contact Whitzard",
    },
  },
  zh: {
    meta: {
      title: "白泽（Whitzard）— 智能体安全基础设施",
      description:
        "白泽（Whitzard）统一评测、理解并控制企业智能体的模型推理、工具调用、身份权限与数据流转。",
    },
    hero: {
      eyebrow: "企业级智能体安全基础设施",
      title: "守其边界，行其智能",
      description:
        "评测、控制并审计智能体的推理、工具、权限与数据流。",
      primary: "预约产品演示",
      secondary: "了解 AgentGuard Enterprise",
    },
    manifesto: "在安全边界内释放自主智能价值",
    operations: {
      eyebrow: "AGENTGUARD ENTERPRISE",
      title: "智能体安全运营中台",
      body: "将运行时判断转化为审批、响应、策略与审计流程。",
      communityBadge: "社区版公开界面",
      imageAlt: "AgentGuard 社区版控制台，展示运行流量、待审批、策略命中与审计事件",
      callouts: ["运行流量", "待审批", "策略命中", "审计事件"],
      queueLabel: "安全事件队列",
      fields: { request: "业务请求", risk: "关键风险", action: "AgentGuard 处置", status: "当前状态", audit: "审计证据" },
      cases: [
        { id: "production", label: "生产变更审批", request: "定位生产事故、生成补丁并发布生产变更。", risk: "模型生成命令与不可逆生产变更。", action: "诊断与补丁生成已完成；AgentGuard 已将命令降级为预览，并暂停生产发布等待审批。", status: "等待授权负责人审批", audit: "执行轨迹 · 策略判断 · 变更工单" },
        { id: "egress", label: "敏感数据外发", request: "向获批顾问发送客户续约摘要。", risk: "衍生结果保留客户身份与合同数据血缘。", action: "AgentGuard 已移除敏感字段，并限制外发目标。", status: "脱敏载荷已放行", audit: "数据血缘 · 字段差异 · 外发目标" },
        { id: "injection", label: "外部指令注入", request: "使用外部排障资料修复生产服务。", risk: "不可信指令传播为 Shell 命令。", action: "AgentGuard 已在 Shell 边界前阻断执行。", status: "命令已阻断，进入调查", audit: "来源标签 · 命中规则 · 阻断载荷" },
      ],
      cta: "查看完整技术演示",
    },
    risk: {
      eyebrow: "新型安全控制面",
      title: "智能体时代带来全新安全挑战",
      intro: "智能体连接模型、数据与业务系统后，风险会沿多步行动持续扩散。",
      cards: [
        {
          title: "自主规划",
          body: "智能体会根据任务、工具反馈和上下文持续调整计划。",
        },
        {
          title: "委托权限",
          body: "智能体能够调用工具、访问数据，并代表用户和系统执行操作。",
        },
        {
          title: "运行时风险",
          body: "风险会在计划、权限、工具、数据与响应之间组合形成。",
        },
      ],
      closing: "安全控制必须覆盖行动发生的全过程",
    },
    platform: {
      eyebrow: "AGENTGUARD 平台",
      title: "AgentGuard 智能体安全引擎",
      intro: "从接入、研判到处置与运营，统一保护智能体运行时。",
      layers: [
        {
          index: "01",
          title: "安全接入",
          body: "将运行时安全接入智能体已经使用的系统。",
          items: ["多框架 Hook", "工具与 MCP 代理", "动态身份权限", "可信沙箱"],
        },
        {
          index: "02",
          title: "智能防护",
          body: "理解并干预思维链、行为链和数据链。",
          items: ["思维链校准", "行为链推理", "数据链追踪", "策略处置"],
        },
        {
          index: "03",
          title: "评测运营",
          body: "将风险证据转化为持续安全运营。",
          items: ["自动红队", "持续评测", "风险画像", "审计响应"],
        },
        {
          index: "04",
          title: "模型底座",
          body: "用研究成果与部署反馈持续改进安全模型。",
          items: ["数据工厂", "模型训练", "风险知识", "反馈优化"],
        },
      ],
    },
    chains: {
      eyebrow: "三链智能",
      title: "理解完整运行轨迹",
      intro:
        "AgentGuard 关联智能体活动的三个视角，并将确定性控制与模型智能协同起来。",
      items: [
        {
          short: "思维",
          title: "思维链实时校准",
          body: "在行动发生前识别并纠正高风险推理。",
        },
        {
          short: "行为",
          title: "行为链风险推理",
          body: "关联跨步骤、跨工具和跨智能体的组合风险。",
        },
        {
          short: "数据",
          title: "数据链血缘追踪",
          body: "追踪敏感数据的来源、用途、流向和外泄边界。",
        },
      ],
      fusion: "规则引擎 × 轻量安全模型 × 自研大模型",
      decisions: ["允许", "脱敏", "校准", "降级", "审批", "阻断"],
    },
    loop: {
      eyebrow: "前沿 AI 安全研究",
      title: "研究驱动产品持续演进",
      statement: "女娲实验室持续识别、评估前沿风险，并转化为 AgentGuard 的评测、模型与控制能力。",
      lab: {
        name: "女娲实验室",
        role: "前沿 AI 安全研究引擎",
        items: ["前沿风险定义", "评测方法与证据", "安全模型研究"],
        link: "了解女娲实验室",
      },
      bridge: {
        down: "风险定义 → 评测证据 → 安全模型",
        up: "部署证据 → 新型风险 → 研究迭代",
      },
      product: {
        name: "AgentGuard",
        role: "企业级智能体安全解决方案",
        items: ["运行时安全控制", "私有化部署", "持续安全运营"],
        link: "了解 AgentGuard",
      },
      feedback: "研究形成控制能力，部署持续增强研究。",
    },
    enterprise: {
      eyebrow: "企业级部署",
      title: "低侵入适配各类主流智能体架构",
      intro: "通过运行时 Hook 接入现有技术栈，将控制部署在企业信任边界内。",
      items: [
        {
          title: "低侵入接入",
          body: "通过 SDK Hook、Sidecar 或 Gateway 接入，并保留现有智能体技术栈。",
        },
        {
          title: "私有化部署",
          body: "让敏感运行数据和策略决策保留在企业受控环境中。",
        },
        {
          title: "分层智能协同",
          body: "根据风险和延迟要求，协同 DSL 规则、轻量安全模型与前沿大模型。",
        },
        {
          title: "可解释安全运营",
          body: "追踪智能体完整运行过程中的判断、处置和审计证据。",
        },
      ],
      diagram: [
        "企业智能体",
        "AgentGuard 安全控制层",
        "模型 · 工具 · MCP · 数据 · 沙箱",
      ],
    },
    ecosystem: {
      eyebrow: "WHITZARDAGENT",
      title: "白泽开放生态",
      intro: "开放智能体框架、评测基础设施与安全模型。",
      viewAll: "查看开放生态",
    },
    cta: {
      eyebrow: "建立可信边界",
      title: "安全部署企业智能体",
      body: "以 AgentGuard 建立运行时控制边界。",
      primary: "预约产品演示",
      secondary: "联系白泽（Whitzard）",
    },
  },
};
