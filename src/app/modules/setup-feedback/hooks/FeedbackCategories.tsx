import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import DeleteDialog from 'app/components/dialog/DeleteDialog'
import { MODULES } from 'app/constants/module-permission'
import { EditFeedbackTypes } from 'app/http/feedback-types/feedbacktypes.model'
import FeedbackTypeService from 'app/http/feedback-types/feedbacktypes.service'
import {
  defParamsFb,
  fetchFeedbackTypes,
  setEditData,
  setTabIndex,
} from 'app/http/feedback-types/feedbacktypesSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AiOutlineEnter } from 'react-icons/ai'
import { MdOutlineCreate } from 'react-icons/md'
import { toast } from 'react-toastify'

import TabPanel from '../components/TabPanel'
import Table from '../components/Table'
import { TABLE_HEADER } from '../model/tableHeader'
import WithAddCategory from './WithAddCategory'

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const FeedbackCategories = () => {
  const [tab, setTab] = React.useState(0)
  const { dataTable, editData, loading } = useAppSelector((state) => state.feedbackTypes)

  const dispatch = useAppDispatch()
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEditCategories = Boolean(
    permissions.find((a) => a.code === MODULES.SetupCategoriesEditFunc.code)
  )

  const canDeleteCategories = Boolean(
    permissions.find((a) => a.code === MODULES.SetupCategoriesDeleteFunc.code)
  )

  useEffect(() => {
    dispatch(fetchFeedbackTypes(defParamsFb))
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    dispatch(setTabIndex(newValue))
  }

  const onEdit = (editData: any) => {
    // console.log('handle edit: ', editData)
    // console.log('tab: ', tab)
    // console.log('dataTable: ', dataTable)

    const selectedTab = dataTable.rows[tab]
    const editSelectedTab: EditFeedbackTypes = {
      ...selectedTab,
      editSubCategory: editData,
    }

    dispatch(setEditData(editSelectedTab))
  }

  const onDelete = async (deletedItems: any[]) => {
    // console.log('handle delete: ', deletedItems)
    // console.log('tab: ', tab)
    // console.log('dataTable: ', dataTable)

    const selectedTab = dataTable.rows[tab]

    try {
      await FeedbackTypeService.updateFeedbackType({
        ...selectedTab,
        subCategories: selectedTab?.subCategories?.filter(
          (item: any) => !deletedItems.includes(item)
        ),
      })
      toast.success('Success')
      await dispatch(fetchFeedbackTypes({ ...defParamsFb, setLoading: false }))
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

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

  return !loading ? (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={3}>
        <Grid container spacing={3} direction='column'>
          <Grid item xs={12}>
            <Tabs
              className='rounded-lg'
              orientation='vertical'
              variant='fullWidth'
              value={tab}
              onChange={handleChange}
              aria-label='Vertical tabs example'
              sx={{
                border: 1,
                borderColor: 'divider',
                backgroundColor: 'white',
                '& button': { borderRadius: 2 },
              }}
            >
              {dataTable.rows.map((row: any, index: number) => {
                return (
                  <Tab
                    label={row.name}
                    {...a11yProps(index)}
                    key={index}
                    sx={{ alignItems: { sm: 'center', lg: 'flex-end' }, paddingRight: '30px' }}
                  />
                )
              })}
            </Tabs>
          </Grid>
          {/* <Grid item xs={12}>
            <Card
              className='rounded-lg flex justify-center align-middle'
              variant='outlined'
              style={{ height: '100%' }}
            >
              <InputBase
                sx={{ ml: 3, flex: 1 }}
                placeholder='New Category'
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <Divider sx={{ height: 30, m: 0.5 }} orientation='vertical' />
              <IconButton color='primary' sx={{ p: '10px' }} aria-label='directions'>
                <AiOutlineEnter />
              </IconButton>
            </Card>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} lg={9}>
        <div className='mb-3'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {dataTable.rows.map((row: any, index: number) => {
                return (
                  <TabPanel value={tab} index={index} key={index}>
                    {canEditCategories && <WithAddCategory data={row} />}
                    <Table
                      headers={TABLE_HEADER}
                      dataTable={row}
                      isFetching={loading}
                      canEditCategories={canEditCategories}
                      canDeleteCategories={canDeleteCategories}
                      onEdit={onEdit}
                      onDelete={onDeleteConfimDialog}
                    />
                  </TabPanel>
                )
              })}
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  ) : (
    <CircularProgress color='success' />
  )
}

export default FeedbackCategories
