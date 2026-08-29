import ZoomablePoster from './ZoomablePoster';

export default function SecurityPermissionPoster() {
  return (
    <ZoomablePoster
      src="/projects/ai-assistant-security-permission-poster.png"
      alt="AI 智能助手安全与权限控制图：系统根据发起者、动作、资源、时间和真实外部影响进行权限决策；风险从只读观察、低风险可逆、对外代表用户、高影响敏感到禁止边界逐级提高，并分别采用自动执行、用户确认或拒绝执行"
      label="Security & Permission Model · v0.1"
      caption="白底权限图解：用决策流程和五级风险矩阵定义 AI 的行动边界。"
    />
  );
}
