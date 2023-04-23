import { LoadingButton } from '@mui/lab'
import { Button, Dialog } from '@mui/material'
import Loading from 'app/components/Loading'
import { FORM_FIELD_TYPE } from 'app/constants'
import { useFormik } from 'formik'
import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

import companyLogo from '../../../assets/images/renci/company-logo-with-name.png'
import PublicInputAddress from './components/PublicInputAddress'
import PublicInputContactNumber from './components/PublicInputContactNumber'
import PublicInputDatePicker from './components/PublicInputDatePicker'
import PublicInputEmail from './components/PublicInputEmail'
import PublicInputFullName from './components/PublicInputFullName'
import PublicInputImageUpload from './components/PublicInputImageUpload'
import PublicInputLongText from './components/PublicInputLongText'
import PublicInputMultipleChoise from './components/PublicInputMultipleChoise'
import PublicInputSelectDropDown from './components/PublicInputSelectDropdown'
import PublicInputShortText from './components/PublicInputShortText'
import PublicInputSingleChoise from './components/PublicInputSingleChoise'
import PublicSmilyFace from './components/PublicSmilyFace'
import { toast } from 'react-toastify'
import PublicSubHeader from './components/PublicSubHeader'
import PublicInputLocationDropDown from './components/PublicInputLocationDropdown'
import { IoClose } from 'react-icons/io5'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { defParamsLoc, fetchLocations } from 'app/http/locations/locationSlice'
import { fetchAreaByLocationId } from 'app/http/areas/areaSlice'
import { fetchDepartmentByAreaId } from 'app/http/departments/departmentSlice'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_APP_API_URL

const getInitialValues = (fields: any) => {
  const values: any = {}
  fields?.forEach((f: any) => {
    values[`${f.name}`] = ''
  })
  return values
}

const getYupString = (type: any, required: boolean, name: string) => {
  if(type === FORM_FIELD_TYPE.FULL_NAME) {
    if(required) {
      return Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Required')
    }
    else {
      return Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
    }
  }
  else if(type === FORM_FIELD_TYPE.EMAIL) {
    if(required) {
      return Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Required')
    }
    else {
      return Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
    }
  }
  else if(type === FORM_FIELD_TYPE.ADDRESS) {
    if(required) {
      return Yup.object().shape({
          street: Yup.string().required('Required'),
          unit: Yup.string().required('Required'),
          code: Yup.string().required('Required')
        })
    }
    else {
      return Yup.object().shape({
          street: Yup.string(),
          unit: Yup.string(),
          code: Yup.string()
        })
    }
  }
  else if(type === FORM_FIELD_TYPE.CONTACT_NUMBER) {
    if(required) {
      return Yup.string()
      .min(8, 'Minimum 8 symbols')
      .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/, 'Wrong format')
      .required('Required')
    }
    else {
      return Yup.string()
      .min(8, 'Minimum 8 symbols')
      .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/, 'Wrong format')
    }
  }
  else if(type === FORM_FIELD_TYPE.DATE_PICKER){
    if(required) {
      return Yup.string()
      .required('Required')
    }
    else {
      return Yup.string()
    }
  }
  else if(type === FORM_FIELD_TYPE.DROPDOWN
    || type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE
    || type === FORM_FIELD_TYPE.DROPDOWN_LOCATION
    || type === FORM_FIELD_TYPE.DROPDOWN_AREA
    || type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS
    || type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT
    ){
    if(required) {
      return Yup.string()
      .required('Required')
    }
    else {
      return Yup.string()
    }
  }
  else if(type === FORM_FIELD_TYPE.SHORT_TEXT || type === FORM_FIELD_TYPE.LONG_TEXT){
    if(required) {
      return Yup.string()
      .required('Required')
    }
    else {
      return Yup.string()
    }
  }
  else if(type === FORM_FIELD_TYPE.SINGLE_CHOISE){
    if(required) {
      return Yup.string()
      .required('Required')
    }
    else {
      return Yup.string()
    }
  }
  else if(type === FORM_FIELD_TYPE.MULTIPLE_CHOISE){
    if(required) {
      return Yup.array()
      .required('Required')
    }
    else {
      return Yup.array()
    }
  }
  else if(type === FORM_FIELD_TYPE.SMILY_FACE || type === FORM_FIELD_TYPE.SMILY_FACE_FIVE){
    if(required) {
      return Yup.string()
      .required('Required')
    }
    else {
      return Yup.string()
    }
  }
  else if(type === FORM_FIELD_TYPE.UPLOAD_IMAGE){
    if(required) {
      return Yup.mixed()
      .required('Required')
    }
    else {
      return Yup.mixed()
    }
  }
}

const getValidationSchema = (fields: any) => {
  const values: any = {}
  fields?.forEach((f: any) => {values[`${f.name}`] = getYupString(f.type, f.value.required, f.name)});
  return Yup.object().shape(values)
}

const getDynamicValues = (values: any) => {
  const res = values?.filter((f: any)=> {
    const fieldName = f.fieldName?.toLowerCase().replace(/\s/g, '')
    return (
      fieldName !== "salutation"
      && f.key !== FORM_FIELD_TYPE.FULL_NAME
      && f.key !== FORM_FIELD_TYPE.CONTACT_NUMBER
      && f.key !== FORM_FIELD_TYPE.EMAIL
      && fieldName !== "patientname"
      && fieldName !== "client'sname"
      && fieldName !== "patient's/resident'sname"
      && fieldName !== "feedback"
      && f.key !== FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE
      && f.key !== FORM_FIELD_TYPE.DROPDOWN_LOCATION
      && f.key !== FORM_FIELD_TYPE.DROPDOWN_AREA
      && f.key !== FORM_FIELD_TYPE.DROPDOWN_AREA_CBS
      && f.key !== FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT
    )
  } 
  )
  return res || []
}

const getLocationObject = (locationId: any, areaId: any, depId: any) => {
  const obj: any = {}
  if(locationId)
    obj.locationId = locationId
  if(areaId)
    obj.areaId= areaId
  if(depId)
    obj.departmentId = depId
  return obj
}

const PublicForm: FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(undefined)
  const [data, setData] = useState<any>(undefined)
  const [constant, setConstant] = useState<any>(undefined)
  const [createLoading, setCreateLoading] = useState(false)
  const [errorFields, setErrorFields] = useState([])

  const params = useParams()
  const { feedbackFormCode } = params

  const dispatch = useAppDispatch()

  useEffect(() => {
    setErrorFields([])
    if (feedbackFormCode) {
      fetch(`${API_URL}/feedbackForms/public?feedbackFormCode=${feedbackFormCode}`, {
        method: 'post',
      })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
        setLoading(false)
      })
    }
    fetch(`${API_URL}/appConstants`)
    .then((res) => res.json())
    .then((json) => {
      setConstant(json)
    })
    .catch((err) => {
      console.log(err)
      setError(err.message)
      setLoading(false)
    })
  }, [])

  const formik = useFormik({
    initialValues: getInitialValues(data?.fields),
    validationSchema: getValidationSchema(data?.fields),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let tempData: any = []
      Object.keys(values).forEach((key) => {
        const field = data?.fields?.find((f: any)=> f.name === key);
        if(field) {
          const obj = {id: field?.name, key: field?.type, value: field?.type === FORM_FIELD_TYPE.SUB_HEADER ? field?.value?.text : values[key], fieldName: field?.value?.fieldName}
          tempData= [...tempData, obj]
        }
      })
      const locationId = tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "location")?.value
      const areaId = tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "area")?.value
      const departmentId = tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "department")?.value
      const feedbackType = tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "feedbacktype")?.value
      const validData: any = {
        feedbackTypeName: (feedbackType === "Appeals" ?  "Appeals/MP letters" : feedbackType) || "Appeals/MP letters",
        TAT: 2,
        source: "Digital Form - QR",
        salutation: tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "salutation")?.value || constant?.salutation[0],
        submittedDate: moment(new Date()?.toString()).format(),
        fullName: tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "fullname")?.value || "",
        contactNumber: tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "contactnumber")?.value || "",
        email: tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "email")?.value || "",
        locations: [getLocationObject(locationId || data?.locationId, areaId || data?.areaId, locationId && areaId && departmentId ? departmentId : data?.departmentId)],
        patientName: tempData?.find((f: any)=> (f.fieldName?.toLowerCase().replace(/\s/g, '') === "patientname") || (f.fieldName?.toLowerCase().replace(/\s/g, '') === "client'sname") || (f.fieldName?.toLowerCase().replace(/\s/g, '') === "patient's/resident'sname"))?.value || "",
        feedback: tempData?.find((f: any)=> f.fieldName?.toLowerCase().replace(/\s/g, '') === "feedback")?.value || "",
        users: data?.mainRecipient?.concat(data?.ccRecipient),
        feedbackFormCode: data?.feedbackFormCode,
        dynamicValues: getDynamicValues(tempData)
      }
      // console.log(validData)
      if(validData) {
        const uploadFields = validData?.dynamicValues?.filter((f: any)=> f.key === "uploadimage")
        const notUploadFields = validData?.dynamicValues?.filter((f: any)=> f.key !== "uploadimage")
        setCreateLoading(true)
        if(uploadFields.length > 0) {
          const tempArr = [...uploadFields]
          await Promise.all(
            tempArr.map(async (el,i)=> {
              const formdata = new FormData();
              formdata.append("file", el.value);
              await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formdata
              }).then((res) => res.json())
              .then((json) => {
                tempArr[i].value = json?.uri
              }).catch((err) => {
                console.log(err)
                toast.error(err.message, {
                  position: toast.POSITION.TOP_RIGHT,
                })
                setCreateLoading(false)
              })
            })
          )
          validData['dynamicValues'] = [...notUploadFields, ...tempArr]
        }
        fetch(`${API_URL}/feedbacks`, {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(validData) as any
        },)
        .then((res: any) => {
          if (res.ok) {
            return res.json();
          }
          else {
            res.json().then((m: any) => {
              toast.error(m?.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
            })
            setCreateLoading(false)
            return Promise.reject()
          }
        })
        .then((json) => {
          // console.log(json)
          // toast.success('Feedback Created', {
          //   position: toast.POSITION.TOP_RIGHT,
          // })
          Swal.fire({
            title: 'Thank you for your feedback!',
            icon: 'success',
            confirmButtonColor: '#2BA579',
          })
          setCreateLoading(false)
          resetForm({values: getInitialValues(data?.fields)})
        })
        .catch((err) => {
          toast.error(err?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          setCreateLoading(false)
        })
      }
    }
  })

  // console.log(formik.values)

  const {
    dataTable
  } = useAppSelector((state) => state.location)
  const {
    dataTableArea
  } = useAppSelector((state) => state.area)
  const {
    dataTableDep
  } = useAppSelector((state) => state.department)

  useEffect(() => {
    if(data) {
      const locaitonField = data?.fields?.find(({type}: any) => type === FORM_FIELD_TYPE.DROPDOWN_LOCATION)
      if(locaitonField) {
        dispatch(fetchLocations(defParamsLoc))
      }
    }
  }, [data])

  const prevLocationId = useRef(null)
  const prevAreaId = useRef(null)

  useEffect(()=> {
    const locField = data?.fields?.find((f: any)=> f.type === FORM_FIELD_TYPE.DROPDOWN_LOCATION)
    const areaField = data?.fields?.find((f: any)=> f.type === FORM_FIELD_TYPE.DROPDOWN_AREA)
    const departmentField = data?.fields?.find((f: any)=> f.type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT)
    const locationId = formik.values[locField?.name]
    const areaId = formik.values[areaField?.name]
    if(locationId) {
      if(prevLocationId.current !== locationId) {
        prevLocationId.current = locationId
        dispatch(fetchAreaByLocationId(locationId))
        if(areaField?.name) {
          formik.setFieldValue(`${areaField?.name}`, "")
          prevAreaId.current = null
        }
      }
    }
    if(areaId) {
      if(prevAreaId.current !== areaId) {
        prevAreaId.current = areaId
        dispatch(fetchDepartmentByAreaId({locId: locationId , areaId}))
        if(departmentField?.name) {
          formik.setFieldValue(`${departmentField?.name}`, "")
        }
      }
    }
  }, [formik.values])

  useEffect(()=> {
    if (formik.isSubmitting && !formik.isValidating) {
      const keys = Object.keys(formik.errors);
      const fieldNames: any = []
      keys.forEach((key) => {
        const field = data?.fields?.find((f: any)=> f.name === key);
        fieldNames.push(field?.value?.fieldName)
      })
      setErrorFields(fieldNames)
      if (keys.length > 0) {
        Swal.fire({
          icon: 'error',
          text: 'Please fill out all required fields',
          confirmButtonColor: '#2BA579'
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(()=> {
              const errorElement = document.getElementById(keys[0]) as HTMLElement;
              if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 310)
          }
        })
      }
    }
  }, [formik.errors, formik.isSubmitting, formik.isValidating])

  return (
    <div className='w-full h-full bg-[#F3F6F9] overflow-auto'>
      <div className='max-w-[1120px] w-full mx-auto py-10'>
        <div className='max-w-[755px] w-full mx-auto h-auto bg-white rounded-md py-[50px] max-md:py-[25px] px-[60px] max-md:px-[20px] relative'>
          {loading && <Loading />}
          {data && (
            <>
              <div className='w-full flex items-center justify-center mb-[50px]'>
                <figure className='max-w-[300px]'>
                  <img src={data.logo !== '' ? data.logo : companyLogo} alt=''/>
                </figure>
              </div>
              <h2 className='text-[28px] font-semibold w-full mb-[18px]'>{data.title}</h2>
              <p className='text-[16px] w-full font-sm text-[#7E8299] mb-10'>{data.subtitle}</p>
              {
                errorFields.length > 0 &&
                <div className='w-full h-auto bg-[#FFE2E5] p-4 rounded mb-5'>
                  <p className='text-lg font-semibold text-red-800'>Please fill out below fields:</p>
                  <ul className='p-2'>
                    {
                      errorFields.map((item, index) => {
                        return <li key={index} className="font-medium text-red-700">{item}</li>
                      })
                    }
                  </ul>
                </div>
              }
              {data?.fields?.map(({ id, type, value, name }: any) => {
                return (
                  <div key={id}>
                    {type === FORM_FIELD_TYPE.FULL_NAME &&
                      <div>
                        <PublicInputFullName
                          data={value}
                          {...formik.getFieldProps(name)}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {type === FORM_FIELD_TYPE.EMAIL &&
                      <div>
                        <PublicInputEmail
                          data={value}
                          {...formik.getFieldProps(name)}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {type === FORM_FIELD_TYPE.ADDRESS &&
                      <PublicInputAddress
                        data={value}
                        name={name}
                        formik={formik}
                      />
                    }
                    {type === FORM_FIELD_TYPE.CONTACT_NUMBER && (
                      <div>
                        <PublicInputContactNumber
                          data={value}
                          {...formik.getFieldProps(name)}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {type === FORM_FIELD_TYPE.DATE_PICKER &&
                      <div>
                        <PublicInputDatePicker
                          data={value}
                          setField={formik.setFieldValue}
                          {...formik.getFieldProps(name)}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {type === FORM_FIELD_TYPE.SHORT_TEXT &&
                    <div>
                      <PublicInputShortText
                        data={value}
                        {...formik.getFieldProps(name)}
                        isError={(formik.errors[name] && formik.touched[name]) as boolean}
                      />
                      {(formik.errors[name] && formik.touched[name]) && (
                        <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                          <span role='alert'>{formik.errors[name] as string}</span>
                        </div>
                      )}
                    </div>
                      
                    }
                    {type === FORM_FIELD_TYPE.LONG_TEXT &&
                      <div>
                        <PublicInputLongText
                          data={value}
                          {...formik.getFieldProps(name)}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN) &&
                      <div>
                        <PublicInputSelectDropDown 
                          data={value}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE) &&
                      <div>
                        <PublicInputSelectDropDown 
                          data={value}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          dropdownType= {FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN_LOCATION) &&
                      <div>
                        <PublicInputLocationDropDown
                          data={{...value, options: dataTable?.map(({id, name})=> ({id, value: name}))}}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          dropdownType= {FORM_FIELD_TYPE.DROPDOWN_LOCATION}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN_AREA) &&
                      <div>
                        <PublicInputLocationDropDown
                          data={{...value, options: dataTableArea?.map(({id, name})=> ({id, value: name}))}}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          dropdownType= {FORM_FIELD_TYPE.DROPDOWN_AREA}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS) &&
                      <div>
                        <PublicInputLocationDropDown
                          data={{...value, options: dataTableArea?.filter((f)=> f.name === 'Senior Care Centre').map(({id, name})=> ({id, value: name}))}}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          dropdownType= {FORM_FIELD_TYPE.DROPDOWN_AREA}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {(type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT) &&
                      <div>
                        <PublicInputLocationDropDown
                          data={{...value, options: dataTableDep?.map(({id, name})=> ({id, value: name}))}}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          dropdownType= {FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {type === FORM_FIELD_TYPE.SINGLE_CHOISE &&
                      <div>
                        <PublicInputSingleChoise
                          data={value}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    }
                    {type === FORM_FIELD_TYPE.MULTIPLE_CHOISE && (
                      <div>
                        <PublicInputMultipleChoise
                          data={value}
                          name={name}
                          setField={formik.setFieldValue}
                          value={formik.values[name]}
                          isError={(formik.errors[name] && formik.touched[name]) as boolean}
                        />
                        {(formik.errors[name] && formik.touched[name]) && (
                          <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                            <span role='alert'>{formik.errors[name] as string}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {type === FORM_FIELD_TYPE.SMILY_FACE &&
                    <div>
                      <PublicSmilyFace
                        data={value}
                        name={name}
                        setField={formik.setFieldValue}
                        value={formik.values[name]}
                        isError={(formik.errors[name] && formik.touched[name]) as boolean}
                      />
                      {(formik.errors[name] && formik.touched[name]) && (
                        <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                          <span role='alert'>{formik.errors[name] as string}</span>
                        </div>
                      )}
                    </div>
                    }
                    {type === FORM_FIELD_TYPE.SMILY_FACE_FIVE &&
                    <div>
                      <PublicSmilyFace
                        data={value}
                        name={name}
                        setField={formik.setFieldValue}
                        value={formik.values[name]}
                        emojiType='fiveIcons'
                        isError={(formik.errors[name] && formik.touched[name]) as boolean}
                      />
                      {(formik.errors[name] && formik.touched[name]) && (
                        <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                          <span role='alert'>{formik.errors[name] as string}</span>
                        </div>
                      )}
                    </div>
                    }
                    {type === FORM_FIELD_TYPE.UPLOAD_IMAGE &&
                    <div>
                      <PublicInputImageUpload
                        data={value}
                        name={name}
                        value={formik.values[name]}
                        setField={formik.setFieldValue}
                        isError={(formik.errors[name] && formik.touched[name]) as boolean}
                      />
                      {(formik.errors[name] && formik.touched[name]) && (
                        <div className='text-red-600 text-[12px] px-4 mt-[-17px]'>
                          <span role='alert'>{formik.errors[name] as string}</span>
                        </div>
                      )}
                    </div>
                    }
                    {
                      type === FORM_FIELD_TYPE.SUB_HEADER && <PublicSubHeader data={value}  />
                    }
                  </div>
                )
              })}
              <div className='mt-8'>
                <p className='text-[10px] text-gray-400'>By clicking Submit, you agree to our collection, use and/or disclosure of your personal data to the extent necessary to process your feedback in accordance with the Personal Data Protection Act (PDPA).</p>
              </div>
              <div className='flex justify-end mt-5'>
                <div className='flex items-center'>
                  <Button
                    variant='contained'
                    className='bg-skin-button-secondary hover:bg-skin-button-secondary focus:bg-skin-button-secondary normal-case mr-[15px]'
                    onClick={() => formik.resetForm({values: getInitialValues(data?.fields)})}
                  >
                    Reset
                  </Button>
                  <LoadingButton
                    variant='contained'
                    className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
                    onClick={() => formik.handleSubmit()}
                    loading={createLoading}
                    loadingPosition='center'
                  >
                    Submit
                  </LoadingButton>
                </div>
              </div>
            </>
          )}
          {error && (
            <div className='p-15 flex items-center justify-center text-[30px] font-semibold text-[#F69B11]'>
              Wrong Url!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicForm
