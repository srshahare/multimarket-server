import React, { useState } from 'react'
import { Input, Form, Checkbox, Button, message } from 'antd'
import styles from '@/styles/login.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import baseUrl from '@/utils/baseUrl'
import axios from 'axios'

const RegisterAgent = ({ setLogin }: any) => {

  const router = useRouter();
  const { asPath } = useRouter();

  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitRegister = async (values: any) => {
    const { email, password } = values;

    const origin =
    typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';
    
    const URL = `${origin}${asPath}`;
    let refDomain = ""
    if (URL === "https://ztroo.com" || URL === "https://www.ztroo.com") {
        refDomain = "www"
    }else {
      const domain = URL.split("https://")[1]
      refDomain = domain.split("/")[0]
    }
    // const refDomain = "test20-gmail-agent.ztroo.com"
    setLoading(true)
    try {
      const result = await axios({
        method: "post",
        url: baseUrl + "/auth/signup",
        headers: {},
        data: {
          email, password, refDomain
        }
      })
      if (result) {
        console.log(result)
        router.push("/")
        router.reload()
      }
    } catch (err: any) {
      console.log(err)
      setLoading(false)
      return message.error({
        content: String(err?.message)
      })
    }
    setLoading(false)
  }

  const onFinishedFailed = (error: any) => {

  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h3>Register (Agent)</h3>
        <Form onFinish={handleSubmitRegister} onFinishFailed={onFinishedFailed} layout='vertical'>
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
          <Form.Item label="Confirm Password" name="cnfpassword" rules={[{
            required: true,
            message: "Please enter your password"
          }, {
            validator: (rule, value, callback) => {
              if (value !== pass) {
                callback("Password not matched")
              } else {
                callback()
              }
            }
          }]}>
            <Input.Password onChange={e => setPass(e.target.value)} placeholder='******' />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType='submit' style={{ width: "100%" }} type="primary" >Sign Up</Button>
          </Form.Item>
          <Form.Item>
            <Link onClick={() => setLogin(true)} href="/">
              <p className={styles.link} style={{ marginTop: '1rem' }}>Login</p>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default RegisterAgent