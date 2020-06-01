import {searchApi} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';

type TopMenuObjectType = {
    categoryTitle: string,
    url: string,
    hasPtypes: boolean,
    ptypesList: Array<{
        ptypeTitle: string,
        url: string
    }>
}
type SearchProductType = {
    id: string,
    brand: string,
    productTitle: string,
    image: string
}
let initialState = {
    topMenu: [
        {
            'categoryTitle': 'Top Sales',
            'url': 'top-sales',
            'hasPtypes': true,
            'ptypesList': [
                {
                    'ptypeTitle': 'Cell Phones',
                    'url': 'cell-phones'
                },
                {
                    'ptypeTitle': 'Cameras',
                    'url': 'cameras'
                },
                {
                    'ptypeTitle': 'Computers',
                    'url': 'computers'
                },
                {
                    'ptypeTitle': 'TV, Audio',
                    'url': 'tv-audio'
                },
                {
                    'ptypeTitle': 'Video Games',
                    'url': 'video-games'
                }
            ]
        },
        {
            'categoryTitle': 'Brand Focus',
            'url': 'brand-focus',
            'hasPtypes': true,
            'ptypesList': [
                {
                    'ptypeTitle': 'Cell Phones',
                    'url': 'cell-phones'
                },
                {
                    'ptypeTitle': 'Cameras',
                    'url': 'cameras'
                },
                {
                    'ptypeTitle': 'Computers',
                    'url': 'computers'
                },
                {
                    'ptypeTitle': 'TV, Audio',
                    'url': 'tv-audio'
                },
                {
                    'ptypeTitle': 'Video Games',
                    'url': 'video-games'
                }
            ]
        },
        {
            'categoryTitle': 'Hi-Tech',
            'url': 'hi-tech',
            'hasPtypes': true,
            'ptypesList': [
                {
                    'ptypeTitle': 'Cell Phones',
                    'url': 'cell-phones'
                },
                {
                    'ptypeTitle': 'Cameras',
                    'url': 'cameras'
                },
                {
                    'ptypeTitle': 'Computers',
                    'url': 'computers'
                },
                {
                    'ptypeTitle': 'TV, Audio',
                    'url': 'tv-audio'
                },
                {
                    'ptypeTitle': 'Video Games',
                    'url': 'video-games'
                }
            ]
        },
        {
            'categoryTitle': 'Best Sellers',
            'url': 'best-sellers',
            'hasPtypes': true,
            'ptypesList': [
                {
                    'ptypeTitle': 'Cell Phones',
                    'url': 'cell-phones'
                },
                {
                    'ptypeTitle': 'Cameras',
                    'url': 'cameras'
                },
                {
                    'ptypeTitle': 'Computers',
                    'url': 'computers'
                },
                {
                    'ptypeTitle': 'TV, Audio',
                    'url': 'tv-audio'
                },
                {
                    'ptypeTitle': 'Video Games',
                    'url': 'video-games'
                }
            ]
        },
        {
            'categoryTitle': 'Projects',
            'url': 'projects',
            'hasPtypes': true,
            'ptypesList': [
                {
                    'ptypeTitle': 'Cell Phones',
                    'url': 'cell-phones'
                },
                {
                    'ptypeTitle': 'Cameras',
                    'url': 'cameras'
                },
                {
                    'ptypeTitle': 'Computers',
                    'url': 'computers'
                },
                {
                    'ptypeTitle': 'TV, Audio',
                    'url': 'tv-audio'
                },
                {
                    'ptypeTitle': 'Video Games',
                    'url': 'video-games'
                }
            ]
        }
    ] as Array<TopMenuObjectType>,
    mainMenu: [
        {
            'title': 'Home',
            'url': '#'
        },
        {
            'title': 'All Brands',
            'url': '/all-brands'
        },
        {
            'title': 'Delivery & Payment',
            'url': '#'
        },
        {
            'title': 'Guarantee',
            'url': '#'
        },
        {
            'title': 'About Us',
            'url': '/about-us/'
        }
    ] as Array<{
        title: string,
        url: string
    }>,
    searchProducts: [] as Array<SearchProductType>
}

type InitialStateType = typeof initialState;

const headerReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case SEARCH_PRODUCTS:
            return {
                ...state,
                'searchProducts': action.data
            };
        default:
            return state;
    }
}
type ActionsTypes = SetSearchProductsActionType;

type SetSearchProductsActionType = {
    type: typeof SEARCH_PRODUCTS,
    data: Array<SearchProductType>
}
export const setSearchProducts = (data: Array<SearchProductType>): SetSearchProductsActionType => ({type: SEARCH_PRODUCTS, data});

export const searchProducts = (query: string): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes> => async(dispatch) => {
    try{
        let response = await searchApi.searchProducts(query);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        if(response.data) {
            dispatch(setSearchProducts(response.data.data))
        }
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
        dispatch(setSearchProducts([]))
    }
}

export default headerReducer;