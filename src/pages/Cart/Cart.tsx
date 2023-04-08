/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react'
import Bill from 'src/components/Bill/Bill'
import { useMutation, useQuery } from 'react-query'
import { buyProducts, buyProductsOnline, deletePurchase, getPurchases, updatePurchase } from 'src/apis/purchase.api'
import { getProfileFromLS } from 'src/utils/auth'
import { purchasesStatus } from 'src/constants/perchase'
import { Purchase } from 'src/types/purchase.type'
// eslint-disable-next-line import/no-named-as-default
import produce from 'immer'
import { FormatNumber, generateNameId } from 'src/hooks/useFormatNumber'
import QuantityController from 'src/components/QuantityController/QuantityController'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'

export interface ExtendedPurchase extends Purchase {
  checked: boolean
  disabled: boolean
}

const Cart = () => {
  const { t } = useTranslation('cart')
  const location = useLocation()
  const purchaseId = (location.state as { purchaseId: string | null })?.purchaseId

  const [hidden, setHidden] = useState(false)
  const profileAccessToken = getProfileFromLS()
  const handlerPaymentClick = () => {
    if (checkedPurchasesCount) {
      setHidden(true)
    }
  }
  const handlerPaymentRemove = () => {
    setHidden(false)
  }

  const { extendedPurchases, setExtendedPurchase } = useContext(AppContext)
  const {
    data: purchaseData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['purchases', profileAccessToken?._id],
    queryFn: () => {
      return getPurchases(profileAccessToken?._id, { status: purchasesStatus.inCart })
    },
    onSuccess: () => {
      window.scroll({
        top: 0,
        left: 0
      })
    }
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: (body: any) => {
      return updatePurchase(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      refetch()
    }
  })
  const buyPurchaseMutation = useMutation({
    mutationFn: (body: any) => {
      return buyProducts(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      refetch()
      toast.success('Mua hàng thành công!')
    }
  })
  const buyPurchaseOnlineMutation = useMutation({
    mutationFn: (body: any) => {
      return buyProductsOnline(profileAccessToken?._id, body)
    },
    onSuccess: (data) => {
      refetch()
      window.open(data.data.link)
      toast.success('Chuyển đến trang thanh toán!')
    }
  })

  const purchaseInCart = purchaseData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length

  const totalCheckedPurchasePriceBeforeDiscount = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price_after_discount * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const deletePurchaseMutation = useMutation({
    mutationFn: (body: any) => {
      return deletePurchase(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      refetch()
      if (checkedPurchasesCount !== 0) {
        toast.success(`Xoá ${checkedPurchasesCount} sản phẩm thành công`)
      } else {
        toast.success(`Xoá sản phẩm thành công`)
      }
    }
  })
  useEffect(() => {
    setExtendedPurchase((prev) => {
      const extenededPurchaseObject = keyBy(prev, '_id')
      return (
        purchaseInCart?.map((purchase: any) => {
          const isChoosenPurchase = purchaseId === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchase || Boolean(extenededPurchaseObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseInCart, purchaseId])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft: any) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedPurchase((prev: any) =>
      prev.map((purchase: any) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchase(
        produce((draft: any) => {
          draft[purchaseIndex].disabled = true
        })
      )

      const body: any = { product_id: purchase.product._id, buy_count: value }
      updatePurchaseMutation.mutate(body)
    }
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchase(
      produce((draft: any) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchase = () => {
    if (checkedPurchasesCount > 0) {
      const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
      deletePurchaseMutation.mutate(purchaseIds)
    }
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      const data = {
        body,
        paymentMethods: 0
      }

      buyPurchaseMutation.mutate(data)
      setHidden(!hidden)
    }
  }

  const handleBuyPurchasesOnline = () => {
    const body = {
      id: profileAccessToken?._id,
      price: totalCheckedPurchasePriceBeforeDiscount,
      data: checkedPurchases
    }
    buyPurchaseOnlineMutation.mutate(body)
  }

  return (
    <div>
      <h1 className='font-[700] dark:text-white mobile:px-[20px] text-[24px]'>{t('your cart')}</h1>
      {isLoading && (
        <div className='text-center mt-20 '>
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
      {!isLoading && (
        <div>
          <div className='mobile:px-6 dark:text-text-color'>
            <div className='flex mb-7'></div>
            <div className='w-[100%]'>
              <table className='product-list  shadow-md dark:rounded-lg dark:overflow-hidden'>
                <thead className='mobile:hidden  dark:bg-[#1C1C24]'>
                  <tr>
                    <th className='flex items-center ml-2'>
                      <input
                        type='checkbox'
                        checked={extendedPurchases.length === 0 ? false : isAllChecked}
                        className='accent-pink-500 w-[20px] h-[20px]'
                        onChange={handleCheckAll}
                      />
                    </th>
                    <th>{t('name product')}</th>
                    <th>{t('image')}</th>
                    <th>{t('price')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('total price')}</th>
                    <th>{t('action')}</th>
                  </tr>
                </thead>
                <tbody className='mobile:hidden dark:bg-[#1C1C24]'>
                  {extendedPurchases &&
                    extendedPurchases.map((purchase, index) => (
                      <tr key={purchase._id}>
                        <td className='items-center'>
                          <input
                            type='checkbox'
                            className='accent-pink-500 w-[20px] h-[20px]'
                            checked={purchase.checked}
                            onChange={handleCheck(index)}
                          />
                        </td>
                        <td className=''>
                          <div className='mr-4'>{purchase.product.name}</div>
                        </td>
                        <td className=''>
                          <Link
                            to={`/product/${generateNameId({
                              name: purchase.product?.name,
                              id: purchase.product?._id
                            })}`}
                          >
                            <div className='h-[100px] w-[80px] block m-auto'>
                              <img src={purchase.product.image[0]} alt='' />
                            </div>
                          </Link>
                        </td>
                        <td>{FormatNumber(purchase.product.price_after_discount)}đ</td>
                        <td>
                          <QuantityController
                            max={purchase.product?.countInStock}
                            value={purchase.buy_count}
                            onIncrease={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value <= (purchaseInCart as Purchase[])[index].product.countInStock
                              )
                            }
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            disabled={purchase.disabled}
                            onType={handleTypeQuantity(index)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= (purchaseInCart as Purchase[])[index].product.countInStock &&
                                  value !== (purchaseInCart as Purchase[])[index].buy_count
                              )
                            }
                          ></QuantityController>
                        </td>
                        <td>{FormatNumber(purchase.product.price_after_discount * purchase?.buy_count)}đ</td>
                        <td>
                          <button onClick={handleDeletePurchase(index)} className='text-red-400 cursor-pointer'>
                            {t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='hidden mobile:block dark:text-text-color dark:rounded-lg dark:bg-[#1C1C24] '>
              {extendedPurchases &&
                extendedPurchases.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='flex shadow-md p-2 rounded-md items-start mb-4 pl-4 justify-between'
                  >
                    <input
                      type='checkbox'
                      className='accent-pink-500 w-[20px] h-[20px]'
                      checked={purchase.checked}
                      onChange={handleCheck(index)}
                    />
                    <Link
                      to={`/product/${generateNameId({
                        name: purchase.product?.name,
                        id: purchase.product?._id
                      })}`}
                    >
                      <div className='h-[100px] w-[80px]'>
                        <img src={purchase.product.image[0]} alt='' />
                      </div>
                    </Link>
                    <div className='w-[60%] grid gap-y-2'>
                      <div className='mr-4 w-full'>{purchase.product.name}</div>
                      <div>{FormatNumber(purchase.product.price_after_discount)}đ</div>
                      <div className='flex justify-start'>
                        <QuantityController
                          max={purchase.product?.countInStock}
                          value={purchase.buy_count}
                          onIncrease={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value <= (purchaseInCart as Purchase[])[index].product.countInStock
                            )
                          }
                          onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          disabled={purchase.disabled}
                          onType={handleTypeQuantity(index)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= (purchaseInCart as Purchase[])[index].product.countInStock &&
                                value !== (purchaseInCart as Purchase[])[index].buy_count
                            )
                          }
                        ></QuantityController>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {extendedPurchases.length === 0 && (
              <div className='my-4 p-4 dark:bg-[#3A3A43] dark:rounded-lg shadow-md dark:text-text-color w-full text-[16px] flex gap-x-2'>
                {t('no favorite')}
                <div className='hover:translate-x-0.5 hover:-translate-y-0.5 transition-all'>
                  <Link to={'/product'} className='text-primary'>
                    {t('buy now')}
                  </Link>
                </div>
              </div>
            )}
            <div className='flex items-center gap-x-4  dark:text-text-color dark:bg-[#1C1C24] dark:mt-5 dark:rounded-lg shadow-md p-4'>
              <label htmlFor='checkbox' className='flex items-center gap-x-4'>
                <input
                  id='checkbox'
                  type='checkbox'
                  checked={extendedPurchases.length === 0 ? false : isAllChecked}
                  className='accent-pink-500 w-[20px] h-[20px]'
                  onChange={handleCheckAll}
                />
                {t('select all')} ({purchaseData?.data.data.length})
              </label>
              <button onClick={handleDeleteManyPurchase}>{t('delete')}</button>
            </div>
            <div>
              <div className='flex mt-[80px] mb-[80px] justify-between mobile:block'>
                <div className='p-5 mobile:p-0 dark:text-white'>
                  <div className='mt-[20px] mb-[20px] '>
                    <div className=' dark:text-white font-bold text-xl'>{t('billing information')}</div>
                  </div>
                  <div className='mt-[20px] mb-[20px] '>
                    <input
                      disabled
                      className='dark:border-none w-[420px] h-[40px] mobile:w-[330px] border-2 p-4 rounded-sm'
                      type='text'
                      placeholder='Họ và tên'
                      value={profileAccessToken.name}
                    />
                  </div>
                  <div className='mt-[20px] mb-[20px] '>
                    <input
                      disabled
                      className=' dark:border-none w-[420px] h-[40px] mobile:w-[330px] border-2 p-4 rounded-sm'
                      type='text'
                      placeholder='Địa chỉ giao hàng'
                      value={profileAccessToken.address}
                    />
                  </div>
                  <div className='mt-[20px] mb-[20px] '>
                    <input
                      disabled
                      className='dark:border-none w-[420px] h-[40px] mobile:w-[330px] border-2 p-4 rounded-sm'
                      type='text'
                      placeholder='Số điện thoại'
                      value={profileAccessToken.phone}
                    />
                  </div>
                  <div className='mt-[20px] mb-[20px] '>
                    <input
                      disabled
                      className='dark:border-none w-[420px] h-[40px] mobile:w-[330px] border-2 p-4 rounded-sm'
                      type='text'
                      placeholder='thongtin@gmail.com'
                      value={profileAccessToken.email}
                    />
                  </div>
                </div>
                {/* <button onClick={handleBuyPurchasesOnline}>asdasd</button> */}
                <Bill
                  totalCheckedPurchasePriceBeforeDiscount={totalCheckedPurchasePriceBeforeDiscount}
                  totalCheckedPurchasePrice={totalCheckedPurchasePrice}
                  checkedPurchasesCount={checkedPurchasesCount}
                  handlerPaymentClick={handlerPaymentClick}
                  hidden={hidden}
                  handleBuyPurchasesOnline={handleBuyPurchasesOnline}
                  handleBuyPurchases={handleBuyPurchases}
                  handlerPaymentRemove={handlerPaymentRemove}
                  extendedPurchases={extendedPurchases}
                  disabled={buyPurchaseMutation.isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
