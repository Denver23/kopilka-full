import {allBrandsApi} from "../api/api";
import {BrandType, GetActionsTypes} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_LOADING = 'SET_LOADING';
const SET_BRANDS = 'SET_BRANDS'

let initialState = {
    loading: false,
    quantity: 0 as number,
    brands: [] as Array<BrandType>
}

type InitialStateType = typeof initialState;

const allBrandsReducer = (state = initialState, action: GetActionsTypes<typeof allBrandsReducerActions>): InitialStateType => {
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

export const allBrandsReducerActions = {
    setLoading: (value: boolean) => ({type: SET_LOADING, value} as const),
    setBrands: (brands: Array<BrandType>, quantity: number) => ({type: SET_BRANDS, data: {brands, quantity}} as const)
}

export const uploadAllBrands = (page: number,
                                brandsOnPage: number): ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof allBrandsReducerActions>> => async(dispatch) => {
    dispatch(allBrandsReducerActions.setLoading(true));
    try {
        let result = await allBrandsApi.loadBrands(page, brandsOnPage);

        dispatch(allBrandsReducerActions.setBrands(result.data.brands, result.data.quantity))
        dispatch(allBrandsReducerActions.setLoading(false));

    } catch (err) {
        dispatch(allBrandsReducerActions.setBrands([], 0))
        dispatch(allBrandsReducerActions.setLoading(false));
        console.log(err.message);
    }
}

export default allBrandsReducer;