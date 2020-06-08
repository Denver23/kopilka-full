import React from "react";
import RadioButton from "./RadioButton/RadioButton";
import s from './RadioButtons.module.scss'
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import { RadioFieldType } from "../../../types/types";

type RadioFormValuesType = {
    [key: string]: string
}
type RadioOwnPropsType = {
    fields: Array<RadioFieldType>
}

const RadioButtons: React.FC<InjectedFormProps<RadioFormValuesType, RadioOwnPropsType> & RadioOwnPropsType> = ({ handleSubmit, fields, ...props }) => {
    return (
        <form className={s.radioButtons}>
            {fields.map(field => (
                <Field name={props.form} component={RadioButton} type={'radio'} field={field} key={field.name} />
            ))}
        </form>

    )
}

const RadioButtonsRedux = reduxForm<RadioFormValuesType, RadioOwnPropsType>({})(RadioButtons);

export default RadioButtonsRedux;