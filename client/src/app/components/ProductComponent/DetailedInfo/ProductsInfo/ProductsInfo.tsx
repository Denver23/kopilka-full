import React, {useLayoutEffect, useState} from "react";
import s from './ProductsInfo.module.scss';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {compose} from "redux";
import {connect} from "react-redux";
import {AppStateType} from "../../../../redux/store";
import {ChildProductType} from "../../../../types/types";

type MapStateToPropsType = {
    childProducts: Array<ChildProductType>
}

type OwnProps = {
    brand: string
}

type PropsType = OwnProps & MapStateToPropsType & RouteComponentProps<{brand: string}>;

const ProductsInfo: React.FC<PropsType> = (props) => {

    let skuRow = React.useRef<HTMLDivElement>(null);
    let [skuAllHeight, changeSKUAllHeight] = useState(skuRow.current ? skuRow.current.scrollHeight : 0);
    let [skuHeight, changeSKUHeight] = useState(0);
    let [activeSKUList, changeSKUListStatus] = useState(false);

    useLayoutEffect(() => {
        changeSKUAllHeight(skuRow.current ? skuRow.current.scrollHeight : 0);
        changeSKUHeight(skuRow.current ? skuRow.current.clientHeight : 0)
    }, [skuAllHeight])

    return <div className={s.ProductsInfo}>
        <div className={s.infoRow}>
            <div className={s.infoTitle}>Brand:</div>
            <div className={s.infoContent}><Link to={`/brands/${props.match.params.brand}`}>{props.brand}</Link></div>
        </div>
        <div className={s.infoRow}>
            <div className={s.infoTitle}>Part Number:</div>
            <div className={activeSKUList ? `${s.infoContent} ${s.active}` : s.infoContent} ref={skuRow}>
                {props.childProducts.map(product => {
                    return <div className={s.productSKU} key={product.sku}>{product.sku}</div>
                })}
                {skuAllHeight > skuHeight ? <span className={s.skuArrow} onClick={() => {changeSKUListStatus(!activeSKUList)}}>&#8744;</span> : ''}
            </div>
        </div>
    </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        childProducts: state.productReducer.childProducts
    }
}

export default compose(withRouter, connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps, {}))(ProductsInfo) as React.FC<OwnProps>;