import { useRouter } from 'next/router'
import React, { useState } from 'react'
import LoginAgent from './agentSite/login';
import AgentHome from './agentSite/home';
import RegisterAgent from './agentSite/register';

const AgentSite = ({ auth, setAuth, user, isLogin, setLogin }: any) => {

    const router = useRouter();

    return (
        <div>
            {auth ?
                <AgentHome auth={auth} setAuth={setAuth} user={user} /> :
                <>
                    {isLogin ?
                        <LoginAgent setLogin={setLogin} setAuth={setAuth} /> :
                        <RegisterAgent setLogin={setLogin} />
                    }
                </>
            }
        </div>
    )
}

export default AgentSite