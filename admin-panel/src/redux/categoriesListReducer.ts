import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {
    CategoriesListItemType, categoriesListRequestObjectType,
    categoryRequestObjectType,
    changeProductsParamsTypes,
    GetActionsTypes
} from "../types/types";
import {categoriesListAPI, productListAPI} from "../api/api";

const SET_CATEGORIES_LIST = 'SET_PRODUCTS_LIST';
const SET_CATEGORIES_LIST_LOADING = 'SET_PRODUCTS_LIST_LOADING';
const CHANGE_PRODUCTS_PARAMS = 'CHANGE_PRODUCTS_PARAMS';

let initialState = {
    loading: false as boolean,
    categoriesQuantity: 0 as number,
    categoriesList: [] as Array<CategoriesListItemType>
};

export type CategoriesListReducerInitialStateType = typeof initialState;

const categoriesListReducer = (state = initialState, action: GetActionsTypes<typeof categoriesListReducersActions>): CategoriesListReducerInitialStateType => {
    switch (action.type) {
        case SET_CATEGORIES_LIST:
            return {...state, categoriesList: action.categories, categoriesQuantity: action.categoriesQuantity};
        case SET_CATEGORIES_LIST_LOADING:
            return {...state, loading: action.loading};
        case CHANGE_PRODUCTS_PARAMS:
            const productList = [...state.categoriesList];
            let newProductList = productList.map(product => {
                if(action.items.includes(product._id)) {
                    return {...product, ...action.params}
                }
                return product;
            });
            return {...state, categoriesList: newProductList};
        default:
            return state;
    }
}

export const categoriesListReducersActions = {
    setCategoriesList: (categories: Array<CategoriesListItemType>, categoriesQuantity: number) => ({type: SET_CATEGORIES_LIST, categories, categoriesQuantity} as const),
    setLoading: (loading: boolean) => ({type: SET_CATEGORIES_LIST_LOADING, loading} as const),
    changeParams: (items: Array<string>, params: changeProductsParamsTypes) => ({type: CHANGE_PRODUCTS_PARAMS, items, params} as const)
};

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof categoriesListReducersActions>>
export const getCategoriesList = (page: number, categoriesOnPage: number, requestObject: categoriesListRequestObjectType): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(categoriesListReducersActions.setLoading(true));
            let response = await categoriesListAPI.loadCategoriesList(page, categoriesOnPage, requestObject);

            if (!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            dispatch(categoriesListReducersActions.setCategoriesList(response.data.categories, response.data.totalCount));

        } catch (err) {
            let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
            console.log(message);
        } finally {
            dispatch(categoriesListReducersActions.setLoading(false));
        }
    };
};

export const changeCategoriesProps = (items: Array<string>, params: changeProductsParamsTypes): ThunkType => {
    return async (dispatch) => {
        try {
            dispatch(categoriesListReducersActions.setLoading(true));
            let response = await productListAPI.changeProductsProps(items, params);

            dispatch(categoriesListReducersActions.setLoading(false));

            if(response) {
                dispatch(categoriesListReducersActions.changeParams(items, params))
            }

        } catch (err) {
            let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
            console.log(message);
        } finally {
            dispatch(categoriesListReducersActions.setLoading(false));
        }
    }
};

export default categoriesListReducer;