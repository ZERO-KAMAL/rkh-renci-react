import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import UploadService from './uploadService'

interface UploadState {
  loading: boolean
  data: any
}

const initialState: UploadState = {
  loading: true,
  data: undefined,
}

// Actions
export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file: any, thunkAPI: any) => {
    try {
      const data: any = new FormData()
      data.append('file', file)
      const res = await UploadService.upload(data)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadFile.pending, (state) => {
      state.loading = true
    })
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(uploadFile.rejected, (state) => {
      state.loading = false
    })
  },
})

export default uploadSlice

// export const {} = storageSlice.actions
