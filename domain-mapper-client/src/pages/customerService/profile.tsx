import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import axios from 'axios'
import baseUrl from '@/utils/baseUrl'

const Profile = ({site}: any) => {

    
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

    return (
        <div style={{ background: "#eee", padding: '2rem', borderRadius: "8px", width: "30%" }}>
            {contextHolder}
            <h3 style={{ marginBottom: "2rem" }}>Profile Settings</h3>
            <div>
                <p style={{ marginBottom: '8px' }}>Email</p>
                <Input disabled contentEditable={false} value={site?.email} />
            </div>
            <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: '8px' }}>
                <h5 style={{ marginBottom: '8px' }}>Change Password</h5>
                <div>
                    <p style={{ marginBottom: '8px' }}>Previous Password</p>
                    <Input.Password onChange={e => setOldPass(e.target.value)} placeholder='******' />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <p style={{ marginBottom: '8px' }}>New Password</p>
                    <Input.Password onChange={e => setNewPass(e.target.value)} placeholder='******' />
                </div>
                <Button onClick={handleUpdatePass} type="primary" style={{ marginTop: '8px' }}>Submit</Button>
            </div>
        </div>
    )
}

export default Profile