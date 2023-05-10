import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Vector from 'src/assets/images/Vector.png'
import { FormatNumber, FormatNumberK, generateNameId } from 'src/hooks/useFormatNumber'
import { Product } from 'src/types/product.type'
interface Props {
  product: Product
}
const ProductItem = ({ product }: Props) => {
  const { t } = useTranslation('product')
  return (
    <Link to={`/product/${generateNameId({ name: product?.name, id: product?._id })}`}>
      <div className='dark:bg-[#1C1C24] flex flex-col shadow-sm rounded-[15px] tablet:w-[150px] mobile:w-[170px] w-[250px]'>
        <div className='w-[250px] mobile:w-[170px] tablet:w-[150px] tablet:h-[150px] h-[300px] mobile:h-[200px] rounded-[25px] overflow-hidden '>
          <img src={product?.image[0]} alt={product?.name} />
        </div>
        <div className='px-[20px] mobile:w-auto tablet:w-[150px] py-[15px] w-[271px] flex flex-col mobile:gap-y-[0px] gap-y-[15px]'>
          <div className='flex items-center gap-2'>
            <div className='w-[18px] h-[18px] py-[2px]'>
              <img src={Vector} alt='' />
            </div>
            <p className='text-[12px] mobile:text-[10px] font-[500] text-text-color'>{product?.category?.name}</p>
          </div>
          <div>
            <h2 className='font-[600] dark:text-white text-[16px] mobile:text-[12px] tablet:text-[12px] leading-7 tablet:leading-4 mobile:leading-4 line-clamp-2'>
              {product?.name}
            </h2>
            <p className='text-text-color text-[12px] leading-[18px]'>{product?.description}</p>
          </div>
          <div className='flex justify-between pr-5 mobile:pr-0 tablet:pr-0'>
            <div className='flex flex-col '>
              <h2 className='font-[600] text-[14px] leading-6 dark:text-text-color'>
                {FormatNumber(Number(product?.price_after_discount))}đ
              </h2>
              <div className='text-textColor4 text-[12px] mobile:hidden tablet:hidden '>
                {t('historical cost')} {FormatNumber(Number(product?.price))}đ
              </div>
              <div className='text-textColor4 text-[12px] hidden mobile:block tablet:block '>
                {FormatNumber(Number(product?.price))}đ
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h2 className='font-[600] text-[14px] leading-6 dark:text-text-color lowercase'>
                {FormatNumberK(product?.selled || 0)}
              </h2>
              <div className='text-textColor4 text-[12px] '>{t('selled')} </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
export default ProductItem
