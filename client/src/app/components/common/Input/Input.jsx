import s from "./Input.module.scss";
import React from "react";


const Input = ({input, meta: {touched, error}, ...props}) => {
    const hasError = touched && error;
    return <div className={s.inputContainer}>
        <input {...input} {...props}  className={s.inputLogin + " " + (hasError ? s.errorInput : "")}/>
        {hasError && <div className={s.errorMessage}>{error}</div>}
    </div>
}

export default Input;