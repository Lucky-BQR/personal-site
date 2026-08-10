import type { RelatedKnowledgeNode } from '@/lib/knowledge';
import KnowledgeCard from './KnowledgeCard';

const relationLabels = {
  related_to: '相关',
  part_of: '属于',
  inspired_by: '启发自',
  built_from: '构建自',
  continues: '延续',
  documents: '记录',
};

export default function RelatedKnowledge({ items }: { items: RelatedKnowledgeNode[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-16 border-t pt-10" style={{ borderColor: 'var(--color-border)' }} aria-labelledby="related-knowledge-title">
      <p className="type-meta mb-3" style={{ color: 'var(--color-accent)' }}>KNOWLEDGE CONNECTIONS</p>
      <h2 id="related-knowledge-title" className="type-heading mb-6">关联内容</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 spatial-card-grid">
        {items.map((item) => (
          <KnowledgeCard key={item.node.id} node={item.node} eyebrow={`${item.connections.map((connection) => connection.label || relationLabels[connection.relation]).join(' · ')} · ${item.node.kind}`} />
        ))}
      </div>
    </section>
  );
}
