/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ProductItem from '../ProductItem/ProductItem'
import { useTranslation } from 'react-i18next'
import { filter } from 'lodash'
interface Props {
  product: any
  similarProduct: any
}
const DescriptionBlock = ({ product, similarProduct }: Props) => {
  const { t: t1 } = useTranslation('product')
  const { t: t2 } = useTranslation('home')
  return (
    <section className={`mobile:w-[100%]  py-[10px] mobile:flex-col dark:text-white flex justify-between mb-[70px]`}>
      <div className='w-[605px] mobile:w-[327px]'>
        <h1 className='text-[18px] font-[600] mb-[20px]'>{t1('describe')}</h1>
        <div className=' mobile:w-[100%] mobile:h-[450px] mb-[20px]'>
          <img src={product?.image[1]} alt='' />
        </div>
        <div className='px-[30px] mobile:text-[12px] mobile:leading-[18px] text-text-color mb-5 py-[10px] font-[400] text-[16px] leading-[26px]'>
          {product?.description}
        </div>
        <div className=' mobile:w-[100%] mobile:h-[450px] mb-[20px]'>
          <img src={product?.image[2]} alt='' />
        </div>
      </div>
      <div className='w-[391px] mobile:w-[327px]'>
        <h1 className='text-[18px] font-[600] mb-[20px]'>{t2('similar product')}</h1>
        <div className='flex flex-col gap-y-[60px] mobile:flex-row mobile:gap-x-[30px] mobile:overflow-x-auto'>
          {similarProduct
            ?.filter((item: any) => item._id !== product._id)
            .slice(0, 4)
            .map((item: any) => (
              <div key={item._id}>
                <ProductItem product={item}></ProductItem>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default DescriptionBlock
