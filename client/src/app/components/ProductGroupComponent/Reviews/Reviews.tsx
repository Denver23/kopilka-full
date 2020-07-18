import React from "react";
import Review from "./Review/Review";
import s from './Reviews.module.scss';

type PropsType = {
    reviews: Array<{[key: string]: string}>
}

const Reviews: React.FC<PropsType> = (props) => {
    return (
        <div className={s.reviewsBlock}>
            <div className={s.wrapper}>
                <span className={s.reviewsTitle}>What Our Customers Have to Say</span>
                <span className={s.reviewsDescription}>Couple of Words About This Stories Section</span>
                <div className={s.messages}>
                    {props.reviews.map((review) => {
                        return <Review data={review} key={review.message}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Reviews;