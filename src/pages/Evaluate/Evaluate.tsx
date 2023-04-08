/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import FileBase from 'react-file-base64'
import { createEvaluate } from 'src/apis/comment.api'
import { getProfileFromLS } from 'src/utils/auth'
import { toast } from 'react-toastify'
import { RatingStar } from 'rating-star'

const initialFromState = {
  comment: '',
  image: [],
  product_id: '',
  rating: 0
}
const Evaluate = () => {
  const [valueComment, setValueComment] = useState(initialFromState)
  const navigate = useNavigate()
  const profileAccessToken = getProfileFromLS()
  const onRatingChange = (score: any) => {
    setValueComment((prev: any) => ({ ...prev, rating: score }))
  }
  const location = useLocation()
  const productId = (location.state as { productId: string | null })?.productId
  const createCommentMutation = useMutation({
    mutationFn: (body: any) => {
      return createEvaluate(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      toast.success('Cảm ơn đã đánh giá!')
      setValueComment(initialFromState)
      navigate('/order')
    }
  })
  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if ((valueComment.comment !== '', valueComment.product_id !== '', valueComment.rating !== 0)) {
      const newForm = { ...valueComment, product_id: productId }
      createCommentMutation.mutate(newForm)
    } else {
      toast.warn('Xin hãy cho đánh giá!')
    }
  }
  return (
    <div className='px-3'>
      <section>
        <div>
          <form onSubmit={handleSubmitComment}>
            <div className='w-full mb-4 border dark:bg-[#3A3A43] dark:border-none border-gray-200 rounded-lg bg-gray-50  '>
              <div className='px-4 py-2 dark:bg-[#3A3A43] bg-white rounded-t-lg '>
                <label htmlFor='comment' className='sr-only'>
                  Bình luận của bạn
                </label>
                <textarea
                  id='comment'
                  rows={4}
                  className='w-full px-0 dark:bg-[#3A3A43] dark:text-white text-sm text-gray-900 bg-white border-0  focus:ring-0 '
                  placeholder='Viết bình luận...'
                  // required
                  value={valueComment.comment}
                  onChange={(event) => setValueComment((prev: any) => ({ ...prev, comment: event.target.value }))}
                />
              </div>
              <div className='flex items-center mobile:gap-y-3 mobile:flex-col-reverse justify-between px-3 py-2 border-t '>
                <div className='flex items-center'>
                  <button
                    type='submit'
                    className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
                  >
                    Đánh giá
                  </button>
                  <div className='flex pl-0 space-x-1 sm:pl-2 wrapper-file relative'>
                    <FileBase
                      type='file'
                      name='picture'
                      onDone={(base64: any) => {
                        const listBase = base64.map((item: { base64: unknown }) => {
                          return item.base64
                        })
                        setValueComment((prev: any) => {
                          return { ...prev, image: listBase }
                        })
                      }}
                      multiple={true}
                      accept='image/png, image/jpg, image/webp'
                    />
                    <button
                      type='button'
                      className='inline-flex absolute left-10 z-0 top-[-6px] justify-center p-2 text-gray-500 rounded  '
                    >
                      <svg
                        aria-hidden='true'
                        className='w-5 h-5 z-1 cursor-pointer'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <RatingStar
                    clickable
                    maxScore={5}
                    id='123'
                    rating={valueComment.rating}
                    onRatingChange={onRatingChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Evaluate
