import React, {useState} from "react";
import s from './CategoriesBlock.module.scss';
import {Link, NavLink} from "react-router-dom";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {ChildCategoryType} from "../../../../types/types";

type PropsType = {
    type: string,
    brandName: string,
    categoriesList: Array<ChildCategoryType>
}

const CategoriesBlock: React.FC<PropsType> = (props) => {

    let [activeList, changeActiveList] = useState('');

    const brandQuery = props.type === 'brand' ? `?brands=${props.brandName}` : '';

    const toggleActiveList = (e: string) => {
        if (e === activeList) {
            changeActiveList('')
        } else {
            changeActiveList(e);
        }
    }

    return (
        <ul className={s.categoriesList}>
            {props.categoriesList.map((category) => {
                return (
                    <li className={s.categoriesItem} key={category.name}>
                        {category.childCategories.length > 0 ? (
                            <div className={s.categoryButton} onClick={() => toggleActiveList(category.name)}>
                                <div className={s.categoryTitle}>{category.name}</div>
                                <ArrowForwardIosIcon
                                    className={`${s.categoryArrow} ` + (category.name === activeList ? (s.active) : '')}/>
                            </div>) : (<Link to={`/${category.url}-category${brandQuery}`}
                                             className={s.categoryTitle}>{category.name}</Link>)}
                        {category.childCategories.length > 0 ? (
                            <ul className={`${s.ptypesList} ` + (category.name === activeList ? (s.active) : '')}>
                                {category.childCategories.map((child) => {
                                    return <li className={s.ptypeItem} key={child.name}><NavLink to={`/${child.url}-category${brandQuery}`}
                                                                                className={s.ptypeLink}
                                                                                activeClassName={s.active}>{child.name}</NavLink>
                                    </li>
                                })}
                            </ul>
                        ) : ''}
                    </li>
                )
            })}
        </ul>
    )
}

export default CategoriesBlock;