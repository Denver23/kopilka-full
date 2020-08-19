import {AppStateType} from "../store";

export const GetEditMode = (state: AppStateType): boolean => {
    return state.profileReducer.editMode;
}

export const GetUserName = (state: AppStateType): string | null => {
    return state.profileReducer.name;
}

export const GetUserSurname = (state: AppStateType): string | null => {
    return state.profileReducer.surname;
}

export const GetUserPhone = (state: AppStateType): string | null => {
    return state.profileReducer.phone;
}

export const GetUserNumberOfPurchases = (state: AppStateType): number | null => {
    return state.profileReducer.numberOfPurchases;
}