import { Link } from 'react-router-dom'
import Logo from '../../assets/images/Logo.png'

const RegisterHeader = () => {
  return (
    <div className='mb-[61px] mobile:mb-[20px] mobile:px-[24px] mobile:pt-[24px]'>
      <div className='w-[52px] h-[52px] mobile:w-[40px] mobile:h-[40px]'>
        <Link to='/'>
          <img src={Logo} alt='' />
        </Link>
      </div>
    </div>
  )
}

export default RegisterHeader
