import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Edit your website')
    .items([
      S.listItem()
        .title('Site settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Photography')
        .child(
          S.documentTypeList('photography')
            .title('Photography collections')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Artwork')
        .child(
          S.documentTypeList('visual')
            .title('Artwork collections')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Audio')
        .child(
          S.documentTypeList('audio')
            .title('Audio collections')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
    ]);
