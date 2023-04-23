import { useField } from 'formik'

const Input = ({ placeholder, type = 'text', styles, width, bgColor, ...props }: any) => {
  const [field, meta, helpers] = useField(props)
  const isValid = !(meta.touched && meta.error)
  return (
    <div className={`${styles ? styles : 'w-[80%]'}`}>
      <input
        type={type}
        placeholder={`Enter ${placeholder}`}
        className={`${bgColor ? bgColor : 'bg-[#F5F8FA]'} border  rounded-md px-4 py-3 ${
          width ? width : 'w-[80%]'
        } ${!isValid ? 'border-red-700 border-2' : ''}`}
        {...field}
        {...props}
      />
      {!isValid ? <p className='mt-1 text-red-700 font-[500] text-[12px]'>{meta.error}</p> : null}
    </div>
  )
}

export default Input
