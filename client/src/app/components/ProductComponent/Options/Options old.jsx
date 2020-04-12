import React, {useEffect, useState} from "react";
import s from './Options.module.scss';
import {Field, reduxForm} from "redux-form";

const Options = (props) => {

    const virtOptions = {
        'options': ['Memory', 'Color', 'Style'],
        'items': [
            {
                'sku': 'i-11-64-bl-gl',
                'Memory': '64 Gb',
                'Color': 'Black',
                'Style': 'Gloss'
            },
            {
                'sku': 'i-11-64-wh-gl',
                'Memory': '64 Gb',
                'Color': 'White',
                'Style': 'Gloss'
            },
            {
                'sku': 'i-11-64-bl-mt',
                'Memory': '64 Gb',
                'Color': 'Black',
                'Style': 'Matte'
            },
            {
                'sku': 'i-11-64-wh-mt',
                'Memory': '64 Gb',
                'Color': 'White',
                'Style': 'Matte'
            },
            {
                'sku': 'i-11-128-bl-gl',
                'Memory': '128 Gb',
                'Color': 'Black',
                'Style': 'Gloss'
            },
            {
                'sku': 'i-11-128-wh-gl',
                'Memory': '128 Gb',
                'Color': 'White',
                'Style': 'Gloss'
            },
            {
                'sku': 'i-11-128-bl-mt',
                'Memory': '128 Gb',
                'Color': 'Black',
                'Style': 'Matte'
            },
            {
                'sku': 'i-11-128-wh-mt',
                'Memory': '128 Gb',
                'Color': 'White',
                'Style': 'Matte'
            }
        ]
    };

    const unique = (arr) => {
        let result = [];
        for (let str of arr) {
            if (!result.includes(str)) {result.push(str);}
        }
        return result;
    }

    let [activeOptions, changeOptions] = useState(virtOptions.options.map(option => {
        var key = {'name': option, value: ''};
        return key;
    }));

    let dataOption = (option, value) => {
        let result = activeOptions;
        if(value !== '') {
            result = result.map(item => {
                return item.name === option ? {'name': option, 'value': value} : item;
            });
        } else {
            let i = result.length;
            result = result.map((item, index) => {
                if(index > i) {
                    return {'name': item.name, 'value': ''};
                } else {
                    if(item.name === option) {
                        i = index;
                        return {'name': option, 'value': value};
                    }
                    return item;
                }

            });
        }
        return result;
    };

    const resultProduct = () => {

    };

    return <form className={s.optionsForm}>
        {
            activeOptions.map((option,index) => {
                if(index === 0) {
                    let items = unique(virtOptions.items.map(item => {return item[option.name];}));
                    return <Field name={option.name} items={items} component={Select} type={'select'} onChange={(e) => {changeOptions(dataOption(e.target.name, e.target.value))}} />
                } else {
                    if(activeOptions[index-1].value !== '') {
                        let items = unique(virtOptions.items.map(item => {return item[option.name];}));

                        return <Field name={option.name} items={items} component={Select} type={'select'} onChange={(e) => {changeOptions(dataOption(e.target.name, e.target.value))}} />
                    }
                }
            })
        }
        {
            activeOptions[activeOptions.length-1].value !== '' ? (
                <div></div>
            ) : ''
        }
    </form>
}

const Select = ({input, type, ...props}) => {
    return <div className={s.options}>
        <span className={s.optionTitle}>{input.name}</span>
        <select {...input} type={type} {...props} className={s.optionSelect}>
            <option value={''}></option>
            {props.items.map(item => {
                return <option value={item} key={item}>{item}</option>
            })}
        </select>
    </div>
}

export default reduxForm({'form': 'options'})(Options);