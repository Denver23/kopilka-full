import {prGroupAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ProductInListType, PrGroupDataType, ChildCategoryType, RefineType, GetActionsTypes} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_PR_GROUP = 'SET_PR_GROUP';
const TOGGLE_LOADING = 'TOGGLE_LOADING';
const TOGGLE_PRODUCTS_LOADING = 'TOGGLE_PRODUCTS_LOADING';


let initialState = {
    name: null as string | null,
    url: null as string | null,
    productCount: null as number | null,
    products: [] as Array<ProductInListType>,
    refines: [] as Array<RefineType>,
    childCategories: [] as Array<ChildCategoryType>,
    reviews: [] as Array<Object> | undefined,
    bestSellers: [] as Array<ProductInListType> | undefined,
    slides: [] as Array<string>,
    productsOnPage: 7 as number,
    loading: false as boolean,
    productsLoading: false as boolean
}

type InitialStateType = typeof initialState;

const productGroupReducer = (state = initialState, action: GetActionsTypes<typeof productGroupReducerActions>): InitialStateType => {
    switch (action.type) {
        case SET_PR_GROUP:
            return {
                ...state,
                name: action.data.name,
                url: action.data.url,
                productCount: action.data.productCount,
                products: action.data.products,
                refines: action.data.refines,
                childCategories: action.data.childCategories,
                reviews: action.data.reviews,
                bestSellers: action.data.bestSellers,
                slides: action.data.slides
            };
        case TOGGLE_LOADING:
            return {...state, 'loading': action.loading};
        case TOGGLE_PRODUCTS_LOADING:
            return {...state, 'productsLoading': action.productsLoading}
        default:
            return state;
    }
}

export const productGroupReducerActions = {
    setPrGroup: (data: PrGroupDataType) => ({type: SET_PR_GROUP,data} as const),
    toggleLoading: (loading: boolean) => ({type: TOGGLE_LOADING,loading} as const),
    toggleProductsLoading: (productsLoading: boolean) => ({type: TOGGLE_PRODUCTS_LOADING, productsLoading} as const)
}


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productGroupReducerActions>>
export const loadPrGroup = (type: string, url: string, query: string, productsOnPage: number): ThunkType => async (dispatch) => {
    dispatch(productGroupReducerActions.toggleLoading(true));
    try{
        let response = await prGroupAPI.loadPrGroup(type, url, query, productsOnPage);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productGroupReducerActions.setPrGroup(response.data.productGroup));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(productGroupReducerActions.setPrGroup({
            name: null,
            url: null,
            productCount: null,
            products: [],
            refines: [],
            childCategories: [],
            reviews: [],
            bestSellers: [],
            slides: []
        }))
    } finally {
        dispatch(productGroupReducerActions.toggleLoading(false));
    }
}

export const loadProducts = (type: string, url: string, query: string, productsOnPage: number): ThunkType => async (dispatch) => {
    dispatch(productGroupReducerActions.toggleProductsLoading(true));
    try {
        let response = await prGroupAPI.loadProducts(type, url, query, productsOnPage);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productGroupReducerActions.setPrGroup(response.data.productGroup));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(productGroupReducerActions.setPrGroup({
            name: null,
            url: null,
            productCount: null,
            products: [],
            refines: [],
            childCategories: [],
            reviews: [],
            bestSellers: [],
            slides: []
        }))
    } finally {
        dispatch(productGroupReducerActions.toggleProductsLoading(false));
    }
}

export default productGroupReducer;