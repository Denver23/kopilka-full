import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import productReducer from "./productReducer";
import productsListReducer from "./productsListReducer";

let rootReducer = combineReducers({
    appReducer,
    authReducer,
    productReducer,
    productsListReducer
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;