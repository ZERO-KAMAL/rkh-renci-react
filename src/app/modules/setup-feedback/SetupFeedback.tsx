import ModuleHeader from 'app/components/ModuleHeader'
import { useAppSelector } from 'app/redux/store'

import FeedbackCategories from './hooks/FeedbackCategories'
import WithEditCategoryModal from './hooks/WithEditCategoryModal'

const SetupFeedback = () => {
  const { editData } = useAppSelector((state) => state.feedbackTypes)
  
  return (
    <div className='relative max-w-[1024px] h-full mx-auto pt-5'>
      <ModuleHeader header='Feedback Type' />
      <div className='flex flex-col w-full h-[calc(100%-3rem)] rounded overflow-auto'>
        <FeedbackCategories />
        {/* modal */}
        {editData !== undefined && <WithEditCategoryModal />}
      </div>
    </div>
  )
}

export default SetupFeedback
