import {authAPI} from "../api/api";
import {FormAction, stopSubmit} from "redux-form";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {GetActionsTypes} from "../types/types";

const SET_USER_DATA = 'SET_USER_DATA';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const CHANGE_AUTH_DATA = 'CHANGE_AUTH_DATA';

let initialState = {
    userId: null as string | null,
    email: null as string | null,
    login: null as string | null,
    isAuth: false as boolean,
    isFetching: false as boolean
}

type InitialStateType = typeof initialState;

const authReducer = (state = initialState, action: GetActionsTypes<typeof authReducersActions>): InitialStateType => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case CHANGE_AUTH_DATA:
            return {
                ...state,
                login: action.data.login,
                email: action.data.email
            }
        default:
            return state;
    }
}

export const authReducersActions = {
    toggleIsFetching: (isFetching: boolean) => ({type: TOGGLE_IS_FETCHING, isFetching} as const),
    setAuthUserData: (userId: string | null, email: string | null, login: string | null, isAuth: boolean) => ({
        type: SET_USER_DATA,
        payload: {userId, email, login, isAuth}
    } as const),
    changeAuthData: (login: string, email: string) => ({
        type: CHANGE_AUTH_DATA,
        data: {login, email}
    } as const)
}

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof authReducersActions> | FormAction>
export const getAuthUserData = (): ThunkType => async (dispatch) => {
    if(!!localStorage.getItem('refreshToken')) {
        try {
            let response = await authAPI.me();

            if(!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            let {id, login, email} = response.data;
            dispatch(authReducersActions.setAuthUserData(id, email, login, true));
        } catch(err) {
            let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
            dispatch(authReducersActions.setAuthUserData(null, null, null, false))
            console.log(message);
        }
    } else {
        dispatch(authReducersActions.setAuthUserData(null, null, null, false))
    }

}

export const login = (email: string, password: string, rememberMe: boolean): ThunkType => async (dispatch) => {
    dispatch(authReducersActions.toggleIsFetching(true));

    try {
        let response = await authAPI.login(email, password, rememberMe);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        let {userId, login, accessToken, refreshToken} = response.data;

        localStorage.setItem('userId', userId);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('exp', JSON.parse(atob(accessToken.split('.')[1])).exp);
        dispatch(authReducersActions.setAuthUserData(userId, email, login, true));
        dispatch(authReducersActions.toggleIsFetching(false));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        dispatch(authReducersActions.toggleIsFetching(false));
        dispatch(stopSubmit("loginForm", {_error: message}));
    }
}

type SignUpDataType = {
    name: string,
    surname: string,
    login: string,
    email: string,
    password: string,
    phone: string,
    subscribeToNews: string
}
export const signUp = (data: SignUpDataType): ThunkType => async (dispatch) => {
    try {

        let user = {name: data.name,
            surname: data.surname,
            login: data.login,
            email: data.email,
            password: data.password,
            phone: data.phone,
            subscribeToNews: data.subscribeToNews === 'yes' ? true : false}

        let response = await authAPI.signUp(user);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        let responseUser = response.data.user;

        let {accessToken, refreshToken} = response.data;

        localStorage.setItem('userId', responseUser.userId);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('exp', JSON.parse(atob(accessToken.split('.')[1])).exp);

        dispatch(authReducersActions.setAuthUserData(responseUser.userId, user.email, user.login, true));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        dispatch(stopSubmit("signUpForm", {_error: message}));
    }
}


export const signOut = (userId: string): ThunkType => async (dispatch) => {
    try{
        let response = await authAPI.signOut(userId);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    } finally {
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('exp');
        dispatch(authReducersActions.setAuthUserData(null, null, null, false));
    }
};

// @ts-ignore
export default authReducer;