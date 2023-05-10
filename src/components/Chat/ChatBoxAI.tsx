/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useContext, useEffect, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Frame from 'src/assets/images/Frame.jpg'
import { useMutation } from 'react-query'
import { chatWithBot } from 'src/apis/chat.api'
import BotImg from 'src/assets/images/bot.png'
import { FormatNumber, generateNameId } from 'src/hooks/useFormatNumber'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ChatBoxAI = () => {
  const { t } = useTranslation('chat')

  const [toggleChatBox, setToggleChatBox] = useState<boolean>(true)
  const [valueInput, setValueInput] = useState<string>('')
  const data = [
    {
      id: 1,
      userId: 'bot',
      text: 'Cảm ơn bạn đã liên hệ, bạn muốn hỏi gì nào?',
      dataText: [],
      dataProduct: []
    }
  ]
  const { profile } = useContext(AppContext)

  const chatInLS = JSON.parse(localStorage.getItem('chatbox') || '{}')
  const [chatState, setChatState] = useState(JSON.stringify(chatInLS) === '{}' ? data : chatInLS)
  useEffect(() => {
    localStorage.setItem('chatbox', JSON.stringify(chatState))
  }, [chatState])

  const chatMutation = useMutation({
    mutationFn: (body: any) => {
      return chatWithBot(body)
    },
    onSuccess: (data) => {
      setChatState([
        ...chatState,
        {
          id: Math.random(),
          userId: 'bot',
          text: data.data.result,
          dataText: data.data.dataText ? data.data.dataText : [],
          dataProduct: data.data.dataProduct ? data.data.dataProduct : []
        }
      ])
    }
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valueInput !== '') {
      setValueInput('')
      setChatState([
        ...chatState,
        {
          id: Math.random(),
          userId: 'user',
          text: valueInput,
          dataText: [],
          dataProduct: []
        }
      ])
      const body = { question: valueInput }
      setTimeout(() => {
        chatMutation.mutate(body)
      }, 1000)
    }
  }

  return (
    <div className='fixed bottom-10 right-10 mobile:bottom-5 mobile:right-5'>
      <div
        className={`${
          toggleChatBox
            ? 'opacity-0 invisible w-0 h-0 duration-700'
            : 'opacity-100 visible w-[300px] h-[485px] duration-150'
        } transition rounded-2xl overflow-hidden shadow-2xl mb-4 max-w-[300px] w-full bg-secondary`}
      >
        <div className='px-4 py-1.5 text-white'>
          <div className='flex justify-between items-center mb-2'>
            <div>
              {t('hi')}
              <div className='font-[700]'>{profile ? profile?.name : ''}</div>
            </div>
            <div className='flex gap-x-2'>
              <button>
                <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z'
                    fillOpacity='0.04'
                    className='fill-black hover:fill-slate-500 transition-all'
                  ></path>
                  <path
                    d='M11.7222 16C11.7222 16.9665 10.9387 17.75 9.97217 17.75C9.00567 17.75 8.22217 16.9665 8.22217 16C8.22217 15.0335 9.00567 14.25 9.97217 14.25C10.9387 14.25 11.7222 15.0335 11.7222 16Z'
                    fill='white'
                  ></path>
                  <path
                    d='M17.7499 16C17.7499 16.9665 16.9664 17.75 15.9999 17.75C15.0334 17.75 14.2499 16.9665 14.2499 16C14.2499 15.0335 15.0334 14.25 15.9999 14.25C16.9664 14.25 17.7499 15.0335 17.7499 16Z'
                    fill='white'
                  ></path>
                  <path
                    d='M22.0277 17.75C22.9942 17.75 23.7777 16.9665 23.7777 16C23.7777 15.0335 22.9942 14.25 22.0277 14.25C21.0612 14.25 20.2777 15.0335 20.2777 16C20.2777 16.9665 21.0612 17.75 22.0277 17.75Z'
                    fill='white'
                  ></path>
                </svg>
              </button>

              <button onClick={() => setToggleChatBox(true)}>
                <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z'
                    className='fill-black hover:fill-slate-500 transition-all'
                    fillOpacity='0.04'
                  ></path>
                  <path
                    d='M22.0278 15.0278C22.5647 15.0278 23 15.4631 23 16.0001C23 16.537 22.5647 16.9723 22.0278 16.9723L9.97222 16.9723C9.43528 16.9723 9 16.537 9 16.0001C9 15.4631 9.43528 15.0278 9.97222 15.0278L22.0278 15.0278Z'
                    fill='white'
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <p className='text-xs'>{t('text')}</p>
        </div>
        <div className='w-auto h-[350px] bg-white p-3 overflow-y-scroll custom-scrollbar'>
          {chatState.length !== 0 &&
            chatState?.map((item: any) => {
              return (
                <div key={item.id}>
                  {item.userId === 'bot' && (
                    <div className='chat-message mb-3'>
                      <div className='flex items-end justify-between gap-x-2'>
                        <div className='flex flex-col space-y-2 text-xs w-[300px] mx-2 order-2 items-start'>
                          <div>
                            <span className='px-3 py-2 rounded-lg inline-block rounded-bl-none bg-[#000000] bg-opacity-5 text-gray-600'>
                              <p>{item.text}</p>
                              {item.dataText && (
                                <ul>
                                  {item.dataText.map((item: any, index: number) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              )}
                              {item.dataProduct.length !== 0 && (
                                <ul className='gap-y-3 grid mt-3'>
                                  {item.dataProduct.map((item: any) => (
                                    <li key={item._id} className=''>
                                      <Link
                                        to={`/product/${generateNameId({ name: item?.name, id: item?._id })}`}
                                        className='flex gap-x-3'
                                      >
                                        <div className='w-10'>
                                          <img src={item.image[0]} alt='ảnh' />
                                        </div>
                                        <div className='w-[70%]'>
                                          <h3 className='mb-1 line-clamp'>{item.name}</h3>
                                          <div className='flex gap-x-4'>
                                            <p className='text-primary'>
                                              {FormatNumber(Number(item.price_after_discount))}đ
                                            </p>
                                            <p className=''>{FormatNumber(Number(item.selled))} lượt mua</p>
                                          </div>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className='w-8 h-6 rounded-full'>
                          <img src={BotImg} alt='My profile' className='rounded-full ' />
                        </div>
                      </div>
                    </div>
                  )}
                  {item.userId !== 'bot' && (
                    <div className='chat-message mb-3'>
                      <div className='flex items-end justify-between gap-x-2'>
                        <div className='flex flex-col space-y-2 text-xs w-[300px] mx-2 '>
                          <div>
                            <span className=' float-right px-4 py-2 rounded-lg inline-block rounded-br-none bg-secondary text-white '>
                              {item.text}
                            </span>
                          </div>
                        </div>
                        <div className='w-8 h-6 rounded-full'>
                          <img src={profile ? profile?.avatar : Frame} alt='My profile' className='rounded-full ' />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          {chatMutation.isLoading && (
            <div className='chat-message mb-3'>
              <div className='flex items-end justify-between gap-x-2'>
                <div className='flex flex-col space-y-2 text-xs w-[300px] mx-2 order-2 items-start'>
                  <div>
                    <span className=' animate-pulse px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'>
                      ....
                    </span>
                  </div>
                </div>
                <div className='w-6 h-6 rounded-full'>
                  <img src={BotImg} alt='My profile' className='rounded-full ' />
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className='w-auto border-t h-[50px] bg-white shadow flex px-3 overflow-hidden'>
          <input
            type='text'
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            className='w-full h-full pl-2 overflow-hidden rounded-md'
            placeholder={t('ques') || ''}
          />
          <button type='submit' className='w-14 flex items-center justify-center'>
            <svg
              viewBox='0 0 22 22'
              width='30'
              height='30'
              className={` rounded-full p-1.5 ${
                valueInput !== '' ? 'hover:bg-black hover:bg-opacity-5 transition-all' : ''
              }`}
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g
                  transform='translate(-5.000000, -5.000000)'
                  className={`${valueInput !== '' ? 'fill-secondary' : 'fill-[#8A8D91]'}`}
                >
                  <g>
                    <g transform='translate(5.000000, 5.000000)'>
                      <path d='M2.0300068,0.145970044 L20.9662955,9.37015518 C22.3445682,10.0420071 22.3445682,11.9582654 20.9662955,12.6296618 L2.0300068,21.853847 C1.09728834,22.3084288 0,21.6475087 0,20.6317597 L0.806953417,13.8945654 C0.882225434,13.2659853 1.39089595,12.7699536 2.03608467,12.6957083 L12.0229514,11.6795038 C12.8612292,11.5943266 12.8612292,10.4054904 12.0229514,10.3203132 L2.03608467,9.30410872 C1.39089595,9.23031889 0.882225434,8.7342872 0.806953417,8.10525162 L0,1.36805729 C0,0.352308292 1.09728834,-0.3081563 2.0300068,0.145970044'></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </form>
      </div>
      <button
        onClick={() => setToggleChatBox(!toggleChatBox)}
        className='float-right gap-x-1.5 flex rounded-full bg-primary items-center px-2 py-2'
      >
        <div>
          <svg width='25' height='25' viewBox='0 0 24 24' fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M0.75 11.9125C0.75 5.6422 5.66254 1 12 1C18.3375 1 23.25 5.6422 23.25 11.9125C23.25 18.1828 18.3375 22.825 12 22.825C10.8617 22.825 9.76958 22.6746 8.74346 22.3925C8.544 22.3376 8.33188 22.3532 8.1426 22.4368L5.90964 23.4224C5.32554 23.6803 4.66618 23.2648 4.64661 22.6267L4.58535 20.6253C4.57781 20.3789 4.46689 20.1483 4.28312 19.9839C2.09415 18.0264 0.75 15.1923 0.75 11.9125ZM8.54913 9.86084L5.24444 15.1038C4.92731 15.6069 5.54578 16.1739 6.01957 15.8144L9.56934 13.1204C9.80947 12.9381 10.1413 12.9371 10.3824 13.118L13.0109 15.0893C13.7996 15.6809 14.9252 15.4732 15.451 14.6392L18.7556 9.39616C19.0727 8.893 18.4543 8.326 17.9805 8.68555L14.4307 11.3796C14.1906 11.5618 13.8587 11.5628 13.6176 11.3819L10.9892 9.41061C10.2005 8.81909 9.07479 9.02676 8.54913 9.86084Z'
              fill='white'
            ></path>
          </svg>
        </div>
        <span className='text-md font-bold text-white'>Chat</span>
      </button>
    </div>
  )
}

export default ChatBoxAI
