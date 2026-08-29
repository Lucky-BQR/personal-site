import ZoomablePoster from './ZoomablePoster';

export default function CoreDataModelPoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-core-data-model-poster.png"
      alt="AI 智能助手核心数据模型图：用户拥有项目，项目包含任务、会话和资料；任务包含步骤与确认记录，步骤产生工具执行记录；消息和执行结果通过引用连接资料，任务可以产生记忆条目，状态变化进入审计事件"
      label="Core Data Model · v0.1"
      caption="白底 ER 图解：用实体、关键字段和关系说明第一版的数据骨架。"
    />
  );
}
