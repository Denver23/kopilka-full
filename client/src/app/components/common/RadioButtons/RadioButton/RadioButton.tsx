import React from "react";
import s from './RadioButton.module.scss'
import {WrappedFieldInputProps, WrappedFieldMetaProps} from "redux-form";
import {FieldType} from "../../../../types/types";

type RadioPropsType = {
    input: WrappedFieldInputProps,
    meta: WrappedFieldMetaProps,
    field: FieldType,
    value?: string
}

const RadioButton: React.FC<RadioPropsType> = ({ input, field, meta, ...props }) => {
    let active = (input.value === props.value) ? s.active : '';
    return (
        <label className={`${s.radioButton} ${active}`} data-key={props.value}>
            <input {...input} value={props.value ? props.value : input.value} type={'radio'} className={s.hiddenInput} />
            <div className={s.radioCircle}></div>
            <span>{field.name}</span>
        </label>
    )
}

export default RadioButton;