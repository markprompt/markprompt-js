// Custom link mapping functions: https://markprompt.com/docs#link-mapping
if (typeof window !== 'undefined') {
  window.markprompt = {
    references: {
      // Example link mapping for references:
      // getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
      // getLabel: (reference) => reference.meta?.leadHeading?.value || reference.file?.title,
    },
    search: {
      // Example link mapping for search results (here a standard Algolia index):
      getHref: (result) => result.url,
      getHeading: (result) => result.hierarchy?.lvl0,
      getTitle: (result) => result.hierarchy?.lvl1,
      getSubtitle: (result) => result.hierarchy?.lvl2,
    },
  };
}
