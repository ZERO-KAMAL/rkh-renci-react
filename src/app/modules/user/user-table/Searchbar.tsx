import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC, memo } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

import RoleFilter from '../components/FilterButton'

interface Props {
  setSearchText: (text: string) => void
  selectedRows: number[]
  canUsersDelete: boolean
  onDeleteMultiple: () => void
}
const Searchbar: FC<Props> = (props: Props) => {
  return (
    <div className='flex items-center justify-between m-2 p-3 w-full flex-wrap'>
      {/* Search bar */}
      <div className='flex w-full'>
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
        {<RoleFilter />}
      </div>
      {props.canUsersDelete && props.selectedRows.length > 0 && (
        <div className='mr-6 right-0 ml-auto'>
          <ReactIconBtn
            name='Delete Selected'
            bgColor={ColorsEnum.red}
            onClick={props.onDeleteMultiple}
          ></ReactIconBtn>
        </div>
      )}
    </div>
  )
}

export default memo(Searchbar)
