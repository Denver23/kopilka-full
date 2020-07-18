import React from "react";
import s from './Review.module.scss';

type PropsType = {
    data: {[key: string]: string}
}

const Review: React.FC<PropsType> = (props) => {
    return <div className={s.review}>
        <img src={props.data.photo} alt="" className={s.photo}/>
        <div className={s.nameWork}><span className={s.name}>{props.data.name}</span><span className={s.work}>{props.data.work}</span></div>
        <span className={s.message}>{props.data.message}</span>
    </div>
}

export default Review;