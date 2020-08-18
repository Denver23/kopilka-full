import {AppStateType} from "../store";
import {OptionType, ProductType} from "../../types/types";

export const GetCartProducts = (state: AppStateType): Array<ProductType> => {
    return state.cartReducer.products;
}

export const GetCheckoutOptions = (state: AppStateType): Array<OptionType> => {
    return state.cartReducer.checkoutOptions;
}
export const GetCheckoutMessage = (state: AppStateType): string => {
    return state.cartReducer.checkoutMessage;
}

export const GetLoadingCheckout = (state: AppStateType): boolean => {
    return state.cartReducer.loadingCheckout;
}