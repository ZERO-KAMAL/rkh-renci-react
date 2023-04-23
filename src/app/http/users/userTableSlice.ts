import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserInfo, UserTableParams, tableInit } from 'app/http/users/users.model'

import { Role } from '../roles-modules/roleModule.model'

interface UserTableSliceState {
  // Required for table component
  table: UserTableParams
  // Required for Location Buttons component
  locationId: string
  // Required for filters
  filterByRoleIds: string
}

const initialState: UserTableSliceState = {
  table: tableInit,
  locationId: '',
  filterByRoleIds: '',
}

export const userTableSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Required for Location Buttons component
    setLocationId: (state, action) => {
      state.locationId = action.payload
    },
    // Required for table component
    setTable: (state, action) => {
      state.table = { ...state.table, ...action.payload }
    },
    // Required for filter dropdown accordion
    setFilterByRoleIds: (state, action) => {
      state.filterByRoleIds = action.payload
    },
    // Required table functions
    tblOnSelect: (state, action: PayloadAction<UserInfo>) => {
      const selectedIds = action.payload.id
      if (state.table.selectedId.includes(selectedIds)) {
        state.table = {
          ...state.table,
          selectedId: state.table.selectedId.filter((itemId) => itemId !== selectedIds),
        }
      } else {
        state.table = {
          ...state.table,
          selectedId: [...state.table.selectedId, selectedIds],
        }
      }
    },
    tblSetSelectMulti: (
      state,
      action: PayloadAction<{ ids: number[] | undefined; toggleAllSelected: boolean }>
    ) => {
      const ids = action.payload.ids
      const toggleAllSelected = action.payload.toggleAllSelected
      if (!ids) return

      if (state.table.isAllSelected) {
        state.table = {
          ...state.table,
          isAllSelected: toggleAllSelected && false,
          selectedId: [],
        }
      } else {
        state.table = {
          ...state.table,
          isAllSelected: toggleAllSelected && true,
          selectedId: [...ids],
        }
      }
    },
    tblSortHandler: (state, action: PayloadAction<string>) => {
      const sortBy = action.payload
      if (state.table.sortDir === 'asc') {
        state.table = {
          ...state.table,
          sortBy: sortBy,
          sortDir: 'desc',
        }
      } else {
        state.table = {
          ...state.table,
          sortBy: sortBy,
          sortDir: 'asc',
        }
      }
    },
  },
})
