import LoadingButton from 'app/components/button/LoadingButton'
import { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC } from 'react'

interface Props {
  formik: any
}

const AddDepartment: FC<Props> = (props: Props) => {
  return (
    <form>
      <div className='bg-white rounded-xl flex justify-between items-center w-full min-h-[140px] h-auto mt-4 px-[24px] pt-[12px] pb-[24px]'>
        <div id='add-department' className='flex-col items-start w-2/6 '>
          <p className='text-skin-muted font-medium m-2 p-2'>Department</p>
          <div className='h-10 w-4/5 flex-col items-center bg-[#ECF0F3] rounded-lg mx-2 px-2'>
            <input
              type='text'
              id='department'
              placeholder='Enter Department name'
              className='bg-[#ECF0F3] w-[90%] h-full ml-2 focus:outline-none text-sm'
              autoComplete='on'
              {...props.formik.getFieldProps('name')}
            />
            {props.formik.touched.name && props.formik.errors.name && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{props.formik.errors.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className='w-1/6 mt-auto text-left mb-1'>
          <LoadingButton
            name={'Save'}
            loadingName={'Saving ...'}
            isLoading={false}
            onClick={() => {props.formik.handleSubmit()}}
            className={ColorsEnum.orange}
          />
        </div>
      </div>
    </form>
  )
}

export default AddDepartment
