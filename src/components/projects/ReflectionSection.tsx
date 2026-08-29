export default function ReflectionSection({ text }: { text: string }) {
  return (
    <section id="reflection" className="project-reflection" aria-labelledby="project-reflection-title">
      <div className="project-reflection-mark" aria-hidden="true">“</div>
      <div>
        <p>12 · Reflection</p>
        <h2 id="project-reflection-title">创造之后，重新理解技术</h2>
        <blockquote>{text}</blockquote>
        <span>技术负责拓展可能，人负责决定方向。</span>
      </div>
    </section>
  );
}
