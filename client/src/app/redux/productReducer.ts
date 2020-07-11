import {productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ProductInListType, SetProductType, ChildProductType, GetActionsTypes, productImage} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_PRODUCT = 'SET_PRODUCT';

let initialState = {
    loading: false as boolean,
    id: '' as string | null,
    brand: '' as string,
    category: '' as string,
    productTitle: '' as string,
    childProducts: [] as Array<ChildProductType>,
    images: [] as Array<productImage>,
    productBrandImage: '' as string,
    shortDescription: '' as string,
    specifications: '' as string,
    features: '' as string,
    recommendedProducts: [] as Array<ProductInListType>
}

type InitialStateType = typeof initialState;

const productReducer = (state = initialState, action: GetActionsTypes<typeof productReducerActions>): InitialStateType => {
    switch (action.type) {
        case SET_PRODUCT:
            return {
                ...state,
                id: action.data.id,
                brand: action.data.brand,
                category: action.data.category,
                productTitle: action.data.productTitle,
                childProducts: action.data.childProducts,
                images: action.data.images,
                productBrandImage: action.data.productBrandImage,
                shortDescription: action.data.shortDescription,
                specifications: action.data.specifications,
                features: action.data.features,
                recommendedProducts: action.data.recommendedProducts
            };
        case TOGGLE_LOADING:
            return {...state, 'loading': action.loading};
        default:
            return state;
    }
}

export const productReducerActions = {
    toggleLoading: (loading: boolean) => ({type: TOGGLE_LOADING,loading} as const),
    setProduct: (data: SetProductType) => ({type: SET_PRODUCT, data} as const)
}


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productReducerActions>>
export const loadProduct = (id: string, brand: string): ThunkType => async (dispatch) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let response = await productAPI.loadProduct(id, brand);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productReducerActions.setProduct(response.data.product));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(productReducerActions.setProduct({
            id: null,
            brand: '',
            category: '',
            productTitle: '',
            childProducts: [],
            images: [],
            productBrandImage: '',
            shortDescription: '',
            specifications: '',
            features: '',
            recommendedProducts: []
        }));
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
}

export default productReducer;