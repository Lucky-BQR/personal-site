import styles from './CoreUserJourney.module.css';

const steps = [
  {
    role: '用户',
    title: '提出目标',
    description: '说明想解决的问题、期望结果与必要限制。',
  },
  {
    role: 'AI',
    title: '澄清上下文',
    description: '识别缺失信息，只询问会影响结果的关键问题。',
  },
  {
    role: 'AI',
    title: '形成计划',
    description: '给出执行步骤、所需工具、风险与确认点。',
  },
  {
    role: '用户',
    title: '确认关键步骤',
    description: '修改、批准或终止计划，保留最终决定权。',
  },
  {
    role: 'AI + 工具',
    title: '执行任务',
    description: '调用研究、文档与知识工具，并反馈执行状态。',
  },
  {
    role: '系统',
    title: '整理结果',
    description: '提供结果、来源、执行记录和仍待解决的问题。',
  },
  {
    role: '用户',
    title: '判断并继续',
    description: '接受结果、提出调整，或开启下一轮协作。',
  },
] as const;

export default function CoreUserJourney() {
  return (
    <figure className={styles.journey} aria-labelledby="core-journey-caption">
      <div className={styles.overview}>
        <div>
          <span>Input</span>
          <strong>目标 · 限制 · 可用资料</strong>
        </div>
        <div>
          <span>Control</span>
          <strong>用户确认 · 可修改 · 可终止</strong>
        </div>
        <div>
          <span>Output</span>
          <strong>结果 · 来源 · 记录 · 下一步</strong>
        </div>
      </div>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li className={styles.step} data-role={step.role} key={step.title}>
            <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.stepRole}>{step.role}</span>
            <div className={styles.stepBody}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.memory}>
        <span>Long-term Context</span>
        <p>经过用户确认的目标、重要决策和项目进度，成为下一次协作的上下文，而不是保存全部对话。</p>
      </div>

      <figcaption className={styles.caption} id="core-journey-caption">
        核心原则：AI 推动任务向前，用户掌握目标、关键确认与最终判断。
      </figcaption>
    </figure>
  );
}
