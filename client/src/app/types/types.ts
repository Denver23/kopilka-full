export type PropertiesType<T> = T extends {[key: string]: infer U} ? U : never;
export type GetActionsTypes<T extends {[key: string]: (...args: any[]) => any}> = ReturnType<PropertiesType<T>>

export type ProductRouteType = {
    brand: string,
    id: string
}

export type ProductGroupRouteType = {
    search: string,
    brand?: string,
    category?: string
}

export type FieldType = {
    name: string,
    forType?: string
}

export type MainMenuItem = {
    title: string,
    url: string
}

export type productImage = {
    _id?: string,
    original: string,
    thumbnail: string,
    alt: string
}

export type localStorageProductType ={
    sku: string,
    id: string,
    quantity: number
}

export type BrandType = {
    name: string,
    url: string
}

export type ProductInListType = {
    id: string,
    brandUrl: string,
    brand: string,
    productTitle: string,
    price: string,
    additional: string,
    imageUrl: string,
}

export type ChangeProfileDataType = {
    name: string,
    surname: string,
    login: string,
    email: string,
    phone: string
}

export type InitializeProductsType = {
    id: string,
    brand: string,
    sku: string,
    quantity: number
}

export type CheckoutProduct = {
    productId: string,
    sku: string,
    quantity: number
}

export type PrGroupDataType = {
    name: string | null,
    url: string | null,
    productCount: number | null,
    products: Array<ProductInListType>,
    refines: Array<RefineType>,
    childCategories: Array<ChildCategoryType>,
    reviews?: Array<{[key: string]: string}>,
    bestSellers?: Array<ProductInListType> | undefined,
    slides: Array<string>
}

export type RefineType = {
    items: Array<string>,
    title: string,
    type: string
}

export type ChildCategoryType = {
    name: string,
    url: string,
    childCategories: Array<{
        name: string,
        url: string
    }>
}

export type SetProductType = {
    id: string | null,
    brand: string,
    category: string,
    productTitle: string,
    childProducts: Array<ChildProductType>,
    images: Array<{
        _id?: string,
        original: string,
        thumbnail: string,
        alt: string
    }>,
    productBrandImage: string,
    shortDescription: string,
    specifications: string,
    features: string,
    recommendedProducts: Array<ProductInListType>
}

export type ChildProductType = {
    _id: string,
    sku: string,
    price: number,
    quantity: number,
    options: {[key: string]: string}
}

export type ProductTypeAPI = {
    id: string,
    brand: string,
    sku: string,
    price: number,
    productTitle: string,
    thumbnail: string,
    avaibility: boolean,
    options: { [key: string]: string | number}
}

export type ProductType = {
    id: string,
    brand: string,
    sku: string,
    price: number,
    productTitle: string,
    thumbnail: string,
    avaibility: boolean,
    options: { [key: string]: string | number},
    quantity: number
}

export type OptionType = {
    name: string,
    forType: string
}

export type SearchProductType = {
    id: string,
    brand: string,
    productTitle: string,
    image: string
}

export type TopMenuObjectType = {
    categoryTitle: string,
    url: string,
    hasPtypes: boolean,
    ptypesList: Array<{
        ptypeTitle: string,
        url: string
    }>
}