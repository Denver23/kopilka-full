import React, {useEffect, useRef, useState} from 'react';
import s from './CategoriesMenu.module.scss';
import {NavLink} from "react-router-dom";
import Search from "./Search/Search";
import {TopMenuObjectType} from "../../../types/types";

type PropsType = {
    topMenu: Array<TopMenuObjectType>
}

const CategoriesMenu: React.FC<PropsType> = (props) => {

    let [showCategories, setShowCategories] = useState(false);

    let categoriesRef = useRef<HTMLUListElement>(null);

    let handleClickOutside = (e: Event) => {
        const domNode = categoriesRef;
        const eventNode = e.target as Node;
        if ((!domNode.current || !domNode.current.contains(eventNode))) {
            if(showCategories) {
                setShowCategories(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [showCategories])

    return (
        <div className={s.wrapper}>
            <div className={s.topLine}>
                <div className={s.generalMenuList}>
                    <div className={s.categoriesButton} onClick={()=>{setShowCategories(!showCategories)}}>Categories: <div className={showCategories ? `${s.categoryArrow} ${s.active}` : s.categoryArrow}>&gt;</div></div>
                    <ul ref={categoriesRef} className={showCategories ? `${s.categoriesList} ${s.active}` : s.categoriesList}>
                        {props.topMenu.map(menuItem => {
                            return <li className={s.categoryItem} key={menuItem.categoryTitle}><NavLink to={`/${menuItem.url}-category/`} className={s.linkUrl} activeClassName={s.active} onClick={()=>{setShowCategories(false)}}>{menuItem.categoryTitle}</NavLink></li>
                        })}
                    </ul>
                    <NavLink to='#' className={s.linkUrl} activeClassName={s.active}>Support</NavLink>
                </div>
                <Search />
            </div>
        </div>
    )
}

export default CategoriesMenu;