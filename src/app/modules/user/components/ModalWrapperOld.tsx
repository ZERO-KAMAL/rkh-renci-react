import { Hooks } from 'app/helpers/hooks'
import { Breakpoint } from 'app/helpers/hooks/useWindowSize'
import { FC, ReactNode, useState } from 'react'

interface Props {
  title: string
  children?: ReactNode
  onSubmit: () => void
  onClose: () => void
}

const ModalWrapperOld: FC<Props> = (props: Props) => {
  const [windowSize] = useState(Hooks.useWindowSize())

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed outline-none focus:outline-none h-full w-full inset-0 z-[900]'>
        <div
          className={`relative w-auto my-6 mx-auto 
            ${
              windowSize.width <= Breakpoint.SM
                ? 'max-w-xl'
                : windowSize.width <= Breakpoint.MD
                ? 'max-w-xl'
                : windowSize.width <= Breakpoint.LG
                ? 'max-w-4xl'
                : 'max-w-6xl'
            }
            `}
        >
          {/* content*/}
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-auto bg-white outline-none focus:outline-none justify-center md:mt-28 items-center'>
            {/* header*/}
            <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>Users</h3>
            </div>
            {/* body*/}
            <div
              className={`relative p-6 flex-auto overflow-y-auto 
                  ${
                    windowSize.height <= Breakpoint.SM
                      ? 'max-h-[250px]'
                      : windowSize.height <= Breakpoint.MD
                      ? 'max-h-[300px]'
                      : windowSize.height <= Breakpoint.LG
                      ? 'max-h-[400px]'
                      : windowSize.height <= Breakpoint.XL
                      ? 'max-h-[700px]'
                      : 'max-h-[900px]'
                  }
                `}
            >
              {props.children}
            </div>
            {/* footer*/}
            <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={props.onClose}
              >
                Close
              </button>
              <button
                className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={props.onSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-50 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}

export default ModalWrapperOld
