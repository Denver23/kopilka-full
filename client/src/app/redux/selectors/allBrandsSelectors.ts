import {AppStateType} from "../store";
import {BrandType} from "../../types/types";

export const GetBrandsLoading = (state: AppStateType): boolean => {
    return state.allBrandsReducer.loading;
};

export const GetBrandsQuantity = (state: AppStateType): number => {
    return state.allBrandsReducer.quantity;
};
export const GetAllBrands = (state: AppStateType): Array<BrandType> => {
    return state.allBrandsReducer.brands;
};