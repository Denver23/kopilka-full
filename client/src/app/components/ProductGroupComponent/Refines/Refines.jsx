import React, {useRef} from "react";
import CustomRefine from "./CustomRefine/CustomRefine";
import s from './Refines.module.scss';
import {withRouter} from "react-router-dom";
import {submit} from 'redux-form';
import {compose} from "redux";
import {connect} from "react-redux";

const Refines = ({dispatch, ...props}) => {

    let initialValues = {};
    if(props.location.search.slice(1).length > 1) {
        decodeURIComponent(props.location.search.slice(1)).split('&').forEach(item => {
            let values = item.split("=");
            values = values.map(value => {
                return value.replace('.', '{:dot:}').replace(' ', '+');
            });
            if(!!initialValues[values[0]]) {
                let initialValue = initialValues[values[0]];
                initialValue[values[1]] = true;
                initialValues[values[0]] = initialValue;
            } else {
                let initialValue = {};
                initialValue[values[1]] = true;
                initialValues[values[0]] = initialValue;
            }
        })
    }

    let data = {};

    props.fields.forEach(refine => {
        data[refine.title] = [];
    })

    let refinesData = useRef(data);

    const updateRefineData = (dispatch) => new Promise((resolve, reject) => {
        props.fields.forEach(item => {
            dispatch(submit(item.title.replace('.', '{:dot:}').replace(' ', '+')));
        })
        resolve();
    })

    let takeRefinesData = () => {
        updateRefineData(dispatch).then(() => {
            let queryString = Object.keys(refinesData.current).filter(item => {
                return refinesData.current[item].length > 0;
            }).map(refineName => {
                let keyQuery = refinesData.current[refineName].map(item => {
                    return encodeURIComponent(refineName) + '=' + encodeURIComponent(item)
                }).join('&');
                return keyQuery;
            }).join('&');
            if(queryString.length > 0) {
                props.history.push({search: `?${queryString}`});
            } else {
                props.history.push({search: ''});
            }
        })
    }

return (
    <div className={s.refines}>
        {
            props.fields.map(ref => {
                return <CustomRefine
                    takeRefinesData={takeRefinesData}
                    refinesData={refinesData}
                    title={ref.title}
                    type={ref.type}
                    items={ref.items}
                    key={ref.title}
                    initialValues={initialValues[ref.title.replace('.', '{:dot:}').replace(' ', '+')]}
                />
            })
        }
    </div>
)
}

export default compose(withRouter, connect())(Refines);