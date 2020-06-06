import {getAuthUserData} from "./authReducer";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import { GetActionsTypes } from "../types/types";

const INITIALIZED_SUCCESS = 'INITIALIZED_SUCCESS';

let initialState = {
    initialized: false
}

type InitialStateType = typeof initialState;

const appReducer = (state = initialState, action: GetActionsTypes<typeof appReducerActions>): InitialStateType => {
    switch (action.type) {
        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true
            }
        default:
            return state;
    }
}

export const appReducerActions = {
    initializedSuccess: () => ({type: INITIALIZED_SUCCESS} as const)
}

export const initializeApp = (): ThunkAction<void, AppStateType, unknown, GetActionsTypes<typeof appReducerActions>> => (dispatch) => {
    let promise = dispatch(getAuthUserData());

    Promise.all([promise])
        .then(() => {
            dispatch(appReducerActions.initializedSuccess());
        });
};
export default appReducer;