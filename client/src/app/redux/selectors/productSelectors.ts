import {AppStateType} from "../store";
import {ChildProductType, productImage, ProductInListType} from "../../types/types";

export const GetChildProducts = (state: AppStateType): Array<ChildProductType> => {
    return state.productReducer.childProducts;
}

export const GetProductBrandImage = (state: AppStateType): string => {
    return state.productReducer.productBrandImage;
}

export const GetProductShortDescription = (state: AppStateType): string => {
    return state.productReducer.shortDescription;
}

export const GetProductFeatures = (state: AppStateType): string => {
    return state.productReducer.features;
}

export const GetProductSpecifications = (state: AppStateType): string => {
    return state.productReducer.specifications;
}

export const GetProductImages = (state: AppStateType): Array<productImage> => {
    return state.productReducer.images;
}

export const GetRecommendedProducts = (state: AppStateType): Array<ProductInListType> => {
    return state.productReducer.recommendedProducts;
}

export const GetBrand = (state: AppStateType): string => {
    return state.productReducer.brand;
}

export const GetCategory = (state: AppStateType): string => {
    return state.productReducer.category;
}

export const GetProductTitle = (state: AppStateType): string => {
    return state.productReducer.productTitle;
}

export const GetProductLoading = (state: AppStateType): boolean => {
    return state.productReducer.loading;
}

export const GetProductId = (state: AppStateType): string | null => {
    return state.productReducer.id;
}