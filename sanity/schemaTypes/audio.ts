import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'audio',
  title: 'Audio Collections',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      description: 'Name of this audio/video collection (will appear as a subtab)',
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
      title: 'Collection Description',
      type: 'text',
    }),
    defineField({
      name: 'tracks',
      title: 'Media Items',
      description: 'Add audio or video files to this collection. Drag and drop to reorder.',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Media Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'year',
              title: 'Year',
              type: 'number',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'coverImage',
              title: 'Cover Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'mediaFile',
              title: 'Audio/Video File',
              type: 'file',
              validation: (Rule) => Rule.required(),
              options: {
                accept: 'audio/*,video/*',
              },
            },
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Audio', value: 'audio' },
                  { title: 'Video', value: 'video' },
                ],
              },
              initialValue: 'audio',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'coverImage',
              subtitle: 'mediaType',
            },
            prepare({ title, media, subtitle }) {
              return {
                title: title || 'Untitled',
                media: media,
                subtitle: subtitle === 'video' ? '🎬 Video' : '🎵 Audio',
              };
            },
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'tracks.0.coverImage',
    },
  },
}); 