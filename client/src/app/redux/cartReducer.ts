import {cartAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {CheckoutProduct, InitializeProductsType, ProductType, GetActionsTypes, OptionType, localStorageProductType} from "../types/types";

const SET_PRODUCTS = 'SET_PRODUCTS';
const ADD_PRODUCT = 'ADD_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const CHANGE_QUANTITY = 'CHANGE_QUANTITY';
const TOGGLE_LOADING_CHECKOUT = 'TOGGLE_LOADING_CHECKOUT';
const SET_CHECKOUT_OPTIONS = 'SET_CHECKOUT_OPTIONS';
const SET_CHECKOUT_MESSAGE = 'SET_CHECKOUT_MESSAGE';


let initialState = {
    loadingCheckout: false,
    checkoutMessage: '' as string,
    checkoutOptions: [] as Array<OptionType>,
    products: [] as Array<ProductType>
}

type InitialStateType = typeof initialState;

const cartReducer = (state = initialState, action: GetActionsTypes<typeof cartReducerActions>): InitialStateType => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                products: [...action.data]
            }
        case ADD_PRODUCT:
            return {
                ...state,
                products: [...state.products, action.data]
            }
        case DELETE_PRODUCT:
            let productsArray = state.products;
            let index = productsArray.findIndex(item => {
                return item.sku == action.sku
            })
            productsArray.splice(index, 1);
            return {
                ...state,
                products: [...productsArray]
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
                products: [...products]
            }
        case TOGGLE_LOADING_CHECKOUT:
            return {...state, 'loadingCheckout': action.loading};
        case SET_CHECKOUT_OPTIONS:
            return {
                ...state,
                checkoutOptions: action.options
            }
        case SET_CHECKOUT_MESSAGE:
            return {...state, checkoutMessage: action.message};
        default:
            return state;
    }
}


export const cartReducerActions = {
    addProduct: (data: ProductType) => ({type: ADD_PRODUCT,data} as const),
    setProducts: (data: Array<ProductType>) => ({type: SET_PRODUCTS,data} as const),
    deleteProduct: (sku: string) => ({type: DELETE_PRODUCT, sku} as const),
    changeQuantity: (sku: string, quantity: number) => ({type: CHANGE_QUANTITY, data: {sku, quantity}} as const),
    toggleLoadingCheckout: (loading: boolean) => ({type: TOGGLE_LOADING_CHECKOUT,loading} as const),
    setCheckOutMessage: (message: string) => ({type: SET_CHECKOUT_MESSAGE, message} as const),
    setOptions: (options: Array<OptionType>) => ({type: SET_CHECKOUT_OPTIONS, options} as const)
}


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof cartReducerActions>>
export const addToCart = (brand: string, id: string, sku: string): ThunkType => async (dispatch) => {
    let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
    let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;

    if(localProducts !== null && localProducts.find((item: localStorageProductType) => {
        return item.sku == sku;
    })) {
        return;
    }

    try {
        let response = await cartAPI.addToCart(brand, id, sku);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(localProducts !== null) {
            localProducts.push({id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1})
            localStorage.setItem('cartProducts', JSON.stringify(localProducts));
        } else {
            localStorage.setItem('cartProducts', JSON.stringify([{id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1}]));
        }
        dispatch(cartReducerActions.addProduct({...response.data.product, quantity: 1}))
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
}

export const deleteFromCart = (sku: string): ThunkAction<void, AppStateType, unknown, GetActionsTypes<typeof cartReducerActions>> => (dispatch) => {

    dispatch(cartReducerActions.deleteProduct(sku));
    let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
    let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;
    let index = localProducts.findIndex((item: {sku: string, id: string, quantity: string}) => {
        return item.sku == sku
    })
    localProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(localProducts))
}

export const initializeProducts = (products: Array<InitializeProductsType>): ThunkType => async (dispatch) => {
    if(products !== null && products.length > 0) {
        try {
            let response = await cartAPI.initializeProducts(products);

            if(!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            if(response.data) {
                dispatch(cartReducerActions.setProducts(response.data.cartProducts));
            }
        } catch(err) {
            let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
            console.log(`${err.name}: ${message}`);
            dispatch(cartReducerActions.setProducts([]));
        }
    } else {
        dispatch(cartReducerActions.setProducts([]));
    }

}

export const checkoutProducts = (products: Array<CheckoutProduct>, options: Object): ThunkType => async (dispatch) => {
    try {
        let response = await cartAPI.checkout(products, options);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(response.data) {
            localStorage.removeItem('cartProducts');
            dispatch(cartReducerActions.setProducts([]));

            dispatch(cartReducerActions.setCheckOutMessage(response.data.message));
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(cartReducerActions.setCheckOutMessage(message));
    }
}

export const loadOptions = (): ThunkType => async (dispatch) => {
    dispatch(cartReducerActions.toggleLoadingCheckout(true));
    try{
        let response = await cartAPI.loadOptions();

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(response.data) {
            dispatch(cartReducerActions.setOptions(response.data.options));
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(cartReducerActions.setOptions([]));
    }

    dispatch(cartReducerActions.toggleLoadingCheckout(false));
}


export default cartReducer;