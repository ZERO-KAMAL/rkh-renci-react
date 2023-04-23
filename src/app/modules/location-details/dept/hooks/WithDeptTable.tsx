import DeleteDialog from 'app/components/dialog/DeleteDialog'
import { MODULES } from 'app/constants/module-permission'
import DepartmentService from 'app/http/departments/departmentService'
import {
  fetchDepartments,
  setEditData,
  setLimit,
  setOrder,
  setPage,
  setTextDep,
} from 'app/http/departments/departmentSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { toast } from 'react-toastify'
import { useDebounce } from 'usehooks-ts'

import Table from '../../shared-components/table/Table'
import { TABLE_HEADER, TABLE_INIT } from '../model/tableHeader'

const WithDeptTable = () => {
  const dispatch = useAppDispatch()
  const isInitialMount = useRef(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedText = useDebounce(searchTerm, 500)
  const { dataTableDep, counts, loadingDep, limit, page, order, text } = useAppSelector(
    (state) => state.department
  )

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEdit = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  const canDelete = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationDeleteFunc.code)
  )
  
  const initialFetch = async () => {
    await dispatch(fetchDepartments(TABLE_INIT))
  }

  const refetchApi = useCallback(async () => {
    await dispatch(fetchDepartments({ page, limit, areaId: '', locationId: '', text, order }))
  }, [page, limit, text, order])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      initialFetch()
    } else {
      refetchApi()
    }
  }, [page, limit, text, order])

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
      await DepartmentService.deleteDepartments(ids)
      toast.success('Success')
      await dispatch(fetchDepartments({ page, limit, areaId: '', locationId: '', text, order }))
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  const setSearchText = (text: string) => {
    setSearchTerm(text)
  }
  useEffect(() => {
    dispatch(setTextDep(debouncedText))
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
      dataTable={dataTableDep}
      isFetching={loadingDep}
      counts={counts}
      limit={limit}
      page={page}
      sortBy={order.sortBy}
      canEdit={canEdit}
      canDelete={canDelete}
      sortDir={order.sortDir}
      setLimit={setPageLimit}
      setPage={setPageNum}
      setSortBy={setSortBy}
      onEdit={onEdit}
      onDelete={onDeleteConfimDialog}
      setSearchText={setSearchText}
    />
  )
}

export default WithDeptTable
