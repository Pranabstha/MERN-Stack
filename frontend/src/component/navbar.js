import React from 'react'

export const Navbar = () => {
    return (
        <>
    <nav style={{ height: '20%', backgroundColor: 'black', display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
        <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', width: '200px', margin: 0, padding: 0 }}>
          <li style={{ textDecoration: 'none', color: 'white' }} >Home</li>
          <li style={{ textDecoration: 'none', color: 'white' }}>Contact Us</li>
          <li style={{ textDecoration: 'none', color: 'white' }}>****</li>
        </ul>
      </div>
      <div>
        <button className='btn btn-primary'>Sign Up</button>
        <button className='btn btn-success'>Log In</button>
      </div>
    </nav>
        </>

    )
}
