import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button } from '@mui/material'
import BackIconButton from 'app/components/button/BackIconButton'
import {
  nextStep,
  prevStep,
  setFields,
  setSubTitle,
  setTitle,
} from 'app/http/feedback-form/feedBackFormCreationSlice'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'

import Canvas, { Field } from './components/Canvas'
import Sidebar, { SidebarField } from './components/Sidebar'

const getData = (prop: any) => {
  return prop?.data?.current ?? {}
}

const createSpacer = (id: any) => {
  return {
    id,
    type: 'spacer',
    title: 'spacer',
  }
}

interface Props {
  createFormClicked: () => void
  formId?: number
}

const FormBuilder: FC<Props> = ({ createFormClicked, formId }) => {
  const dispatch = useDispatch()
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(Date.now())
  const spacerInsertedRef: any = useRef(null)
  const currentDragFieldRef: any = useRef(null)
  const [activeSidebarField, setActiveSidebarField] = useState()
  const [activeField, setActiveField] = useState()
  const [data, updateData] = useImmer({
    fields: [],
  })

  const {
    fields: globalFields,
    title,
    subTitle,
  } = useAppSelector((state) => state.feedbackFormCreation)

  useEffect(() => {
    updateData((draft) => {
      draft.fields = globalFields
    })
  }, [])

  const cleanUp = () => {
    setActiveSidebarField(null as any)
    setActiveField(null as any)
    currentDragFieldRef.current = null
    spacerInsertedRef.current = false
  }

  const handleDragStart = (e: any) => {
    const { active } = e
    const activeData = getData(active)

    if (activeData.fromSidebar) {
      const { field } = activeData
      const { type } = field
      setActiveSidebarField(field)
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${fields.length + 1}`,
        value: null,
      }
      return
    }

    const { field, index } = activeData

    setActiveField(field)
    currentDragFieldRef.current = field
    updateData((draft) => {
      draft.fields.splice(index, 1, createSpacer(active.id) as never)
    })
  }

  const handleDragOver = (e: any) => {
    const { active, over } = e
    const activeData = getData(active)
    if (activeData.fromSidebar && !spacerInsertedRef.current) {
      const overData = getData(over)

      const spacer = createSpacer({
        id: active.id,
      })

      updateData((draft) => {
        if (!draft.fields.length) {
          draft.fields.push(spacer as never)
        } else {
          const nextIndex = overData.index > -1 ? overData.index : draft.fields.length - 1
          draft.fields.splice(nextIndex + 1, 0, spacer as never)
        }
        spacerInsertedRef.current = true
      })
    }
  }

  const handleDragEnd = (e: any) => {
    const { over } = e

    if (!over) {
      cleanUp()
      updateData((draft) => {
        draft.fields = draft.fields.filter((f: any) => f.type !== 'spacer')
      })
      return
    }

    const nextField = currentDragFieldRef.current

    if (nextField) {
      const overData = getData(over)

      updateData((draft) => {
        const spacerIndex = draft.fields.findIndex((f: any) => f.type === 'spacer')
        draft.fields.splice(spacerIndex, 1, nextField as never)

        draft.fields = arrayMove(draft.fields, spacerIndex, overData.index || 0)
      })
    }

    setSidebarFieldsRegenKey(Date.now())
    cleanUp()
  }

  const { fields } = data
  useEffect(() => {
    if (fields.filter((f: any) => f.type !== 'spacer')) {
      dispatch(setFields(fields))
    }
  }, [fields])
  const { loadingFormCreation, loadingFormUpdate } = useAppSelector((state) => state.feedbackForm)

  return (
    <div>
      <div className='flex items-center justify-between'>
        <BackIconButton
          onClick={() => dispatch(prevStep())}
          iconSize={'22px'}
          iconColor={'#1BC5BD'}
          textSize={'20px'}
        />
        <div className='flex items-center'>
          <Button
            variant='contained'
            className='bg-skin-button-secondary hover:bg-skin-button-secondary focus:bg-skin-button-secondary normal-case mr-[15px]'
            onClick={() => {
              dispatch(nextStep())
              dispatch(setFields(fields))
            }}
          >
            Preview Form
          </Button>
          <LoadingButton
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
            onClick={createFormClicked}
            loading={formId ? loadingFormUpdate : loadingFormCreation}
            loadingPosition='center'
          >
            {formId ? 'Update Form' : 'Create Form'}
          </LoadingButton>
        </div>
      </div>
      <div className=' h-auto bg-white mt-8 rounded-xl px-[38px] max-md:px-[0] py-[30px] max-md:py-[0] flex max-md:flex-col ml-[-120px] max-md:ml-0 w-[calc(100%+120px)] max-md:w-full'>
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll
        >
          <div className='w-[506px] max-md:w-full h-auto max-h-[800px] overflow-auto mr-[25px] max-md:mr-0 border'>
            <div className='p-[30px] pb-[20px] border-b'>
              <p className='font-semibold'>Drag and Drop Form Modules</p>
            </div>
            <div className='px-[30px] max-md:px-[10px] py-[20px]'>
              <Sidebar fieldsRegKey={sidebarFieldsRegenKey} droppedFields={fields} />
            </div>
          </div>
          <div className='bg-[#F3F6F9] max-h-[800px] overflow-auto w-[calc(100%-525px)] max-md:w-full'>
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={fields.map((f: any) => f.id)}
            >
              <Canvas
                fields={fields}
                formTitle={title}
                setFormTitle={(val) => dispatch(setTitle(val))}
                formSubTitle={subTitle}
                setFormSubTitle={(val) => dispatch(setSubTitle(val))}
                deleteClicked={(id) =>
                  updateData((draft) => {
                    draft.fields = draft.fields.filter((f: any) => f.id !== id)
                  })
                }
                updateData={updateData}
              />
            </SortableContext>
          </div>
          <DragOverlay dropAnimation={false as any}>
            {activeSidebarField ? <SidebarField overlay field={activeSidebarField} /> : null}
            {activeField ? <Field overlay field={activeField} onChange={() => null} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default FormBuilder
