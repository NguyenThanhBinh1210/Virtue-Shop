import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import omit from 'lodash/omit'
import { useQuery } from 'react-query'
import { createSearchParams, Link } from 'react-router-dom'
import { getCategories } from 'src/apis/category.api'
import { getAllProduct, getProduct } from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import ProductItem from 'src/components/ProductItem/ProductItem'
import SortProductList from 'src/components/SortProductList'

import useQueryParams from 'src/hooks/useQueryParams'
import { ProductListComfig } from 'src/types/product.type'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
export type QueryConfigS = {
  [key in keyof ProductListComfig]: string
}
const ProductList = () => {
  const queryParams: QueryConfigS = useQueryParams()
  const queryConfig: QueryConfigS = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 8,
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      category: queryParams.category,
      name: queryParams.name,
      rating_filter: queryParams.rating_filter,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max
    },
    isUndefined
  )
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => {
      return getProduct(queryConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return getCategories()
    }
  })

  const { data: dataAll2, isLoading: loading } = useQuery({
    queryFn: () => {
      return getAllProduct()
    }
  })
  const { t } = useTranslation('product')

  return (
    <div className='w-full'>
      <Helmet>
        <title>Danh sách sản phẩm | Virtue Shop</title>
        <meta name='description' content='Danh sách sản phẩm trang Virtue Shop' />
      </Helmet>
      {productsData && (
        <>
          {/* <section className='flex justify-center mb-[45px]'>
            <h1 className='font-[700] text-[25px] dark:text-white'>
              {t('full product')} {productsData.data.data.length}
            </h1>
          </section> */}
          <SortProductList categories={categoriesData?.data.data || []} queryConfig={queryConfig}></SortProductList>
          <div className='grid grid-cols-4 mobile:grid-cols-2 mobile:px-4 gap-[30px] mb-[30px]'>
            {productsData.data.data.map((product) => (
              <div className='' key={product._id}>
                <ProductItem product={product}></ProductItem>
              </div>
            ))}
          </div>
          {productsData?.config && productsData.data.data.length === 0 && (
            <div className='mb-10 flex justify-center gap-x-3 dark:text-white'>
              {t('not yet')}
              <button className='hover:translate-x-0.5 hover:-translate-y-0.5 transition-all text-primary'>
                <Link
                  to={{
                    pathname: '/product',
                    search: createSearchParams(omit(queryConfig, ['category', 'name', 'rating_filter'])).toString()
                  }}
                >
                  {t('other')}
                </Link>
              </button>
            </div>
          )}
          <Pagination queryConfig={queryConfig} pageSize={productsData.data.totalPage}></Pagination>
        </>
      )}
      {isLoading && (
        <div className='text-center mt-20'>
          <div role='status'>
            <svg
              aria-hidden='true'
              className='inline w-[100px] h-[100px] mr-2 text-gray-200 animate-spin  fill-primary'
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
        </div>
      )}
    </div>
  )
}

export default ProductList
