import React from "react";
import Checkbox from "./Checkbox/Checkbox";
import s from './Checkboxes.module.scss';
import {Field, InjectedFormProps, reduxForm} from "redux-form";

export type CheckboxesFormValuesType = {
    [key: string]: boolean
}
type CheckboxesOwnPropsType = {
    refineValues: Array<string>
}

const Checkboxes: React.FC<InjectedFormProps<CheckboxesFormValuesType, CheckboxesOwnPropsType> & CheckboxesOwnPropsType> = ({ handleSubmit, refineValues, ...props }) => {

    return (
        <form onSubmit={handleSubmit} className={s.checkboxBody}>
            {refineValues.map((field: string) => (
                <Field name={field.replace(/\./g, '{:dot:}').replace(/ /g, '+')} component={Checkbox} type={'checkbox'} field={field} key={field} />
            ))}
        </form>
    )

}

const CheckboxesRedux = reduxForm<CheckboxesFormValuesType, CheckboxesOwnPropsType>({})(Checkboxes);

export default CheckboxesRedux;