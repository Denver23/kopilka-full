import {authAPI} from "../api/api";
import {FormAction, stopSubmit} from "redux-form";
import {changeAuthData, ChangeAuthDataActionType} from "./authReducer";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
const CHANGE_EDIT_MODE = 'CHANGE_EDIT_MODE';
const TOGGLE_FETCHING_PROFILE = 'TOGGLE_FETCHING_PROFILE';


let initialState = {
    editMode: false as boolean,
    name: null as string | null,
    surname: null as string | null,
    phone: null as string | null,
    numberOfPurchases: null as number | null,
    isFetchingProfile: false as boolean
}

type InitialStateType = typeof initialState;

const profileReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
type ActionsTypes = SetProfileActionType | ChangeEditModeActionType | ToggleIsFetchingProfileActionType;

type SetProfileActionType = {
    type: typeof SET_PROFILE_DATA,
    data: {
        name: string,
        surname: string,
        phone: string,
        numberOfPurchases: number | null
    }
}
export const setProfile = (name: string, surname: string, phone: string, numberOfPurchases: number | null = null): SetProfileActionType => ({type: SET_PROFILE_DATA, data: {name, surname, phone, numberOfPurchases}});

type ChangeEditModeActionType = {
    type: typeof CHANGE_EDIT_MODE,
    value: boolean
}
export const changeEditMode = (value: boolean): ChangeEditModeActionType => ({type: CHANGE_EDIT_MODE, value});

type ToggleIsFetchingProfileActionType = {
    type: typeof TOGGLE_FETCHING_PROFILE,
    isFetchingProfile: boolean
}
export const toggleIsFetchingProfile = (isFetchingProfile: boolean): ToggleIsFetchingProfileActionType => ({type: TOGGLE_FETCHING_PROFILE, isFetchingProfile});


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;
export const loadProfile = (id: string): ThunkType => async(dispatch) => {
    dispatch(toggleIsFetchingProfile(true));
    try {
        let response = await authAPI.loadProfile(id);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(setProfile(response.data.name,response.data.surname,response.data.phone,response.data.numberOfPurchases));
        dispatch(toggleIsFetchingProfile(false));

    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
}

type ChangeProfileDataType = {
    name: string,
    surname: string,
    login: string,
    email: string,
    phone: string
}
export const changeProfile = (userId: string, data: ChangeProfileDataType): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes | ChangeAuthDataActionType | FormAction> => async(dispatch) => {
    try {
        let response = await authAPI.changeProfile(userId, data);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(changeAuthData(response.data.login, response.data.email))
        dispatch(setProfile(response.data.name, response.data.surname, response.data.phone))
        dispatch(changeEditMode(false))
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(stopSubmit("profileForm", {_error: message}));
    }
}


export default profileReducer;