import React from "react";
import {NavLink} from 'react-router-dom';
import s from './MainMenu.module.scss';

const MainMenu = (props) => {
    return (
        <ul className={s.topMenuList}>
            {props.mainMenu.map(item => {
                return <li key={`${item.title}-top-menu`}><NavLink to={item.url} className={s.topMenuUrl}>{item.title}</NavLink></li>
            })}
        </ul>
    )
}


export default MainMenu;