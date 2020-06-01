import productGroupReducer from "./productGroupReducer";
import headerReducer from "./headerReducer";
import productReducer from "./productReducer";
import {reducer as formReducer} from 'redux-form';
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import appReducer from "./appReducer";
import thunkMiddleware from 'redux-thunk';
import authReducer from "./authReducer";
import cartReducer from "./cartReducer";
import profileReducer from "./profileReducer";
import allBrandsReducer from "./allBrandsReducer";

let rootReducer = combineReducers({
    productGroupReducer,
    headerReducer,
    productReducer,
    appReducer,
    authReducer,
    cartReducer,
    profileReducer,
    allBrandsReducer,
    form: formReducer
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;