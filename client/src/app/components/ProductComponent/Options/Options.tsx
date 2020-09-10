import React, {ChangeEvent, FormEvent, useState} from "react";
import s from './Options.module.scss';
import {
    Field,
    InjectedFormProps,
    reduxForm,
    WrappedFieldProps
} from "redux-form";
import {ChildProductType} from "../../../types/types";

type OptionsValuesType = {
    [key: string]: string
}

type OptionsOwnPropsType = {
    options: Array<ChildProductType>
}

type optionType = {name: string, key: string};

const Options: React.FC<InjectedFormProps<OptionsValuesType, OptionsOwnPropsType> & OptionsOwnPropsType> = ({ handleSubmit, options, ...props }) => {

    let [activeOptions, changeOptions] = useState(options.length > 1 ? Object.keys(options[0].options).map(option => {
        return {name: option, key: ''};
    }) : []);
    let [currentProduct, changeProduct] = useState(options.length === 1 ? options[0] : undefined);

    let dataOption = (option: string, value: string) => {
        let result = activeOptions;
        result.forEach(item => {
            return item.name === option ? item.key = value : ''
        });
        return result;
    };

    let getMaxValue = (array: Array<number>) => {
        let max = array[0];
        for (let i = 0; i < array.length; i++) {
            if (max < array[i]) max = array[i];
        }
        return max;
    };

    let getMinValue = (array: Array<number>) => {
        let min = array[0];
        for (let i = 0; i < array.length; i++) {
            if (min > array[i]) min = array[i];
        }
        return min;
    };

    let lowPrice = getMinValue(options.map(item => {
        return +item.price;
    }));

    let highPrice = getMaxValue(options.map(item => {
        return +item.price;
    }));

    let changeFormOption = (e: ChangeEvent<HTMLInputElement>) => {
        changeOptions(dataOption(e.currentTarget.name, e.currentTarget.value));
        let newProduct = options.find((product: ChildProductType) => {
            return activeOptions.every((option: optionType) => {
                return option.key === product.options[option.name];
            })
        });
        changeProduct(newProduct);
    }

    return <form className={s.optionsForm}>
        {
            activeOptions.length ?
            activeOptions.map((option) => {
                return <Field name={option.name} onChange={(e: ChangeEvent<HTMLInputElement>) => {changeFormOption(e)}} component={Select} currentProduct={currentProduct} activeOptions={activeOptions} parentProducts={options} type={'select'} key={option.name}/>
            }) : ''
        }
        {currentProduct !== undefined ? <ProductStatus currentProduct={currentProduct} /> : <div className={s.productStatus}><span className={s.cost}>${lowPrice} - ${highPrice}</span></div>}
    </form>
}

type ProductStatusProps = {
    currentProduct: ChildProductType
}

const ProductStatus: React.FC<ProductStatusProps> = (props) => {
    return <div className={s.productStatus}>
        <span className={s.cost}>${props.currentProduct.price}</span>
        <div className={props.currentProduct.quantity > 0 ? `${s.avaibility} ${s.inStock}` : `${s.avaibility} ${s.outOfStock}`}>
            {props.currentProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </div>
    </div>
}

type SelectPropsType = {
    currentProduct: ChildProductType,
    parentProducts: Array<ChildProductType>,
    activeOptions: Array<optionType>
}

const Select: React.FC<SelectPropsType & WrappedFieldProps> = ({input, parentProducts, activeOptions, ...props}) => {
    const unique = (arr: Array<string>) => {
        let result: Array<string> = [];
        for (let str of arr) {
            if (!result.includes(str)) {
                result.push(str);
            }
        }
        return result;
    }
    let keys = parentProducts == [] ? [] : parentProducts.map((item: ChildProductType) => {
        if (
            activeOptions.every((optionObject: optionType) => {
                if (optionObject.key === '' || optionObject.name === input.name) {
                    return true;
                } else {
                    return item.options[optionObject.name] === optionObject.key;
                }
            })) {
            return {'optionKey': item.options[input.name], 'disabled': false};
        }
        return {'optionKey': item.options[input.name], 'disabled': true};
    });
    let items = parentProducts == [] ? [] : unique(parentProducts.map(item => {
        return item.options[input.name];
    }))
    return <div className={s.options}>
        <span className={s.optionTitle}>{input.name}</span>
        <select {...input} className={s.optionSelect}>
            <option value={''}></option>
            {parentProducts == [] ? '' : items.map(item => {
                return <option value={item} key={item} disabled={
                    !keys.some(key => {
                        if(key.optionKey === item && key.disabled === false) return true;
                    })
                }>{item}</option>
            })}
        </select>
    </div>
}

export default reduxForm<OptionsValuesType, OptionsOwnPropsType>({form: 'options'})(Options);