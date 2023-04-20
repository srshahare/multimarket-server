import React from 'react'
import { Input, Button } from 'antd'

const CustomDomain = ({site}: any) => {
    return (
        <div style={{ background: "#eee", padding: '2rem', borderRadius: "8px", width: "30%" }}>
            <h3 style={{ marginBottom: "2rem" }}>Custom Domains Settings</h3>
            <div>
                <h4 style={{ marginBottom: '8px', textDecoration: 'underline' }}>Agent Site</h4>
                <h5>Temporary Domain</h5>
                <p style={{ marginLeft: '8px' }}>aaa.tempdomain.cc</p>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <h5>Custom Domain</h5>
                    <Button type="primary" >Add</Button>
                </div>
                <p style={{ marginLeft: '8px' }}>aaa.tempdomain.cc</p> */}
            </div>
            <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '8px', textDecoration: 'underline' }}>Back Office</h4>
                <h5>Temporary Domain</h5>
                <p style={{ marginLeft: '8px' }}>bbb.tempdomain.cc</p>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <h5>Custom Domain</h5>
                    <Button type="primary" >Add</Button>
                </div>
                <p style={{ marginLeft: '8px' }}>aaa.tempdomain.cc</p> */}
            </div>
        </div>
    )
}

export default CustomDomain