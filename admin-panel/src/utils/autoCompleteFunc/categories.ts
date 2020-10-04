import {productAPI} from "../../api/api";

export const onCategoryChange = async (value: string, setStateFunc: (array: Array<{value: string}>) => void) => {
    if (value !== '') {
        const result = await productAPI.getCategoriesList(value);

        const categories = result.data.categories.map(category => {
            return {value: category.name};
        });
        setStateFunc(categories);
    } else {
        setStateFunc([]);
    }
};