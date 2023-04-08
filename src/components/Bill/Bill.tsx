import { FormatNumber } from 'src/hooks/useFormatNumber'
import { Purchase } from 'src/types/purchase.type'
import { getProfileFromLS } from 'src/utils/auth'
import Close from '../../assets/images/Close.png'
import { useTranslation } from 'react-i18next'

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
}

function Bill({
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
      <div className=' h-[auto] border rounded border-textCart dark:bg-[#1C1C24] dark:border-none p-6'>
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
            <div className='text-textCart'>{FormatNumber(totalCheckedPurchasePrice)}</div>
            <div className='text-textCart'>đ</div>
          </div>
        </div>
        <div className='flex justify-between mb-6'>
          <div className='font-medium'>{t('save')}:</div>
          <div className='flex'>
            <div className='text-textCart'>
              {FormatNumber(totalCheckedPurchasePrice - totalCheckedPurchasePriceBeforeDiscount)}
            </div>
            <div className='text-textCart'>đ</div>
          </div>
        </div>
        <div className='flex justify-between mb-6'>
          <div className='font-medium'>{t('total price')}:</div>
          <div className='flex'>
            <div className='text-textCart'>{FormatNumber(totalCheckedPurchasePriceBeforeDiscount)}</div>
            <div className='text-textCart'>đ</div>
          </div>
        </div>
        <div>
          <div>
            <div className='p-2 mobile:p-0 leading-[2] text-xs font-light'>{t('text')}</div>
          </div>
          <div className='flex justify-end'>
            <button
              onClick={handlerPaymentClick}
              className='bg-primary w-[120px] h-[40px] flex justify-center items-center rounded-sm text-textColorwhite'
            >
              {t('pay')}
            </button>
          </div>
          <div>
            <div
              className={`${
                hidden === false ? 'hidden' : 'block'
              } fixed top-0 left-0 right-0 bottom-0 mobile:px-5 z-40 bg-active flex justify-center items-center} `}
            >
              <div className='flex w-[800px] h-[500px] mobile:w-[100%] mobile:h-[400px] mobile:mt-[150px] rounded bg-white mt-[100px]'>
                <div className='w-[100%] h-[100%]'>
                  <div className='w-[100%] h-[40px] flex justify-end '>
                    <button onClick={handlerPaymentRemove} className='mr-4 mt-4'>
                      <img src={Close} alt='' />
                    </button>
                  </div>
                  <div className='flex justify-between items-start '>
                    <div className='w-[50%] mobile:w-[100%]'>
                      <div className='mt-10 mobile:mt-5'>
                        <div className='text-primary text-center text-xl font-semibold'>{t('payment on delivery')}</div>
                      </div>
                      <div className='p-4'>
                        <div className='text-textBlack mb-2 flex h-[40px] '>
                          <div className='w-[40%]'>
                            <div>{t('fullname')}:</div>
                          </div>
                          <div className=''>
                            <div>{profileAccessToken.name}</div>
                          </div>
                        </div>
                        <div className='text-textBlack mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>{t('phone number')}:</div>
                          </div>
                          <div className=''>
                            <div>{profileAccessToken.phone}</div>
                          </div>
                        </div>
                        <div className='text-textBlack mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>{t('address')}:</div>
                          </div>
                          <div className=''>
                            <div className='text-left'>{profileAccessToken.address}</div>
                          </div>
                        </div>
                        <div className='text-textBlack mb-2 flex h-[40px]'>
                          <div className='w-[40%]'>
                            <div>Email :</div>
                          </div>
                          <div className=''>
                            <div className='text-left w-full'>{profileAccessToken.email}</div>
                          </div>
                        </div>

                        <div className='text-textBlack mb-2 flex h-[40px] justify-center'>
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
                    <div className='h-[450px] w-[2%] flex justify-center items-center mobile:hidden '>
                      <div className='bg-textBlack h-[80%] w-[1%] flex justify-center items-center m-auto'></div>
                    </div>
                    <div className='w-[49%] mobile:hidden'>
                      <div className='mt-10'>
                        <div className='text-primary text-center text-xl font-semibold'>{t('online payment')}</div>
                        <button
                          onClick={handleBuyPurchasesOnline}
                          className='h-[50px] mx-auto w-[80%] flex gap-x-6 items-center hover:bg-slate-50 p-2 rounded-sm'
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
