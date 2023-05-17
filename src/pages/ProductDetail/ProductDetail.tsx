/* eslint-disable @typescript-eslint/no-explicit-any */
import BigItem from 'src/components/BigItem/BigItem'
import Button from 'src/components/Button'
import { getProductDetail, getProduct } from 'src/apis/product.api'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getIdFromNameId } from 'src/hooks/useFormatNumber'
import ProductItem from 'src/components/ProductItem/ProductItem'
import { useEffect, useState } from 'react'
import CommentBlock from 'src/components/CommentBlock/CommentBlock'
import EvaluateBlock from 'src/components/EvaluateBlock/EvaluateBlock'
import DescriptionBlock from 'src/components/DescriptionBlock/DescriptionBlock'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

const ProductDetail = () => {
  const [acctive, setActive] = useState(1)
  const { id: nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  const { t } = useTranslation('product')
  const { t: t2 } = useTranslation('home')
  const { data: productDetailData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id as string),
    onSuccess: () => {
      window.scroll({
        top: 0,
        left: 0
      })
    }
  })

  const [scrollTop, setScrollTop] = useState(0)
  const onScroll = (e: any) => {
    setScrollTop(e.target.documentElement.scrollTop)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
  }, [])

  const product = productDetailData?.data.data
  const queryConfig = {
    page: 1,
    limit: 5,
    category: product?.category
  }
  const { data: productsSimilarData } = useQuery({
    queryKey: ['productList', queryConfig],
    queryFn: () => {
      return getProduct(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })
  const { data: productsDataNewest } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return getProduct({
        page: 1,
        limit: 6
      })
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const similarProduct = productsSimilarData?.data.data
  const products = productsDataNewest?.data.data
  return (
    <div className='pb-[50px] mobile:w-[100%] p-6 flex justify-center '>
      {product && (
        <Helmet>
          <title>{product?.name} | Virtue Shop</title>
          <meta name='description' content={product?.description} />
        </Helmet>
      )}
      {isLoading && (
        <div role='status' className='mx-auto '>
          <svg
            aria-hidden='true'
            className='w-[150px] h-[150px] mr-2 text-gray-200 animate-spin fill-primary'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!isLoading && (
        <div>
          <div className='h-[140px] mobile:h-[90px] mobile:w-[100%] mb-10 mobile:mb-5 rounded-[25px] w-[100%] relative'>
            <div className=' h-full overflow-hidden rounded-[25px]'>
              <img
                src='https://img1.kienthucvui.vn/uploads/2019/10/09/anh-bau-troi-cuc-dep-voi-canh-chim-co-don_042050853.jpg'
                alt=''
              />
            </div>
            <h1 className='font-[700] text-[40px] absolute mobile:text-[20px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-white'>
              {product?.category.name ? <div>{product?.category.name}</div> : null}
            </h1>
          </div>
          <section className='mobile:w-[100%] mobile:flex mobile:justify-center mobile:mb-[30px] mb-[155px]'>
            <BigItem type='big' product={product} />
          </section>
          <section className=' mobile:w-[100%] flex gap-[50%] py-[19px] mb-[25px] '>
            <div className='flex gap-[60px] items-center dark:text-white mobile:gap-[30px]'>
              <button onClick={() => setActive(1)} className={`cursor-pointer ${acctive === 1 ? 'text-violet' : ''} `}>
                {t('product')}
              </button>
              <button onClick={() => setActive(2)} className={`cursor-pointer ${acctive === 2 ? 'text-violet' : ''} `}>
                {t('comment')}
              </button>
              <button onClick={() => setActive(3)} className={`cursor-pointer ${acctive === 3 ? 'text-violet' : ''} `}>
                {t('evaluate')}
              </button>
            </div>
            <div className='mobile:hidden'>
              <Button>{t('back')}</Button>
            </div>
          </section>
          <div className={`${acctive === 1 ? ' block' : 'hidden'}`}>
            <DescriptionBlock product={product} similarProduct={similarProduct} />
          </div>
          <div className={`${acctive === 2 ? ' block' : 'hidden'}`}>
            <CommentBlock id={id} />
          </div>
          <div className={`${acctive === 3 ? ' block' : 'hidden'}`}>
            <EvaluateBlock id={id} />
          </div>
          <section className='mb-[20px] mobile:w-[327px] dark:text-white '>
            <h1 className='font-[600] text-[18px] leading-7 mb-[20px]'>{t2('latest products')}</h1>
            <div className='gap-[30px] grid grid-cols-4 mobile:flex mobile:w-[100%] mobile:overflow-x-auto'>
              {products
                ?.filter((item: any) => item._id !== product._id)
                .slice(0, 4)
                .map((item) => (
                  <div key={item._id}>
                    <ProductItem product={item} />
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
      {scrollTop > 1000 && (
        <button
          onClick={() => {
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth'
            })
          }}
          className='fixed bottom-20 right-5 bg-primary opacity-90 p-3 rounded-full'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={24}
            height={24}
            viewBox='0 0 24 24'
            style={{ fill: 'white', transform: '' }}
          >
            <path d='m6.293 11.293 1.414 1.414L12 8.414l4.293 4.293 1.414-1.414L12 5.586z' />
            <path d='m6.293 16.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L12 10.586z' />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ProductDetail
