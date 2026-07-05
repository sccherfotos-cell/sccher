export interface Photo {
  id: string;
  url: string;
  blobPathname: string;
  width: number;
  height: number;
  createdAt: string;
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

export interface PortfolioData {
  version: 1;
  categories: Category[];
  logo: LogoRef | null;
}
