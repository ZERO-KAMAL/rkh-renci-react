import DeleteDialog from 'app/components/dialog/DeleteDialog'
import { MODULES } from 'app/constants/module-permission'
import LocationService from 'app/http/locations/locationService'
import {
  fetchLocations,
  setEditData,
  setLimit,
  setOrder,
  setPage,
  setTextLoc,
} from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { toast } from 'react-toastify'
import { useDebounce } from 'usehooks-ts'

import Table from '../../shared-components/table/Table'
import { TABLE_HEADER, TABLE_INIT } from '../model/tableHeader'

const WithLocationTable = () => {
  const dispatch = useAppDispatch()
  const isInitialMount = useRef(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedText = useDebounce(searchTerm, 500)
  const { dataTable, counts, loading, limit, page, order, locationId, text } = useAppSelector(
    (state) => state.location
  )

  const refetchApi = useCallback(async () => {
    await dispatch(fetchLocations({ page, limit, locationId, text, order }))
  }, [page, limit, text, order])

  const initialFetch = async () => {
    await dispatch(fetchLocations(TABLE_INIT))
  }

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEdit = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  const canDelete = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationDeleteFunc.code)
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      initialFetch()
    } else {
      refetchApi()
    }
  }, [page, limit, locationId, text, order])

  const setPageLimit = (limit: number) => {
    dispatch(setLimit(limit))
  }

  const setPageNum = (page: number) => {
    dispatch(setPage(page))
  }

  const setSortBy = (sortBy: string) => {
    if (order.sortDir === 'asc') {
      dispatch(
        setOrder({
          sortBy: sortBy,
          sortDir: 'desc',
        })
      )
    } else {
      dispatch(
        setOrder({
          sortBy: sortBy,
          sortDir: 'asc',
        })
      )
    }
  }

  const onEdit = (data: any) => {
    dispatch(setEditData(data))
  }

  const onDelete = async (ids: number[]) => {
    try {
      await LocationService.deleteLocation(ids)
      toast.success('Success')
      await dispatch(fetchLocations({ page, limit, locationId, text, order }))
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  const setSearchText = (text: string) => {
    setSearchTerm(text)
  }
  useEffect(() => {
    dispatch(setTextLoc(debouncedText))
    setPageNum(1)
  }, [debouncedText])

  const onDeleteConfimDialog = (deletedIds: number[]) => {
    const node = ReactDOM.createRoot(document.createElement('div'))
    node.render(
      <DeleteDialog
        open={true}
        isLoading={false}
        onSubmit={() => {
          onDelete(deletedIds)
          node.unmount()
        }}
        onClose={() => node.unmount()}
      />
    )
    return () => {
      node.unmount()
    }
  }

  return (
    <Table
      headers={TABLE_HEADER}
      dataTable={dataTable}
      isFetching={loading}
      counts={counts}
      limit={limit}
      page={page}
      sortBy={order.sortBy}
      sortDir={order.sortDir}
      canEdit={canEdit}
      canDelete={canDelete}
      setLimit={setPageLimit}
      setPage={setPageNum}
      setSortBy={setSortBy}
      onEdit={onEdit}
      onDelete={onDeleteConfimDialog}
      setSearchText={setSearchText}
    />
  )
}

export default WithLocationTable
