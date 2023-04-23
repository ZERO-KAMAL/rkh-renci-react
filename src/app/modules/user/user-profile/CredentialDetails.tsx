import Button from '../../../common/button'

const CredentialDetails = ({ user, handleChangeForm }: any) => {
  return (
    <div className='bg-white rounded-xl mt-8'>
      <div className=''>
        <div className='pl-8 pt-9  pb-5 border-b-2 border-[#EFF2F5]'>
          <p className='text-base md:text-lg font-bold leading-6 text-[#3F4254]'>
            {' '}
            Profile Details
          </p>
        </div>
      </div>
      <div className='flex justify-between items-center mx-7 mt-9 pb-7'>
        <div className=''>
          <p className='text-sm md:text-base font-medium leading-5 text-[#3F4254]'>Email Address</p>
          <p className='text-xs md:text-[15px] font-medium leading-5 text-[#5E6278]'>{user?.email}</p>
        </div>
        <div>
          <Button
            bgColor='bg-[#F3F7F9]'
            textColor='text-[#5E6278]'
            text='Change Email'
            hover='hover:bg-[#DFF1EB] hover:text-[#2BA579] hover:shadow-md'
            onClick={() => handleChangeForm('changeEmail')}
          />
        </div>
      </div>
      <div className='flex  justify-between items-center  pt-8 pb-10 border-dotted border-t-2 border-[#DADADA]'>
        <div className=' mx-7'>
          <p className='text-sm md:text-base font-medium leading-5 text-[#3F4254]'>Password</p>
          <p className='text-xs md:text-[15px] font-medium leading-5 text-[#5E6278]'>
            *****************
          </p>
        </div>
        <div className='mx-7'>
          <Button
            bgColor='bg-[#F3F7F9]'
            textColor='text-[#5E6278]'
            text='Reset Password'
            hover='hover:bg-[#DFF1EB] hover:text-[#2BA579] hover:shadow-md'
            onClick={() => handleChangeForm('changePassword')}
          />
        </div>
      </div>
    </div>
  )
}

export default CredentialDetails
