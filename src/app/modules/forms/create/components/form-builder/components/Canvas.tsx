import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FORM_FIELD_TYPE } from 'app/constants'
import { FC, useState } from 'react'
import { FaTrash } from 'react-icons/fa'

import { RenderField } from '../fields/Fields'
import AddLogo from './AddLogo'

const Spacer = () => {
  return <div className='w-full h-[50px] bg-black opacity-[.02] shadow-2xl'>spacer</div>
}

const GetRenderer = ({ type, value, onChange }: any) => {
  return (
    <>
      {type === 'spacer' ? (
        <Spacer />
      ) : (
        <RenderField type={type} value={value} onChange={onChange} />
      )}
    </>
  )
}

export const Field = (props: any) => {
  const { field, overlay, onChange, ...rest } = props
  const { type, value } = field

  return (
    <div>
      <GetRenderer type={type} value={value} onChange={onChange} {...rest} />
    </div>
  )
}

const SortableField = (props: any) => {
  const { id, index, field, deleteClicked, onChange } = props

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      index,
      id,
      field,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className='relative mb-[24px] rounded-lg overflow-hidden '
      style={{ ...style, width: field.type === 'uploadimage' ? 'fit-content' : 'auto' }}
    >
      <div
        className='absolute right-2 max-md:right-0 flex flex-col items-center top-2/4'
        style={{ transform: 'translateY(-50%)' }}
      >
        {field.type !== 'spacer' && (
          <>
            <div
              className='text-[24px] mb-2'
              style={{ color: '#2BA579' }}
              {...attributes}
              {...listeners}
            >
              ⣿
            </div>
            {
              field.type !== FORM_FIELD_TYPE.DROPDOWN_LOCATION
              && field.type !== FORM_FIELD_TYPE.DROPDOWN_AREA
              && field.type !== FORM_FIELD_TYPE.DROPDOWN_AREA_CBS
              && field.type !== FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE &&
              <FaTrash
                color='#B5B5C3'
                size='14px'
                onClick={deleteClicked}
                className='cursor-pointer'
              />
            }
          </>
        )}
      </div>
      <Field field={field} onChange={onChange} />
    </div>
  )
}

interface Props {
  fields: any
  formTitle: string
  setFormTitle: (v: string) => void
  formSubTitle: string
  setFormSubTitle: (v: string) => void
  deleteClicked: (v: string) => void
  updateData: any
}

const Canvas: FC<Props> = ({
  fields,
  formTitle,
  setFormTitle,
  formSubTitle,
  setFormSubTitle,
  deleteClicked,
  updateData,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition }: any = useDroppable({
    id: 'canvas_droppable',
    data: {
      parent: null,
      isContainer: true,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className='w-full h-full p-[50px] max-md:p-[10px] max-md:py-[30px]'
      style={style}
      {...attributes}
      {...listeners}
    >
      <AddLogo />
      <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px] mt-[35px] mb-[24px] rounded-md'>
        <input
          type='text'
          value={formTitle === "Form Title" ? "" : formTitle}
          placeholder={"Form Title"}
          onChange={(e) => setFormTitle(e.target.value === "" ? "Form Title" : e.target.value)}
          className='border-none outline-none text-[28px] font-semibold w-full mb-[18px]'
        />
        <input
          type='text'
          placeholder='Type a subheader'
          value={formSubTitle}
          onChange={(e) => setFormSubTitle(e.target.value)}
          className='border-none outline-none text-[16px] w-full font-sm text-[#7E8299]'
        />
      </div>
      {fields?.map((f: any, i: number) => (
        <SortableField
          key={f.id}
          id={f.id}
          field={f}
          index={i}
          deleteClicked={() => deleteClicked(f.id)}
          onChange={(v: any) =>
            updateData((draft: any) => {
              draft.fields = draft.fields.map((a: any) => (a.id === f.id ? { ...a, value: v } : a))
            })
          }
        />
      ))}
      <div className='w-full h-[200px] bg-transparent'></div>
    </div>
  )
}

export default Canvas
