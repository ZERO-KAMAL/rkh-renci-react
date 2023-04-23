import { AnyListenerPredicate, PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Area } from '../areas/area.model'
import { Department } from '../departments/department.model'
import { Location } from '../locations/location.model'
import { formCreationStep } from './feedBackForm.model'

interface Recipient {
  id: number
  name: string
}
interface FeedBackFormCreationState {
  step: formCreationStep
  location: Location | null
  area: Area | null
  department: Department | null
  mainRecipients: Array<Recipient | undefined> | undefined
  ccRecipients: Array<Recipient | undefined> | undefined
  logo: any
  title: string
  subTitle: string
  fields: any
}

const initialState: FeedBackFormCreationState = {
  step: formCreationStep.ASSIGN_LOCATION,
  location: null,
  area: null,
  department: null,
  mainRecipients: [undefined],
  ccRecipients: [undefined],
  logo: undefined,
  title: 'Form Title',
  subTitle: '',
  fields: [],
}

const feedBackFormCreationSlice = createSlice({
  name: 'feedbackFormCreation',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    nextStep: (state) => {
      if (state.step < formCreationStep.PREVIEW) state.step = state.step + 1
    },
    prevStep: (state) => {
      if (state.step > formCreationStep.ASSIGN_LOCATION) state.step = state.step - 1
    },
    setLocation: (state, action: PayloadAction<Location | null>) => {
      state.location = action.payload
    },
    setArea: (state, action: PayloadAction<Area | null>) => {
      state.area = action.payload
    },
    setDepartment: (state, action: PayloadAction<Location | null>) => {
      state.department = action.payload
    },
    addMainRecipient: (state, action: PayloadAction<Recipient | undefined>) => {
      const recipient: Recipient | undefined = action.payload
      state.mainRecipients?.push(recipient)
    },
    updateMainRecipient: (state, action: PayloadAction<any>) => {
      const { index: indexNuber, recipient } = action.payload
      state.mainRecipients = state.mainRecipients?.map((obj, index) =>
        index === indexNuber ? recipient : obj
      )
    },
    setMainRecipient: (state, action: PayloadAction<Array<Recipient | undefined> | undefined>) => {
      state.mainRecipients = action.payload
    },
    removeMainRecipient: (state, action: PayloadAction<any>) => {
      const { indexNumber } = action.payload
      console.log(action.payload)
      const { id } = action.payload
      // state.mainRecipients = state.mainRecipients?.filter((item: any) => item?.id !== id)
      state.mainRecipients?.splice(indexNumber, 1)
    },
    addCCRecipient: (state, action: PayloadAction<Recipient | undefined>) => {
      const recipient: Recipient | undefined = action.payload
      state.ccRecipients?.push(recipient)
    },
    updateCCRecipient: (state, action: PayloadAction<any>) => {
      const { index: indexNuber, recipient } = action.payload
      state.ccRecipients = state.ccRecipients?.map((obj, index) =>
        index === indexNuber ? recipient : obj
      )
    },
    setCCRecipient: (state, action: PayloadAction<Array<Recipient | undefined> | undefined>) => {
      state.ccRecipients = action.payload
    },
    removeCCRecipient: (state, action: PayloadAction<any>) => {
      const { indexNumber } = action.payload
      state.ccRecipients?.splice(indexNumber, 1)
      // const {id} = action.payload
      // state.ccRecipients = state.ccRecipients?.filter((item :any)=>item.id !==id)
    },
    setLogo: (state, action: PayloadAction<any>) => {
      state.logo = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setSubTitle: (state, action: PayloadAction<string>) => {
      state.subTitle = action.payload
    },
    setFields: (state, action: PayloadAction<any>) => {
      state.fields = action.payload
    },
    setFeedBackFormCreationStateClear: () => initialState,
  },
})

export default feedBackFormCreationSlice.reducer
export const {
  setFeedBackFormCreationStateClear,
  setLocation,
  setArea,
  setDepartment,
  setStep,
  nextStep,
  prevStep,
  addMainRecipient,
  updateMainRecipient,
  setMainRecipient,
  removeMainRecipient,
  addCCRecipient,
  updateCCRecipient,
  setCCRecipient,
  removeCCRecipient,
  setLogo,
  setTitle,
  setSubTitle,
  setFields,
} = feedBackFormCreationSlice.actions
