import ZoomablePoster from './ZoomablePoster';

export default function ArchitectureBlock() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-architecture-poster.png"
      alt="AI 智能助手功能架构图：用户通过交互层连接任务编排核心，编排核心协调工具能力层和上下文数据层，安全控制面覆盖全部系统模块"
      label="Functional Architecture Poster · v0.2"
      caption="白底架构图解：展示用户、交互层、编排核心、工具、上下文与安全控制面的关系。"
    />
  );
}
