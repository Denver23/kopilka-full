import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {GetActionsTypes} from "../types/types";

const SET_PRODUCTS_LIST = 'SET_PRODUCTS_LIST';

let initialState = {
    loading: false as boolean,
    productsList: [] as Array<any>
};

export type ProductsListReducerInitialStateType = typeof initialState;

const productsListReducer = (state = initialState, action: GetActionsTypes<typeof productsListReducersActions>): ProductsListReducerInitialStateType => {
    switch (action.type) {
        case SET_PRODUCTS_LIST:
            return {...state};
        default:
            return state;
    }
}

export const productsListReducersActions = {
    setProductsList: (products: any) => ({type: SET_PRODUCTS_LIST, products} as const)
};

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productsListReducersActions>>


export default productsListReducer;