export interface ProjectCaseStudy {
  slug: string;
  title: string;
  summary: string;
  year: string;
  category: string;
  technologies: string[];
  challenge: string;
  architecture: string[];
  reflection: string;
  featured?: boolean;
}
