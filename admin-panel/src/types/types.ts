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
    brand: string,
    category: string,
    productTitle: string,
    hidden: boolean,
    childProducts: Array<ChildProductType>,
    images: Array<productImage>,
    customFields: Array<{[key: string]: Array<string>}>,
    shortDescription: string,
    specifications: string,
    features: string,
    recommendedProducts: Array<ProductInListType>,
    productCategoryCustomFields: Array<RefineType>
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

export type RefineType = {
    items: Array<string>,
    title: string,
    type: string
}

export type SaveProductType = {
    id: string,
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