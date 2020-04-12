import React from "react";
import s from './InfoList.module.scss';

const InfoList = (props) => {
    return <div className={s.infoList}>
        <p className={s.title}>{props.title}</p>
        {
            props.type === 'features' ? <Features items={props.items}/> : props.type === 'specs' ?
                <Specs items={props.items}/> : ''
        }
    </div>
}

const Features = (props) => {
    return <ul className={s.list}>
        {props.items.split(/\[:os:\]/).map(item => {
            return <li className={s.listItem} key={item}>{item}</li>
        })}
    </ul>
}

const Specs = (props) => {
    return <table className={s.table}>
        <tbody>
        {props.items.split(/\[:os:\]/).map(item => {
            return <tr key={item}><td>{item}</td></tr>
        })}
        </tbody>
    </table>
}

export default InfoList;