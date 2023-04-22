/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addToCart } from 'src/apis/purchase.api'
import Vector from 'src/assets/images/Vector.png'
import { AppContext } from 'src/contexts/app.context'
import { FormatNumber, FormatNumberK } from 'src/hooks/useFormatNumber'
import { Product } from 'src/types/product.type'
import { getProfileFromLS } from 'src/utils/auth'
import QuantityController from '../QuantityController/QuantityController'
import { useTranslation } from 'react-i18next'

interface Props {
  type?: string
  product: Product
}

const BigItem = ({ product, type }: Props) => {
  const { isAuthenticated } = useContext(AppContext)
  const { t } = useTranslation('product')
  // const queryClient = useQueryClient()
  const profileAccessToken = getProfileFromLS()
  const [buyCount, setBuyCount] = useState(1)
  const navigate = useNavigate()
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  const body: any = { buy_count: buyCount, product_id: product?._id }

  const addToCartMutation = useMutation({
    mutationFn: () => {
      return addToCart(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['cart', profileAccessToken?._id] })
      toast.success('Đã thêm vào giỏ')
    }
  })

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCartMutation.mutate()
    } else {
      toast.warn('Hãy đăng nhập để thực hiện!')
    }
  }
  const handleBuyNow = async () => {
    if (isAuthenticated) {
      const res = await addToCartMutation.mutateAsync(profileAccessToken?._id, body)
      const purchase = res.data.data
      navigate('/cart', {
        state: {
          purchaseId: purchase._id
        }
      })
    } else {
      toast.warn('Hãy đăng nhập để thực hiện!')
    }
  }
  if (!product) return null
  return (
    <div className='m-auto dark:text-white'>
      {/* {!type && (
        <div className='font-[600] text-[18px] leading-7 mb-[20px]'>
          Your Campaign <span className='text-violet'>(4)</span>
        </div>
      )} */}
      <div className={`${type ? 'gap-x-[40px]' : ''} flex mobile:flex-col mobile:w-[327px]`}>
        <div className=''>
          <div className={`${type ? 'h-[700px]' : 'h-[266px]'} w-[583px] mobile:w-[100%] mobile:h-[510px]`}>
            {product.image && <img src={product.image[0]} alt='' />}
          </div>
        </div>
        <div
          className={`${
            type ? 'w-[443px]' : 'w-[495px]'
          } flex flex-col gap-y-[12px] mobile:px-0 px-[30px] py-[17px] mobile:w-[100%]`}
        >
          <div className='flex gap-[10px] items-center'>
            <div className='w-6 h-6 py-[2px]'>
              <img src={Vector} alt='' />
            </div>
            <p className='text-[14px] font-[500] leading-5 text-text-color'>
              {product?.category ? product?.category.name : null}
            </p>
          </div>
          <h1 className='font-[700] dark:text-white mobile:font-[600] mobile:text-[16px] text-[20px] leading-7'>
            {product?.name}
          </h1>
          <p className='leading-[22px] mobile:text-[12px] text-text-color'>{product?.description}</p>
          <div>
            <div className='h-[5px] bg-[#EFEFEF] rounded-[5px]'>
              <div className='bg-primary w-[70%] h-[100%] rounded-[5px]'></div>
            </div>
          </div>
          <div className={`${type ? 'gap-[40px]' : 'gap-[65px]'} flex justify-between mobile:gap-[31px]`}>
            <div className='flex flex-col items-center'>
              <h2 className='font-[700] text-[20px] mobile:text-[16px]'>
                {FormatNumber(Number(product?.price_after_discount))}đ
              </h2>
              <div className='text-textColor4 text-[16px] mobile:text-[14px] leading-7'>
                {t('historical cost')} {FormatNumber(Number(product?.price))}đ
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h2 className='font-[700] text-[20px] mobile:text-[16px]'>{FormatNumberK(product?.selled as number)}</h2>
              <div className='text-textColor4 text-[16px] mobile:text-[14px] leading-7'>{t('selled')}</div>
            </div>
            <div className='flex flex-col items-center'>
              <h2 className='font-[700] text-[20px] mobile:text-[16px]'>
                {!product.rating ? <p>{t('not have')}</p> : product.rating + '*'}
              </h2>
              <div className='text-textColor4 text-[16px] mobile:text-[14px] leading-7'>{t('rating')}</div>
            </div>
          </div>
          <div className='flex gap-x-8 items-center'>
            <QuantityController
              max={product?.countInStock}
              onDecrease={handleBuyCount}
              onIncrease={handleBuyCount}
              onType={handleBuyCount}
              value={buyCount}
              disabled={false}
            ></QuantityController>
            <div>
              {FormatNumberK(product?.countInStock)} {t('products available')}
            </div>
          </div>
          {type && (
            <>
              <button
                onClick={handleBuyNow}
                className='bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px] w-full  hover:opacity-90'
              >
                {t('buy now')}
              </button>
              <button
                onClick={handleAddToCart}
                className={` bg-secondary text-4 font-[600]  text-white h-[52px] rounded-[10px] w-full  hover:opacity-90`}
              >
                {t('add to cart')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BigItem
