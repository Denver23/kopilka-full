import {AppStateType} from "../store";
import {ChildCategoryType, ProductInListType, RefineType} from "../../types/types";

export const GetProductGroupProducts = (state: AppStateType): Array<ProductInListType> => {
    return state.productGroupReducer.products;
}
export const GetURL = (state: AppStateType): string | null => {
    return state.productGroupReducer.url;
}

export const GetSlides = (state: AppStateType): Array<string> => {
    return state.productGroupReducer.slides;
}

export const GetProductGroupProductsLoading = (state: AppStateType): boolean => {
    return state.productGroupReducer.productsLoading;
}

export const GetProductGroupRefines = (state: AppStateType): Array<RefineType> => {
    return state.productGroupReducer.refines;
}
export const GetProductGroupProductsCount = (state: AppStateType): number | null => {
    return state.productGroupReducer.productCount;
}

export const GetProductGroupCategoriesList = (state: AppStateType): Array<ChildCategoryType> => {
    return state.productGroupReducer.childCategories;
}

export const GetProductGroupName = (state: AppStateType): string | null => {
    return state.productGroupReducer.name;
}

export const GetProductGroupLoading = (state: AppStateType): boolean => {
    return state.productGroupReducer.loading;
}

export const GetProductGroupBestSellers = (state: AppStateType): Array<ProductInListType> | undefined => {
    return state.productGroupReducer.bestSellers;
}

export const GetProductGroupReviews = (state: AppStateType): Array<{[key: string]: string}> | undefined => {
    return state.productGroupReducer.reviews;
}

export const GetProductsOnPage = (state: AppStateType): number => {
    return state.productGroupReducer.productsOnPage;
}