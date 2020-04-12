import React, {useState} from "react";
import s from './Options.module.scss';
import {Field, reduxForm} from "redux-form";

const Options = ({ handleSubmit, fields, ...props }) => {

    let [activeOptions, changeOptions] = useState(fields.length > 1 ? Object.keys(fields[0].options).map(option => {
        return {'name': option, 'key': ''};
    }) : []);
    let [currentProduct, changeProduct] = useState(fields.length > 1 ? undefined : fields.length === 1 ? fields[0] : undefined);

    let dataOption = (option, value) => {
        let result = activeOptions;
        result.forEach(item => {
            return item.name === option ? item.key = value : ''
        })
        return result;
    };

    let getMaxValue = (array) => {
        let max = array[0];
        for (let i = 0; i < array.length; i++) {
            if (max < array[i]) max = array[i];
        }
        return max;
    };

    let getMinValue = (array) => {
        let min = array[0];
        for (let i = 0; i < array.length; i++) {
            if (min > array[i]) min = array[i];
        }
        return min;
    };

    let lowPrice = getMinValue(fields.map(item => {
        return item.price;
    }));

    let highPrice = getMaxValue(fields.map(item => {
        return item.price;
    }));

    let changeFormOption = (e) => {
        changeOptions(dataOption(e.target.name, e.target.value));
        let newProduct = fields.find(product => {
            return activeOptions.every(option => {
                return option.key === product.options[option.name];
            })
        })
        changeProduct(newProduct);
    }

    return <form className={s.optionsForm}>
        {
            activeOptions.length ?
            activeOptions.map((option) => {
                return <Field key={option.name} name={option.name} currentProduct={currentProduct} activeOptions={activeOptions} parentProducts={fields} component={Select} type={'select'} onChange={(e) => {
                    changeFormOption(e);
                }}/>
            }) : ''
        }
        {currentProduct !== undefined ? <ProductStatus currentProduct={currentProduct} /> : <div className={s.productStatus}><span className={s.cost}>${lowPrice} - ${highPrice}</span></div>}
    </form>
}

const ProductStatus = (props) => {
    return <div className={s.productStatus}>
        <span className={s.cost}>${props.currentProduct.price}</span>
        <div className={props.currentProduct.quantity > 0 ? `${s.avaibility} ${s.inStock}` : `${s.avaibility} ${s.outOfStock}`}>
            {props.currentProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </div>
    </div>
}

const Select = ({input, type, parentProducts, activeOptions, ...props}) => {
    const unique = (arr) => {
        let result = [];
        for (let str of arr) {
            if (!result.includes(str)) {
                result.push(str);
            }
        }
        return result;
    }
    let keys = parentProducts == [] ? [] : parentProducts.map(item => {
        if (
            activeOptions.every(optionObject => {
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
        <select {...input} type={type} className={s.optionSelect}>
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

export default reduxForm({'form': 'options'})(Options);