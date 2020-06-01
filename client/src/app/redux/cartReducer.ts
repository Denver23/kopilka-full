import {cartApi, productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_PRODUCTS = 'SET_PRODUCTS';
const ADD_PRODUCT = 'ADD_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const CHANGE_QUANTITY = 'CHANGE_QUANTITY';
const TOGGLE_LOADING_CHECKOUT = 'TOGGLE_LOADING_CHECKOUT';
const SET_CHECKOUT_OPTIONS = 'SET_CHECKOUT_OPTIONS';
const SET_CHECKOUT_MESSAGE = 'SET_CHECKOUT_MESSAGE';

type ProductType = {
    id: string,
    brand: string,
    sku: string,
    price: number,
    productTitle: string,
    thumbnail: string,
    avaibility: boolean,
    options: Object,
    quantity: number
}
let initialState = {
    loadingCheckout: false,
    checkoutMessage: '' as string,
    checkoutOptions: [] as Array<OptionType>,
    products: [] as Array<ProductType>
}

type InitialStateType = typeof initialState;

const cartReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
type ActionsTypes = AddProductActionType | SetProductsActionType | DeleteProductActionType | ChangeQuantityActionType | ToggleLoadingCheckoutActionType | SetCheckOutMessageActionType | SetOptionsActionType;

type AddProductActionType = {
    type: typeof ADD_PRODUCT,
    data: ProductType
}
export const addProduct = (data: ProductType): AddProductActionType => ({type: ADD_PRODUCT,data});

type SetProductsActionType = {
    type: typeof SET_PRODUCTS,
    data: Array<ProductType>
}
export const setProducts = (data: Array<ProductType>): SetProductsActionType => ({type: SET_PRODUCTS,data});

type DeleteProductActionType = {
    type: typeof DELETE_PRODUCT,
    sku: string
}
export const deleteProduct = (sku: string): DeleteProductActionType => ({type: DELETE_PRODUCT, sku});

type ChangeQuantityActionType = {
    type: typeof CHANGE_QUANTITY,
    data: {
        sku: string,
        quantity: number
    }
}
export const changeQuantity = (sku: string, quantity: number): ChangeQuantityActionType => ({type: CHANGE_QUANTITY, data: {sku, quantity}});

type ToggleLoadingCheckoutActionType = {
    type: typeof TOGGLE_LOADING_CHECKOUT,
    loading: boolean
}
export const toggleLoadingCheckout = (loading: boolean): ToggleLoadingCheckoutActionType => ({type: TOGGLE_LOADING_CHECKOUT,loading});

type SetCheckOutMessageActionType = {
    type: typeof SET_CHECKOUT_MESSAGE,
    message: string
}
export const setCheckOutMessage = (message: string): SetCheckOutMessageActionType => ({type: SET_CHECKOUT_MESSAGE, message})

type SetOptionsActionType = {
    type: typeof SET_CHECKOUT_OPTIONS,
    options: Array<OptionType>
}
type OptionType = {
    name: string,
    forType: string
}
export const setOptions = (options: Array<OptionType>): SetOptionsActionType => ({type: SET_CHECKOUT_OPTIONS, options})


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>
export const addToCart = (brand: string, id: string, sku: string): ThunkType => async (dispatch) => {
    let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
    let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;

    if(localProducts !== null && localProducts.find((item: {sku: string, id: string, quantity: string}) => {
        return item.sku == sku;
    })) {
        return;
    }

    try {
        let response = await productAPI.addToCart(brand, id, sku);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(localProducts !== null) {
            localProducts.push({id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1})
            localStorage.setItem('cartProducts', JSON.stringify(localProducts));
        } else {
            localStorage.setItem('cartProducts', JSON.stringify([{id: response.data.product.id,brand: response.data.product.brand,sku: response.data.product.sku, quantity: 1}]));
        }
        dispatch(addProduct({...response.data.product, quantity: 1}))
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
}

export const deleteFromCart = (sku: string): ThunkAction<void, AppStateType, unknown, ActionsTypes> => (dispatch) => {

    dispatch(deleteProduct(sku));
    let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
    let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;
    let index = localProducts.findIndex((item: {sku: string, id: string, quantity: string}) => {
        return item.sku == sku
    })
    localProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(localProducts))
}

export const initializeProducts = (products: Array<{id: string,brand: string,sku: string, quantity: number}>): ThunkType => async (dispatch) => {
    if(products !== null && products.length > 0) {
        try {
            let response = await productAPI.initializeProducts(products);

            if(!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            if(response.data) {
                dispatch(setProducts(response.data.cartProducts));
            }
        } catch(err) {
            let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
            console.log(`${err.name}: ${message}`);
            dispatch(setProducts([]));
        }
    } else {
        dispatch(setProducts([]));
    }

}

type CheckoutProduct = {
    productId: string,
    sku: string,
    quantity: number
}
export const checkoutProducts = (products: Array<CheckoutProduct>, options: Object): ThunkType => async (dispatch) => {
    try {
        let response = await cartApi.checkout(products, options);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(response.data) {
            localStorage.removeItem('cartProducts');
            dispatch(setProducts([]));

            dispatch(setCheckOutMessage(response.data.message));
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(setCheckOutMessage(message));
    }
}

export const loadOptions = (): ThunkType => async (dispatch) => {
    dispatch(toggleLoadingCheckout(true));
    try{
        let response = await cartApi.loadOptions();

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(response.data) {
            dispatch(setOptions(response.data.options));
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(setOptions([]));
    }

    dispatch(toggleLoadingCheckout(false));
}


export default cartReducer;