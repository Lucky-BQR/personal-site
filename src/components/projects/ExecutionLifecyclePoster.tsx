import ZoomablePoster from './ZoomablePoster';

export default function ExecutionLifecyclePoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-execution-lifecycle-poster.png"
      alt="AI 智能助手任务执行生命周期图：任务依次经过新建、澄清、计划、确认、准备、执行、验收和完成；执行中可以进入等待补充、执行失败、暂停或终止状态，并从安全检查点恢复"
      label="Task Execution Lifecycle · v0.1"
      caption="白底状态图解：说明任务如何推进、何时等待用户，以及失败后如何安全恢复。"
    />
  );
}
