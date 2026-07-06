export interface Photo {
  id: string;
  url: string;
  blobPathname: string;
  width: number;
  height: number;
  createdAt: string;
  /** Crop anchor (0-100%) used as CSS object-position when the photo is
   * shown in a fixed-ratio box (e.g. the portfolio category card) and
   * doesn't match that box's aspect ratio. Defaults to center (50/50). */
  focalX?: number;
  focalY?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  coverPhotoId: string | null;
  photos: Photo[];
  order: number;
}

export interface LogoRef {
  url: string;
  blobPathname: string;
  updatedAt: string;
}

export interface PlanDetail {
  label: string;
  value: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  priceNote: string | null;
  details: PlanDetail[];
  order: number;
}

export interface PortfolioData {
  version: 1;
  categories: Category[];
  logo: LogoRef | null;
  plans: Plan[];
}
