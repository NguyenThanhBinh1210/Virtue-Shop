/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useContext, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Frame from 'src/assets/images/Frame.jpg'
import { useMutation } from 'react-query'
import { chatWithBot } from 'src/apis/chat.api'
import BotImg from 'src/assets/images/bot.png'
import { FormatNumber, generateNameId } from 'src/hooks/useFormatNumber'
import { Link } from 'react-router-dom'

const ChatBoxAI = () => {
  const [toggleChatBox, setToggleChatBox] = useState<boolean>(true)
  const [valueInput, setValueInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const data = [
    {
      id: 1,
      userId: 'bot',
      text: 'Chào bạn đến với Virtue shop, bạn có câu hỏi gì không ?',
      dataText: [],
      dataProduct: []
    }
  ]
  const { profile } = useContext(AppContext)

  // const chatInLS = JSON.parse(localStorage.getItem('chat') || '{}')
  const [chatState, setChatState] = useState(data)
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
          text: data.data.message,
          dataText: data.data.dataText ? data.data.dataText : [],
          dataProduct: data.data.dataProduct ? data.data.dataProduct : []
        }
      ])
    }
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (valueInput !== '') {
      setValueInput('')
      setChatState([
        ...chatState,
        {
          id: Math.random(),
          userId: 'binh',
          text: valueInput,
          dataText: [],
          dataProduct: []
        }
      ])
      setTimeout(() => {
        const body = { question: valueInput }
        chatMutation.mutate(body)
        setLoading(false)
      }, 2500)
    }
  }

  return (
    <div className='fixed bottom-10 right-10'>
      <div
        className={`${
          toggleChatBox ? 'boxchat opacity-0 invisible w-0 h-0' : 'opacity-100 visible w-auto h-auto'
        } transition ease-in-out rounded-md duration-150 shadow-2xl mb-4 max-w-[360px] w-full bg-secondary`}
      >
        <div className='p-4 text-white'>
          <h1 className='font-[700] mb-2'>Xin chào {profile ? profile?.name : 'bạn'}!</h1>
          <p className='text-xs'>Chúng tôi rất vui lòng được hỗ trợ bạn. Vui lòng đặt câu hỏi ở dưới.</p>
        </div>
        <div className='w-auto h-[370px] bg-white p-3 overflow-y-scroll'>
          {chatState.length !== 0 &&
            chatState?.map((item: any) => {
              return (
                <div key={item.id}>
                  {item.userId === 'bot' && (
                    <div className='chat-message mb-3'>
                      <div className='flex items-end justify-between gap-x-2'>
                        <div className='flex flex-col space-y-2 text-xs w-[300px] mx-2 order-2 items-start'>
                          <div>
                            <span className='px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'>
                              <p>{item.text}</p>
                              {item.dataText && (
                                <ul>
                                  {item.dataText.map((item: any, index: number) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              )}
                              {item.dataProduct && (
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
                                          <h3 className='mb-1'>{item.name}</h3>
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
                        <div className='w-6 h-6 rounded-full'>
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
                        <div className='w-6 h-6 rounded-full'>
                          <img src={profile ? profile?.avatar : Frame} alt='My profile' className='rounded-full ' />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          {loading && (
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
        <form
          onSubmit={handleSubmit}
          className='w-auto border-t-4 border-b-4 h-[50px] bg-white shadow flex pr-2 overflow-hidden'
        >
          <input
            type='text'
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            className='w-full h-full pl-2 overflow-hidden rounded-md'
            placeholder='Nhập nội dung'
          />
          <button type='submit' className='bg-primary text-white px-3'>
            Gửi
          </button>
        </form>
      </div>
      <button
        onClick={() => setToggleChatBox(!toggleChatBox)}
        className='float-right  w-10 h-10 rounded-full bg-secondary'
      >
        <img src='https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-and-lines-1/2/11-512.png' alt='' />
      </button>
    </div>
  )
}

export default ChatBoxAI
