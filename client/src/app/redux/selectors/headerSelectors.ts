import {AppStateType} from "../store";
import {MainMenuItem, SearchProductType, TopMenuObjectType} from "../../types/types";

export const GetSearchProductsList = (state: AppStateType): Array<SearchProductType> => {
    return state.headerReducer.searchProducts;
}
export const GetMainMenu = (state: AppStateType): Array<MainMenuItem> => {
    return state.headerReducer.mainMenu;
}
export const GetTopMenu = (state: AppStateType): Array<TopMenuObjectType> => {
    return state.headerReducer.topMenu;
}