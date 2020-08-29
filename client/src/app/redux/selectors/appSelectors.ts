import {AppStateType} from "../store";

export const GetInitialized = (state: AppStateType): boolean => {
    return state.appReducer.initialized;
}