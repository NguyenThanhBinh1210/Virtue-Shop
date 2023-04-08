import React from 'react'
interface Props {
  children: React.ReactNode
}
const NavItem = ({ children }: Props) => {
  return <div className='w-[48px] h-[48px] flex items-center justify-center rounded-lg mb-5'>{children}</div>
}

export default NavItem
