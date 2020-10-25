import {AppStateType} from "../store";
import {CategoryRefineType, ChildCategoryType, ProductInListType} from "../../types/types";

export const GetCategoryId = (state: AppStateType): string | null => {
    return state.categoryReducer.id;
};

export const GetCategoryBestSellers = (state: AppStateType): Array<ProductInListType> => {
    return state.categoryReducer.bestSellers;
};

export const GetCategoryProductsQuantity = (state: AppStateType): number => {
    return state.categoryReducer.productsQuantity;
};

export const GetCategoryUrl = (state: AppStateType): string | null => {
    return state.categoryReducer.url;
};

export const GetCategoryLoading = (state: AppStateType): boolean => {
    return state.categoryReducer.loading;
};

export const GetCategoryName = (state: AppStateType): string | null => {
    return state.categoryReducer.categoryName;
};

export const GetCategorySlides = (state: AppStateType): Array<string> => {
    return state.categoryReducer.slides;
};

export const GetCategoryRefines = (state: AppStateType): Array<CategoryRefineType> => {
    return state.categoryReducer.refines;
};

export const GetChildCategories = (state: AppStateType): Array<ChildCategoryType> => {
    return state.categoryReducer.childCategories;
};

export const GetCategoryHidden = (state: AppStateType): boolean => {
    return state.categoryReducer.hidden;
};

