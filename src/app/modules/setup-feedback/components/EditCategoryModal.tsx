import ModalWrapper from 'app/components/modal/ModalWrapper'
import { useAppSelector } from 'app/redux/store'
import { FC } from 'react'

interface Props {
  modalTitle: string
  formik: any
  onClose: () => void
}

const EditCategoryModal: FC<Props> = (props: Props) => {
  const { modalTitle, formik, onClose } = props
  return (
    <ModalWrapper title={modalTitle} onClose={onClose} onSubmit={formik.handleSubmit}>
      <form
        id='modal_add_user_form'
        className='form max-w-[30rem] min-w-[15rem] md:min-w-[30rem]'
        noValidate
      >
        <div>
          {/* Category */}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>
              Category
              <span className='text-red-700 font-bold'> *</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <input
                type='text'
                id='category'
                placeholder='Category'
                autoComplete='off'
                {...props.formik.getFieldProps('category')}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
              />
            </div>
            {formik.touched.category && formik.errors.category && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.category}</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </ModalWrapper>
  )
}

export default EditCategoryModal
