import React from 'react'
import AdminHeader from 'src/components/AdminHeader/AdminHeader'
interface Props {
  children?: React.ReactNode
}
const AdminLayout = ({ children }: Props) => {
  return (
    <div>
      <div className='flex dark:bg-gray-800'>
        <AdminHeader></AdminHeader>
        <div className={`w-[100%]`}>{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
