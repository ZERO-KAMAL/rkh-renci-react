import DeleteDialog from 'app/components/dialog/DeleteDialog'
import { MODULES } from 'app/constants/module-permission'
import AreaService from 'app/http/areas/areaService'
import {
  fetchAreas,
  setEditData,
  setLimit,
  setOrder,
  setPage,
  setText,
} from 'app/http/areas/areaSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { toast } from 'react-toastify'
import { useDebounce } from 'usehooks-ts'

import Table from '../../shared-components/table/Table'
import { TABLE_HEADER, TABLE_INIT } from '../model/tableHeader'

const WithAreaTable = () => {
  const dispatch = useAppDispatch()
  const isInitialMount = useRef(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedText = useDebounce(searchTerm, 500)
  const { dataTableArea, counts, loading, page, limit, locationId, text, order } = useAppSelector(
    (state) => state.area
  )

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEdit = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  const canDelete = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationDeleteFunc.code)
  )

  const initialFetch = async () => {
    await dispatch(fetchAreas(TABLE_INIT))
  }

  const refetchApi = useCallback(async () => {
    await dispatch(fetchAreas({ page, limit, locationId, text, order }))
  }, [page, limit, text, order])

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
      await AreaService.deleteAreas(ids)
      toast.success('Success')
      await dispatch(fetchAreas({ page, limit, locationId, text, order }))
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  const setSearchText = (text: string) => {
    setSearchTerm(text)
  }
  useEffect(() => {
    dispatch(setText(debouncedText))
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
      dataTable={dataTableArea}
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

export default WithAreaTable
