import React from "react";
import s from "./Breadcrumbs.module.scss";
import {Link} from "react-router-dom";

const Breadcrumbs = (props) => {

    return (
        <ul className={s.list}>
            {props.list.map(item => {
                return <li className={s.item} key={item.title}><Link to={item.url} className={s.itemUrl}>{item.title}</Link></li>
            })}
        </ul>
    )
}

export default Breadcrumbs;