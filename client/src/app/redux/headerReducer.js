import {searchApi} from "../api/api";

const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';

let initialState = {
    "topMenu": [
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
    ],
    'mainMenu': [
        {
            'title': 'Home',
            'url': '#'
        },
        {
            'title': 'Devices',
            'url': '#'
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
    ],
    "searchProducts": []
}

const headerReducer = (state = initialState, action) => {
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

export const setSearchProducts = (data) => ({type: SEARCH_PRODUCTS, data});

export const searchProducts = (query) => async(dispatch) => {
    let result = await searchApi.searchProducts(query);

    if(result.data) {
        dispatch(setSearchProducts(result.data.data))
    }
}

export default headerReducer;