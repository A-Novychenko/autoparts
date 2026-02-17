export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  viewMode: GalleryViewMode;
};

type BreadcrumbItem = {
  name: string;
  slug: string;
};
