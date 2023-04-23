import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Config } from './config.model'
import ConfigService from './configService'

interface ConfigState {
  config: Config | undefined
  loading: boolean
}

const initialState: ConfigState = {
  config: undefined,
  loading: false,
}

export const fetchConfig = createAsyncThunk('config/fetchConfig', async (thunkAPI: any) => {
  try {
    const response: Config = await ConfigService.getConfig()
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createArea = createAsyncThunk(
  'config/createConfig',
  async (parms: Config, thunkAPI: any) => {
    try {
      const response = await ConfigService.createConfig(parms)
      if (response) {
        thunkAPI.dispatch(fetchConfig(parms))
      }

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

// Slice
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConfig.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.config = action.payload
      state.loading = false
    })
    builder.addCase(fetchConfig.rejected, (state) => {
      state.loading = false
    })
  },
})
export default configSlice
// export const {} = configSlice.actions
