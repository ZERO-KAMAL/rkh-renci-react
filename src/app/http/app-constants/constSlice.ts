import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ConstantsRes } from 'app/http/app-constants/const.model'

interface ConstSliceState {
  constants: ConstantsRes | undefined
}

const initialState: ConstSliceState = {
  constants: undefined,
}

export const constSlice = createSlice({
  name: 'const',
  initialState,
  reducers: {
    setConstants: (
      state: { constants: ConstantsRes | undefined },
      action: PayloadAction<ConstantsRes | undefined>
    ) => {
      state.constants = action.payload
    },
  },
})
