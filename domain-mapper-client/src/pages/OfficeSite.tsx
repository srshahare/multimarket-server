import React from 'react'
import LoginOffice from './backOffice/login'
import OfficeHome from './backOffice/home'

const OfficeSite = ({ auth, setAuth, user }: any) => {

  return (
    <div>
      {auth ?
        <OfficeHome user={user} setAuth={setAuth} /> :
        <LoginOffice setAuth={setAuth} />
      }
    </div>
  )
}

export default OfficeSite