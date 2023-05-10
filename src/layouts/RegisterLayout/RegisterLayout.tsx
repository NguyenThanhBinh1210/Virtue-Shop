import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
const RegisterLayout = ({ children }: Props) => {
  return (
    <div className='p-[40px] mobile:p-[20px] dark:bg-[#13131A] min-h-screen'>
      <RegisterHeader></RegisterHeader>
      {children}
    </div>
  )
}

export default RegisterLayout
