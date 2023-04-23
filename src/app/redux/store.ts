import { configureStore } from '@reduxjs/toolkit'
import { constSlice } from 'app/http/app-constants/constSlice'
import areaReducer from 'app/http/areas/areaSlice'
import configSlice from 'app/http/config/configSlice'
import dashboardReducer from 'app/http/dashboard/dashboardSlice'
import departmentReducer from 'app/http/departments/departmentSlice'
import FeedbackEmailReplySendForwardSlice from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import feedbackTypesSlice from 'app/http/feedback-types/feedbacktypesSlice'
import loationDetailReducer from 'app/http/location-datas/locationDetailSlice'
import locationReducer from 'app/http/locations/locationSlice'
import notificationSlice from 'app/http/notification/notificationSlice'
import uploadSlice from 'app/http/upload/uploadSlice'
import { userSlice } from 'app/http/users/userSlice'
import { userTableSlice } from 'app/http/users/userTableSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import feedBackEmailLabelReducer from '../http/feedback-email-lable/feedBackEmailLableSlice'
import feedBackEmailReducer from '../http/feedback-email/feedBackEmailSlice'
import feedBackFormCreationReducer from '../http/feedback-form/feedBackFormCreationSlice'
import feedBackFormReducer from '../http/feedback-form/feedBackFormSlice'
import feedBackReducer from '../http/feedbacks/feedBackSlice'
import roleModuleReducer from '../http/roles-modules/roleModuleSlice'
import storageReducer from '../http/storage/storageSlice'
import { appSlice } from './appSlice'

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    const: constSlice.reducer,
    user: userSlice.reducer,
    userTable: userTableSlice.reducer,
    location: locationReducer.reducer,
    notifications: notificationSlice.reducer,
    area: areaReducer.reducer,
    locationDetail: loationDetailReducer.reducer,
    dashboard: dashboardReducer.reducer,
    department: departmentReducer.reducer,
    roleModule: roleModuleReducer.reducer,
    feedback: feedBackReducer.reducer,
    feedbackForm: feedBackFormReducer.reducer,
    feedbackFormCreation: feedBackFormCreationReducer,
    feedbackEmail: feedBackEmailReducer.reducer,
    feedbackEmailLabel: feedBackEmailLabelReducer.reducer,
    feedbackSendAndReply: FeedbackEmailReplySendForwardSlice.reducer,
    feedbackTypes: feedbackTypesSlice.reducer,
    config: configSlice.reducer,
    storage: storageReducer.reducer,
    upload: uploadSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['feedbackFormCreation/setLogo'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['feedbackFormCreation.logo'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState> // A global type to access reducers types
export type AppDispatch = typeof store.dispatch // Type to access dispatch

// useDispatch hook with types.
export const useAppDispatch = () => useDispatch<AppDispatch>()
// useSelector hook with types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
