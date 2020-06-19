import React from "react";
import s from "./Breadcrumbs.module.scss";
import {Link} from "react-router-dom";

type PropsType = {
    list: Array<{url: string, title: string}>
}

const Breadcrumbs: React.FC<PropsType> = (props) => {

    return (
        <ul className={s.list}>
            {props.list.map(item => {
                return <li className={s.item} key={item.title}><Link to={item.url} className={s.itemUrl}>{item.title}</Link></li>
            })}
        </ul>
    )
}

export default Breadcrumbs;