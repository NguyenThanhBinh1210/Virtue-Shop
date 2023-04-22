/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormatNumber } from 'src/hooks/useFormatNumber'
import { Purchase } from 'src/types/purchase.type'
import { getProfileFromLS } from 'src/utils/auth'
import Close from '../../assets/images/Close.png'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface Props {
  handlerPaymentClick: () => void
  handlerPaymentRemove: () => void
  hidden: boolean
  checkedPurchasesCount: number
  totalCheckedPurchasePrice: number
  totalCheckedPurchasePriceBeforeDiscount: number
  extendedPurchases: Purchase[]
  handleBuyPurchases: () => void
  handleBuyPurchasesOnline: () => void
  disabled: boolean
  shippingAddress: any
  disableShipping: boolean
}

function Bill({
  disableShipping,
  shippingAddress,
  handleBuyPurchasesOnline,
  totalCheckedPurchasePrice,
  totalCheckedPurchasePriceBeforeDiscount,
  handlerPaymentClick,
  hidden,
  handlerPaymentRemove,
  checkedPurchasesCount,
  handleBuyPurchases,
  disabled
}: Props) {
  const profileAccessToken = getProfileFromLS()
  const { t } = useTranslation('cart')

  return (
    <div className='mobile:p-0 flex w-[30%] mobile:w-full justify-end mobile:justify-start dark:text-text-color '>
      <div className=' h-[auto] border rounded border-red-400 dark:bg-[#1C1C24] dark:border-none p-6'>
        <div className=' font-bold text-lg mb-4'>{t('your order').toUpperCase()}</div>
        <div className='flex justify-between mb-6'>
          <div className='font-semibold'>{t('total product')}:</div>
          <div className='font-semibold'>
            {checkedPurchasesCount} {t('product')}
          </div>
        </div>
        <div className='flex justify-between mb-6'>
          <div className='font-medium'>{t('price first')}:</div>
          <div className='flex'>
            <div className='text-red-400'>{FormatNumber(totalCheckedPurchasePrice)}</div>
            <div className='text-red-400'>đ</div>
          </div>
        </div>
        <div className='flex justify-between mb-6'>
          <div className='font-medium'>{t('save')}:</div>
          <div className='flex'>
            <div className='text-red-400'>
              {FormatNumber(totalCheckedPurchasePrice - totalCheckedPurchasePriceBeforeDiscount)}
            </div>
            <div className='text-red-400'>đ</div>
          </div>
        </div>
        <div className='flex justify-between mb-6'>
          <div className='font-medium'>{t('total price')}:</div>
          <div className='flex'>
            <div className='text-red-400'>{FormatNumber(totalCheckedPurchasePriceBeforeDiscount)}</div>
            <div className='text-red-400'>đ</div>
          </div>
        </div>
        <div>
          <div>
            <div className='p-2 mobile:p-0 leading-[2] text-xs font-light'>{t('text')}</div>
          </div>
          <div className='flex justify-end'>
            <button
              onClick={() => {
                if (disableShipping) {
                  toast.warn('Chưa điền đủ thông tin thanh toán!')
                } else {
                  handlerPaymentClick()
                }
              }}
              className='bg-primary w-[120px] h-[40px] flex justify-center items-center rounded-sm text-textColorwhite'
            >
              {t('pay')}
            </button>
          </div>
          <div>
            <div
              className={`${
                hidden === false ? 'hidden' : 'block'
              } fixed top-0 left-0 right-0 bottom-0 mobile:px-5 z-40 bg-active dark:bg-white dark:bg-opacity-10 flex justify-center items-center} `}
            >
              <div className='flex w-[800px] h-[500px]  dark:bg-[#1C1C24] mobile:w-[100%] mobile:h-max mobile:pb-5 mobile:mt-[150px] rounded bg-white mt-[100px]'>
                <div className='w-[100%] h-[100%]'>
                  <div className='w-[100%] h-[40px] flex justify-end '>
                    <button onClick={handlerPaymentRemove} className='mr-4 mt-4'>
                      <img src={Close} alt='' />
                    </button>
                  </div>
                  <div className='mobile:flex-col flex justify-between items-start '>
                    <div className='w-[50%] mobile:w-[100%]'>
                      <div className='mt-10 mobile:mt-5'>
                        <div className='text-primary text-center text-xl font-semibold'>{t('payment on delivery')}</div>
                      </div>
                      <div className='p-4'>
                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px] '>
                          <div className='w-[40%]'>
                            <div>{t('fullname')}:</div>
                          </div>
                          <div className=''>
                            <div>{shippingAddress.fullName}</div>
                          </div>
                        </div>
                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>{t('phone number')}:</div>
                          </div>
                          <div className=''>
                            <div>{shippingAddress.phone}</div>
                          </div>
                        </div>
                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>{t('city')}:</div>
                          </div>
                          <div className=''>
                            <div className='text-left'>{shippingAddress.city}</div>
                          </div>
                        </div>
                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>{t('address')}:</div>
                          </div>
                          <div className=''>
                            <div className='text-left'>{shippingAddress.address}</div>
                          </div>
                        </div>
                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>Email :</div>
                          </div>
                          <div className=''>
                            <div className='text-left w-full'>{profileAccessToken.email}</div>
                          </div>
                        </div>

                        <div className='text-textBlack dark:text-text-color mb-2 flex h-[40px] justify-center'>
                          <button
                            disabled={disabled}
                            onClick={handleBuyPurchases}
                            className={`bg-primary w-[120px] h-[40px] flex justify-center items-center rounded-sm text-textColorwhite ${
                              disabled ? 'opacity-70' : ''
                            }`}
                          >
                            {t('pay')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='w-[49%] mobile:w-[100%]'>
                      <div className='mt-10'>
                        <div className='text-primary text-center text-xl font-semibold'>{t('online payment')}</div>
                        <button
                          onClick={handleBuyPurchasesOnline}
                          className='h-[50px] mx-auto w-[80%] flex gap-x-6 items-center hover:bg-slate-50 dark:hover:bg-gray-500 dark:hover:text-white dark:bg-gray-700 p-2 rounded-sm'
                        >
                          <div className='h-full'>
                            <img src='https://developers.momo.vn/v3/vi/img/logo2.svg' alt='' />
                          </div>
                          <div>{t('pay momo')}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bill
