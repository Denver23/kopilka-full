import React from 'react';
import s from './Header.module.scss';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../../redux/authReducer";
import {GetIsAuth, GetUserId} from "../../redux/selectors/authSelectors";

const Header: React.FC = () => {

    const isAuth = useSelector(GetIsAuth);
    const userId = useSelector(GetUserId);
    const dispatch = useDispatch();
    const signOutThunk = (userId: string): void => {
        dispatch(signOut(userId));
    }

    return <div className={s.headerWrapper}>
        <Link to={'/admin/'} className={s.generalLink}>Kopilka Admin-Panel</Link>
        {isAuth ? <button className={s.signOutButton} onClick={e => {if(userId !== null) {signOutThunk(userId)}}}>Sign Out</button> : ''}
    </div>
}

export default Header;