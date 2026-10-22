import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'z85vvbbq';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const singletonTypes = new Set(['siteSettings']);

export default defineConfig({
  name: 'default',
  title: 'Ava Roubanian',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => template.id !== 'siteSettings'),
  },
  document: {
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate');
      }
      return prev;
    },
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((option) => option.templateId !== 'siteSettings');
      }
      return prev;
    },
  },
});
