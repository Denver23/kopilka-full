import {AppStateType} from "../store";
import {ProductListItemType} from "../../types/types";

export const GetCategoriesListLoading = (state: AppStateType): boolean => {
    return state.categoriesListReducer.loading;
};

export const GetCategoriesList = (state: AppStateType): Array<ProductListItemType> => {
    return state.categoriesListReducer.categoriesList;
};

export const GetCategoriesQuantity = (state: AppStateType): number => {
    return state.categoriesListReducer.categoriesQuantity;
};