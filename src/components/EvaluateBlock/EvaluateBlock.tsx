/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { RatingStar } from 'rating-star'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getEvaluateProduct } from 'src/apis/comment.api'
import Frame from 'src/assets/images/Frame.jpg'

interface Props {
  id: string
}
const EvaluateBlock = ({ id }: Props) => {
  const [loadmoreComment, setLoadmoreComment] = useState(2)
  const { data: evaluateData } = useQuery({
    queryKey: ['evaluate', id],
    queryFn: () => getEvaluateProduct(id as string)
  })
  const evaluates = evaluateData?.data.data
  const { t } = useTranslation('product')

  return (
    <section>
      <div className='mb-[20px]'>
        {evaluates?.length === 0 && (
          <div className='border border-gray-200 mb-[20px] dark:bg-[#1C1C24] dark:border-none text-text-color rounded-lg bg-gray-50 p-4'>
            {t('not evaluate')}...
          </div>
        )}
        {evaluates?.length > 0 && (
          <>
            <div className='border border-gray-200 dark:border-none mb-[20px] dark:bg-[#1C1C24] text-text-color rounded-lg bg-gray-50 p-4'>
              {t('there is a total')} {evaluates?.length} {t('evaluate').toLowerCase()}
            </div>
            {evaluates &&
              evaluates.slice(0, loadmoreComment).map((evaluate: any) => {
                return (
                  <div
                    key={evaluate._id}
                    className='dark:bg-[#1C1C24] dark:text-white dark:border-t-0 dark:mb-3 dark:rounded-lg border-t-2 py-6 flex items-start justify-between'
                  >
                    <div className='flex gap-x-4'>
                      <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        {evaluate.user.avatar && <img src={evaluate.user.avatar} alt='' />}
                        {!evaluate.user.avatar && <img src={Frame} alt='' />}
                      </div>
                      <div className='flex flex-col gap-y-3'>
                        <div className=''>
                          <RatingStar size={15} clickable maxScore={5} id='123' rating={evaluate.rating} />
                        </div>
                        <div className='font-[600]'>{evaluate.user.name}</div>
                        <div>{evaluate.comment}</div>
                        <div className='flex gap-x-2 text-text-color'>
                          <div>{moment(evaluate?.createdAt).format('YYYY-MM-DD')}</div>
                          <div>{moment(evaluate?.createdAt).format('HH:mm')}</div>
                        </div>
                        <div className='flex gap-x-3'>
                          {evaluate?.image ? (
                            evaluate.image.map((item: any, index: number) => (
                              <div key={index} className='w-[80px] h-[80px]'>
                                <img src={item} alt='' />
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </>
        )}
        <div className='w-full flex items-center justify-center'>
          {evaluates?.length > loadmoreComment && (
            <button
              onClick={() => setLoadmoreComment(loadmoreComment + 2)}
              className=' mb-5 items-center py-2.5 px-4 text-xs font-medium text-center w-max text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
            >
              Xem thêm
            </button>
          )}
          {evaluates?.length <= loadmoreComment && evaluates?.length > 2 && (
            <button
              onClick={() => setLoadmoreComment(2)}
              className=' mb-5 items-center py-2.5 px-4 text-xs font-medium text-center w-max text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
            >
              Thu gọn
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default EvaluateBlock
