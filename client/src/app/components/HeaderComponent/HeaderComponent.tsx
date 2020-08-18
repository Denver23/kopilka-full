import React, {useState} from 'react';
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import MainMenu from "./MainMenu/MainMenu";
import Cart from "./Cart/Cart";
import SignIn from "./SignIn/SignIn";
import s from './HeaderComponent.module.scss';
import CategoriesMenu from "./CategoriesMenu/CategoriesMenu";
import {useSelector} from "react-redux";
import ProfileLink from "./ProfileLink/ProfileLink";
import {Link} from "react-router-dom";
import BurgerDisplay from "./BurgerMenu/BurgerDisplay/BurgerDisplay";
import {GetProfile} from "../../redux/selectors/authSelectors";
import {GetMainMenu, GetTopMenu} from "../../redux/selectors/headerSelectors";

const HeaderComponent: React.FC = (props) => {

    const profile = useSelector(GetProfile);
    const mainMenu = useSelector(GetMainMenu);
    const topMenu = useSelector(GetTopMenu);


    let [burgerDisplay, setBurgerDisplay] = useState(false);

    return (
        <div className={s.headerDecorator}>
            <BurgerDisplay mainMenu={mainMenu} burgerDisplay={burgerDisplay} setBurgerDisplay={setBurgerDisplay}/>
            <div className={s.headerComponent}>
                <div className={s.burgerLogo}>
                    <BurgerMenu burgerDisplay={burgerDisplay} setBurgerDisplay={setBurgerDisplay}/>
                    <Link to="/" className={s.logoUrl}>Portland</Link>
                </div>
                <MainMenu mainMenu={mainMenu}/>
                {profile.isAuth ? (<div className={s.profileMenu}><Cart/><ProfileLink profile={profile} /></div>) : (<div className={s.profileMenu}><Cart/><SignIn/></div>)}
            </div>
            <CategoriesMenu topMenu={topMenu} />
        </div>
    )
}

export default HeaderComponent;