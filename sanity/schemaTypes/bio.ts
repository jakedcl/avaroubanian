import { defineField, defineType } from 'sanity';

/** Legacy type — edit bio in Site settings. Kept for existing content only. */
export default defineType({
  name: 'bio',
  title: 'Bio (legacy)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Legacy field. Use Site settings → Home page intro instead.',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      description: 'Legacy field. Use Site settings → Home page intro instead.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
    }),
  ],
}); 