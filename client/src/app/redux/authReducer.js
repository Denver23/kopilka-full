import {authAPI} from "../api/api";
import {stopSubmit} from "redux-form";

const SET_USER_DATA = 'SET_USER_DATA';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const CHANGE_AUTH_DATA = 'CHANGE_AUTH_DATA';

let initialState = {
    userId: null,
    email: null,
    login: null,
    isAuth: false,
    isFetching: false
}

const authReducer = (state = initialState, action) => {
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

export const setAuthUserData = (userId, email, login, isAuth) => ({
    type: SET_USER_DATA,
    payload: {userId, email, login, isAuth}
});

export const changeAuthData = (login, email) => ({
    type: CHANGE_AUTH_DATA,
    data: {login, email}
})

export const getAuthUserData = () => async (dispatch) => {
    if(!!localStorage.getItem('refreshToken')) {
        let response = await authAPI.me();

        if (response.data.resultCode === 0) {
            let {id, login, email} = response.data;
            dispatch(setAuthUserData(id, email, login, true));
        } else {

        }
    } else {
        dispatch(setAuthUserData(null, null, null, false))
    }

}

export const login = (email, password, rememberMe) => async (dispatch) => {
    dispatch(toggleIsFetching(true));

    let response = await authAPI.login(email, password, rememberMe);

    if (response.data.resultCode === 0) {
        let {userId, login, accessToken, refreshToken} = response.data;

        localStorage.setItem('userId', userId);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('exp', JSON.parse(atob(accessToken.split('.')[1])).exp);
        dispatch(setAuthUserData(userId, email, login, true));
        dispatch(toggleIsFetching(false));
    } else {
        let message = response.data.message ? response.data.message : "Some error";
        dispatch(toggleIsFetching(false));
        dispatch(stopSubmit("loginForm", {_error: message}));
    }
}

export const signUp = (data) => async (dispatch) => {
    let user = {name: data.name,
        surname: data.surname,
        login: data.login,
        email: data.email,
        password: data.password,
        phone: data.phone,
        subscribeToNews: data.subscribeToNews === 'yes' ? true : false}
    let response = await authAPI.signUp(user);

    if(response.status === 201) {
        let user = response.data.user;

        let {accessToken, refreshToken} = response.data;

        localStorage.setItem('userId', user._id);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('exp', JSON.parse(atob(accessToken.split('.')[1])).exp);

        dispatch(setAuthUserData(user._id, user.email, user.login, true));
    } else if(response.status === 200) {
        dispatch(stopSubmit("signUpForm", {_error: response.data.message}));
    }
}

export const signOut = (userId) => async (dispatch) => {
    let response = await authAPI.signOut(userId);

    if(response.data.resultCode === 0) {
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('exp');
        dispatch(setAuthUserData(null, null, null, false));
    }
}

export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching});

export default authReducer;