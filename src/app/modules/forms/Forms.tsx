import ModuleHeader from 'app/components/ModuleHeader'
import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import {
  defParamsForm,
  fetchFeedbackForm,
  setArea,
  setDepartment,
  setFeedBackFormStateClear,
  setLocation,
  setOrder,
} from 'app/http/feedback-form/feedBackFormSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import React, { useEffect, useState } from 'react'
import { RiAddFill } from 'react-icons/ri'
import { useDebounce } from 'usehooks-ts'

import FormsFilter from './components/FormsFilter'
import FormsTable from './components/FormsTable'

const Forms: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearch = useDebounce(searchValue, 500)

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const { location, area, department, order } = useAppSelector((state) => state.feedbackForm)

  // Forms module permission
  const canFormAddEdit = Boolean(permissions.find((a) => a.code === MODULES.FormsEditFunc.code))

  useEffect(() => {
    dispatch(fetchFeedbackForm(defParamsForm))
  }, [])

  const handleBtnClick = () => {
    useHistory.replace(NAVIGATE_LINKS.FORMS.CREATE)
  }

  const myButtons = [
    <ReactIconBtn
      name='Create Form'
      icon={<RiAddFill size={20} />}
      bgColor={ColorsEnum.orange}
      onClick={handleBtnClick}
    ></ReactIconBtn>,
  ]

  return (
    <div className='max-w-[1120px] w-full mx-auto'>
      {canFormAddEdit ? (
        <ModuleHeader header='Form' headerButtons={myButtons} />
      ) : (
        <ModuleHeader header='Form' />
      )}
      <FormsFilter
        location={location}
        setLocation={(val) => dispatch(setLocation(val))}
        area={area}
        setArea={(val) => dispatch(setArea(val))}
        department={department}
        setDepartment={(val) => dispatch(setDepartment(val))}
        text={debouncedSearch}
        setSearchValue={setSearchValue}
        order={order}
      />
      <FormsTable
        sortDir={order.sortDir}
        setSortOrder={(val) => dispatch(setOrder(val))}
        sortBy={order.sortBy}
      />
    </div>
  )
}
export default Forms
