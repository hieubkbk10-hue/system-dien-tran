export type CategoryProductsStyle = 'grid' | 'carousel' | 'cards' | 'bento' | 'magazine' | 'showcase';

export interface CategoryProductsSection {
  id: number;
  categoryId: string;
  itemCount: number;
}

export interface CategoryProductsConfig {
  sections: CategoryProductsSection[];
  style: CategoryProductsStyle;
  showViewAll: boolean;
  columnsDesktop: number;
  columnsMobile: number;
}

export interface CategoryProductsProduct {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  salePrice?: number;
  categoryId?: string;
}
