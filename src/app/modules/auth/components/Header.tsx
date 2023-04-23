import { FC } from 'react'

interface TitleProps {
  name: string
}

const Title: FC<TitleProps> = (props) => {
  return (
    <header
      className='flex justify-center w-full mt-4 sm:mt-5 md:mt-6 lg:mt-7
      font-semibold text-skin-base text-xl md:text-2xl lg:text-2xl'
    >
      {props.name}
    </header>
  )
}

export default Title
