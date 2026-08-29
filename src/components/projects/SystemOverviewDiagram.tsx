const domains = [
  { number: '01', name: '创造', description: '项目、写作、产品实践' },
  { number: '02', name: '整理', description: '文档、任务、自动化流程' },
  { number: '03', name: '求知', description: '学习、研究、阅读整理' },
  { number: '04', name: '观照', description: '复盘、思考、长期成长' },
];

const loopSteps = [
  '用户提出目标',
  'AI 理解并形成计划',
  '关键步骤由用户确认',
  '调用工具执行任务',
  '整理执行结果',
  '沉淀到个人知识系统',
  '返回给用户继续判断和创造',
];

export default function SystemOverviewDiagram() {
  return (
    <figure className="system-overview-figure">
      <div className="system-overview-canvas">
        <header className="system-overview-header">
          <div>
            <span>System Overview</span>
            <strong>个人 AI 智能助手</strong>
          </div>
          <p>产品蓝图 · v0.2</p>
        </header>

        <section className="system-overview-map" aria-label="个人 AI 智能助手系统概念图">
          <div className="system-owner-node">
            <span className="system-node-label">决策中心</span>
            <strong>用户</strong>
            <p>目标、价值与最终判断</p>
            <small>人始终拥有最终决定权</small>
          </div>

          <div className="system-domain-heading">
            <span>Use Domains</span>
            <p>AI 服务于真实生活与创造，而不是替代人</p>
          </div>

          <div className="system-domain-layout">
            <div className="system-domain-column system-domain-column-left">
              {domains.slice(0, 2).map((domain) => (
                <article className="system-domain-node" key={domain.name}>
                  <span>{domain.number}</span>
                  <div>
                    <h3>{domain.name}</h3>
                    <p>{domain.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="system-assistant-core">
              <span>AI Collaborator</span>
              <div className="system-core-mark" aria-hidden="true">竹</div>
              <h2>AI 智能助手</h2>
              <p>理解 · 计划 · 编排 · 确认</p>
              <small>让想法成为可追踪的行动</small>
            </div>

            <div className="system-domain-column system-domain-column-right">
              {domains.slice(2).map((domain) => (
                <article className="system-domain-node" key={domain.name}>
                  <span>{domain.number}</span>
                  <div>
                    <h3>{domain.name}</h3>
                    <p>{domain.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="system-foundation-heading">
            <span>System Foundation</span>
            <p>长期上下文提供理解，工具能力负责执行</p>
          </div>

          <div className="system-foundations">
            <article className="system-foundation-node system-knowledge-node">
              <span>双向记忆</span>
              <h3>个人知识与长期上下文</h3>
              <p>项目记录、学习笔记、个人偏好、历史决策</p>
            </article>
            <article className="system-foundation-node system-tools-node">
              <span>执行能力</span>
              <h3>工具能力</h3>
              <p>网页研究、文档处理、知识检索、自动化工具</p>
            </article>
          </div>
        </section>

        <section className="system-collaboration-loop" aria-labelledby="collaboration-loop-title">
          <header>
            <span>Human-in-the-loop</span>
            <h2 id="collaboration-loop-title">一次完整的协作循环</h2>
          </header>
          <ol>
            {loopSteps.map((step, index) => (
              <li key={step} className={index === 2 ? 'is-confirmation' : undefined}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <figcaption>
        <span>System Overview · v0.2</span>
        <p>产品蓝图阶段：这张图说明系统边界与协作方式，不代表相关功能已经实现。</p>
      </figcaption>
    </figure>
  );
}
