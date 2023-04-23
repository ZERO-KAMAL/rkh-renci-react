import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC, memo } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

interface Props {
  selectedFormId: number[]
  setSearchText: (text: string) => void
  showDeleteBtn: boolean
  onDelete: (ids: number[]) => void
}
const Searchbar: FC<Props> = (props: Props) => {
  return (
    <div className='flex items-center justify-between w-full mb-3'>
      {/* Search bar */}
      <div className='flex w-4/6'>
        <div className='w-2/3 md:w-3/5 h-10 flex items-center bg-[#ECF0F3] rounded-lg p-1 pl-3 mr-2'>
          <AiOutlineSearch size={16} />
          <input
            type='text'
            name='search'
            id='search'
            placeholder='Search text'
            className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none text-sm'
            onChange={(e) => {
              props.setSearchText(e.target.value)
            }}
            autoComplete='off'
          />
        </div>
      </div>
      {props.showDeleteBtn && (
        <div className=''>
          <ReactIconBtn
            name='Delete Selected'
            bgColor={ColorsEnum.red}
            onClick={() => {props.onDelete(props.selectedFormId)}}
          ></ReactIconBtn>
        </div>
      )}
    </div>
  )
}

export default memo(Searchbar)
