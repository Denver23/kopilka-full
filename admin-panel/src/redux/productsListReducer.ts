import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {GetActionsTypes, ProductListItemType} from "../types/types";
import {productListAPI} from "../api/api";

const SET_PRODUCTS_LIST = 'SET_PRODUCTS_LIST';
const SET_PRODUCTS_LIST_LOADING = 'SET_PRODUCTS_LIST_LOADING';

let initialState = {
    loading: false as boolean,
    productsQuantity: 0 as number,
    productsList: [] as Array<ProductListItemType>
};

export type ProductsListReducerInitialStateType = typeof initialState;

const productsListReducer = (state = initialState, action: GetActionsTypes<typeof productsListReducersActions>): ProductsListReducerInitialStateType => {
    switch (action.type) {
        case SET_PRODUCTS_LIST:
            return {...state, productsList: action.products, productsQuantity: action.productsQuantity};
        case SET_PRODUCTS_LIST_LOADING:
            return {...state, loading: action.loading};
        default:
            return state;
    }
}

export const productsListReducersActions = {
    setProductsList: (products: Array<ProductListItemType>, productsQuantity: number) => ({type: SET_PRODUCTS_LIST, products, productsQuantity} as const),
    setLoading: (loading: boolean) => ({type: SET_PRODUCTS_LIST_LOADING, loading} as const)
};

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productsListReducersActions>>
export const getProductsList = (page: number, productsOnPage: number): ThunkType => async (dispatch) => {
    try {
        dispatch(productsListReducersActions.setLoading(true));
        let response = await productListAPI.loadProductsList(page,productsOnPage);

        if (!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productsListReducersActions.setProductsList(response.data.products, response.data.totalCount));

    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(message);
    } finally {
        dispatch(productsListReducersActions.setLoading(false));
    }
};

export default productsListReducer;