/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { createComment, deleteComment, deleteReplyComment, getCommentProduct, replyComment } from 'src/apis/comment.api'
import Frame from 'src/assets/images/Frame.jpg'
import { AppContext } from 'src/contexts/app.context'
import { getProfileFromLS } from 'src/utils/auth'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
}
const CommentBlock = ({ id }: Props) => {
  const initialFromState = {
    title: '',
    product_id: ''
  }
  const initialReplyState = {
    comment_id: '',
    message: ''
  }
  const { t } = useTranslation('product')
  const [valueComment, setValueComment] = useState(initialFromState)
  const [valueReply, setValueReply] = useState(initialReplyState)
  const [toogleReply, setToogleReply] = useState(false)
  const [commentId, setCommentId] = useState(null)
  const { isAuthenticated } = useContext(AppContext)
  const profileAccessToken = getProfileFromLS()
  const [loadmoreComment, setLoadmoreComment] = useState(2)
  const queryClient = useQueryClient()
  const { data: commentData } = useQuery({
    queryKey: ['comment', id],
    queryFn: () => getCommentProduct(id as string)
  })
  const createCommentMutation = useMutation({
    mutationFn: (body: any) => {
      return createComment(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', id] })
      toast.success('Đã bình luận!')
      setValueComment(initialFromState)
    }
  })
  const createReplyMutation = useMutation({
    mutationFn: (body: any) => {
      return replyComment(profileAccessToken?._id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', id] })
      setValueReply(initialReplyState)
    }
  })
  const comments = commentData?.data.data
  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteComment(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', id] })
      toast.success('Đã xoá bình luận!')
    }
  })
  const deleteReplyMutation = useMutation({
    mutationFn: (data: any) => {
      return deleteReplyComment(data.comment_id, data.reply_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', id] })
    }
  })
  const handleDeleteComment = (id: any) => {
    deleteCommentMutation.mutate(id)
  }
  const handleDeleteReply = (comment_id: string, reply_id: string) => {
    const data: any = {
      comment_id,
      reply_id
    }
    deleteReplyMutation.mutate(data)
  }
  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newForm = { ...valueComment, product_id: id }
    createCommentMutation.mutate(newForm)
  }
  const handleSubmitReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setToogleReply(false)
    const newForm = { ...valueReply, comment_id: commentId }
    createReplyMutation.mutate(newForm)
  }
  return (
    <section>
      <div>
        {comments?.length === 0 && (
          <div className='border border-gray-200 dark:border-none mb-[20px] dark:bg-[#1C1C24] text-text-color rounded-lg bg-gray-50 p-4'>
            {t('not comment')}...
          </div>
        )}
        {comments?.length > 0 && (
          <div className='flex flex-col items-center'>
            <div className='border border-gray-200 dark:bg-[#1C1C24] dark:border-none w-full mb-[20px] text-text-color rounded-lg bg-gray-50 p-4'>
              {t('there is a total')} {comments?.length} {t('comment').toLowerCase()}
            </div>
            {comments &&
              comments.slice(0, loadmoreComment)?.map((comment: any) => {
                return (
                  <div
                    key={comment._id}
                    className='dark:bg-[#1C1C24] dark:text-white dark:border-t-0 dark:mb-3 dark:rounded-lg w-full border-t-2 py-6 flex items-start justify-between'
                  >
                    <div className='flex gap-x-4'>
                      <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        {comment.user.avatar && <img src={comment.user.avatar} alt='' />}
                        {!comment.user.avatar && <img src={Frame} alt='' />}
                      </div>
                      <div>
                        <div className='flex flex-col gap-y-1'>
                          <div className='font-[600]'>{comment.user.name}</div>
                          <div>{comment.title}</div>
                          <div className='flex gap-x-3'>
                            {comment?.image ? (
                              comment.image?.map((item: any, index: number) => (
                                <div key={index} className='w-[80px] h-[80px]'>
                                  <img src={item} alt='' />
                                </div>
                              ))
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                        <div className='flex gap-x-2 text-text-color'>
                          <div>{moment(comment?.createdAt).format('YYYY-MM-DD')}</div>
                          <div>{moment(comment?.createdAt).format('HH:mm')}</div>
                        </div>
                        <div className='text-text-color text-xs flex gap-x-4 mt-1'>
                          <button>Thích</button>
                          <button
                            onClick={() => {
                              setCommentId(comment?._id)
                              setToogleReply(!toogleReply)
                            }}
                          >
                            {toogleReply ? 'Trở lại' : 'Trả lời'}
                          </button>
                        </div>
                        <div className='mt-1'>
                          {comment.replyComment?.map((reply: any) => (
                            <div key={reply._id} className='flex gap-x-2 mt-2 w-full'>
                              <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                                <img src={reply.user.avatar} alt='' />
                              </div>
                              <div className='grid gap-y-1'>
                                <div className='flex gap-x-10'>
                                  <h2 className='font-[600]'>{reply.user.name}</h2>
                                  <button onClick={() => handleDeleteReply(comment?._id, reply._id)}>Xoá</button>
                                </div>
                                <p>{reply.message}</p>
                                <div className='flex gap-x-2 text-text-color'>
                                  <div>{moment(reply?.date).format('YYYY-MM-DD')}</div>
                                  <div>{moment(reply?.date).format('HH:mm')}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {profileAccessToken?._id === comment?.user._id && (
                      <div className='flex gap-x-3 text-text-color mr-2'>
                        <button onClick={() => handleDeleteComment(comment._id)}>Xoá</button>
                      </div>
                    )}
                  </div>
                )
              })}
            {comments.length > loadmoreComment && (
              <button
                onClick={() => setLoadmoreComment(loadmoreComment + 2)}
                className='inline-flex mb-5 items-center py-2.5 px-4 text-xs font-medium text-center w-max text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
              >
                Xem thêm
              </button>
            )}
            {comments?.length <= loadmoreComment && comments?.length > 2 && (
              <button
                onClick={() => setLoadmoreComment(2)}
                className='inline-flex mb-5 items-center py-2.5 px-4 text-xs font-medium text-center w-max text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
              >
                Thu gọn
              </button>
            )}
          </div>
        )}

        {isAuthenticated && (
          <form onSubmit={!toogleReply ? handleSubmitComment : handleSubmitReply}>
            <div className='w-full mb-4 border dark:bg-[#1C1C24] dark:border-none border-gray-200 rounded-lg bg-gray-50  '>
              <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-[#1C1C24] '>
                <label htmlFor='comment' className='sr-only '>
                  Bình luận của bạn
                </label>
                <textarea
                  id='comment'
                  rows={4}
                  className='w-full dark:bg-[#1C1C24] dark:text-text-color px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 '
                  placeholder={`${toogleReply ? t('write comment 2') : t('write comment')}`}
                  required
                  value={toogleReply ? valueReply.message : valueComment.title}
                  onChange={(event) => {
                    if (!toogleReply) {
                      setValueComment((prev: any) => ({ ...prev, title: event.target.value }))
                    } else {
                      setValueReply((prev: any) => ({ ...prev, message: event.target.value }))
                    }
                  }}
                />
              </div>
              <div className='flex items-center justify-between px-3 py-2 border-t '>
                <button
                  type='submit'
                  className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 -900 hover:bg-primary'
                >
                  {toogleReply ? t('reply') : t('comment')}
                </button>
              </div>
            </div>
          </form>
        )}
        {!isAuthenticated && (
          <div className='border dark:bg-[#1C1C24] dark:border-none border-gray-200 mb-[20px] text-text-color rounded-lg bg-gray-50 p-4'>
            {t('login to comment')}
          </div>
        )}
      </div>
    </section>
  )
}

export default CommentBlock
