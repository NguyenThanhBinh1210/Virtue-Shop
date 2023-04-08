import DashboardHeader from 'src/components/DashboardHeader/DashboardHeader'
import Footer from 'src/components/Footer'

interface Props {
  children?: React.ReactNode
}
const CartLayout = ({ children }: Props) => {
  return (
    <div className='mobile:w-[100vw] w-[1348px] m-auto'>
      <DashboardHeader />
      <div className='px-8'>{children}</div>
      <Footer></Footer>
    </div>
  )
}

export default CartLayout
