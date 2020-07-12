import React from "react";
import RadioButton from "./RadioButton/RadioButton";
import s from './RadioButtons.module.scss'
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import { FieldType } from "../../../types/types";

type RadioFormValuesType = {
    [key: string]: string
}
type RadioOwnPropsType = {
    values: Array<FieldType>
}

const RadioButtons: React.FC<InjectedFormProps<RadioFormValuesType, RadioOwnPropsType> & RadioOwnPropsType> = ({ handleSubmit, values, ...props }) => {
    return (
        <form className={s.radioButtons}>
            {values.map(field => (
                <Field name={props.form} component={RadioButton} type={'radio'} field={field} key={field.name} />
            ))}
        </form>

    )
}

const RadioButtonsRedux = reduxForm<RadioFormValuesType, RadioOwnPropsType>({})(RadioButtons);

export default RadioButtonsRedux;