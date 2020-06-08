import React from "react";
import s from './Checkbox.module.scss'
import {WrappedFieldInputProps, WrappedFieldMetaProps} from "redux-form";


type CheckboxPropsType = {
    input: WrappedFieldInputProps,
    meta: WrappedFieldMetaProps,
    field: string
}

const Checkbox: React.FC<CheckboxPropsType> = ({ input, field, meta }) => {
    let active = input.value ? s.active : '';
    return (
        <label className={`${s.checkboxButton} ${active}`} data-key={field}>
            <input {...input} type={'checkbox'} name={field} className={s.hiddenInput} />
            <div className={s.checkIcon}></div>
            <span>{field}</span>
        </label>
    )
}

export default Checkbox;