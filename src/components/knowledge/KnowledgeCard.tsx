import Link from 'next/link';
import type { KnowledgeNode } from '@/lib/knowledge';

export default function KnowledgeCard({ node, eyebrow }: { node: KnowledgeNode; eyebrow?: string }) {
  return (
    <Link href={node.route} className="card-base group block">
      <p className="card-meta mb-3">{eyebrow || `${node.kind} · ${node.date || node.year || 'ongoing'}`}</p>
      <h2 className="card-title mb-2">{node.title}</h2>
      {node.excerpt && <p className="card-description">{node.excerpt}</p>}
    </Link>
  );
}
