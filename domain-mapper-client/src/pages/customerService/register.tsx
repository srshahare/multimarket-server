import React, { useState } from 'react'
import { Input, Form, Checkbox, Button, message } from 'antd'
import styles from '@/styles/login.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/utils/baseUrl'

const RegisterService = () => {

  const router = useRouter();
  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitRegister = async (values: any) => {
    console.log(values)
    const { email, password } = values;
    setLoading(true)
    try {
      const result = await axios({
        method: "post",
        url: baseUrl + "/auth/member/signup",
        headers: {},
        data: {
          email, password
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
       message.error({
        content: err?.message
      })
    }
    setLoading(false)
  }

  const onFinishedFailed = (error: any) => {
     message.error({
      content: "Please enter all the inputs!"
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h3>Register (Customer Service)</h3>
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
            <Link href="/">
              <p className={styles.link}>Login</p>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default RegisterService