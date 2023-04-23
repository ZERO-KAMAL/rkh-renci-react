import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import StorageService from './storageService'

interface StorageState {
  loading: boolean
  data: any
}

const initialState: StorageState = {
  loading: true,
  data: undefined,
}

// Actions
export const fetchStorageData = createAsyncThunk(
  'storage/fetchStorageData',
  async (_, thunkAPI) => {
    try {
      const response = await StorageService.getStorageData()
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStorageData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchStorageData.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchStorageData.rejected, (state) => {
      state.loading = false
    })
  },
})

export default storageSlice

// export const {} = storageSlice.actions
