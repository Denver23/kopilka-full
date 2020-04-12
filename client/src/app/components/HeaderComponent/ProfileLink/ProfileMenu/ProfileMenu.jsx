import React, {useEffect, useRef} from "react";
import s from './ProfileMenu.module.scss'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {signOut} from "../../../../redux/authReducer";

const ProfileMenu = (props) => {
    let profileMenu = useRef();

    let handleClickOutside = (e) => {
        const domNode = profileMenu;
        if ((!domNode.current || !domNode.current.contains(e.target))) {
            props.setShowMenu(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [])

    return <div ref={profileMenu} className={s.profileMenu}>
        <Link to={'/profile'} onClick={(e) => {props.setShowMenu(false)}} className={s.profileMenuLink}>Profile</Link>
        <button className={s.profileMenuLink} onClick={e => {props.signOut(props.userId)}}>Sign Out</button>
    </div>
}

let mapStateToProps = (state) => {
    return {
        userId: state.authReducer.userId
    }
}

export default connect(mapStateToProps, {signOut})(ProfileMenu);