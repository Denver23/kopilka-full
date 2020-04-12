import React from "react";
import Checkbox from "./Checkbox/Checkbox";
import s from './Checkboxes.module.scss';
import {Field, reduxForm} from "redux-form";

const Checkboxes = ({ handleSubmit, fields, ...props }) => {
    return (
        <form onSubmit={handleSubmit} className={s.checkboxBody}>
            {fields.map(field => (
                <Field name={field.replace('.', '{:dot:}').replace(' ', '+')} component={Checkbox} type={'checkbox'} field={field} key={field} />
            ))}
        </form>
    )

}

const CheckboxesRedux = reduxForm({})(Checkboxes);

export default CheckboxesRedux;