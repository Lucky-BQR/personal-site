export default function CaseStudySection({ id, number, eyebrow, title, children }: { id: string; number: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="project-story-section" aria-labelledby={`${id}-title`}>
      <header>
        <span>{number}</span>
        <div>
          <p>{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
      </header>
      <div className="project-story-body">{children}</div>
    </section>
  );
}
