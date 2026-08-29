import ZoomablePoster from './ZoomablePoster';

export default function DataArchitecturePoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-data-architecture-poster.png"
      alt="AI 智能助手数据与记忆架构图：用户输入与外部资料经过上下文构建器形成当前任务上下文，为任务编排提供信息；候选记忆经用户确认后分别进入项目、知识、长期记忆和执行记录，用户可以查看、修正、删除和导出"
      label="Data & Memory Architecture · v0.1"
      caption="白底数据图解：说明任务上下文、候选记忆、长期数据与用户控制之间的关系。"
    />
  );
}
