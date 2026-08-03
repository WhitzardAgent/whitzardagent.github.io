export type SupportedFramework = {
  id: string;
  name: string;
  productLabel: string;
  logoPath: string;
  sourceUrl: string;
};

export const supportedFrameworks: SupportedFramework[] = [
  { id: "langchain", name: "LangChain", productLabel: "LangChain", logoPath: "/assets/brands/frameworks/langchain.png", sourceUrl: "https://github.com/langchain-ai/langchain" },
  { id: "autogen", name: "AutoGen", productLabel: "Microsoft AutoGen", logoPath: "/assets/brands/frameworks/autogen.png", sourceUrl: "https://github.com/microsoft/autogen" },
  { id: "openai-agents", name: "OpenAI Agents", productLabel: "OpenAI Agents SDK", logoPath: "/assets/brands/frameworks/openai-agents.png", sourceUrl: "https://github.com/openai/openai-agents-python" },
  { id: "langgraph", name: "LangGraph", productLabel: "LangGraph", logoPath: "/assets/brands/frameworks/langgraph.png", sourceUrl: "https://github.com/langchain-ai/langgraph" },
  { id: "llamaindex", name: "LlamaIndex", productLabel: "LlamaIndex", logoPath: "/assets/brands/frameworks/llamaindex.png", sourceUrl: "https://github.com/run-llama/llama_index" },
  { id: "dify", name: "Dify", productLabel: "Dify", logoPath: "/assets/brands/frameworks/dify.png", sourceUrl: "https://github.com/langgenius/dify" },
  { id: "openclaw", name: "OpenClaw", productLabel: "OpenClaw", logoPath: "/assets/brands/frameworks/openclaw.png", sourceUrl: "https://github.com/openclaw/openclaw" },
];
