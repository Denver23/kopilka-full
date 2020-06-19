import React from "react";
import s from './InfoList.module.scss';

type InfoListPropsType = {
    title: string,
    type: string,
    items: string
}

const InfoList: React.FC<InfoListPropsType> = (props) => {
    return <div className={s.infoList}>
        <p className={s.title}>{props.title}</p>
        {
            props.type === 'features' ? <Features items={props.items}/> : props.type === 'specs' ?
                <Specs items={props.items}/> : ''
        }
    </div>
}

type PropsType = {
    items: string
}

const Features: React.FC<PropsType> = (props) => {
    return <ul className={s.list}>
        {props.items.split(/\[:os:\]/).map(item => {
            return <li className={s.listItem} key={item}>{item}</li>
        })}
    </ul>
}

const Specs: React.FC<PropsType> = (props) => {
    return <table className={s.table}>
        <tbody>
        {props.items.split(/\[:os:\]/).map(item => {
            return <tr key={item}><td>{item}</td></tr>
        })}
        </tbody>
    </table>
}

export default InfoList;