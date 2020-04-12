import React from "react";
import s from './RadioButton.module.scss'

const RadioButton = ({ input, field, ...props}) => {
    let active = (input.value === field) ? s.active : '';
    return (
        <label className={`${s.radioButton} ${active}`} data-key={field}>
            <input {...input} value={field} type={'radio'} className={s.hiddenInput} />
            <div className={s.radioCircle}></div>
            <span>{field}</span>
        </label>
    )
}

export default RadioButton;