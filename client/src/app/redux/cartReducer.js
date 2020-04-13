import {cartApi, productAPI} from "../api/api";
import {setProduct, toggleLoading} from "./productReducer";

const SET_PRODUCTS = 'SET_PRODUCTS';
const ADD_PRODUCT = 'ADD_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const CHANGE_QUANTITY = 'CHANGE_QUANTITY';
const TOGGLE_LOADING_CHECKOUT = 'TOGGLE_LOADING_CHECKOUT';
const SET_CHECKOUT_OPTIONS = 'SET_CHECKOUT_OPTIONS';
const TOGGLE_CHECKOUT_STATUS = 'TOGGLE_CHECKOUT_STATUS';
const SET_CHECKOUT_MESSAGE = 'SET_CHECKOUT_MESSAGE';

let initialState = {
    loadingCheckout: false,
    checkoutMessage: '',
    checkoutOptions: [],
    products: []
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                'products': [...action.data]
            }
        case ADD_PRODUCT:
            return {
                ...state,
                'products': [...state.products, action.data]
            }
        case DELETE_PRODUCT:
            let productsArray = state.products;
            let index = productsArray.findIndex(item => {
                return item.sku == action.sku
            })
            productsArray.splice(index, 1);
            return {
                ...state,
                'products': [...productsArray]
            }
        case CHANGE_QUANTITY:
            let products = state.products;
            products.forEach(item => {
                if(item.sku === action.data.sku) {
                    item.quantity = action.data.quantity;
                }
            })
            return {
                ...state,
                'products': [...products]
            }
        case TOGGLE_LOADING_CHECKOUT:
            return {...state, 'loadingCheckout': action.loading};
        case SET_CHECKOUT_OPTIONS:
            return {
                ...state,
                checkoutOptions: action.options
            }
        case TOGGLE_CHECKOUT_STATUS:
            return {...state, 'checkoutStatus': action.status};
        case SET_CHECKOUT_MESSAGE:
            return {...state, 'checkoutMessage': action.message};
        default:
            return state;
    }
}

export const addProduct = (data) => ({type: ADD_PRODUCT,data});

export const setProducts = (data) => ({type: SET_PRODUCTS,data});

export const deleteProduct = (sku) => ({type: DELETE_PRODUCT, sku});

export const changeQuantity = (sku, quantity) => ({type: CHANGE_QUANTITY, data: {sku, quantity}});

export const toggleLoadingCheckout = (loading) => ({type: TOGGLE_LOADING_CHECKOUT,loading});

export const setCheckOutMessage = (message) => ({type: SET_CHECKOUT_MESSAGE, message})

export const setOptions = (options) => ({type: SET_CHECKOUT_OPTIONS, options})

export const addToCart = (brand, id, sku) => async (dispatch) => {
    let localProducts = JSON.parse(localStorage.getItem('cartProducts'));

    if(localProducts !== null && localProducts.find(item => {
        return item.sku == sku;
    })) {
        return;
    }

    let response = await productAPI.addToCart(brand, id, sku);


    if(response.data.resultCode === 0) {
        if(localProducts !== null) {
            localProducts.push({id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1})
            localStorage.setItem('cartProducts', JSON.stringify(localProducts));
        } else {
            localStorage.setItem('cartProducts', JSON.stringify([{id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1}]));
        }
        dispatch(addProduct({...response.data.product, quantity: 1}))
    } else {
        return;
    }
}

export const deleteFromCart = (sku) => (dispatch) => {

    dispatch(deleteProduct(sku));
    let localProducts = JSON.parse(localStorage.getItem('cartProducts'));
    let index = localProducts.findIndex(item => {
        return item.sku == sku
    })
    localProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(localProducts))
}

export const initializeProducts = (products) => async (dispatch) => {
    if(products !== null) {
        let response = await productAPI.initializeProducts(products);

        if(response.data) {
            dispatch(setProducts(response.data.cartProducts));
        }
    } else {
        dispatch(setProducts([]));
    }

}

export const checkoutProducts = (products, options) => async (dispatch) => {
    let response = await cartApi.checkout(products, options);

    if(response.message) {
        if(response.resultCode === 1) {
            localStorage.setItem('cartProducts', null);
            dispatch(setProducts([]));
        }
        dispatch(setCheckOutMessage(response.message));
    }
}

export const loadOptions = () => async (dispatch) => {
    dispatch(toggleLoadingCheckout(true));
    let response = await cartApi.loadOptions();

    if(response.data) {
        dispatch(setOptions(response.data));
    }
    dispatch(toggleLoadingCheckout(false));
}


export default cartReducer;