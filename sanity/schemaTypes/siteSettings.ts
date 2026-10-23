import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      description: 'Shown when someone taps Contact on your site. Visitors can email you or copy this address.',
      type: 'string',
      validation: (Rule) =>
        Rule.required().email().error('Enter a valid email address (for example name@email.com).'),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram link',
      description: 'Full link to your Instagram profile. Shown in the site sidebar.',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }).error('Paste your full Instagram URL.'),
    }),
    defineField({
      name: 'bioTitle',
      title: 'Home page name line',
      description: 'Optional. Your site already shows your name in the menu; use this only if you want a different line on the home hero.',
      type: 'string',
    }),
    defineField({
      name: 'bioContent',
      title: 'Home page intro text',
      description: 'Short paragraph visitors see at the top of your home page.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'bioImages',
      title: 'Home page hero image',
      description: 'The first image here is shown large at the top of your home page. Leave empty to use the first Photography image.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
