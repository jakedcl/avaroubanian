import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'visual',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Name of this artwork collection (will appear as a subtab)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first (like z-index)',
      type: 'number',
      initialValue: 100, // Default value for existing collections
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Add artwork to this collection. Drag and drop to reorder.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          }
        }
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
  },
}); 