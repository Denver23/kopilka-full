import React from "react";
import Checkbox from "./Checkbox/Checkbox";
import s from './Checkboxes.module.scss';
import {Field, InjectedFormProps, reduxForm} from "redux-form";

type CheckboxesFormValuesType = {
    [key: string]: string | Array<string>
}
type CheckboxesOwnPropsType = {
    fields: Array<string>
}

const Checkboxes: React.FC<InjectedFormProps<CheckboxesFormValuesType, CheckboxesOwnPropsType> & CheckboxesOwnPropsType> = ({ handleSubmit, fields, ...props }) => {
    return (
        <form onSubmit={handleSubmit} className={s.checkboxBody}>
            {fields.map(field => (
                <Field name={field.replace(/\./g, '{:dot:}').replace(/ /g, '+')} component={Checkbox} type={'checkbox'} field={field} key={field} />
            ))}
        </form>
    )

}

const CheckboxesRedux = reduxForm<CheckboxesFormValuesType, CheckboxesOwnPropsType>({})(Checkboxes);

export default CheckboxesRedux;