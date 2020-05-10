import {allBrandsApi} from "../api/api";

const SET_LOADING = 'SET_LOADING';
const SET_BRANDS = 'SET_BRANDS'

let initialState = {
    loading: false,
    quantity: null,
    brands: []
}

const allBrandsReducer = (state = initialState, action) => {
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

export const setLoading = (value) => ({type: SET_LOADING, value});

export const setBrands = (brands, quantity) => ({type: SET_BRANDS, data: {brands, quantity}});

export const uploadAllBrands = (page, brandsOnPage) => async(dispatch) => {
    dispatch(setLoading(true));
    let result = await allBrandsApi.loadBrandsAxios(page, brandsOnPage);

    if(result.data.resultCode === 0) {
        dispatch(setBrands(result.data.brands, result.data.quantity))
        dispatch(setLoading(false));
    }
}

export default allBrandsReducer;