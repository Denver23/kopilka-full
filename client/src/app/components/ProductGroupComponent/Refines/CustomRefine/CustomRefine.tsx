import React, {MouseEvent, useRef} from "react";
import RadioButtons from "../../../common/RadioButtons/RadioButtons";
import Checkboxes, {CheckboxesFormValuesType} from "../../../common/Checkboxes/Checkboxes";
import s from './CustomRefine.module.scss';
import {FieldType} from "../../../../types/types";

type PropsType = {
    takeRefinesData: () => void,
    refinesData: any,
    title: string,
    type: string,
    items: Array<FieldType> | Array<string>,
    key: string,
    initialValues: CheckboxesFormValuesType
}

const CustomRefine: React.FC<PropsType> = ({...props}) => {

    const parent = useRef<HTMLDivElement>(null);
    const refineBodyDiv = useRef<HTMLDivElement>(null)

    let toggleBlock = (e: MouseEvent<HTMLDivElement>) => {
        if( parent.current !== null) {
            parent.current.classList.toggle(s.hidden);
        }
        if(refineBodyDiv.current !== null) {
            if (refineBodyDiv.current.style.height === "0px") {
                refineBodyDiv.current.style.height = `${ refineBodyDiv.current.scrollHeight }px`
            } else {
                refineBodyDiv.current.style.height = `${ refineBodyDiv.current.scrollHeight }px`;
                window.getComputedStyle(refineBodyDiv.current, null).getPropertyValue("height");
                refineBodyDiv.current.style.height = "0";
            }
        }
    }

    let returnData = (options: CheckboxesFormValuesType) => {
        let data = Object.keys(options).filter(title => {
            return options[title] === true;
        }).map(item => {
            return item.replace(/\{:dot:\}/g, '.').replace(/\+/g, ' ');
        })
        props.refinesData.current[props.title.replace(/\{:dot:\}/g, '.').replace(/\+/g, ' ')] = data;
    }

    let checkReinitalize = (data: Partial<CheckboxesFormValuesType>) => {
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
            values={props.items as Array<FieldType>}
            onSubmit={values => alert(JSON.stringify(values))}
        />;
    } else if(props.type === "checkbox") {
        refineBody = <Checkboxes
            onSubmit={(options: CheckboxesFormValuesType)=>{returnData(options)}}
            onChange={(e)=>{checkReinitalize(e)}}
            form={refineTitle}
            refineValues={props.items as Array<string>}
            initialValues={props.initialValues !== undefined ? props.initialValues : {}}
        />;
    }

    return (
        <div ref={parent} className={s.customRefine}>
            <div className={s.refineTitle} onClick={toggleBlock}>{props.title}</div>
            <div ref={refineBodyDiv} className={s.refineBody}>
                {refineBody}
            </div>
        </div>
    )
}

export default CustomRefine;