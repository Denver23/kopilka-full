import {AppStateType} from "../store";

export const GetInitialized = (state: AppStateType): boolean => {
    return state.appReducer.initialized;
}
export const GetTheme = (state: AppStateType): 'light' | 'dark' => {
    return state.appReducer.theme;
}