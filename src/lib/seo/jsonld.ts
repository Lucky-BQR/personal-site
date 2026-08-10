import { articleSchema, personSchema, projectSchema, softwareSchema, websiteSchema } from './schema';
import React from 'react';
export const generatePersonSchema = personSchema;
export const generateWebsiteSchema = websiteSchema;
export const generateArticleSchema = articleSchema;
export const generateProjectSchema = projectSchema;
export const generateSoftwareSchema = softwareSchema;
export function JsonLd({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) { return React.createElement('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: JSON.stringify(schema) } }); }
