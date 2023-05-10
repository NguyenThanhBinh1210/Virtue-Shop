const Footer = () => {
  return (
    <div className=' mt-8 border-t dark:border-t-text-color p-10 text-center text-text-color'>
      <p className='mb-3'>Copyright © 2023 Nguyễn Thanh Bình</p>
      <div className='flex justify-center items-center gap-x-4'>
        <a
          href='https://tailwindcss.com/'
          target='_blank'
          rel='noreferrer'
          className='rounded-full overflow-hidden w-10 h-10'
        >
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png'
            alt=''
          />
        </a>
        <a href='https://tanstack.com/' target='_blank' rel='noreferrer' className='w-8 h-8'>
          <img src='https://vectorwiki.com/images/Skj0l__react-query-icon.svg' alt='' />
        </a>
        <a
          href='https://github.com/catalina5'
          target='_blank'
          rel='noreferrer'
          className='w-10 h-10 rounded-full overflow-hidden'
        >
          <img src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' alt='' />
        </a>
      </div>
    </div>
  )
}

export default Footer
