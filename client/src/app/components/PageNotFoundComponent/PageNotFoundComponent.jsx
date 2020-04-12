import React from "react";
import s from './PageNotFoundComponent.module.scss'
import pageNotFound from '../..//assets/images/pageNotFound.jpg';

const PageNotFoundComponent = (props) => {
    return <div className={s.pageNotFound}>
        <img src={pageNotFound} alt="" className={s.pageNotFoundImg}/>
    </div>
}

export default PageNotFoundComponent;