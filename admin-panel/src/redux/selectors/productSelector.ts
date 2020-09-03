import {AppStateType} from "../store";
import {ChildProductType, productImage, RefineType} from "../../types/types";

export const GetProductBrand = (state: AppStateType): string | null => {
    return state.productReducer.brand;
}

export const GetProductId = (state: AppStateType): string | null => {
    return state.productReducer.id;
}

export const GetProductLoading = (state: AppStateType): boolean => {
    return state.productReducer.loading;
}

export const GetProductTitle = (state: AppStateType): string | null => {
    return state.productReducer.productTitle;
}

export const GetProductCategory = (state: AppStateType): string | null => {
    return state.productReducer.category;
}

export const GetProductImages = (state: AppStateType): Array<productImage> => {
    return state.productReducer.images;
}

export const GetProductShortDescription = (state: AppStateType): string | null => {
    return state.productReducer.shortDescription;
}

export const GetProductSpecifications = (state: AppStateType): string | null => {
    return state.productReducer.specifications;
}

export const GetProductFeatures = (state: AppStateType): string | null => {
    return state.productReducer.features;
}

export const GetProductCustomFields = (state: AppStateType): Array<{[key: string]: Array<string>}> => {
    return state.productReducer.customFields;
}

export const GetNewCategoryProductCustomFields = (state: AppStateType): Array<RefineType> => {
    return state.productReducer.productCategoryCustomFields;
}

export const GetChildProducts = (state: AppStateType): Array<ChildProductType> => {
    return state.productReducer.childProducts;
}

