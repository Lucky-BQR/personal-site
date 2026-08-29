import ZoomablePoster from './ZoomablePoster';

export default function TechnicalDeploymentPoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-technical-deployment-poster.png"
      alt="AI 智能助手技术部署架构图：Web 客户端通过接入层访问模块化后端，后端包含对话、任务编排、权限策略和上下文记忆模块；长任务进入队列，由独立 Worker 和工具适配层执行，并访问关系数据库、向量索引、对象存储、缓存、模型网关和外部工具；日志、指标、链路追踪、审计和告警覆盖全流程"
      label="Technical Deployment Architecture · v0.1"
      caption="白底部署图解：说明第一版的计算单元、异步执行、数据服务与可观测性。"
    />
  );
}
