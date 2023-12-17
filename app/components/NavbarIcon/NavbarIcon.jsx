import React from 'react'

const NavbarIcon = ({Icon,name}) => {
  return (
    <div className='cursor-pointer p-1 rounded  hover:bg-gray-200' >
        <Icon size="25"  className=""/>
    </div>
  )
}

export default NavbarIcon