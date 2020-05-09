import React, {useEffect, useRef, useState} from "react";
import SearchIcon from '@material-ui/icons/Search';
import s from './Search.module.scss';
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {searchProducts, setSearchProducts} from "../../../../redux/headerReducer";
import {Link} from "react-router-dom";

const Search = (props) => {

    let [showResults, setShowResults] = useState(false);
    let latestQueryString = useRef(undefined);


    const SearchResult = (query) => {
        latestQueryString.current = query.search;

        if(query.search !== undefined) {
            setTimeout(() => {
                if(query.search === latestQueryString.current) {
                    props.searchProducts(query.search);
                    setShowResults(true);
                }
            }, 1000)
        } else {
            props.setSearchProducts([]);
        }
    }

    let searchResultList = useRef();

    let handleClickOutside = (e) => {
        const domNode = searchResultList;
        if ((!domNode.current || !domNode.current.contains(e.target))) {
            setShowResults(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [])

    return (
        <div className={s.searchForm}>
            <SearchIcon style={{ fontSize: 20 }}  />
            <SearchFormRedux onChange={SearchResult}/>

                {props.searchProductsList[0] !== undefined ? (<ul ref={searchResultList} className={showResults ? s.searchResultList : `${s.searchResultList} ${s.disabled}`}>
                    {props.searchProductsList.map(product => {
                        return <li className={s.searchListItem}>
                            <Link className={s.searchItemLink} to={`/brands/${product.brand.toLowerCase()}/id${product.id}`} onClick={()=>{setShowResults(false)}}>
                                <div className={s.productThumbnail}><img src={product.image} alt=""/></div>
                                {product.brand}&#169; - {product.productTitle}
                            </Link>
                        </li>
                    })}
                </ul>) : ''}
        </div>
    )
}

const SearchForm = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <Field component={SearchInput} placeholder={'I\'m looking for...'} type={'text'} name={'search'} />
    </form>
}

const SearchInput = ({input, meta: {touched, error}, ...props}) => {
    return <div>
        <input {...input} {...props} autoComplete={'off'} className={s.searchInput}/>
    </div>
}
const SearchFormRedux = reduxForm({form: 'searchForm'})(SearchForm)

let mapStateToProps = (state) => {
    return {
        searchProductsList: state.headerReducer.searchProducts
    }
}

export default connect(mapStateToProps, {searchProducts,setSearchProducts})(Search);