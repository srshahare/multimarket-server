import React from 'react'

const NotFound = () => {
    return (
        <div style={{display: 'flex', flexFlow:'column', justifyContent: 'center', alignItems: 'center', height: "100vh", textAlign: 'center'}}>
            <h1>404</h1>
            <div style={{ marginTop: '1rem' }}>
                <h3>Uh OH! You are lost</h3>
                <p>The apge you are looking for does not exist. How you got here is a mystery.</p>
            </div>
        </div>
    )
}

export default NotFound