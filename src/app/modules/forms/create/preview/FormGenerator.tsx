import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { FC } from 'react'

import companyLogo from '../../../../assets/images/renci/company-logo-with-name.png'
import { FORM_FIELD_TYPE } from '../../../../constants/index'
import InputAddress from './components/InputAddress'
import InputButton from './components/InputButton'
import InputContactNumber from './components/InputContactNumber'
import InputDatePicker from './components/InputDatePicker'
import InputEmail from './components/InputEmail'
import InputFullName from './components/InputFullName'
import InputImageUpload from './components/InputImageUpload'
import InputLongText from './components/InputLongText'
import InputMultipleChoise from './components/InputMultipleChoise'
import InputSelectDropDown from './components/InputSelectDropdown'
import InputShortText from './components/InputShortText'
import InputSingleChoise from './components/InputSingleChoise'
import SmilyFace from './components/SmilyFace'
import SubHeader from './components/SubHeader'

interface Props {
  logo: any
  title: string
  subTitle: string
  data: any
}

const FormGenerator: FC<Props> = ({ logo, title, subTitle, data }) => {
  // console.log(data)
  return (
    <div className='max-w-[755px] w-full mx-auto h-auto bg-white rounded-md py-[50px] max-md:py-[20px] px-[60px] max-md:px-[20px]'>
      <div className='w-full flex items-center justify-center mb-[50px]'>
        <figure className='max-w-[300px] max-md:max-w-[200px]'>
          <img
            src={
              typeof logo === 'string' && logo !== ''
                ? logo
                : logo
                ? URL.createObjectURL(logo)
                : companyLogo
            }
          />
        </figure>
      </div>
      <h2 className='text-[28px] font-semibold w-full mb-[18px]'>{title}</h2>
      <p className='text-[16px] w-full font-sm text-[#7E8299] mb-10'>{subTitle}</p>
      {data?.map(({ id, type, name, value }: any) => {
        return (
          <div key={id}>
            {type === FORM_FIELD_TYPE.FULL_NAME && <InputFullName value={value} />}
            {type === FORM_FIELD_TYPE.EMAIL && <InputEmail value={value} />}
            {type === FORM_FIELD_TYPE.ADDRESS && <InputAddress value={value} />}
            {type === FORM_FIELD_TYPE.CONTACT_NUMBER && <InputContactNumber value={value} />}
            {type === FORM_FIELD_TYPE.DATE_PICKER && <InputDatePicker value={value} />}
            {type === FORM_FIELD_TYPE.SHORT_TEXT && <InputShortText value={value} />}
            {type === FORM_FIELD_TYPE.LONG_TEXT && <InputLongText value={value} />}
            {(type === FORM_FIELD_TYPE.DROPDOWN
            || type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE
            || type === FORM_FIELD_TYPE.DROPDOWN_LOCATION
            || type === FORM_FIELD_TYPE.DROPDOWN_AREA
            || type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS
            || type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT
            ) && <InputSelectDropDown type={type} value={value} />
            }
            {type === FORM_FIELD_TYPE.SINGLE_CHOISE && <InputSingleChoise value={value} />}
            {type === FORM_FIELD_TYPE.MULTIPLE_CHOISE && <InputMultipleChoise value={value} />}
            {type === FORM_FIELD_TYPE.SMILY_FACE && <SmilyFace value={value} />}
            {type === FORM_FIELD_TYPE.SMILY_FACE_FIVE && <SmilyFace value={value} emojiType='fiveIcons' />}
            {type === FORM_FIELD_TYPE.UPLOAD_IMAGE && <InputImageUpload value={value} name={name} />}
            {type === FORM_FIELD_TYPE.BUTTON && <InputButton value={value} />}
            {type === FORM_FIELD_TYPE.SUB_HEADER && <SubHeader value={value} />}
          </div>
        )
      })}
      <div className='flex justify-end mt-10'>
        <div className='flex items-center'>
          <Button
            variant='contained'
            className='bg-skin-button-secondary hover:bg-skin-button-secondary focus:bg-skin-button-secondary normal-case mr-[15px]'
            onClick={() => null}
          >
            Reset
          </Button>
          <LoadingButton
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
            onClick={() => null}
            loading={false}
            loadingPosition='center'
          >
            Submit
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

export default FormGenerator
