import { FC } from 'react'
import { AiOutlineSetting } from 'react-icons/ai'
import { FaArrowLeft } from 'react-icons/fa'
import { NavigateOptions, useNavigate } from 'react-router-dom'

interface Props {
  header: string
  subHeader?: string
  headerButtons?: JSX.Element[]
  withBackButton?: boolean | false
  returnUrl?: any 
}

const ModuleHeader: FC<Props> = (props: Props) => {
  const navigate = useNavigate()
  return (
    <div className='flex w-full justify-between overflow-auto' id='header-container'>
      <span className='flex' id='header-name'>
        {props.withBackButton && (
          <div
            className='inline-flex items-center cursor-pointer'
            onClick={() => {
              navigate(props.returnUrl || -1)
            }}
          >
            <FaArrowLeft size={20} color={'#1BC5BD'} />
            <span className='ml-[25px] max-md:ml-2 font-semibold text-xl'>{props.header}</span>
          </div>
        )}
        {!props.withBackButton && (
          <p className='font-semibold text-xl text-black mb-5 '>{props.header}</p>
        )}
        <p className='text-skin-dashboard-heading-muted text-base pt-1 whitespace-pre'>
          {props.subHeader}
        </p>
      </span>
      <span id='header-btns' className='flex gap-4'>
        {props.headerButtons?.map((btn, index) => (
          <div key={index}>
            {btn}
          </div>
        ))}
      </span>
    </div>
  )
}

export default ModuleHeader
