import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArchitectureBlock from '@/components/projects/ArchitectureBlock';
import CaseStudySection from '@/components/projects/CaseStudySection';
import CoreUserJourney from '@/components/projects/CoreUserJourney';
import CoreDataModelPoster from '@/components/projects/CoreDataModelPoster';
import DataArchitecturePoster from '@/components/projects/DataArchitecturePoster';
import ExecutionLifecyclePoster from '@/components/projects/ExecutionLifecyclePoster';
import MvpScopeMap from '@/components/projects/MvpScopeMap';
import ProductInformationArchitecturePoster from '@/components/projects/ProductInformationArchitecturePoster';
import ReflectionSection from '@/components/projects/ReflectionSection';
import SecurityPermissionPoster from '@/components/projects/SecurityPermissionPoster';
import TechnicalDeploymentPoster from '@/components/projects/TechnicalDeploymentPoster';
import WorkspaceInteractionPoster from '@/components/projects/WorkspaceInteractionPoster';
import { getProject, getProjects } from '@/lib/content/projects';
import { JsonLd } from '@/lib/seo/jsonld';
import { createProjectMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, projectSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? createProjectMetadata(project) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <div className="project-case-page container-main">
      <JsonLd schema={[
        projectSchema(project.title, project.summary, project.slug),
        breadcrumbSchema([
          { name: '首页', path: '/' },
          { name: '项目', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ]),
      ]} />
      <Link href="/projects" className="project-case-back"><span aria-hidden="true">←</span> 返回项目</Link>
      <header className="project-case-hero motion-reveal">
        <div className="project-case-heading">
          <p className="project-case-eyebrow"><span aria-hidden="true" /> {project.category} · Case Study</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="project-case-tags">
            {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
        </div>

        <dl className="project-case-facts" aria-label="项目概览">
          <div>
            <dt>Status</dt>
            <dd><span aria-hidden="true" /> {project.stage}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>{project.focus}</dd>
          </div>
        </dl>
      </header>
      <div className="project-case-statement">
        <span>01</span>
        <p>{project.overview}</p>
        <span aria-hidden="true">↘</span>
      </div>

      <div className="project-case-story">
        <aside className="project-case-index" aria-label="案例章节">
          <p>Case Index</p>
          <nav>
            <a href="#context"><span>01</span> 背景</a>
            <a href="#journey"><span>02</span> 流程</a>
            <a href="#mvp"><span>03</span> 范围</a>
            <a href="#architecture"><span>04</span> 架构</a>
            <a href="#data"><span>05</span> 数据</a>
            <a href="#data-model"><span>06</span> 模型</a>
            <a href="#execution"><span>07</span> 执行</a>
            <a href="#security"><span>08</span> 安全</a>
            <a href="#technical"><span>09</span> 技术</a>
            <a href="#product-ia"><span>10</span> 界面</a>
            <a href="#workspace-interaction"><span>11</span> 交互</a>
            <a href="#reflection"><span>12</span> 反思</a>
          </nav>
        </aside>

        <div className="project-case-content">
          <CaseStudySection id="context" number="01" eyebrow="Context" title="从真实问题出发">
            <p>{project.challenge}</p>
            <div className="project-context-principles">
              <div><span>Problem</span><strong>重复工作占据创造时间</strong></div>
              <div><span>Intent</span><strong>让 AI 进入可执行工作流</strong></div>
              <div><span>Boundary</span><strong>保留人的判断与决定</strong></div>
            </div>
          </CaseStudySection>

          <CaseStudySection id="journey" number="02" eyebrow="Core Journey" title="从目标到可继续的结果">
            <p>第一版先跑通一条完整协作路径，让每一步的责任、输入和输出都足够清楚。</p>
            <CoreUserJourney />
          </CaseStudySection>

          <CaseStudySection id="mvp" number="03" eyebrow="MVP Scope" title="第一版只验证一条闭环">
            <p>先证明系统能够可靠地陪用户完成一个真实项目，再逐步扩展更复杂的智能与连接能力。</p>
            <MvpScopeMap />
          </CaseStudySection>

          <CaseStudySection id="architecture" number="04" eyebrow="Functional Architecture" title="第一版如何完成一次协作">
            <p>系统围绕任务编排展开：用户通过交互层控制方向，工具与上下文提供支撑，安全控制贯穿全过程。</p>
            <ArchitectureBlock />
          </CaseStudySection>

          <CaseStudySection id="data" number="05" eyebrow="Data & Memory Architecture" title="哪些数据会成为长期记忆">
            <p>对话只服务于当前协作；经过筛选、组织并由用户确认的信息，才进入可管理的项目数据与长期记忆。</p>
            <DataArchitecturePoster />
          </CaseStudySection>

          <CaseStudySection id="data-model" number="06" eyebrow="Core Data Model" title="系统需要保存哪些核心对象">
            <p>数据流最终要落到稳定的实体关系中：项目组织长期工作，任务与步骤承载执行，会话、资料、引用、记忆和审计共同保持上下文可追踪。</p>
            <CoreDataModelPoster />
          </CaseStudySection>

          <CaseStudySection id="execution" number="07" eyebrow="Task Execution Lifecycle" title="一个任务如何被安全地推进">
            <p>系统用明确的任务状态协调用户、AI 与工具：正常路径持续向前，异常路径可见、可恢复，关键节点始终等待用户判断。</p>
            <ExecutionLifecyclePoster />
          </CaseStudySection>

          <CaseStudySection id="security" number="08" eyebrow="Security & Permission Model" title="AI 何时可以行动，何时必须停下">
            <p>系统不把“工具已连接”视为永久授权，而是针对每次具体操作判断真实影响，在自动执行、请求确认与拒绝执行之间作出可追踪的决定。</p>
            <SecurityPermissionPoster />
          </CaseStudySection>

          <CaseStudySection id="technical" number="09" eyebrow="Technical Deployment Architecture" title="第一版如何部署并可靠运行">
            <p>第一版以可维护和可恢复为优先：同步请求由模块化后端处理，耗时任务进入队列和独立 Worker，模型、工具与数据服务保持可替换的接入边界。</p>
            <TechnicalDeploymentPoster />
          </CaseStudySection>

          <CaseStudySection id="product-ia" number="10" eyebrow="Product Information Architecture" title="用户会在怎样的界面里完成工作">
            <p>产品以项目而不是聊天记录组织长期工作：用户在协作工作台中推进当前任务，并通过资料、记忆、活动记录和工具设置管理上下文与控制权。</p>
            <ProductInformationArchitecturePoster />
          </CaseStudySection>

          <CaseStudySection id="workspace-interaction" number="11" eyebrow="Workspace Interaction States" title="一次协作在界面中如何推进">
            <p>工作台不是持续增长的聊天记录，而是随任务状态变化的协作空间：用户提出目标、确认计划、观察执行并验收结果，每个关键节点都保留明确的控制权。</p>
            <WorkspaceInteractionPoster />
          </CaseStudySection>

          <ReflectionSection text={project.reflection} />
        </div>
      </div>


    </div>
  );
}
