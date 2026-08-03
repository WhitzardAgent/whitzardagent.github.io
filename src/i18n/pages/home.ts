import type { Locale } from "../config";

export type HomeCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
    visualLabel: string;
    risk: string;
    decision: string;
    outcome: string;
  };
  manifesto: string;
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
        "Evaluate, govern, and protect AI agents across reasoning, tool use, identity, and data flow while preserving the autonomy that makes them valuable.",
      primary: "Book a Demo",
      secondary: "Explore AgentGuard",
      visualLabel: "LIVE RUNTIME TRACE",
      risk: "Sensitive data requested outside task scope",
      decision: "CORRECT",
      outcome: "ALLOWED WITH POLICY",
    },
    manifesto: "Autonomy thrives inside a trustworthy security boundary.",
    risk: {
      eyebrow: "A NEW CONTROL PLANE",
      title: "Agents turn model outputs into real-world actions.",
      intro:
        "A single input-output filter cannot understand risk that develops across plans, permissions, tools, and data.",
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
      closing: "What an agent does next determines how risk evolves.",
    },
    platform: {
      eyebrow: "AGENTGUARD PLATFORM",
      title: "Four layers. One runtime security system.",
      intro:
        "AgentGuard connects to the agent, reasons over its complete trajectory, operates the security program, and continuously improves the underlying models and evidence.",
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
      fusion: "DSL Rules × Lightweight Safety Model × Frontier Model",
      decisions: ["Allow", "Correct", "Approve", "Redact", "Limit", "Block"],
    },
    loop: {
      eyebrow: "NVWA LAB × AGENTGUARD",
      title: "NVWA Lab powers the AgentGuard product line.",
      statement:
        "Frontier safety research defines risks and builds evaluation evidence. AgentGuard turns that work into runtime control, and deployment evidence returns as new research questions.",
      lab: {
        name: "NVWA Lab",
        role: "Frontier AI Safety Research Engine",
        items: [
          "Frontier risk definition",
          "Evaluation methods & evidence",
          "Safety model research",
        ],
        link: "Explore NVWA Lab",
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
      title: "Control stays close to the systems it protects.",
      intro:
        "Deploy AgentGuard with the integration and data boundary your environment requires.",
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
      title: "Open evidence behind the platform.",
      intro:
        "Explore representative tools, models, and evaluation infrastructure from the WhitzardAgent ecosystem.",
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
      title: "Whitzard 白泽 — 智能体安全基础设施",
      description:
        "Whitzard 统一评测、理解并控制企业智能体的模型推理、工具调用、身份权限与数据流转。",
    },
    hero: {
      eyebrow: "智能体安全基础设施",
      title: "守其边界，行其智能",
      description:
        "让智能体在安全边界内自主行动。统一评测、理解并控制模型推理、工具调用、身份权限与数据流转。",
      primary: "预约产品演示",
      secondary: "查看 AgentGuard",
      visualLabel: "实时运行轨迹",
      risk: "敏感数据请求超出当前任务范围",
      decision: "纠正",
      outcome: "在策略约束下允许",
    },
    manifesto: "让自主性在可信安全边界内充分释放。",
    risk: {
      eyebrow: "新型安全控制面",
      title: "智能体让模型输出成为真实行动。",
      intro:
        "单次输入输出检测无法理解跨计划、权限、工具和数据逐步形成的运行时风险。",
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
      closing: "智能体下一步采取的行动决定风险如何演化。",
    },
    platform: {
      eyebrow: "AGENTGUARD 平台",
      title: "四层能力，一个运行时安全系统",
      intro:
        "AgentGuard 接入智能体，理解完整运行轨迹，持续运营安全能力，并用研究与部署反馈改进模型和证据。",
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
      fusion: "DSL 规则 × 轻量安全模型 × 前沿大模型",
      decisions: ["允许", "纠正", "审批", "脱敏", "限制", "阻断"],
    },
    loop: {
      eyebrow: "NVWA LAB × AGENTGUARD",
      title: "NVWA Lab 驱动 AgentGuard 智能体安全产品线",
      statement:
        "前沿安全研究定义风险并建设评测证据，AgentGuard 将研究转化为运行时控制，企业部署证据持续形成新的研究问题。",
      lab: {
        name: "NVWA Lab",
        role: "前沿 AI 安全研究引擎",
        items: ["前沿风险定义", "评测方法与证据", "安全模型研究"],
        link: "了解 NVWA Lab",
      },
      bridge: {
        down: "风险定义 → 评测证据 → 安全模型",
        up: "部署证据 → 新型风险 → 研究迭代",
      },
      product: {
        name: "AgentGuard",
        role: "企业级智能体安全产品线",
        items: ["运行时安全控制", "私有化部署", "持续安全运营"],
        link: "了解 AgentGuard",
      },
      feedback: "研究形成控制能力，部署持续增强研究。",
    },
    enterprise: {
      eyebrow: "企业级部署",
      title: "让控制能力贴近它所保护的系统",
      intro: "根据企业架构与数据边界，以合适的方式部署 AgentGuard。",
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
      title: "支撑平台能力的开放证据",
      intro: "探索 WhitzardAgent 开放生态中的代表性工具、模型和评测基础设施。",
      viewAll: "查看开放生态",
    },
    cta: {
      eyebrow: "建立可信边界",
      title: "让企业放心部署和规模化使用智能体",
      body: "了解 AgentGuard 如何评测、控制并保护你正在投入生产的智能体系统。",
      primary: "预约产品演示",
      secondary: "联系 Whitzard",
    },
  },
};
