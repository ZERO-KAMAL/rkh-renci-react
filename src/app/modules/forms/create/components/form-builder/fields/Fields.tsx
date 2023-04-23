import { FORM_FIELD_TYPE } from 'app/constants'
import { BiCalendarPlus } from 'react-icons/bi'
import { BsCardImage, BsFillEmojiSmileFill } from 'react-icons/bs'
import { CgRadioChecked } from 'react-icons/cg'
import { HiUser } from 'react-icons/hi'
import { HiSquares2X2 } from 'react-icons/hi2'
import { IoIosArrowDropdown } from 'react-icons/io'
import {
  MdEmail,
  MdImportContacts,
  MdOutlineChecklist,
  MdOutlinePhone,
  MdOutlineShortText,
  MdOutlineSort,
  MdTextFields,
} from 'react-icons/md'

import AddressField from './components/AddressField'
import ButtonField from './components/ButtonField'
import ContactNumber from './components/ContactNumber'
import DateField from './components/DateField'
import DropDownFeedbackTypeField from './components/DropDownFeedbackTypeField'
import DropDownField from './components/DropDownField'
import DropDownLocationField from './components/DropDownLocationField'
import EmailField from './components/EmailField'
import FullName from './components/FullName'
import LongTextField from './components/LongTextField'
import MultipleChoiseField from './components/MultipleChoiseField'
import ShortTextField from './components/ShortTextField'
import SingleChoiseField from './components/SingleChoiseField'
import SmilyFaceField from './components/SmilyFaceField'
import SubHeaderField from './components/SubHeaderField'
import UploadImage from './components/UploadImage'

// These will be available from the sidebar
export const fields = [
  {
    type: FORM_FIELD_TYPE.FULL_NAME,
    title: 'Full Name',
    icon: () => <HiUser size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.EMAIL,
    title: 'Email',
    icon: () => <MdEmail size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.ADDRESS,
    title: 'Address',
    icon: () => <MdImportContacts size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.CONTACT_NUMBER,
    title: 'Contact Number',
    icon: () => <MdOutlinePhone size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DATE_PICKER,
    title: 'Date Picker',
    icon: () => <BiCalendarPlus size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.SHORT_TEXT,
    title: 'Short text',
    icon: () => <MdOutlineShortText size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.LONG_TEXT,
    title: 'Long text',
    icon: () => <MdOutlineSort size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN,
    title: 'Dropdown',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE,
    title: 'Dropdown - Feedback Type',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN_LOCATION,
    title: 'Dropdown - Location',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN_AREA,
    title: 'Dropdown - Area',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN_AREA_CBS,
    title: 'Dropdown - Area - CBS',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT,
    title: 'Dropdown - Department',
    icon: () => <IoIosArrowDropdown size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.SINGLE_CHOISE,
    title: 'Single Choice',
    icon: () => <CgRadioChecked size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.MULTIPLE_CHOISE,
    title: 'Multiple Choice',
    icon: () => <MdOutlineChecklist size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.SMILY_FACE,
    title: 'Smily Face x 4',
    icon: () => <BsFillEmojiSmileFill size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.SMILY_FACE_FIVE,
    title: 'Smily Face x 5',
    icon: () => <BsFillEmojiSmileFill size={'30px'} className='text-skin-primary' />,
  },
  {
    type: FORM_FIELD_TYPE.UPLOAD_IMAGE,
    title: 'Image',
    icon: () => <BsCardImage size={'30px'} className='text-skin-primary' />,
  },
  // {
  //   type: FORM_FIELD_TYPE.BUTTON,
  //   title: "Button",
  //   icon: ()=> <HiSquares2X2 size={"30px"} className="text-skin-primary" />
  // },
  {
    type: FORM_FIELD_TYPE.SUB_HEADER,
    title: 'Sub Header',
    icon: () => <MdTextFields size={'30px'} className='text-skin-primary' />,
  },
]

// These define how we render the field
export const RenderField: any = ({ type, value, onChange }: any) => {
  return (
    <>
      {type === FORM_FIELD_TYPE.FULL_NAME ? (
        <FullName value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.EMAIL ? (
        <EmailField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.ADDRESS ? (
        <AddressField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.CONTACT_NUMBER ? (
        <ContactNumber value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.DATE_PICKER ? (
        <DateField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.SHORT_TEXT ? (
        <ShortTextField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.LONG_TEXT ? (
        <LongTextField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.DROPDOWN ? (
        <DropDownField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? (
        <DropDownFeedbackTypeField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.DROPDOWN_LOCATION ? (
        <DropDownLocationField value={value} onChange={onChange} locationType="Location" />
      ) : type === FORM_FIELD_TYPE.DROPDOWN_AREA ? (
        <DropDownLocationField value={value} onChange={onChange} locationType="Area" />
      ) : type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS ? (
        <DropDownLocationField value={value} onChange={onChange} locationType="Area" CBS={true} />
      ) : type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT ? (
        <DropDownLocationField value={value} onChange={onChange} locationType="Department" />
      ) : type === FORM_FIELD_TYPE.SINGLE_CHOISE ? (
        <SingleChoiseField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.MULTIPLE_CHOISE ? (
        <MultipleChoiseField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.SMILY_FACE ? (
        <SmilyFaceField value={value} onChange={onChange} type='fourIcons' />
      ) : type === FORM_FIELD_TYPE.SMILY_FACE_FIVE ? (
        <SmilyFaceField value={value} onChange={onChange} type='fiveIcons' />
      ) : type === FORM_FIELD_TYPE.UPLOAD_IMAGE ? (
        <UploadImage value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.BUTTON ? (
        <ButtonField value={value} onChange={onChange} />
      ) : type === FORM_FIELD_TYPE.SUB_HEADER ? (
        <SubHeaderField value={value} onChange={onChange} />
      ) : null}
    </>
  )
}
