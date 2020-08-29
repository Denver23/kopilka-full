import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import { GetActionsTypes } from "../types/types";
import {getAuthUserData} from "./authReducer";

const INITIALIZED_SUCCESS = 'INITIALIZED_SUCCESS';
const CHANGE_THEME = 'CHANGE_THEME';

let initialState = {
    initialized: false,
    theme: 'light' as 'light' | 'dark'
}

type InitialStateType = typeof initialState;

const appReducer = (state = initialState, action: GetActionsTypes<typeof appReducerActions>): InitialStateType => {
    switch (action.type) {
        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true
            }
        case CHANGE_THEME:
            return {
                ...state,
                theme: action.theme
            }
        default:
            return state;
    }
}

export const appReducerActions = {
    initializedSuccess: () => ({type: INITIALIZED_SUCCESS} as const),
    changeTheme: (theme: 'light' | 'dark') => ({type: CHANGE_THEME, theme})
}

export const initializeApp = (): ThunkAction<void, AppStateType, unknown, GetActionsTypes<typeof appReducerActions>> => (dispatch) => {
    let promise = dispatch(getAuthUserData());

    Promise.all([promise])
        .then(() => {
            dispatch(appReducerActions.initializedSuccess());
        });
};
export default appReducer;