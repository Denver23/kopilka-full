import {prGroupAPI} from "../api/api";

const SET_PR_GROUP = 'SET_PR_GROUP';
const TOGGLE_LOADING = 'TOGGLE_LOADING';
const TOGGLE_PRODUCTS_LOADING = 'TOGGLE_PRODUCTS_LOADING';

let initialState = {
    url: null,
    productCount: null,
    products: [],
    refines: [],
    childCategories: [],
    reviews: [],
    bestSellers: [],
    slides: [],
    productsOnPage: 7,
    loading: false,
    productsLoading: false
}

const productGroupReducer = (state = initialState, action) => {
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

export const setPrGroup = (data) => ({type: SET_PR_GROUP,data});
export const toggleLoading = (loading) => ({type: TOGGLE_LOADING,loading});
export const toggleProductsLoading = (productsLoading) => ({type: TOGGLE_PRODUCTS_LOADING, productsLoading});

export const loadPrGroup = (type, url, query, productsOnPage) => async (dispatch) => {
    dispatch(toggleLoading(true));
    let response = await prGroupAPI.loadPrGroup(type, url, query, productsOnPage);

    if(response.data.resultCode === 0) {
        dispatch(setPrGroup(response.data.productGroup));
    } else(
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
    )
    dispatch(toggleLoading(false));
}

export const loadProducts = (type, url, query, productsOnPage) => async (dispatch) => {
    dispatch(toggleProductsLoading(true));
    let response = await prGroupAPI.loadProducts(type, url, query, productsOnPage);

    if(response.data.resultCode === 0) {
        dispatch(setPrGroup(response.data.productGroup));
    } else(
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
    )
    dispatch(toggleProductsLoading(false));
}

export default productGroupReducer;