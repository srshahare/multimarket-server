import React from 'react'
import LoginService from './customerService/login'
import CustomerHome from './customerService/home'

const CustomerSite = ({ auth, setMemberAuth, member }: any) => {
  return (
    <div>
      {auth ?
        <CustomerHome member={member} /> :
        <LoginService setAuth={setMemberAuth} />
      }
    </div>
  )
}

export default CustomerSite