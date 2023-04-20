import React, { useState } from 'react'
import styles from '@/styles/agentSite.module.css'
import { Input, Button, Modal, message } from 'antd'
import { useRouter } from 'next/router'
import baseUrl from '@/utils/baseUrl'
import axios from 'axios'

const ECommerce = ({ member }: any) => {

    const router = useRouter();
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();


    const handleUpdatePass = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("mtoken")
            const response = await axios({
                method: 'post',
                url: `${baseUrl}/member/updatePassword`,
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    newPass,
                    oldPass
                }
            })
            if (response.status === 200) {
                messageApi.success("Password changed successfully!")
            }
        } catch (err) {
            console.log(err)
            messageApi.error("Wrong password!")
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.setItem("mtoken", "")
        router.reload()
    }


    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.homeCard}>
                <h3>Account Page</h3>
                <div style={{ marginTop: '1rem' }}>
                    <p style={{ marginBottom: '8px' }}>Email</p>
                    <Input value={member?.email} disabled />
                </div>
                <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '8px' }}>Change Password</h5>
                    <div>
                        <p style={{ marginBottom: '8px' }}>Current Password</p>
                        <Input.Password onChange={e => setOldPass(e.target.value)} placeholder='******' />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ marginBottom: '8px' }}>New Password</p>
                        <Input.Password onChange={e => setNewPass(e.target.value)} placeholder='******' />
                    </div>
                    <Button onClick={handleUpdatePass} loading={loading} type="primary" style={{ marginTop: '8px' }}>Submit</Button>
                </div>
                <Button onClick={handleLogout} style={{ marginTop: '3rem' }}>Sign out</Button>
            </div>
        </div>
    )
}

export default ECommerce