import {productAPI} from "../api/api";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_PRODUCT = 'SET_PRODUCT';

let initialState = {
    loading: false,
    id: '',
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
}

const productReducer = (state = initialState, action) => {
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

export const toggleLoading = (loading) => ({type: TOGGLE_LOADING,loading});

export const setProduct = (data) => ({type: SET_PRODUCT, data});

export const loadProduct = (id, brand) => async (dispatch) => {
    dispatch(toggleLoading(true));
    let response = await productAPI.loadProduct(id, brand);

    if(response.data.resultCode === 0) {
        dispatch(setProduct(response.data.product));
    } else {
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
    }
    dispatch(toggleLoading(false));
}

export default productReducer;