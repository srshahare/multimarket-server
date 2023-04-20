import React from 'react'
import LoginEcom from './eCommerce/login'
import EcomHome from './home'
import ECommerce from './eCommerce/home'
import RegisterEcom from './eCommerce/register'

const EComSite = ({ auth, setMemberAuth, member, isLogin, setLogin }: any) => {
  console.log(auth)
  return (
    <div>
      {auth ?
        <ECommerce member={member} /> :
        <>
          {isLogin ?
            <LoginEcom setAuth={setMemberAuth} setLogin={setLogin} /> :
            <RegisterEcom setLogin={setLogin} />
          }
        </>
      }
    </div>
  )
}

export default EComSite