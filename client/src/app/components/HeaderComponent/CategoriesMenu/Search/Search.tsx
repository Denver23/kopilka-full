import React, {useEffect, useRef, useState} from "react";
import SearchIcon from '@material-ui/icons/Search';
import s from './Search.module.scss';
import {Field, InjectedFormProps, reduxForm, WrappedFieldInputProps, WrappedFieldMetaProps} from "redux-form";
import {connect} from "react-redux";
import {searchProducts, headerReducerActions} from "../../../../redux/headerReducer";
import {Link} from "react-router-dom";
import {SearchProductType} from "../../../../types/types";
import {AppStateType} from "../../../../redux/store";


type SearchMapStateToPropsType = {
    searchProductsList: Array<SearchProductType>
}
type SearchMapDispatchToProps = {
    searchProducts: (query: string) => void,
    setSearchProducts: (data: Array<SearchProductType>) => void
}

type SearchType  = SearchMapStateToPropsType & SearchMapDispatchToProps

const Search: React.FC<SearchType> = (props) => {

    let [showResults, setShowResults] = useState(false);
    let latestQueryString = useRef<string | undefined>(undefined);


    const SearchResult = (query: {search: string}) => {
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

    let searchResultList = useRef<HTMLUListElement>(null);

    let handleClickOutside = (e: Event) => {
        const domNode = searchResultList;
        const eventNode = e.target as Node;
        if ((!domNode.current || !domNode.current.contains(eventNode))) {
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

type SearchFormValuesType = {
    search: string
}

type SearchFormOwnProps = {}

const SearchForm: React.FC<InjectedFormProps<SearchFormValuesType, SearchFormOwnProps> & SearchFormOwnProps> = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <Field component={SearchInput} placeholder={'I\'m looking for...'} type={'text'} name={'search'} />
    </form>
}

type SearchInputPropsType = {
    input: WrappedFieldInputProps,
    meta: WrappedFieldMetaProps
}

const SearchInput: React.FC<SearchInputPropsType> = ({input, meta: {touched, error}, ...props}) => {
    return <div>
        <input {...input} {...props} autoComplete={'off'} className={s.searchInput}/>
    </div>
}
const SearchFormRedux = reduxForm<SearchFormValuesType, SearchFormOwnProps>({form: 'searchForm'})(SearchForm)

let mapStateToProps = (state: AppStateType): SearchMapStateToPropsType => {
    return {
        searchProductsList: state.headerReducer.searchProducts
    }
}

export default connect<SearchMapStateToPropsType, SearchMapDispatchToProps, {}, AppStateType>(mapStateToProps, {searchProducts,setSearchProducts: headerReducerActions.setSearchProducts})(Search);