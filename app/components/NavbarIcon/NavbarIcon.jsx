import React from 'react'

const NavbarIcon = ({Icon,name}) => {
  return (
    <div className='cursor-pointer p-1 hover:text-white rounded transition delay-75   hover:bg-gray-600' >
        <Icon size="25"  className=""/>
    </div>
  )
}

export default NavbarIcon