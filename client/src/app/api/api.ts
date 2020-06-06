import axios from "axios";
import {
    ChangeProfileDataType,
    CheckoutProduct,
    InitializeProductsType,
    PrGroupDataType,
    SetProductType,
    ProductTypeAPI,
    ProductType, OptionType, SearchProductType, BrandType
} from "../types/types";

export const baseURL = 'http://localhost:5000/api/';

const instance = axios.create({
    baseURL
});

const isAccessTokenExpired = (exp: number): boolean => {
    const accessTokenExpDate = exp - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)

    return accessTokenExpDate <= nowTime
}

instance.interceptors.request.use(request => {
    if (!!localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
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

type SignUpResponseType = {
    errorMessage?: string,
    user: {
        userId: string,
        email: string,
        login: string,
    },
    accessToken: string,
    refreshToken: string
};
type SignUpDataType = {
    name: string,
    surname: string,
    login: string,
    email: string,
    password: string,
    phone: string,
    subscribeToNews: boolean
};
type MeResponseType = {
    errorMessage?: string,
    login: string,
    id: string,
    email: string
};
type LoginResponseType = {
    errorMessage?: string,
    accessToken: string,
    refreshToken: string,
    userId: string,
    login: string,
};
type LoadProfileResponseType = {
    errorMessage?: string,
    name: string,
    surname: string,
    login: string,
    phone: string,
    email: string,
    numberOfPurchases: number
};
type ChangeProfileResponseType = {
    errorMessage?: string,
    name: string,
    surname: string,
    login: string,
    phone: string,
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

export const authAPI = {
    signUp(data: SignUpDataType) {
        return instance.post<SignUpResponseType>('/auth/register', {...data});
    },
    login(email: string, password: string, rememberMe: boolean) {
        return instance.post<LoginResponseType>('/auth/login', {email,password,rememberMe});
    },
    me() {
        let userId = localStorage.getItem('userId');
        return instance.get<MeResponseType>(`/auth/me?userId=${userId}`);
    },
    loadProfile(id: string) {
        return instance.get<LoadProfileResponseType>(`/profile/id${id}`)
    },
    changeProfile(userId: string, data: ChangeProfileDataType) {
        return instance.put<ChangeProfileResponseType>(`/profile/id${userId}`, {...data})
    },
    refreshTokens(userId: string) {
        return axios.post<RefreshTokenResponseType>(`${baseURL}auth/refresh-tokens`, {refreshToken: localStorage.getItem('refreshToken'), userId})
    },
    signOut(userId: string) {
        const refreshToken = localStorage.getItem('refreshToken');
        return instance.post<SignOutResponseType>('/auth/sign-out', {userId, refreshToken})
    }
}

type LoadPrGroupResponseType = {
    errorMessage?: string,
    productGroup: PrGroupDataType
}
export const prGroupAPI = {
    loadPrGroup(type: string, url: string, query: string, limit: number) {
        const resultUrl = type === 'category' ? `/category/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}` : `/brand/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}`;
        return instance.get<LoadPrGroupResponseType>(resultUrl);
    },
    loadProducts(type: string, url: string, query: string, limit: number) {
        const resultUrl = type === 'category' ? `/category/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}` : `/brand/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}`;
        return instance.get<LoadPrGroupResponseType>(resultUrl);
    }
}

type LoadProductResponseType = {
    errorMessage?: string,
    product: SetProductType
}
export const productAPI = {
    loadProduct(id: string, brand: string) {
        return instance.get<LoadProductResponseType>(`/product/${brand}/id${id}`);
    }
}

type AddToCartResponseType = {
    errorMessage?: string,
    product: ProductTypeAPI
}
type InitializeProductsResponseType = {
    errorMessage?: string,
    cartProducts: Array<ProductType>
}
type LoadOptionsResponseType = {
    errorMessage?: string,
    options: Array<OptionType>
}
type CheckoutResponseType = {
    errorMessage?: string,
    message: string
}

export const cartAPI = {
    addToCart(brand: string, id: string, sku: string) {
        return instance.get<AddToCartResponseType>(`/cart/add-to-cart?brand=${brand}&id=${id}&sku=${sku}`)
    },
    initializeProducts(products: Array<InitializeProductsType>) {
        return instance.post<InitializeProductsResponseType>(`/cart/initialize-cart`, {products})
    },
    loadOptions() {
        return instance.get<LoadOptionsResponseType>('/cart/checkout-options');
    },
    checkout(products: Array<CheckoutProduct>, options: Object) {
        return instance.post<CheckoutResponseType>(`/cart/checkout`, {products, options})
    }
}

type SearchProductsResponseType = {
    errorMessage?: string,
    data: Array<SearchProductType>
}
export const searchApi = {
    searchProducts(query: string) {
        return instance.get<SearchProductsResponseType>(`/search?searchQuery=${query}`);
    }
}

type AllBrandsResponseType = {
    errorMessage?: string,
    brands: Array<BrandType>,
    quantity: number
}
export const allBrandsApi = {
    loadBrands(page: number, brandsOnPage: number) {
        return instance.get<AllBrandsResponseType>(`/all-brands?page=${page}&quantity=${brandsOnPage}`);
    }
}