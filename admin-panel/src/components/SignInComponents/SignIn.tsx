import React from 'react';
import {  Form, Input, Button, Checkbox  } from 'antd';
import {  UserOutlined, LockOutlined  } from '@ant-design/icons';
import 'antd/dist/antd.css';
import s from './SignIn.module.scss';
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../redux/authReducer";

const SignIn: React.FC = () => {

    const dispatch = useDispatch();
    const loginThunk = (email: string, password: string, rememberMe: boolean): void => {
        dispatch(login(email, password, rememberMe));
    }

    const onFinish = (values: any) => {
        loginThunk(values.email, values.password, values.rememberMe);
    };

    return (
        <Form
            name="loginForm"
            className={s.loginForm}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link className={s.loginFormForgot} to="">
                    Forgot password
                </Link>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={s.loginFormButton}>
                    Log in
                </Button>
                Or <Link to="">register now!</Link>
            </Form.Item>
        </Form>
    );
}

export default SignIn;