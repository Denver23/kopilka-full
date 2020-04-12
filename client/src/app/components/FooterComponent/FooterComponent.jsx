import React from "react";
import s from './FooterComponent.module.scss';
import {Link} from "react-router-dom";
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';

const FooterComponent = (props) => {
    return <div className={s.footer}>
        <div className={s.wrapper}>
            <div className={s.firstLine}>
                <a href="/" className={s.logoUrl}>Portland</a>
                <ul className={s.footerNav}>
                    <li><Link to={'/'} className={s.footerNavLink}>Home</Link></li>
                    <li><Link to={'/'} className={s.footerNavLink}>Shop</Link></li>
                    <li><Link to={'/'} className={s.footerNavLink}>Team</Link></li>
                    <li><Link to={'/about-us/'} className={s.footerNavLink}>About Us</Link></li>
                    <li><Link to={'/'} className={s.footerNavLink}>Contacts</Link></li>
                </ul>
                <ul className={s.socialNav}>
                    <li><Link to={'/'} className={s.socialLink}><TwitterIcon/></Link></li>
                    <li><Link to={'/'} className={s.socialLink}><FacebookIcon/></Link></li>
                    <li><Link to={'/'} className={s.socialLink}><PinterestIcon/></Link></li>
                </ul>
            </div>
            <div className={s.secondLine}>
                <span className={s.footerDescription}>She gave my mother such a turn, that I have always been convinced I am indebted to Miss Betsey for having been born on a Friday.</span>
                <ul className={s.secondLineTerms}>
                    <li><Link to={'/'} className={s.policyTerms}>Privacy Policy</Link></li>
                    <li><Link to={'/'} className={s.policyTerms}>Terms and Conditions</Link></li>
                </ul>
            </div>
        </div>
    </div>
}

export default FooterComponent;