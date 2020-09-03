import {productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {
    ProductInListType,
    SetProductType,
    ChildProductType,
    GetActionsTypes,
    productImage,
    RefineType
} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_PRODUCT = 'SET_PRODUCT';
const DELETE_IMAGE = 'DELETE_IMAGE';
const CHANGE_IMAGE = 'CHANGE_IMAGE';
const ADD_IMAGE = 'ADD_IMAGE';
const DATA_CHANGE = 'DATA_CHANGE';
const DELETE_CUSTOMFIELD_TAG = 'DELETE_CUSTOMFIELD_TAG';
const CHANGE_CUSTOMFIELD_TAG = 'CHANGE_CUSTOMFIELD_TAG';
const ADD_NEW_CUSTOMFIELD_TAG = 'ADD_NEW_CUSTOMFIELD_TAG';
const SET_PR_REFINES = 'SET_PR_REFINES';
const DELETE_PR_REFINE = 'DELETE_PR_REFINE';
const ADD_NEW_PR_REFINE = 'ADD_NEW_PR_REFINE';
const DELETE_VIRT_OPTION = 'DELETE_VIRT_OPTION';
const EDIT_VIRT_OPTION_NAME = 'EDIT_VIRT_OPTION_NAME';
const ADD_NEW_VIRT_OPTION = 'ADD_NEW_VIRT_OPTION';
function makeCounter() {
    let count = 0;

    return function() {
        return count++; // есть доступ к внешней переменной "count"
    };
}

let counter = makeCounter();

let initialState = {
    loading: false as boolean,
    id: null as string | null,
    brand: null as string | null,
    category: null as string | null,
    productTitle: null as string | null,
    childProducts: [] as Array<ChildProductType>,
    images: [] as Array<productImage>,
    shortDescription: null as string | null,
    specifications: null as string | null,
    features: null as string | null,
    customFields: [] as Array<{[key: string]: Array<string>}>,
    recommendedProducts: [] as Array<ProductInListType>,
    productCategoryCustomFields: [] as Array<RefineType>
}

type InitialStateType = typeof initialState;

const productReducer = (state = initialState, action: GetActionsTypes<typeof productReducerActions>): InitialStateType => {
    switch (action.type) {
        case SET_PRODUCT:
            return {
                ...state,
                id: action.data.id,
                brand: action.data.brand,
                category: action.data.category,
                productTitle: action.data.productTitle,
                childProducts: action.data.childProducts,
                images: action.data.images,
                shortDescription: action.data.shortDescription,
                specifications: action.data.specifications,
                features: action.data.features,
                customFields: action.data.customFields,
                recommendedProducts: action.data.recommendedProducts,
                productCategoryCustomFields: action.data.productCategoryCustomFields
            };
        case TOGGLE_LOADING:
            return {...state, 'loading': action.loading};
        case DELETE_IMAGE:
            let newImagesList = state.images.filter(image => {
                return image._id !== action._id;
            })
            return {...state,images: newImagesList};
        case CHANGE_IMAGE:
            let newImagesData = state.images.map(image => {
                if(image._id === action.imageObject._id) {
                    return action.imageObject;
                }
                return image;
            });
            return {...state, images: newImagesData};
        case ADD_IMAGE:
            let newImagesCount = [...state.images];

            newImagesCount.push({
                _id: `${counter()}`,
                original: '',
                thumbnail: '',
                alt: ''
            });
            return {...state, images: newImagesCount};
        case DATA_CHANGE:
            return {...state, ...action.data};
        case DELETE_CUSTOMFIELD_TAG:
            let newCustomFields = [...state.customFields];
            newCustomFields = newCustomFields.map(customField => {
                let newField = {...customField};
                let name = Object.keys(newField)[0]
                if(name === action.customFieldName) {
                    newField[name] = customField[name].filter(item => {
                        return item !== action.tag;
                    })
                }
                return newField;
            })
            return {...state, customFields: newCustomFields};
        case CHANGE_CUSTOMFIELD_TAG:
            let customFieldsChanged = [...state.customFields];
            customFieldsChanged = customFieldsChanged.map(customField => {
                let newField = {...customField};
                let name = Object.keys(newField)[0]
                if(name === action.customFieldName) {
                    newField[name] = customField[name].map(item => {
                        if(item === action.oldTag) {
                            return action.newTag;
                        }
                        return item;
                    })
                }
                return newField;
            });
            return {...state, customFields: customFieldsChanged};
        case ADD_NEW_CUSTOMFIELD_TAG:
            let customFieldsAdded = [...state.customFields];
            customFieldsAdded = customFieldsAdded.map(customField => {
                let newField = {...customField};
                let name = Object.keys(newField)[0]
                if(name === action.customFieldName) {
                    newField[name].push(action.newTag);
                }
                return newField;
            });
            return {...state, customFields: customFieldsAdded};
        case SET_PR_REFINES:
            return {...state, productCategoryCustomFields: action.data};
        case DELETE_PR_REFINE:
            let newRefinesList = state.customFields.filter(refine => {
                return Object.keys(refine)[0] !== action.name;
            })
            return {...state, customFields: [...newRefinesList]};
        case ADD_NEW_PR_REFINE:
            let newCF: {[key: string]: Array<string>} = {};
            newCF[action.value] = []
            let addedRefinesList = state.customFields;
            addedRefinesList.push(newCF)
            return {...state, customFields: [...addedRefinesList]}
        case DELETE_VIRT_OPTION:
            let newChildProductsWOOption = [...state.childProducts].map(item => {
                let newItemOptions = {...item.options};
                delete newItemOptions[action.value];
                return {...item, options: newItemOptions};
            });
            return {...state, childProducts: newChildProductsWOOption};
        case EDIT_VIRT_OPTION_NAME:
            let newChildProductsWEditOption = [...state.childProducts].map(item => {
                let newItemOptions: {[key: string]: string} = {};
                Object.keys(item.options).forEach(optionName => {
                    if(optionName === action.oldValue) {
                        newItemOptions[action.newValue] = item.options[action.oldValue];
                    } else {
                        newItemOptions[optionName] = item.options[optionName];
                    }
                })
                return {...item, options: newItemOptions};
            })
            return {...state, childProducts: newChildProductsWEditOption};
        case ADD_NEW_VIRT_OPTION:
            let newChildProductsWNewOption = [...state.childProducts].map(item => {
                let newOptions = item.options;
                newOptions[action.value] = ''
                return {...item, options: {...newOptions}}
            })
            return {...state, childProducts: newChildProductsWNewOption};
        default:
            return state;
    }
}

export const productReducerActions = {
    toggleLoading: (loading: boolean) => ({type: TOGGLE_LOADING,loading} as const),
    setProduct: (data: SetProductType) => ({type: SET_PRODUCT, data} as const),
    deleteImage: (_id: string) => ({type: DELETE_IMAGE, _id} as const),
    changeImage: (imageObject: productImage) => ({type: CHANGE_IMAGE, imageObject} as const),
    addImage: () => ({type: ADD_IMAGE} as const),
    dataChange: (data: {[key: string]: string}) => ({type: DATA_CHANGE, data} as const),
    deleteCustomFieldTag: (tag: string, customFieldName: string) => ({type: DELETE_CUSTOMFIELD_TAG, tag, customFieldName} as const),
    changeCustomFieldTag: (oldTag: string, newTag: string, customFieldName: string) => ({type: CHANGE_CUSTOMFIELD_TAG, oldTag, newTag, customFieldName} as const),
    addNewCustomFieldTag: (newTag: string, customFieldName: string) => ({type: ADD_NEW_CUSTOMFIELD_TAG, newTag, customFieldName} as const),
    setNewProductRefines: (data: Array<RefineType>) => ({type: SET_PR_REFINES, data} as const),
    deleteProductRefine: (name: string) => ({type: DELETE_PR_REFINE, name} as const),
    addNewPrRefine: (value: string) => ({type: ADD_NEW_PR_REFINE, value} as const),
    deleteVirtOption: (value: string) => ({type: DELETE_VIRT_OPTION, value} as const),
    editVirtOption: (oldValue: string, newValue: string) => ({type: EDIT_VIRT_OPTION_NAME, oldValue, newValue} as const),
    addVirtOption: (value: string) => ({type: ADD_NEW_VIRT_OPTION, value} as const)
}


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productReducerActions>>
export const loadProduct = (id: string): ThunkType => async (dispatch) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let response = await productAPI.loadProduct(id);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productReducerActions.setProduct(response.data.product));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(productReducerActions.setProduct({
            id: null,
            brand: '',
            category: '',
            productTitle: '',
            childProducts: [],
            images: [],
            customFields: [],
            shortDescription: '',
            specifications: '',
            features: '',
            recommendedProducts: [],
            productCategoryCustomFields: []
        }));
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
}

export const loadCategoryRefines = (category: string): ThunkType => async (dispatch) => {
    try {
        let response = await productAPI.getNewRefinesForProduct(category);

        if(!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productReducerActions.setNewProductRefines(response.data.refines));
        dispatch(productReducerActions.dataChange({category: category}));
    } catch(err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
}

export default productReducer;