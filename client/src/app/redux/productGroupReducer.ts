import {prGroupAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ProductType} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_PR_GROUP = 'SET_PR_GROUP';
const TOGGLE_LOADING = 'TOGGLE_LOADING';
const TOGGLE_PRODUCTS_LOADING = 'TOGGLE_PRODUCTS_LOADING';

type RefineType = {
    items: Array<string>,
    title: string,
    type: string
}
type ChildCategoryType = {
    name: string,
    url: string,
    childCategories: Array<{
        name: string,
        url: string
    }>
}
let initialState = {
    name: null as string | null,
    url: null as string | null,
    productCount: null as number | null,
    products: [] as Array<ProductType>,
    refines: [] as Array<RefineType>,
    childCategories: [] as Array<ChildCategoryType>,
    reviews: [] as Array<Object> | undefined,
    bestSellers: [] as Array<Object> | undefined,
    slides: [] as Array<string>,
    productsOnPage: 7 as number,
    loading: false as boolean,
    productsLoading: false as boolean
}

type InitialStateType = typeof initialState;

const productGroupReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
type ActionsTypes = SetPrGroupActionType | ToggleLoadingActionType | ToggleProductsLoadingActionType;

type SetPrGroupActionType = {
    type: typeof SET_PR_GROUP,
    data: PrGroupDataType
}
type PrGroupDataType = {
    name: string | null,
    url: string | null,
    productCount: number | null,
    products: Array<ProductType>,
    refines: Array<RefineType>,
    childCategories: Array<ChildCategoryType>,
    reviews?: Array<Object>,
    bestSellers?: Array<Object>,
    slides: Array<string>
}
export const setPrGroup = (data: PrGroupDataType): SetPrGroupActionType => ({type: SET_PR_GROUP,data});

type ToggleLoadingActionType = {
    type: typeof TOGGLE_LOADING,
    loading: boolean
}
export const toggleLoading = (loading: boolean): ToggleLoadingActionType => ({type: TOGGLE_LOADING,loading});

type ToggleProductsLoadingActionType = {
    type: typeof TOGGLE_PRODUCTS_LOADING,
    productsLoading: boolean
}
export const toggleProductsLoading = (productsLoading: boolean): ToggleProductsLoadingActionType => ({type: TOGGLE_PRODUCTS_LOADING, productsLoading});


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>
export const loadPrGroup = (type: string, url: string, query: string, productsOnPage: number): ThunkType => async (dispatch) => {
    dispatch(toggleLoading(true));
    try{
        let response = await prGroupAPI.loadPrGroup(type, url, query, productsOnPage);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(setPrGroup(response.data.productGroup));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(setPrGroup({
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
        dispatch(toggleLoading(false));
    }
}

export const loadProducts = (type: string, url: string, query: string, productsOnPage: number): ThunkType => async (dispatch) => {
    dispatch(toggleProductsLoading(true));
    try {
        let response = await prGroupAPI.loadProducts(type, url, query, productsOnPage);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(setPrGroup(response.data.productGroup));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(setPrGroup({
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
        dispatch(toggleProductsLoading(false));
    }
}

export default productGroupReducer;