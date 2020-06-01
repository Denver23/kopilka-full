import * as axios from "axios";

export const baseURL = 'http://localhost:5000/api/';

const instance = axios.create({
    baseURL
});

const isAccessTokenExpired = (exp) => {
    const accessTokenExpDate = exp - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)

    return accessTokenExpDate <= nowTime
}

instance.interceptors.request.use(request => {
    if (!!localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const exp = localStorage.getItem('exp');

        if (isAccessTokenExpired(exp) && refreshToken) {
            return authAPI.refreshTokens(localStorage.getItem('userId'))
                .then(response => {
                    if(response.data.resultCode === 0) {
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

export const authAPI = {
    signUp(data) {
        return instance.post('/auth/register', {...data});
    },
    login(email, password, rememberMe) {
        return instance.post('/auth/login', {email,password,rememberMe});
    },
    me() {
        let userId = localStorage.getItem('userId');
        return instance.get(`/auth/me?userId=${userId}`);
    },
    loadProfile(id) {
        return instance.get(`/profile/id${id}`)
    },
    changeProfile(userId, data) {
        return instance.put(`/profile/id${userId}`, {...data})
    },
    refreshTokens(userId) {
        return axios.post(`${baseURL}auth/refresh-tokens`, {refreshToken: localStorage.getItem('refreshToken'), userId})
    },
    signOut(userId) {
        const refreshToken = localStorage.getItem('refreshToken');
        return instance.post('/auth/sign-out', {userId, refreshToken})
    }
}

export const prGroupAPI = {
    loadPrGroup(type, url, query, limit) {
        const resultUrl = type === 'category' ? `/category/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}` : `/brand/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}`;
        return instance.get(resultUrl);
    },
    loadProducts(type, url, query, limit) {
        const resultUrl = type === 'category' ? `/category/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}` : `/brand/${url}?${query.length > 0 ? `${query}&` : ''}limit=${limit}`;
        return instance.get(resultUrl);
    }
}

export const productAPI = {
    loadProduct(id, brand) {
        return instance.get(`/product/${brand}/id${id}`);
    },
    addToCart(brand, id, sku) {
        return instance.get(`/cart/add-to-cart?brand=${brand}&id=${id}&sku=${sku}`)
    },
    initializeProducts(products) {
        return instance.post(`/cart/initialize-cart`, {products})
    }
}

export const cartApi = {
    loadOptions() {
        return instance.get('/cart/checkout-options');
    },
    checkout(products, options) {
        return instance.post(`/cart/checkout`, {products, options})
    }
}

export const searchApi = {
    searchProducts(query) {
        return instance.get(`/search?searchQuery=${query}`);
    }
}

export const allBrandsApi = {
    loadBrands(page, brandsOnPage) {
        return instance.get(`/all-brands?page=${page}&quantity=${brandsOnPage}`);
    }
}