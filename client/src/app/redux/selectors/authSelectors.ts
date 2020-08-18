import {AppStateType} from "../store";
import {AuthReducerInitialStateType} from "../authReducer";

export const GetUserId = (state: AppStateType): string | null => {
    return state.authReducer.userId;
}
export const GetUserFetching = (state: AppStateType): boolean => {
    return state.authReducer.isFetching;
}
export const GetProfile = (state: AppStateType): AuthReducerInitialStateType => {
    return state.authReducer;
}