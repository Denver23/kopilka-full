import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import s from './PagesButtonList.module.scss';

type PropsType = {
    itemsCount: number | null,
    productsOnPage: number,
    activePage: number,
    activeURL: string | undefined,
    type: string,
    query?: string,
    portionSize?: number
}

const PagesButtonList: React.FC<PropsType> = ({portionSize = 12,...props}) => {

    let type = props.type;
    let activeURL = props.activeURL === undefined ? '' : props.activeURL;
    let activePage = +props.activePage;
    let itemsCount = props.itemsCount !== null ? props.itemsCount : 0;
    let pagesCount = Math.ceil(itemsCount / props.productsOnPage);
    let step = 3;
    let query = new URLSearchParams(props.query);
    if(query.has('page')) {
        query.delete("page");
    }
    const queryResult = [...query.keys()].length > 0 ? `&${query.toString()}` : '';
    let url = type === 'category' ?
        (props.activeURL !== undefined ? `/${props.activeURL}-category?page=` : `?page=`) :
    type === 'brand' ? `/brands/${props.activeURL}?page=` : `/${activeURL}?page=`;

    let pagesArray = [];

    if(activePage < +step + 2) {
        let lastPage = pagesCount - 1 - (step*2+1) > 0 ? (step*2+1) : (pagesCount - 1);
        for(let i = 2; i <= lastPage; i++) {
            pagesArray.push(i);
        }
    } else if(activePage >= +step + 2 && +activePage + step < pagesCount) {
        for(let i = activePage - step; i <= +activePage + step; i++) {
            pagesArray.push(i);
        }
    } else if(+activePage + step >= pagesCount) {
        for(let i = (step*2+1); i > 0; i--) {
            if(pagesCount - i > 1) {
                pagesArray.push(pagesCount - i);
            }
        }
    }


    return (
        <div className={s.pagesListWrapper}>
            {pagesCount > 1 ?
            <div className={s.pagesList}>
                {+activePage !== 1 ? <NavLink to={`${url}${activePage - 1}${queryResult}`} className={`${s.pagesArrows} ${s.leftArrow}`}>&#60;</NavLink> : ''}
                <div className={s.numbers}>
                    <NavLink to={`${url}${1}${queryResult}`} className={activePage === 1 ? `${s.pageNumber} ${s.pageNumberActive}` : s.pageNumber} key={`page-${1}`}>{1}</NavLink>
                    {pagesArray[0] - 1 === 1 || pagesArray.length === 0 ? '' : <div className={s.paginationDots}>...</div>}
                    {
                        pagesArray.map(page => {
                            return <NavLink to={`${url}${page}${queryResult}`} className={activePage === page ? `${s.pageNumber} ${s.pageNumberActive}` : s.pageNumber} key={`page-${page}`}>{page}</NavLink>
                        })
                    }
                    {pagesArray[pagesArray.length - 1] + 1 === pagesCount || pagesArray.length === 0 ? '' : <div className={s.paginationDots}>...</div>}
                    <NavLink to={`${url}${pagesCount}${queryResult}`} className={activePage === pagesCount ? `${s.pageNumber} ${s.pageNumberActive}` : s.pageNumber} key={`page-${pagesCount}`}>{pagesCount}</NavLink>
                </div>
                {+activePage !== pagesCount ? <NavLink to={`${url}${activePage + 1}${queryResult}`} className={`${s.pagesArrows} ${s.rightArrow}`}>&#62;</NavLink> : ''}
            </div> : ''}
        </div>
    )
}

export default PagesButtonList;