import {allBrandsApi} from "../api/api";
import {BrandType} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_LOADING = 'SET_LOADING';
const SET_BRANDS = 'SET_BRANDS'

let initialState = {
    loading: false,
    quantity: null as number | null,
    brands: [] as Array<BrandType>
}

type InitialStateType = typeof initialState;

const allBrandsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.value
            }
        case SET_BRANDS:
            return {
                ...state,
                brands: action.data.brands,
                quantity: action.data.quantity
            }
        default:
            return state;
    }
}

type ActionsTypes = SetLoadingActionType | SetBrandsActionType;

type SetLoadingActionType = {
    type: typeof SET_LOADING,
    value: boolean
}
export const setLoading = (value: boolean): SetLoadingActionType => ({type: SET_LOADING, value});

type SetBrandsActionType = {
    type: typeof SET_BRANDS,
    data: {
        brands: Array<BrandType>
        quantity: number
    }
}
export const setBrands = (brands: Array<BrandType>, quantity: number): SetBrandsActionType => ({type: SET_BRANDS, data: {brands, quantity}});



export const uploadAllBrands = (page: number,
                                brandsOnPage: number): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes> => async(dispatch) => {
    dispatch(setLoading(true));
    try {
        let result = await allBrandsApi.loadBrands(page, brandsOnPage);

        dispatch(setBrands(result.data.brands, result.data.quantity))
        dispatch(setLoading(false));

    } catch (err) {
        dispatch(setBrands([], 0))
        dispatch(setLoading(false));
        console.log(err.message);
    }
}

export default allBrandsReducer;