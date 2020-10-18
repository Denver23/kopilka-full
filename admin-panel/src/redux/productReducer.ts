import {productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {
    ProductInListType,
    SetProductType,
    ChildProductType,
    GetActionsTypes,
    productImage,
    RefineType, SaveProductType
} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {checkRowValidator} from "../utils/productFunc/productFunc";

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
const CHANGE_CHILD_PRODUCT_OPTION_VALUE = 'CHANGE_CHILD_PRODUCT_OPTION_VALUE';
const SET_NEW_CHILD_PRODUCTS = 'SET_NEW_CHILD_PRODUCTS';
const SET_NEW_IMAGE_LIST = 'SET_NEW_IMAGE_LIST';
const SET_NEW_CUSTOM_FIELDS_OBJECT = 'SET_NEW_CUSTOM_FIELDS_OBJECT';
const DELETE_CHILD_PRODUCT = 'DELETE_CHILD_PRODUCT';
const ADD_NEW_CHILD_PRODUCT = 'ADD_NEW_CHILD_PRODUCT';
const CHANGE_HIDDEN_STATUS = 'CHANGE_HIDDEN_STATUS';

function makeCounter() {
    let count = 0;

    return function () {
        return count++;
    };
}

let counter = makeCounter();

let initialState = {
    loading: false as boolean,
    id: null as string | null,
    brand: null as string | null,
    category: null as string | null,
    productTitle: null as string | null,
    hidden: false as boolean,
    childProducts: [] as Array<ChildProductType>,
    images: [] as Array<productImage>,
    shortDescription: null as string | null,
    specifications: null as string | null,
    features: null as string | null,
    customFields: [] as Array<{ [key: string]: Array<string> }>,
    recommendedProducts: [] as Array<ProductInListType>,
    productCategoryCustomFields: [] as Array<RefineType>
};

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
                hidden: action.data.hidden,
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
            });
            return {...state, images: newImagesList};
        case CHANGE_IMAGE:
            let newImagesData = state.images.map(image => {
                if (image._id === action.imageObject._id) {
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
                if (name === action.customFieldName) {
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
                if (name === action.customFieldName) {
                    newField[name] = customField[name].map(item => {
                        if (item === action.oldTag) {
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
                if (name === action.customFieldName) {
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
            let newCF: { [key: string]: Array<string> } = {};
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
                let newItemOptions: { [key: string]: string } = {};
                Object.keys(item.options).forEach(optionName => {
                    if (optionName === action.oldValue) {
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
        case CHANGE_CHILD_PRODUCT_OPTION_VALUE:
            let changedOptionValueChildProducts = [...state.childProducts].map((item, index) => {
                let newChild: any = item;
                if (index === action.index) {
                    if (action.option) {
                        newChild.options[action.position] = action.newValue.toString();
                    } else {
                        newChild[action.position as keyof ChildProductType] = action.newValue;
                    }
                }
                return newChild;
            });
            return {...state, childProducts: changedOptionValueChildProducts};
        case SET_NEW_CHILD_PRODUCTS:
            return {...state, childProducts: [...action.childProducts]};
        case SET_NEW_IMAGE_LIST:
            return {...state, images: [...action.imageList]};
        case SET_NEW_CUSTOM_FIELDS_OBJECT:
            return {...state, ...action.data};
        case DELETE_CHILD_PRODUCT:
            let childProductsWOIndexProduct = [...state.childProducts].filter((childProduct, index) => {
                return index !== action.index;
            });
            return {...state, childProducts: childProductsWOIndexProduct};
        case ADD_NEW_CHILD_PRODUCT:
            let newChild: ChildProductType = {
                sku: '',
                price: 0,
                quantity: 0,
                options: {}
            };
            Object.keys(state.childProducts[0] ? state.childProducts[0].options : {}).forEach(option => {
                newChild.options[option] = ''
            });
            let addedChildProducts = [...state.childProducts];
            addedChildProducts.push(newChild);
            return {...state, childProducts: addedChildProducts};
        case CHANGE_HIDDEN_STATUS:
            return {...state, hidden: action.value};
        default:
            return state;
    }
}

export const productReducerActions = {
    toggleLoading: (loading: boolean) => ({type: TOGGLE_LOADING, loading} as const),
    setProduct: (data: SetProductType) => ({type: SET_PRODUCT, data} as const),
    deleteImage: (_id: string) => ({type: DELETE_IMAGE, _id} as const),
    changeImage: (imageObject: productImage) => ({type: CHANGE_IMAGE, imageObject} as const),
    addImage: () => ({type: ADD_IMAGE} as const),
    dataChange: (data: { [key: string]: string }) => ({type: DATA_CHANGE, data} as const),
    deleteCustomFieldTag: (tag: string, customFieldName: string) => ({
        type: DELETE_CUSTOMFIELD_TAG,
        tag,
        customFieldName
    } as const),
    changeCustomFieldTag: (oldTag: string, newTag: string, customFieldName: string) => ({
        type: CHANGE_CUSTOMFIELD_TAG,
        oldTag,
        newTag,
        customFieldName
    } as const),
    addNewCustomFieldTag: (newTag: string, customFieldName: string) => ({
        type: ADD_NEW_CUSTOMFIELD_TAG,
        newTag,
        customFieldName
    } as const),
    setNewProductRefines: (data: Array<RefineType>) => ({type: SET_PR_REFINES, data} as const),
    deleteProductRefine: (name: string) => ({type: DELETE_PR_REFINE, name} as const),
    addNewPrRefine: (value: string) => ({type: ADD_NEW_PR_REFINE, value} as const),
    deleteVirtOption: (value: string) => ({type: DELETE_VIRT_OPTION, value} as const),
    editVirtOption: (oldValue: string, newValue: string) => ({
        type: EDIT_VIRT_OPTION_NAME,
        oldValue,
        newValue
    } as const),
    addVirtOption: (value: string) => ({type: ADD_NEW_VIRT_OPTION, value} as const),
    changeChildProductOptionValue: (newValue: string | number, position: string, index: number, option: boolean) => ({
        type: CHANGE_CHILD_PRODUCT_OPTION_VALUE,
        newValue,
        position,
        index,
        option
    } as const),
    setNewChildProductsForSave: (childProducts: Array<ChildProductType>) => ({
        type: SET_NEW_CHILD_PRODUCTS,
        childProducts
    } as const),
    setNewImageList: (imageList: Array<productImage>) => ({type: SET_NEW_IMAGE_LIST, imageList} as const),
    setNewCustomFieldsObject: (data: { customFields: Array<{ [key: string]: Array<string> }> }) => ({
        type: SET_NEW_CUSTOM_FIELDS_OBJECT,
        data
    } as const),
    deleteChildProduct: (index: number) => ({type: DELETE_CHILD_PRODUCT, index} as const),
    addNewChildProduct: () => ({type: ADD_NEW_CHILD_PRODUCT} as const),
    changeHiddenStatus: (value: boolean) => ({type: CHANGE_HIDDEN_STATUS, value} as const)
};


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof productReducerActions>>
export const loadProduct = (id: string): ThunkType => async (dispatch) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let response = await productAPI.loadProduct(id);

        if (!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productReducerActions.setProduct(response.data.product));
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(productReducerActions.setProduct({
            id: null,
            brand: null,
            category: null,
            productTitle: null,
            hidden: false,
            childProducts: [],
            images: [],
            customFields: [],
            shortDescription: null,
            specifications: null,
            features: null,
            recommendedProducts: [],
            productCategoryCustomFields: []
        }));
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
};

export const loadCategoryRefines = (category: string): ThunkType => async (dispatch) => {
    try {
        let response = await productAPI.getNewRefinesForProduct(category);

        if (!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(productReducerActions.setNewProductRefines(response.data.refines));
        dispatch(productReducerActions.dataChange({category: category}));
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    }
};

export const saveProduct = (): ThunkType => async (dispatch, getState) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let productState = getState().productReducer;
        let childProductsForSave = productState.childProducts.filter(item => {
            if (item.sku === null || item.sku === '') {
                return false
            }
            return true;
        });
        dispatch(productReducerActions.setNewChildProductsForSave(childProductsForSave));
        let childValidator = checkRowValidator(childProductsForSave);
        let emptyOptions = childProductsForSave.filter((item: any) => {
            let options = item.options;
            Object.keys(options).forEach(option => {
                if (item[option] === '') {
                    return true;
                }
                return false
            })
        });

        let images = productState.images.filter(image => {
            if (image.original !== '') {
                return true;
            }
            return false;
        });

        dispatch(productReducerActions.setNewImageList(images));

        const categoryCF = getState().productReducer.productCategoryCustomFields.map(item => {
            return item.title
        });
        let validateCustomFields = productState.customFields.filter(customField => {
            return categoryCF.includes(Object.keys(customField)[0]);
        });
        dispatch(productReducerActions.setNewCustomFieldsObject({customFields: validateCustomFields}))
        let errors: Array<string> = [];

        if (productState.id == null || productState.id.length == 0) {
            errors.push('ProductId is null');
        } else if (productState.brand == null || productState.brand.length == 0) {
            errors.push('Product Brand is null');
        } else if (productState.category == null || productState.category.length == 0) {
            errors.push('Product Category is null');
        } else if (productState.productTitle == null || productState.productTitle.length == 0) {
            errors.push('Product Title is null');
        } else if (childValidator.length || emptyOptions.length) {
            errors.push('Some child products has the same options or empty');
        }

        let data: SaveProductType = {
            id: productState.id !== null ? productState.id : '',
            brand: productState.brand !== null ? productState.brand : '',
            category: productState.category !== null ? productState.category : '',
            productTitle: productState.productTitle !== null ? productState.productTitle : '',
            hidden: productState.hidden,
            childProducts: childProductsForSave,
            images: images,
            shortDescription: productState.shortDescription !== null ? productState.shortDescription : '',
            specifications: productState.specifications !== null ? productState.specifications : '',
            features: productState.features !== null ? productState.features : '',
            customFields: validateCustomFields
        };
        if (errors.length === 0) {
            let response = await productAPI.saveProduct(data);

            if (!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            dispatch(productReducerActions.setProduct(response.data.product));
        }
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
};


export const addNewProduct = (): ThunkType => async (dispatch, getState) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let productState = getState().productReducer;
        let childProductsForSave = productState.childProducts.filter(item => {
            if (item.sku === null || item.sku === '') {
                return false
            }
            return true;
        });
        dispatch(productReducerActions.setNewChildProductsForSave(childProductsForSave));
        let childValidator = checkRowValidator(childProductsForSave);
        let emptyOptions = childProductsForSave.filter((item: any) => {
            let options = item.options;
            Object.keys(options).forEach(option => {
                if (item[option] === '') {
                    return true;
                }
                return false
            })
        });

        let images = productState.images.filter(image => {
            if (image.original !== '') {
                return true;
            }
            return false;
        });

        dispatch(productReducerActions.setNewImageList(images));

        const categoryCF = getState().productReducer.productCategoryCustomFields.map(item => {
            return item.title
        });
        let validateCustomFields = productState.customFields.filter(customField => {
            return categoryCF.includes(Object.keys(customField)[0]);
        });
        dispatch(productReducerActions.setNewCustomFieldsObject({customFields: validateCustomFields}))
        let errors: Array<string> = [];

        if (productState.brand == null || productState.brand.length == 0) {
            errors.push('Product Brand is null');
        } else if (productState.category == null || productState.category.length == 0) {
            errors.push('Product Category is null');
        } else if (productState.productTitle == null || productState.productTitle.length == 0) {
            errors.push('Product Title is null');
        } else if (childValidator.length || emptyOptions.length) {
            errors.push('Some child products has the same options or empty');
        } else if (productState.childProducts.length === 0) {
            errors.push('Add min 1 child product for save')
        }

        let data: SaveProductType = {
            brand: productState.brand !== null ? productState.brand : '',
            category: productState.category !== null ? productState.category : '',
            productTitle: productState.productTitle !== null ? productState.productTitle : '',
            hidden: productState.hidden,
            childProducts: childProductsForSave,
            images: images,
            shortDescription: productState.shortDescription !== null ? productState.shortDescription : '',
            specifications: productState.specifications !== null ? productState.specifications : '',
            features: productState.features !== null ? productState.features : '',
            customFields: validateCustomFields
        };
        if (errors.length === 0) {
            let response = await productAPI.addNewProduct(data);

            if (!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            dispatch(productReducerActions.setProduct({
                id: response.data.id as string,
                brand: null,
                category: null,
                productTitle: null,
                hidden: false,
                childProducts: [],
                images: [],
                customFields: [],
                shortDescription: null,
                specifications: null,
                features: null,
                recommendedProducts: [],
                productCategoryCustomFields: []
            }));
        }
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
};

export const deleteProduct = (): ThunkType => async (dispatch, getState) => {
    dispatch(productReducerActions.toggleLoading(true));
    try {
        let productState = getState().productReducer;

        let response = await productAPI.deleteProduct(productState.id !== null ? productState.id : '');

        if (!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    } finally {
        dispatch(productReducerActions.toggleLoading(false));
    }
};

export default productReducer;