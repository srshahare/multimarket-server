import React, { useState } from 'react'
import AgentSite from './AgentSite'
import OfficeSite from './OfficeSite'
import EComSite from './EComSite'
import CustomerSite from './CustomerSite'

const EcomHome = () => {

    const [site, setSite] = useState("agent")

    return (
        <div>
            {site === 'agent' &&
                <AgentSite />
            }
            {
                site === 'office' &&
                <OfficeSite />
            }
            {
                site === "ecom" &&
                <EComSite />
            }
            {
                site === "customer" &&
                <CustomerSite />
            }
        </div>
    )
}

export default EcomHome