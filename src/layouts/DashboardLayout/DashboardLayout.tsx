import { memo } from 'react'
import DashboardHeader from 'src/components/DashboardHeader/DashboardHeader'
import Footer from 'src/components/Footer'
import Navbar from 'src/components/Navbar'

interface Props {
  children?: React.ReactNode
}
const DashboardLayoutInner = ({ children }: Props) => {
  return (
    <div className='mobile:w-[100vw] tablet:w-[100vw] w-[1348px] m-auto dark:bg-[#13131A] min-h-screen'>
      <DashboardHeader />
      <div className='flex gap-[30px]'>
        <Navbar></Navbar>
        <div className='w-full mobile:mt-3'>{children}</div>
      </div>
      <Footer />
    </div>
  )
}
const DashboardLayout = memo(DashboardLayoutInner)
export default DashboardLayout
