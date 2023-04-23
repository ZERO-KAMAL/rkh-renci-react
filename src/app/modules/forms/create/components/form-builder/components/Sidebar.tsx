import { useDraggable } from '@dnd-kit/core'
import { FORM_FIELD_TYPE } from 'app/constants'
import { nanoid } from 'nanoid'
import { useRef } from 'react'

import { fields } from '../fields/Fields'

const isFiledAvailable = (type: any, fileds: any) => {
  if(
    type === FORM_FIELD_TYPE.FULL_NAME
    || type === FORM_FIELD_TYPE.EMAIL
    || type === FORM_FIELD_TYPE.ADDRESS
    || type === FORM_FIELD_TYPE.CONTACT_NUMBER
    || type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE
    || type === FORM_FIELD_TYPE.DROPDOWN_LOCATION
    || type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT
    ) {
    const field = fileds.find(((f: any) => f.type === type))
    if(field)
      return false
    else
      return true
  }
  else if(type === FORM_FIELD_TYPE.DROPDOWN_AREA || type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS) {
    const field = fileds.find(((f: any) => (f.type === FORM_FIELD_TYPE.DROPDOWN_AREA || f.type === FORM_FIELD_TYPE.DROPDOWN_AREA_CBS)))
    if(field)
      return false
    else
      return true
  }
  else if( type === FORM_FIELD_TYPE.SMILY_FACE) {
    const field = fileds.find(((f: any) => f.type === FORM_FIELD_TYPE.SMILY_FACE_FIVE))
    if(field)
      return false
    else
      return true
  }
  else if( type === FORM_FIELD_TYPE.SMILY_FACE_FIVE) {
    const field = fileds.find(((f: any) => f.type === FORM_FIELD_TYPE.SMILY_FACE))
    if(field)
      return false
    else
      return true
  }
  else return true
}

export const SidebarField = (props: any) => {
  const { field } = props
  const { title, icon } = field

  return (
    <div className='flex items-center p-[28px] border border-dashed border-[#2BA579] mb-[20px] rounded-md bg-[#f5f8fa]'>
      {icon()}
      <span className='ml-[15px]'>{title}</span>
    </div>
  )
}

const DraggableSidebarField = (props: any) => {
  const { field, ...rest } = props

  const id = useRef(nanoid())

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id.current,
    data: {
      field,
      fromSidebar: true,
    },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <SidebarField field={field} {...rest} />
    </div>
  )
}

const Sidebar = ({ fieldsRegKey, droppedFields }: any) => {
  return (
    <div key={fieldsRegKey}>
      {fields.filter(f=> isFiledAvailable(f.type, droppedFields)).map((f: any, i) => (
        <DraggableSidebarField key={i} field={f} />
      ))}
    </div>
  )
}

export default Sidebar
