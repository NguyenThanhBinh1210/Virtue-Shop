import React, { useState } from 'react'
import { sortBy, order as orderConstant } from 'src/constants/product'
import classNames from 'classnames'
import { ProductListComfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'
import { Category } from 'src/types/category.type'
import { QueryConfigS } from 'src/hooks/useQueryConfig'
import InputNumber from '../InputNumber/InputNumber'
import ProductRating from '../ProductRating/ProductRating'
import { useForm, Controller } from 'react-hook-form'
import { schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
interface Props {
  categories: Category[]
  queryConfig: QueryConfigS
}
type FormData = {
  price_min: string
  price_max: string
}
const priceSchema = schema.pick(['price_min', 'price_max'])
const SortProductList = ({ categories, queryConfig }: Props) => {
  const { t } = useTranslation('product')
  const [hiddenCat, setHiddenCat] = useState<boolean>(true)
  const [moreOt, setMoreOt] = useState<boolean>(false)
  const { category } = queryConfig
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListComfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: '/product',
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })
  const handleSort = (sortByValue: Exclude<ProductListComfig['sort_by'], undefined>) => {
    navigate({
      pathname: '/product',
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListComfig['order'], undefined>) => {
    navigate({
      pathname: '/product',
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  const handleSearchByCategory = (categoryValue: string) => {
    navigate({
      pathname: '/product',
      search: createSearchParams({
        ...queryConfig,
        category: categoryValue
      }).toString()
    })
  }

  const handlerRemoveAll = () => {
    navigate({
      pathname: '/product',
      search: createSearchParams(
        omit(queryConfig, ['category', 'name', 'price_min', 'price_max', 'rating_filter', 'sort_by', 'order'])
      ).toString()
    })
    setMoreOt(false)
  }

  return (
    <section className={`mb-7 pr-10 mobile:pr-0`}>
      <div className='flex justify-between mobile:flex-col mobile:gap-y-[15px] mobile:items-center'>
        <div className='flex gap-[20px]'>
          <button
            className={classNames('p-2 text-white rounded-[10px] ', {
              'bg-secondary': isActiveSortBy(sortBy.countInStock),
              'bg-bgPrimary': !isActiveSortBy(sortBy.countInStock),
              'hover:opacity-90': !isActiveSortBy(sortBy.countInStock)
            })}
            onClick={() => handleSort(sortBy.countInStock)}
          >
            {t('popular')}
          </button>
          <button
            className={classNames('p-2 text-white rounded-[10px] hover:opacity-90', {
              'bg-secondary': isActiveSortBy(sortBy.createdAt),
              'bg-bgPrimary': !isActiveSortBy(sortBy.createdAt),
              'hover:opacity-90': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            {t('newest')}
          </button>
          <button
            className={classNames('p-2 text-white rounded-[10px] hover:opacity-90', {
              'bg-secondary': isActiveSortBy(sortBy.selled),
              'bg-bgPrimary': !isActiveSortBy(sortBy.selled),
              'hover:opacity-90': !isActiveSortBy(sortBy.selled)
            })}
            onClick={() => handleSort(sortBy.selled)}
          >
            {t('best selling')}
          </button>
        </div>
        <div>
          <select
            className={classNames(
              'py-2 px-4 text-white dark:bg-[#24242c] dark:text-white dark:border-none rounded-[10px]',
              {
                'dark:bg-secondary bg-secondary': isActiveSortBy(sortBy.price),
                'text-black': !isActiveSortBy(sortBy.price),
                border: !isActiveSortBy(sortBy.price),
                'hover:opacity-90': !isActiveSortBy(sortBy.price)
              }
            )}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListComfig['order'], undefined>)}
          >
            <option className='text-black bg-white ' value='' disabled>
              {t('price')}
            </option>
            <option className='text-black bg-white' value={orderConstant.asc}>
              {t('low to high')}
            </option>
            <option className='text-black bg-white' value={orderConstant.desc}>
              {t('high to low')}
            </option>
          </select>
        </div>
      </div>
      <div
        className={`${
          moreOt ? 'h-[50px] mobile:h-full' : 'h-0 overflow-hidden transition-all ease-in'
        } mobile:px-3 mt-4 flex mobile:flex-col `}
      >
        <div className='mobile:mx-auto'>
          <ProductRating queryConfig={queryConfig}></ProductRating>
        </div>
        <div className='flex ml-10 gap-x-20 mobile:m-0 mobile:mt-5 mobile:gap-x-3 mobile:mb-5 mobile:flex-col mobile:items-center mobile:gap-y-5'>
          <div className='relative' onMouseEnter={() => setHiddenCat(false)} onMouseLeave={() => setHiddenCat(true)}>
            <button className='dark:bg-[#24242c] dark:text-white dark:border-none border hover:opacity-90 rounded-lg p-2 '>
              {t('category')}
            </button>
            <ul
              className={`${
                hiddenCat ? 'hidden' : 'block'
              } overflow-hidden mobile:z-10 absolute dark:bg-[#24242c] dark:text-white flex flex-col top-[100%] bg-white rounded-lg w-full border`}
            >
              {categories.map((item) => {
                const isActive = category === item._id
                return (
                  <button
                    key={item._id}
                    onClick={() => handleSearchByCategory(item._id as string)}
                    className={classNames('dark:hover:bg-text-color px-2 py-3 cursor-pointer hover:bg-slate-50', {
                      'text-secondary': isActive
                    })}
                  >
                    {item.name}
                  </button>
                )
              })}
            </ul>
          </div>
          <form onSubmit={onSubmit} className='relative'>
            <div className=''>
              <div className='flex gap-x-6'>
                <div className='flex items-center gap-x-2'>
                  <Controller
                    control={control}
                    name='price_min'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          placeholder={`đ ${t('from')}`}
                          smail={true}
                          {...field}
                          onChange={(event) => {
                            field.onChange(event)
                            trigger('price_max')
                          }}
                        />
                      )
                    }}
                  />
                  <div>-</div>
                  <Controller
                    control={control}
                    name='price_max'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          placeholder={`đ ${t('to')}`}
                          smail={true}
                          {...field}
                          onChange={(event) => {
                            field.onChange(event)
                            trigger('price_min')
                          }}
                        />
                      )
                    }}
                  />
                </div>
                <button className={classNames('p-2 bg-bgPrimary text-white rounded-[10px] hover:opacity-90')}>
                  {t('confirm')}
                </button>
              </div>
            </div>
            <div className='mt-1 absolute text-center text-red-400 min-h-[1.25rem] text-sm'>
              {errors.price_min?.message}
            </div>
          </form>
        </div>
        <button
          onClick={() => handlerRemoveAll()}
          className='ml-auto h-max bg-red-300 hover:opacity-90 rounded-lg p-2 text-white'
        >
          {t('delete')}
        </button>
      </div>
      <div className='flex justify-center mt-2 dark:text-white '>
        <button
          onClick={() => setMoreOt(!moreOt)}
          className='p-2 shadow-lg dark:bg-text-color hover:shadow-md rounded-md'
        >
          {moreOt ? `${t('close')}` : `${t('more')}`}
        </button>
      </div>
    </section>
  )
}

export default SortProductList
