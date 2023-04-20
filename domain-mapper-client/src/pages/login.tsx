import React, { useState } from 'react'
import LoginAgent from './agentSite/login'
import LoginEcom from './eCommerce/login'
import LoginOffice from './backOffice/login'
import LoginService from './customerService/login'

const Login = () => {

    const [site, setSite] = useState("office")

    return (
        <div>
            {site === 'agent' &&
                <LoginAgent />
            }
            {
                site === 'office' &&
                <LoginOffice />
            }
            {
                site === "ecom" &&
                <LoginEcom />
            }
            {
                site === "customer" &&
                <LoginService />
            }
        </div>
    )
}

export default Login