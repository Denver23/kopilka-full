import {getAuthUserData} from "./authReducer";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const INITIALIZED_SUCCESS = 'INITIALIZED_SUCCESS';

let initialState = {
    initialized: false
}

type InitialStateType = typeof initialState;

const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
type ActionsTypes = InitializedSuccessActionType;

type InitializedSuccessActionType = {
    type: typeof INITIALIZED_SUCCESS
}
export const initializedSuccess = (): InitializedSuccessActionType => ({type: INITIALIZED_SUCCESS});

export const initializeApp = (): ThunkAction<void, AppStateType, unknown, ActionsTypes> => (dispatch) => {
    let promise = dispatch(getAuthUserData());

    Promise.all([promise])
        .then(() => {
            dispatch(initializedSuccess());
        });
};
export default appReducer;