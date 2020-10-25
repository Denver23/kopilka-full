export type PropertiesType<T> = T extends {[key: string]: infer U} ? U : never;
export type GetActionsTypes<T extends {[key: string]: (...args: any[]) => any}> = ReturnType<PropertiesType<T>>

export type ProductInListType = {
    id: string,
    brandUrl: string,
    brand: string,
    productTitle: string,
    price: string,
    additional: string,
    imageUrl: string,
}

export type SetProductType = {
    id: string | null,
    brand: string | null,
    category: string | null,
    productTitle: string | null,
    hidden: boolean,
    childProducts: Array<ChildProductType>,
    images: Array<productImage>,
    customFields: Array<{[key: string]: Array<string>}>,
    shortDescription: string | null,
    specifications: string | null,
    features: string | null,
    recommendedProducts: Array<ProductInListType>,
    productCategoryCustomFields: Array<RefineType>
}

export type SetCategoryType = {
    id: string | null,
    categoryName: string | null,
    url: string | null,
    hidden: boolean,
    childCategories: Array<ChildCategoryType>,
    slides: Array<string>,
    refines: Array<CategoryRefineType>,
    bestSellers: Array<ProductInListType>,
    productsQuantity: number
}

export type ChildCategoryType = {
    _id: string,
    name: string | null,
    url: string | null,
    hidden: boolean,
    childCategories: Array<string>,
    slides: Array<string>,
    refines: Array<CategoryRefineType>,
    bestSellers: Array<ProductInListType>,
    productsQuantity?: number
}

export type ChildProductType = {
    sku: string,
    price: number,
    quantity: number,
    options: {[key: string]: string}
}

export type productImage = {
    _id: string,
    original: string,
    thumbnail: string,
    alt: string
}
export type productImageTable = {
    _id: string,
    key: number,
    src: string,
    alt: string,
    showImage: string,
    thumbnail: string
}

export type categorySlideTable = {
    src: string,
    showImage: string,
}

export type productCustomField = {
    customFieldName: string,
    customFieldTags: Array<string>,
    warningStyle: boolean
}

export type ProductRouteType = {
    id: string
}

export type ProductsListRouteType = {
    page: string
}

export type ProductListItemType = {
    _id: string,
    key: string,
    brand: string,
    category: string,
    productTitle: string,
    hidden: boolean
}

export type CategoriesListItemType = {
    _id: string,
    key: string,
    name: string,
    url: string,
    childsQuantity: number,
    hidden: boolean
}

export type RefineType = {
    items: Array<string>,
    title: string,
    type: string
}

export type SaveProductType = {
    id?: string,
    brand: string,
    category: string,
    productTitle: string,
    hidden: boolean,
    childProducts: Array<ChildProductType>,
    images: Array<productImage>,
    customFields: Array<{[key: string]: Array<string>}>,
    shortDescription: string,
    specifications: string,
    features: string
}

export type SaveCategoryType = {
    id: string,
    categoryName: string,
    url: string,
    hidden: boolean,
    childCategories: Array<string>,
    slides: Array<string>,
    refines: Array<CategoryRefineType>,
    bestSellers: Array<ProductInListType>
}

export type categoryRequestObjectType = {
    brand?: string,
    productTitle?: string,
    category?: string
}

export type categoriesListRequestObjectType = {
    name?: string,
    url?: string
}

export type changeProductsParamsTypes = {
    [key in ProductPropsTypes]?: any
}

export type ProductPropsTypes = 'brand'|'category'|'hidden' | 'delete';

export type CategoryRefineType = {
    items: Array<string>,
    _id?: string,
    title: string,
    type: string
}