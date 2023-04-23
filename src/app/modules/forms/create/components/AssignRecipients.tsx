import { Button } from '@mui/material'
import CustomSelectWithSearch from 'app/components/CustomSelectWithSearch'
import BackIconButton from 'app/components/button/BackIconButton'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { formCreationStep } from 'app/http/feedback-form/feedBackForm.model'
import {
  addCCRecipient,
  addMainRecipient,
  nextStep,
  prevStep,
  removeCCRecipient,
  removeMainRecipient,
  setStep,
  updateCCRecipient,
  updateMainRecipient,
} from 'app/http/feedback-form/feedBackFormCreationSlice'
import { defParamsUserList, fetchUserList } from 'app/http/users/userSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import { FC, useCallback, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { MdDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'

const AssignRecipients: FC = () => {
  const dispatch = useDispatch()

  const { userListDataTable } = useAppSelector((state) => state.user)
  const userListData = userListDataTable?.map(({ id, fullName }) => ({ id, name: fullName }))
  const { mainRecipients, ccRecipients } = useAppSelector((state) => state.feedbackFormCreation)

  const closeClicked = () => {
    useHistory.replace(NAVIGATE_LINKS.FORMS.OVERVIEW)
    dispatch(setStep(formCreationStep.ASSIGN_LOCATION))
  }

  const initialFetch = useCallback(async () => {
    await dispatch(fetchUserList(defParamsUserList) as any)
  }, [])

  useEffect(() => {
    initialFetch()
  }, [])

  const setMainRecipient = (recipient: any, index: number) => {
    dispatch(updateMainRecipient({ index, recipient }))
  }

  const setCCRecipient = (recipient: any, index: number) => {
    dispatch(updateCCRecipient({ index, recipient }))
  }

  const setRecipientSearch = (fullName: any) => {
    dispatch(fetchUserList({ ...defParamsUserList, fullName }) as any)
  }

  const validMainRecipient = mainRecipients?.filter((f) => f)
  const validCCRecipient = ccRecipients?.filter((f) => f)

  console.log(mainRecipients)

  return (
    <div>
      <div>
        <BackIconButton
          onClick={() => dispatch(prevStep())}
          iconSize={'22px'}
          iconColor={'#1BC5BD'}
          textSize={'20px'}
        />
      </div>
      <div className='w-full h-auto bg-white mt-4 rounded-xl'>
        <div className='flex items-center justify-between pt-[33px] max-md:pt-[20px] px-[65px] max-md:px-[20px] pb-[16px] border-b-[1px]'>
          <span className='text-[20px] font-semibold'>Assign recipients to form</span>
          <IoCloseOutline size={'30px'} color='#0000008a' onClick={closeClicked} />
        </div>
        <div className='px-[65px] max-md:px-[20px] py-[50px] max-md:py-[20px]'>
          <div>
            <div className='flex items-center'>
              <span className='text-lg font-medium'>
                Main Recipient<span className='text-[#FD3D00]'>*</span>{' '}
              </span>
              <span
                className='p-[4px] ml-[20px] rounded bg-[#DFF1EB]'
                onClick={() => dispatch(addMainRecipient(undefined))}
              >
                <HiPlus size={'23px'} className='text-skin-primary' />
              </span>
            </div>
            {mainRecipients?.map((item, index) => {
              return (
                <div key={`main${index}`}>
                  <div className='flex items-center mt-[25px] mb-[10px]'>
                    <span className='text-md text-[#80808F] mr-[8px]'>Main recipient</span>
                    {mainRecipients.length > 1 && (
                      <MdDelete
                        size='23px'
                        color='#80808F'
                        onClick={() => {
                           dispatch(removeMainRecipient({ indexNumber: index }))
                        }}
                      />
                    )}
                  </div>
                  <CustomSelectWithSearch
                    placeHolder={item?.name || 'Main recipient'}
                    data={userListData}
                    setSelectedValue={(recipient) => setMainRecipient(recipient, index)}
                    setSearch={setRecipientSearch}
                    reset
                    resetClicked={() => setMainRecipient(undefined, index)}
                  />
                </div>
              )
            })}
          </div>

          <div className='mt-[30px]'>
            <div className='flex items-center'>
              <span className='text-lg font-medium'>
                CC Recipient
                {/* <span className='text-[#FD3D00]'>*</span>{' '} */}
              </span>
              <span
                className='p-[4px] ml-[20px] rounded bg-[#DFF1EB]'
                onClick={() => dispatch(addCCRecipient(undefined))}
              >
                <HiPlus size={'23px'} className='text-skin-primary' />
              </span>
            </div>
            {ccRecipients?.map((item, index) => {
              return (
                <div key={`main${index}`}>
                  <div className='flex items-center mt-[25px] mb-[10px]'>
                    <span className='text-md text-[#80808F] mr-[8px]'>CC recipient</span>
                    {ccRecipients.length > 1 && (
                      <MdDelete
                        size='23px'
                        color='#80808F'
                        onClick={() => dispatch(removeCCRecipient({indexNumber : index}))}
                      />
                    )}
                  </div>
                  <CustomSelectWithSearch
                    placeHolder={item?.name || 'CC recipient'}
                    data={userListData}
                    setSelectedValue={(recipient) => setCCRecipient(recipient, index)}
                    setSearch={setRecipientSearch}
                    reset
                    resetClicked={() => setCCRecipient(undefined, index)}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className='px-[65px] max-md:px-[20px] py-[32px] max-md:py-[20px] border-t-[1px] flex justify-end'>
          <Button
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar'
            onClick={() => dispatch(nextStep())}
            disabled={validMainRecipient?.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AssignRecipients
