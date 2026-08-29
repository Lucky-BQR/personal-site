import ZoomablePoster from './ZoomablePoster';

export default function WorkspaceInteractionPoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-workspace-interaction-poster.png"
      alt="AI 智能助手协作工作台四阶段交互图：用户依次提出目标、确认计划、查看执行过程并验收结果；每个阶段都展示系统状态、用户控制点、来源与记忆处理方式"
      label="Workspace Interaction States · v0.1"
      caption="白底交互蓝图：展示一次任务在协作工作台中的四个核心界面状态与用户控制点。"
      width={1600}
      height={1200}
    />
  );
}
