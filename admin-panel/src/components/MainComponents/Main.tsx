import React from 'react';
import s from './Main.module.scss'
import { Input, Menu, Switch as SwitchAnt } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    ApartmentOutlined,
    LinkOutlined,
} from '@ant-design/icons'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadProduct} from "../../redux/productReducer";
import {Route, withRouter, Switch, RouteComponentProps} from "react-router-dom";
import ProductPage from "../ProductPageComponents/ProductPage";
import {GetTheme} from "../../redux/selectors/appSelectors";
import {appReducerActions} from "../../redux/appReducer";
import ProductsList from "../ProductsListComponents/ProductsList";
const { SubMenu } = Menu;

const Main: React.FC<RouteComponentProps> = ({history, ...props}) => {

    const dispatch = useDispatch();
    const loadProductThunk = (id: string): void => {
        dispatch(loadProduct(id));
    };
    const changeTheme = (theme: 'light' | 'dark') => {
        dispatch(appReducerActions.changeTheme(theme));
    }

    let theme = useSelector(GetTheme);

    const switchTheme = (e: any) => {
        if(theme === 'light') {
            changeTheme('dark');
        } else {
            changeTheme('light');
        }
    }

    return <div className={s.Main}>
        <div className={s.searchInputLine}>
            <Input.Search placeholder="Input productID" onSearch={value => {loadProductThunk(value); history.push(`/admin/product/id${value}`)}} maxLength={50} enterButton className={s.searchInput} />
            <div><SwitchAnt onChange={switchTheme} /> Change Style</div>
        </div>

        <Menu
            style={{ width: 250 }}
            defaultSelectedKeys={[]}
            defaultOpenKeys={['sub1']}
            mode={'inline'}
            theme={theme}
        >
            <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Products Control">
                <Menu.Item key="3"><Link to={'/admin/products'}>Products</Link></Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
                <SubMenu key="sub1-2" title="Submenu">
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                </SubMenu>
            </SubMenu>
            <SubMenu key="sub2" icon={<ApartmentOutlined />} title="Categories Control">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <Menu.Item key="1" icon={<UserOutlined />}>
                Users
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
                Navigation Two
            </Menu.Item>
        </Menu>
        <div className={s.wrapper}>
            <Switch>
                <Route exact path='/admin/' component={() => {return <div></div>}}/>
                <Route exact path='/admin/product/id:id(\w+)' component={ProductPage}/>
                <Route path={'/admin/products'} component={ProductsList} />
            </Switch>
        </div>
    </div>
}

export default withRouter(Main);