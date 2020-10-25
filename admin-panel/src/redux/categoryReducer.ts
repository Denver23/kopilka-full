import {categoryAPI} from "../api/api";
import ResponseMessageError from "../utils/errors/responseErrors";
import {
    ProductInListType,
    GetActionsTypes,
    CategoryRefineType, SetCategoryType, SaveCategoryType, ChildCategoryType
} from "../types/types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";

const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SET_CATEGORY = 'SET_CATEGORY';
const DELETE_IMAGE = 'DELETE_IMAGE';
const CHANGE_IMAGE = 'CHANGE_IMAGE';
const ADD_IMAGE = 'ADD_IMAGE';
const DATA_CHANGE = 'DATA_CHANGE';
const CHANGE_HIDDEN_STATUS = 'CHANGE_HIDDEN_STATUS';
const DELETE_CT_REFINE = 'DELETE_CT_REFINE';
const DELETE_REFINE_TAG = 'DELETE_REFINE_TAG';
const CHANGE_REFINE_TAG = 'CHANGE_REFINE_TAG';
const ADD_NEW_REFINE_TAG = 'ADD_NEW_REFINE_TAG';
const ADD_NEW_REFINE = 'ADD_NEW_REFINE';
const DELETE_CHILD_CATEGORY = 'DELETE_CHILD_CATEGORY';

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
    childCategories: [] as Array<ChildCategoryType>,
    slides: [] as Array<string>,
    refines: [] as Array<CategoryRefineType>,
    bestSellers: [] as Array<ProductInListType>,
    productsQuantity: 0 as number
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
                bestSellers: action.data.bestSellers,
                productsQuantity: action.data.productsQuantity
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
        case DELETE_CT_REFINE:
            let newRefineList = [...state.refines].filter(item => {
                return item.title !== action.title;
            });
            return {...state, refines: newRefineList};
        case DELETE_REFINE_TAG:
            let newTagsList = [...state.refines].map(refine => {
                if (refine.title === action.refineName) {
                    let newRefine = refine;
                    newRefine.items = newRefine.items.filter(item => item !== action.tag);
                    return newRefine;
                }
                return refine;
            });
            return {...state, refines: newTagsList};
        case CHANGE_REFINE_TAG:
            let changedTagsList = [...state.refines].map(refine => {
                if (refine.title === action.refineName) {
                    let newRefine = refine;
                    newRefine.items = newRefine.items.map(item => {
                        if (item === action.oldTag) {
                            return action.newTag
                        }
                        return item;
                    });
                    return newRefine;
                }
                return refine;
            });
            return {...state, refines: changedTagsList};
        case ADD_NEW_REFINE_TAG:
            let newItemTagsList = [...state.refines].map(refine => {
                if (refine.title === action.refineName) {
                    let newRefine = refine;
                    newRefine.items.push(action.newTag);
                    return newRefine;
                }
                return refine;
            });
            return {...state, refines: newItemTagsList};
        case ADD_NEW_REFINE:
            let newAddedRefineList = [...state.refines];
            newAddedRefineList.push({
                items: [],
                title: action.value,
                type: 'checkbox'
            });
            return {...state, refines: newAddedRefineList};
        case DELETE_CHILD_CATEGORY:
            let deletedChildCategoriesList = [...state.childCategories].filter(category => category._id !== action.id);
            return {...state, childCategories: deletedChildCategoriesList};
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
    deleteRefineTag: (tag: string, refineName: string) => ({
        type: DELETE_REFINE_TAG,
        tag,
        refineName
    } as const),
    changeRefineTag: (oldTag: string, newTag: string, refineName: string) => ({
        type: CHANGE_REFINE_TAG,
        oldTag,
        newTag,
        refineName
    } as const),
    addNewRefineTag: (newTag: string, refineName: string) => ({
        type: ADD_NEW_REFINE_TAG,
        newTag,
        refineName
    } as const),
    deleteCategoryRefine: (title: string) => ({type: DELETE_CT_REFINE, title} as const),
    addNewRefine: (value: string) => ({type: ADD_NEW_REFINE, value} as const),
    deleteChildCategory: (id: string) => ({type: DELETE_CHILD_CATEGORY, id} as const),
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
            bestSellers: [],
            productsQuantity: 0
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
            childCategories: categoryState.childCategories.map(category => category._id),
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