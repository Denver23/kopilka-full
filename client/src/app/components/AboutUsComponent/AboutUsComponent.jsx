import React from "react";
import s from './AboutUsComponent.module.scss'
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";

const AboutUsComponent = (props) => {
    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/about-us/', 'title': 'About Us'},
    ];

    return <div className={s.aboutUsWrapper}>
        <Breadcrumbs list={brList}/>
        <div className={s.aboutUsBody}>
            <span className={s.pageTitle}>About Us</span>
            <p>
                <div className={s.generalImage}>
                    <img src="https://epicris.ru/wp-content/uploads/2019/04/top-10-luchshix-internet-magazinov-elektroniki-rejting-768x432.jpg" alt="" />
                </div>
                <span className={s.aboutText}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci amet assumenda beatae consectetur deserunt dolore ducimus excepturi fuga, illum labore libero non pariatur perferendis rem repudiandae temporibus totam veritatis voluptatem? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aspernatur consequuntur deleniti eius et ex incidunt ipsa, iusto necessitatibus nulla optio placeat porro repellendus repudiandae voluptatum? Enim perferendis rem sequi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dignissimos dolore exercitationem fugit illo illum, itaque laborum maiores nihil nobis numquam officia pariatur qui ratione reiciendis, tempora tempore ut, vel.</span>
            </p>
        </div>
    </div>
}

export default AboutUsComponent;