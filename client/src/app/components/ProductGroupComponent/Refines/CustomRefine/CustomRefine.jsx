import React from "react";
import RadioButtons from "../../../common/RadioButtons/RadioButtons";
import Checkboxes from "../../../common/Checkboxes/Checkboxes";
import s from './CustomRefine.module.scss';

const CustomRefine = ({dispatch, ...props}) => {

    let toggleBlock = (e) => {
        e.target.parentElement.classList.toggle(s.hidden);
        refineBody = e.target.nextSibling;
        if (refineBody.style.height === "0px") {
            refineBody.style.height = `${ refineBody.scrollHeight }px`
        } else {
            refineBody.style.height = `${ refineBody.scrollHeight }px`;
            window.getComputedStyle(refineBody, null).getPropertyValue("height");
            refineBody.style.height = "0";
        }
    }

    let returnData = (options) => {
        let data = Object.keys(options).filter(title => {
            return options[title] === true;
        }).map(item => {
            return item.replace(/\{:dot:\}/g, '.').replace(/\+/g, ' ');
        })
        props.refinesData.current[props.title.replace(/\{:dot:\}/g, '.').replace(/\+/g, ' ')] = data;
    }

    let checkReinitalize = (data) => {
        Object.keys(data).forEach(item => {
            if(!props.initialValues || data[item] !== props.initialValues[item]) {
                props.takeRefinesData();
            }
        })
    }
    const refineTitle = props.title.replace('.', '{:dot:}').replace(' ', '+')

    let refineBody;
    if(props.type === "radio") {
        refineBody = <RadioButtons
            form={props.title.toLowerCase()}
            fields={props.items}
            onSubmit={values => alert(JSON.stringify(values))}
        />;
    } else if(props.type === "checkbox") {
        refineBody = <Checkboxes
            onSubmit={options=>{returnData(options)}}
            onChange={(e)=>{checkReinitalize(e)}}
            form={refineTitle}
            fields={props.items}
            initialValues={props.initialValues !== undefined ? props.initialValues : {}}
        />;
    }

    return (
        <div className={s.customRefine}>
            <div className={s.refineTitle} onClick={toggleBlock}>{props.title}</div>
            <div className={s.refineBody}>
                {refineBody}
            </div>
        </div>
    )
}

export default CustomRefine;