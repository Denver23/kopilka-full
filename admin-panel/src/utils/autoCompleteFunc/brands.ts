import {productAPI} from "../../api/api";

export const onBrandChange = async (value: string, setStateFunc: (array: Array<{value: string}>) => void) => {
    if (value !== '') {
        const result = await productAPI.getBrandsList(value);

        const brands = result.data.brands.map(brand => {
            return {value: brand.name};
        });
        setStateFunc(brands);
    } else {
        setStateFunc([]);
    }
};