import React, {Component, useEffect, useState} from 'react';
import HeaderComponent from "./components/HeaderComponent/HeaderComponent.jsx";
import ProductGroupContainer from "./components/ProductGroupComponent/ProductGroupContainer.jsx";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import s from './App.module.scss';
import {Route, withRouter, Switch} from "react-router-dom";
import {compose} from "redux";
import {connect} from "react-redux";
import {initializeApp} from "./redux/appReducer";
import Preloader from "./components/common/Preloader/Preloader";
import ProductComponentWrapper from "./components/ProductComponent/ProductComponentWrapper";
import CartComponentWrapper from "./components/CartComponent/CartComponentWrapper";
import SignUpComponentWrapper from "./components/SignUpComponent/SignUpComponentWrapper";
import ProfileComponent from "./components/ProfileComponent/ProfileComponent";
import AboutUsComponent from "./components/AboutUsComponent/AboutUsComponent";
import PageNotFoundComponent from "./components/PageNotFoundComponent/PageNotFoundComponent";
import AllBrandsComponent from "./components/AllBrandsComponent/AllBrandsComponent";
import {USER_DATA} from "./api/api";

const App = (props) => {

    useEffect(() => {
        function autoInitial() {
            let userId = props.userId;
            let localUserId = localStorage.getItem('userId') ? localStorage.getItem('userId') : null;
            if(userId === localUserId && localUserId !== null) {
                return;
            }
            props.initializeApp();
        }

        window.addEventListener('storage', autoInitial);
        autoInitial();
        return () => window.removeEventListener('storage', autoInitial);
    }, []);

    return <div className={s.appWrapper}>
        {!props.initialized ? <Preloader/> :
            (<div className={s.appGrid}><HeaderComponent/>
                <Switch>
                    <Route exact path='/' component={ProductGroupContainer}/>
                    <Route exact path='/:category(\w[-\w]{0,25}\w)-category' component={ProductGroupContainer}/>
                    <Route exact path='/brands/:brand(\w[-\w]{0,25}\w)' component={ProductGroupContainer}/>
                    <Route exact path='/brands/:brand(\w[-\w]{0,25}\w)/id:id(\w+)' component={ProductComponentWrapper}/>
                    <Route exact path='/all-brands/page-:page' component={AllBrandsComponent}/>
                    <Route exact path='/cart' component={CartComponentWrapper}/>
                    <Route exact path='/sign-up' component={SignUpComponentWrapper}/>
                    <Route exact path='/profile' component={ProfileComponent}/>
                    <Route exact path='/about-us' component={AboutUsComponent}/>
                    <Route exact path='/404' component={PageNotFoundComponent}/>
                    <Route component={PageNotFoundComponent}/>
                </Switch>
                <FooterComponent/>
            </div>)
        }
    </div>
}

const mapStateToProps = (state) => ({
    initialized: state.appReducer.initialized,
    userId: state.authReducer.userId
})


export default compose(
    withRouter,
    connect(mapStateToProps, {initializeApp}))(App);
