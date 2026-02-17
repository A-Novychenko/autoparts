interface IGroup {
  _id: string;
  name: string;
  description: string | null;
  slug: string;
  parent: { $oid: string } | null;
  ancestors: Array<{
    _id: { $oid: string };
    name: string;
    slug: string;
  }>;
  img: string;
  isVisible: boolean;
}
interface IGroupAncestor {
  _id?: string;
  name: string;
  slug: string;
}

interface IBreadcrumbItem {
  name: string;
  slug: string;
}
