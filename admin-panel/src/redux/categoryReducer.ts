import {categoryAPI, productAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {
    ProductInListType,
    SetProductType,
    ChildProductType,
    GetActionsTypes,
    productImage,
    RefineType, SaveProductType, CategoryRefineType, SetCategoryType, SaveCategoryType
} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";
import {checkRowValidator} from "../utils/productFunc/productFunc";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_CATEGORY = 'SET_CATEGORY';
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
    categoryName: null as string | null,
    url: null as string | null,
    hidden: false as boolean,
    childCategories: [] as Array<string>,
    slides: [] as Array<string>,
    refines: [] as Array<CategoryRefineType>,
    bestSellers: [] as Array<ProductInListType>
};

type InitialStateType = typeof initialState;

const categoryReducer = (state = initialState, action: GetActionsTypes<typeof categoryReducerActions>): InitialStateType => {
    switch (action.type) {
        case SET_CATEGORY:
            return {
                ...state,
                id: action.data.id,
                hidden: action.data.hidden,
                categoryName: action.data.categoryName,
                url: action.data.url,
                childCategories: action.data.childCategories,
                slides: action.data.slides,
                refines: action.data.refines,
                bestSellers: action.data.bestSellers
            };
        case TOGGLE_LOADING:
            return {...state, 'loading': action.loading};
        case DELETE_IMAGE:
            let newImagesList = state.slides.filter((slide, index) => {
                return index !== action.index;
            });
            return {...state, slides: newImagesList};
        case CHANGE_IMAGE:
            let newImagesData = state.slides.map(slide => {
                if (slide === action.oldSrc) {
                    return action.src;
                }
                return slide;
            });
            return {...state, slides: newImagesData};
        case ADD_IMAGE:
            let newImagesCount = [...state.slides];

            newImagesCount.push('');
            return {...state, slides: newImagesCount};
        case DATA_CHANGE:
            return {...state, ...action.data};
        case CHANGE_HIDDEN_STATUS:
            return {...state, hidden: action.value};
        default:
            return state;
    }
}

export const categoryReducerActions = {
    toggleLoading: (loading: boolean) => ({type: TOGGLE_LOADING, loading} as const),
    setCategory: (data: SetCategoryType) => ({type: SET_CATEGORY, data} as const),
    deleteImage: (index: number) => ({type: DELETE_IMAGE, index} as const),
    changeImage: (oldSrc: string, src: string) => ({type: CHANGE_IMAGE, oldSrc, src} as const),
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


type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, GetActionsTypes<typeof categoryReducerActions>>
export const loadCategory = (id: string): ThunkType => async (dispatch) => {
    dispatch(categoryReducerActions.toggleLoading(true));
    try {
        let response = await categoryAPI.loadCategory(id);

        if (!!response.data.errorMessage) {
            throw new ResponseMessageError(response);
        }

        dispatch(categoryReducerActions.setCategory(response.data.category));
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);

        dispatch(categoryReducerActions.setCategory({
            id: null,
            categoryName: null,
            url: null,
            hidden: false,
            childCategories: [],
            slides: [],
            refines: [],
            bestSellers: []
        }));

    } finally {
        dispatch(categoryReducerActions.toggleLoading(false));
    }
};

export const saveCategory = (): ThunkType => async (dispatch, getState) => {
    dispatch(categoryReducerActions.toggleLoading(true));
    try {
        let categoryState = getState().categoryReducer;

        let errors: Array<string> = [];

        let data: SaveCategoryType = {
            id: categoryState.id !== null ? categoryState.id : '',
            categoryName: categoryState.categoryName !== null ? categoryState.categoryName : '',
            url: categoryState.url !== null ? categoryState.url : '',
            hidden: categoryState.hidden,
            childCategories: categoryState.childCategories,
            slides: categoryState.slides,
            refines: categoryState.refines,
            bestSellers: categoryState.bestSellers
        };

        if (errors.length === 0) {
            let response = await categoryAPI.saveCategory(data);

            if (!!response.data.errorMessage) {
                throw new ResponseMessageError(response);
            }

            dispatch(categoryReducerActions.setCategory(response.data.category));
        }
    } catch (err) {
        let message = err.response && err.response.data.errorMessage ? err.response.data.errorMessage : err.message;
        console.log(`${err.name}: ${message}`);
    } finally {
        dispatch(categoryReducerActions.toggleLoading(false));
    }
};


/*export const addNewCategory = (): ThunkType => async (dispatch, getState) => {
    dispatch(categoryReducerActions.toggleLoading(true));
    try {
        let productState = getState().productReducer;
        let childProductsForSave = productState.childProducts.filter(item => {
            if (item.sku === null || item.sku === '') {
                return false
            }
            return true;
        });
        dispatch(categoryReducerActions.setNewChildProductsForSave(childProductsForSave));
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

        dispatch(categoryReducerActions.setNewImageList(images));

        const categoryCF = getState().productReducer.productCategoryCustomFields.map(item => {
            return item.title
        });
        let validateCustomFields = productState.customFields.filter(customField => {
            return categoryCF.includes(Object.keys(customField)[0]);
        });
        dispatch(categoryReducerActions.setNewCustomFieldsObject({customFields: validateCustomFields}))
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

            dispatch(categoryReducerActions.setProduct({
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
        dispatch(categoryReducerActions.toggleLoading(false));
    }
};

export const deleteProduct = (): ThunkType => async (dispatch, getState) => {
    dispatch(categoryReducerActions.toggleLoading(true));
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
        dispatch(categoryReducerActions.toggleLoading(false));
    }
};*/

export default categoryReducer;