import { FC } from 'react'

interface Props {
  // Inputs from parent
  name: string
  loadingName: string
  isLoading: boolean
  className: string

  // return callbacks to parent
  onClick?: () => void
}

const LoadingButton: FC<Props> = (props: Props) => {
  return (
    <>
      {!props.isLoading && (
        <button
          type='button'
          className={`${props?.className} hover:bg-opacity-90 rounded-md px-8 h-10 text-skin-base-inverted text-sm`}
          onClick={props.onClick}
        >
          {props.name}
        </button>
      )}
      {props.isLoading && (
        <button
          type='button'
          className={`${props?.className} flex items-center rounded-md px-4 h-10 text-skin-base-inverted`}
          disabled
        >
          <svg
            className='mr-3 h-5 w-5 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <span className='text-sm'> {props.loadingName} </span>
        </button>
      )}
    </>
  )
}

export default LoadingButton
