import axios from "axios";
import {
    CategoriesListItemType,
    categoriesListRequestObjectType, CategoryRefineType,
    categoryRequestObjectType, changeProductsParamsTypes, ProductInListType,
    ProductListItemType,
    RefineType, SaveCategoryType,
    SaveProductType, SetCategoryType,
    SetProductType
} from "../types/types";

export const baseURL = 'http://localhost:5000/';

const instance = axios.create({
    baseURL
});

const isAccessTokenExpired = (exp: number): boolean => {
    const accessTokenExpDate = exp - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)

    return accessTokenExpDate <= nowTime
};

instance.interceptors.request.use(request => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken !== undefined && refreshToken !== undefined) {
        let exp = Number(localStorage.getItem('exp'));

        if (isAccessTokenExpired(exp) && refreshToken) {
            return authAPI.refreshTokens(String(localStorage.getItem('userId')))
                .then(response => {
                    if(!response.data.errorMessage) {
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('refreshToken', response.data.refreshToken);
                        localStorage.setItem('exp', JSON.parse(atob(response.data.accessToken.split('.')[1])).exp);
                        request.headers.authorization = response.data.accessToken;
                    } else {
                        localStorage.removeItem('userId');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('exp');
                    }
                    return request
                }).catch(error => Promise.reject(error))
        } else {
            request.headers.authorization = accessToken;
            return request
        }
    } else {
        delete request.headers.Authorization;
    }
    return request;
});

type MeResponseType = {
    errorMessage?: string,
    login: string,
    id: string,
    email: string
};
type RefreshTokenResponseType = {
    errorMessage?: string,
    accessToken: string,
    refreshToken: string
};
type SignOutResponseType = {
    errorMessage?: string
}
type LoginResponseType = {
    errorMessage?: string,
    accessToken: string,
    refreshToken: string,
    userId: string,
    login: string,
};

export const authAPI = {
    me() {
        let userId = localStorage.getItem('userId');
        return instance.get<MeResponseType>(`/api/auth/me?userId=${userId}`);
    },
    login(email: string, password: string, rememberMe: boolean) {
        return instance.post<LoginResponseType>('/api/auth/login', {email,password,rememberMe});
    },
    refreshTokens(userId: string) {
        return axios.post<RefreshTokenResponseType>(`${baseURL}api/auth/refresh-tokens`, {refreshToken: localStorage.getItem('refreshToken'), userId})
    },
    signOut(userId: string) {
        const refreshToken = localStorage.getItem('refreshToken');
        return instance.post<SignOutResponseType>('/api/auth/sign-out', {userId, refreshToken})
    }
}

type LoadProductResponseType = {
    errorMessage?: string,
    product: SetProductType
}
type LoadBrandsListResponseType = {
    errorMessage?: string,
    brands: Array<{name: string, url: string}>
}
type LoadCategoriesListResponseType = {
    errorMessage?: string,
    categories: Array<{name: string, url: string}>
}
type LoadNewRefinesForProductResponseType = {
    errorMessage?: string,
    refines: Array<RefineType>
}
export const productAPI = {
    loadProduct(id: string) {
        return instance.get<LoadProductResponseType>(`/admin-api/product/id${id}`);
    },
    getBrandsList(value: string) {
        return instance.get<LoadBrandsListResponseType>(`/admin-api/brands?value=${value}`);
    },
    getCategoriesList(value: string) {
        return instance.get<LoadCategoriesListResponseType>(`/admin-api/categories?value=${value}`);
    },
    getNewRefinesForProduct(category: string) {
        return instance.get<LoadNewRefinesForProductResponseType>(`/admin-api/categories/refines/${category}`);
    },
    saveProduct(data: SaveProductType) {
        return instance.post<LoadProductResponseType>(`/admin-api/product/id${data.id}`,{data})
    },
    addNewProduct(data: SaveProductType) {
        return instance.post<{id?: string, errorMessage?: string}>(`/admin-api/product/new-product`,{data})
    },
    deleteProduct(id: string) {
        return instance.post<{id?: string, errorMessage?: string}>(`/admin-api/product/delete-product`,{id})
    }
};

type loadProductsListResponseType = {
    errorMessage?: string,
    products: Array<ProductListItemType>,
    totalCount: number
}

export const productListAPI = {
    loadProductsList(page: number, productsOnPage: number, requestObject: categoryRequestObjectType) {
        let queryString = (Object.keys(requestObject) as Array<keyof categoryRequestObjectType>).reduce(function(result, currentItem){return `&${currentItem}=${requestObject[currentItem]}`}, '');
        return instance.get<loadProductsListResponseType>(`/admin-api/products-list?page=${page}&productsOnPage=${productsOnPage}${queryString}`);
    },
    changeProductsProps(items: Array<string>, params: changeProductsParamsTypes) {
        return instance.put<{errorMessage?: string}>('/admin-api/products-list', {items, params});
    }
};

type loadCategoriesListResponseType = {
    errorMessage?: string,
    categories: Array<CategoriesListItemType>,
    totalCount: number
}

export const categoriesListAPI = {
    loadCategoriesList(page: number, categoriesOnPage: number, requestObject: categoriesListRequestObjectType) {
        let queryString = (Object.keys(requestObject) as Array<keyof categoriesListRequestObjectType>).reduce(function(result, currentItem){return `&${currentItem}=${requestObject[currentItem]}`}, '');
        return instance.get<loadCategoriesListResponseType>(`/admin-api/categories-list?page=${page}&productsOnPage=${categoriesOnPage}${queryString}`);
    }
};

type LoadCategoryResponseType = {
    errorMessage?: string,
    category: SetCategoryType
}

export const categoryAPI = {
    loadCategory(id: string) {
        return instance.get<LoadCategoryResponseType>(`/admin-api/category/id${id}`);
    },
    saveCategory(data: SaveCategoryType) {
        return instance.post<LoadCategoryResponseType>(`/admin-api/category/id${data.id}`,{data})
    },
};