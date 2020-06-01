import {productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ProductType} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_PRODUCT = 'SET_PRODUCT';

type ChildProductType = {
    _id: string,
    sku: string,
    price: number,
    quantity: number,
    options: Array<Object>

}
let initialState = {
    loading: false as boolean,
    id: '' as string | null,
    brand: '' as string,
    category: '' as string,
    productTitle: '' as string,
    childProducts: [] as Array<ChildProductType>,
    images: [] as Array<{
        _id?: string,
        original: string,
        thumbnail: string,
        alt: string
    }>,
    productBrandImage: '' as string,
    shortDescription: '' as string,
    specifications: '' as string,
    features: '' as string,
    recommendedProducts: [] as Array<ProductType>
}

type InitialStateType = typeof initialState;

const productReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
type ActionsTypes = ToggleLoadingActionType | SetProductActionType;

type ToggleLoadingActionType = {
    type: typeof TOGGLE_LOADING,
    loading: boolean
}
export const toggleLoading = (loading: boolean): ToggleLoadingActionType => ({type: TOGGLE_LOADING,loading});

type SetProductActionType = {
    type: typeof SET_PRODUCT,
    data: SetProductType
}
type SetProductType = {
    id: string | null,
    brand: string,
    category: string,
    productTitle: string,
    childProducts: Array<ChildProductType>,
    images: Array<{
        _id?: string,
        original: string,
        thumbnail: string,
        alt: string
    }>,
    productBrandImage: string,
    shortDescription: string,
    specifications: string,
    features: string,
    recommendedProducts: Array<ProductType>
}
export const setProduct = (data: SetProductType): SetProductActionType => ({type: SET_PRODUCT, data});

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>
export const loadProduct = (id: string, brand: string): ThunkType => async (dispatch) => {
    dispatch(toggleLoading(true));
    try {
        let response = await productAPI.loadProduct(id, brand);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(setProduct(response.data.product));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(setProduct({
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
        dispatch(toggleLoading(false));
    }
}

export default productReducer;