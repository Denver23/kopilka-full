import {AppStateType} from "../store";
import {ProductListItemType} from "../../types/types";

export const GetProductsListLoading = (state: AppStateType): boolean => {
    return state.productsListReducer.loading;
};

export const GetProductsList = (state: AppStateType): Array<ProductListItemType> => {
    return state.productsListReducer.productsList;
};

export const GetProductsQuantity = (state: AppStateType): number => {
    return state.productsListReducer.productsQuantity;
};