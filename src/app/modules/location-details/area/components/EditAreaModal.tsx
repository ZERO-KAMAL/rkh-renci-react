import ModalWrapper from 'app/components/modal/ModalWrapper'
import { useAppSelector } from 'app/redux/store'
import { FC } from 'react'

interface Props {
  modalTitle: string
  formik: any
  onClose: () => void
}

const EditAreaModal: FC<Props> = (props: Props) => {
  const { modalTitle, formik, onClose } = props
  return (
    <ModalWrapper title={modalTitle} onClose={onClose} onSubmit={formik.handleSubmit}>
      <form
        id='modal_add_user_form'
        className='form max-w-[30rem] min-w-[15rem] md:min-w-[30rem]'
        noValidate
      >
        <div>
          {/* Area Name */}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>
              Area
              <span className='text-red-700 font-bold'> *</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <input
                type='text'
                id='area'
                placeholder='Area name'
                autoComplete='off'
                {...props.formik.getFieldProps('name')}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.name}</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default EditAreaModal
