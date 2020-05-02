import React from "react";
import s from './RadioButton.module.scss'

const RadioButton = ({ input, field, ...props}) => {
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