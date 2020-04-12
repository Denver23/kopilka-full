import {authAPI} from "../api/api";
import {stopSubmit} from "redux-form";
import {changeAuthData} from "./authReducer";

const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
const CHANGE_EDIT_MODE = 'CHANGE_EDIT_MODE';
const TOGGLE_FETCHING_PROFILE = 'TOGGLE_FETCHING_PROFILE';


let initialState = {
    editMode: false,
    name: null,
    surname: null,
    phone: null,
    numberOfPurchases: null,
    isFetchingProfile: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE_DATA:
            let resultData = action.data.numberOfPurchases === null ? {name: action.data.name,surname: action.data.surname,phone: action.data.phone} : action.data
            return {
                ...state,
                ...resultData
            }
        case CHANGE_EDIT_MODE:
            return {
                ...state,
                editMode: action.value
            }
        default:
            return state;
    }
}

export const setProfile = (name, surname, phone, numberOfPurchases = null) => ({type: SET_PROFILE_DATA, data: {name, surname, phone, numberOfPurchases}});

export const changeEditMode = (value) => ({type: CHANGE_EDIT_MODE, value});

export const toggleIsFetchingProfile = (isFetchingProfile) => ({type: TOGGLE_FETCHING_PROFILE, isFetchingProfile});


export const loadProfile = (id) => async(dispatch) => {
    dispatch(toggleIsFetchingProfile(true));
    let response = await authAPI.loadProfile(id);

    if(response.data.resultCode === 0) {
        dispatch(setProfile(response.data.name,response.data.surname,response.data.phone,response.data.numberOfPurchases));
        dispatch(toggleIsFetchingProfile(false));
    }
}

export const changeProfile = (userId, data) => async(dispatch) => {

    let response = await authAPI.changeProfile(userId, data);

    if(response.data.resultCode === 0) {
        dispatch(changeAuthData(response.data.login, response.data.email))
        dispatch(setProfile(response.data.name, response.data.surname, response.data.phone))
        dispatch(changeEditMode(false))
    } else if (!!response.data.message) {
        dispatch(stopSubmit("profileForm", {_error: response.data.message}));
    } else {
        dispatch(stopSubmit("profileForm", {_error: 'Server Error'}));
    }
}


export default profileReducer;