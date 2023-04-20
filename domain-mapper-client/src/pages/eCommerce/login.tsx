import { Input, Form, Checkbox, Button, message } from 'antd'
import React from 'react'
import styles from '@/styles/login.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '@/utils/baseUrl'

const LoginEcom = ({ setAuth, setLogin }: any) => {

    const router = useRouter()

    interface LoginObject {
        email: string,
        password: string,
    }

    const handleFinish = async (values: LoginObject) => {
        const { email, password } = values;
        try {
            const result = await axios({
                method: "post",
                url: baseUrl + '/auth/member/login',
                headers: {},
                data: {
                    email,
                    password
                }
            })
            if (result.data?.token) {
                const token = result.data?.token;
                localStorage.setItem("mtoken", token)
                setAuth(true)
                router.reload();
            }
        } catch (err: any) {
            setAuth(false)
            console.log(err)
            message.error({
                content: err?.message || "Password is wrong or User already exist!"
            })
        }
    }

    const handleFinishFailed = () => {
        message.error({
            content: "Please enter all the inputs!"
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h3>Login (E-Commerce)</h3>
                <Form onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout='vertical'>
                    <Form.Item label="Email" name="email" rules={[{
                        required: true,
                        message: "Please enter your email"
                    }]}>
                        <Input placeholder='e.g. abc@gmail.com' />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{
                        required: true,
                        message: "Please enter your password"
                    }]}>
                        <Input.Password placeholder='******' />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox defaultChecked >Remember Me</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' style={{ width: "100%" }} type="primary" >Login</Button>
                    </Form.Item>
                    <Form.Item>
                        {/* <Link href="/agentSite/home">
                            <p className={styles.link}>Forget Password?</p>
                        </Link> */}
                        <Link onClick={() => setLogin(false)} href="/">
                            <p className={styles.link} style={{ marginTop: '1rem' }}>Register</p>
                        </Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginEcom