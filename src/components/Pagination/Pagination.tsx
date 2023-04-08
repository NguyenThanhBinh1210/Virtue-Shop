import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfigS } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfigS
  pageSize: number
}
const range = 2
const Pagination = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= range * 2 + 1 && pageNumber > page + range && pageNumber < pageSize - range + 1) {
          return renderDotAfter(index)
        } else if (page > range * 2 + 1 && page < pageSize - range * 2) {
          if (pageNumber < page - range && pageNumber > range) {
            return renderDotBefore(index)
          } else if (pageNumber > page + range && pageNumber < pageSize - range + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - range * 2 && pageNumber > range && pageNumber < page - range) {
          return renderDotBefore(index)
        }
        return (
          <Link
            key={index}
            to={{
              pathname: '/product',
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
          >
            <button
              className={classNames('w-[30px] hover:shadow-xl h-[30px] rounded-[10px] font-[600] text-[16px]', {
                'bg-secondary': pageNumber === page,
                'bg-transparent': pageNumber !== page,
                'text-white': pageNumber === page,
                'text-textsearchColor': pageNumber !== page
              })}
            >
              {pageNumber}
            </button>
          </Link>
        )
      })
  }
  return (
    <div className='flex mx-auto w-full justify-center gap-x-[30px]'>
      {page === 1 ? (
        <button
          disabled
          className='flex items-center justify-center  w-[30px] h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
        >
          <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M7 1L2 6L7 11' stroke='#A2A2A8' strokeWidth='1.5' />
          </svg>
        </button>
      ) : (
        <Link
          to={{
            pathname: '/product',
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
        >
          <button className='flex items-center justify-center hover:shadow-md shadow-xl w-[30px] h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'>
            <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M7 1L2 6L7 11' stroke='#A2A2A8' strokeWidth='1.5' />
            </svg>
          </button>
        </Link>
      )}
      <div className=' flex gap-x-[30px]'>{renderPagination()}</div>
      {page === pageSize ? (
        <button
          disabled
          className='flex items-center justify-center  w-[30px] h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
        >
          <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M1 11L6 6L1 1' stroke='#A2A2A8' strokeWidth='1.5' />
          </svg>
        </button>
      ) : (
        <Link
          to={{
            pathname: '/product',
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
        >
          <button className='flex items-center justify-center hover:shadow-md shadow-xl w-[30px] h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'>
            <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M1 11L6 6L1 1' stroke='#A2A2A8' strokeWidth='1.5' />
            </svg>
          </button>
        </Link>
      )}
    </div>
  )
}

export default Pagination
