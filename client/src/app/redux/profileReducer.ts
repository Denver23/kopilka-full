import {authAPI} from "../api/api";
import {FormAction, stopSubmit} from "redux-form";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {ChangeProfileDataType, GetActionsTypes} from "../types/types";
import { authReducersActions } from "./authReducer";

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

const profileReducer = (state = initialState, action: GetActionsTypes<typeof profileReducerActions>): InitialStateType => {
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

export const profileReducerActions = {
    setProfile: (name: string, surname: string, phone: string, numberOfPurchases: number | null = null) => ({type: SET_PROFILE_DATA, data: {name, surname, phone, numberOfPurchases}} as const),
    changeEditMode: (value: boolean) => ({type: CHANGE_EDIT_MODE, value} as const),
    toggleIsFetchingProfile: (isFetchingProfile: boolean) => ({type: TOGGLE_FETCHING_PROFILE, isFetchingProfile} as const)
}


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof profileReducerActions>>;
export const loadProfile = (id: string): ThunkType => async(dispatch) => {
    dispatch(profileReducerActions.toggleIsFetchingProfile(true));
    try {
        let response = await authAPI.loadProfile(id);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(profileReducerActions.setProfile(response.data.name,response.data.surname,response.data.phone,response.data.numberOfPurchases));
        dispatch(profileReducerActions.toggleIsFetchingProfile(false));

    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
}

export const changeProfile = (userId: string, data: ChangeProfileDataType): ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof profileReducerActions> | ReturnType<typeof authReducersActions.changeAuthData> | FormAction> => async(dispatch) => {
    try {
        let response = await authAPI.changeProfile(userId, data);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(authReducersActions.changeAuthData(response.data.login, response.data.email))
        dispatch(profileReducerActions.setProfile(response.data.name, response.data.surname, response.data.phone))
        dispatch(profileReducerActions.changeEditMode(false))
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(stopSubmit("profileForm", {_error: message}));
    }
}


export default profileReducer;