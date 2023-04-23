import LoadingButton from '@mui/lab/LoadingButton'
import { Grid, Switch } from '@mui/material'
import BackIconButton from 'app/components/button/BackIconButton'
import { MODULES, SUPERADMIN_ID } from 'app/constants/module-permission'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { RolePermission } from '../../../http/roles-modules/roleModule.model'
import {
  createRolePermission,
  defParamsPermission,
  fetchPermission,
  setRoleAction,
} from '../../../http/roles-modules/roleModuleSlice'
import MainMenu from './MainMenu'
import PermissionCard from './PermissionCard'
import SubMenu from './SubMenu'

const PermissionTable = () => {
  const dispatch = useAppDispatch()
  const { roleId, roleName, permissionDataTable, selected } = useAppSelector(
    (state) => state.roleModule
  )
  const [permission, setPermission] = useState<string[]>([])

  const initFetch = useCallback(async () => {
    dispatch(fetchPermission(defParamsPermission))
  }, [])

  useEffect(() => {
    initFetch()
  }, [])

  useEffect(() => {
    const selectedPerm = permissionDataTable
      .filter((item) => selected.includes(item.id))
      .map((item) => item.code)
    setPermission(selectedPerm)
  }, [permissionDataTable])

  const saveOnClick = () => {
    const selectedIds = permissionDataTable
      .filter((item) => permission.includes(item.code))
      .map((item) => item.id)
    const data: RolePermission = { roleId: roleId, permissionIds: selectedIds }
    dispatch(createRolePermission(data)).then((data) => {
      if (data.meta.requestStatus === 'fulfilled') {
        toast.success('Saving Successful', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        toast.error('Something was wrong.', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    })
  }

  const handleSelect = (selectedItems: string[]) => {
    selectedItems.forEach((selected) => {
      if (permission.includes(selected)) {
        setPermission((prevState) => prevState.filter((permission) => permission != selected))
      } else {
        setPermission((prevState) => [...prevState, selected])
      }
    })
  }

  const handleSelectAll = (selectedItems: string[]) => {
    const remove = selectedItems.every((item) => permission.includes(item))
    selectedItems.forEach((selected) => {
      if (remove) {
        setPermission((prevState) => prevState.filter((permission) => permission != selected))
      } else {
        setPermission((prevState) => [...prevState, selected])
      }
    })
  }

  // useEffect(() => {
  //   console.log('permissionDataTable: ', permissionDataTable)
  //   console.log(
  //     'ids: ',
  //     permissionDataTable?.map((item) => item.id)
  //   )
  // }, [permissionDataTable])

  return (
    <>
      <BackIconButton
        onClick={() => {
          dispatch(setRoleAction(true))
        }}
        iconSize={'22px'}
        iconColor={'#1BC5BD'}
        textSize={'20px'}
      />
      <div className='bg-white shadow-md rounded  p-5 mt-5'>
        <div className='flex justify-between'>
          <div>
            <span className='text-gray-800 text-xl font-semibold'>{roleName}</span>
            <Switch
              checked={permissionDataTable
                .map((item) => item.code)
                .some((item) => permission.includes(item))}
              onChange={(e) => handleSelectAll(permissionDataTable.map((item) => item.code))}
              inputProps={{ 'aria-label': 'controlled' }}
              size='medium'
              className='mr-3'
            />
          </div>
          <LoadingButton
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
            onClick={() => saveOnClick()}
            loading={false}
            loadingPosition='center'
          >
            Save
          </LoadingButton>
        </div>

        {roleId === SUPERADMIN_ID && <p>Superadmins are allowed to see all pages regardless of permissions</p>}
        <span className='border-b border-gray-600' />

        {/* dashboard */}
        <MainMenu
          title={
            permissionDataTable.find((item) => item.code === MODULES.DashboardPage.code)?.module ||
            'Dashboard'
          }
          imgSrc='/assets/setup-roles/dashboard.png'
          checked={[
            MODULES.DashboardPage.code,
            MODULES.DashboardViewFeedbackFunc.code,
            MODULES.DashboardCaseTaggingFunc.code,
            MODULES.DashboardArchiveFunc.code,
          ].some((item) => permission.includes(item))}
          onChecked={(e) =>
            handleSelectAll([
              MODULES.DashboardPage.code,
              MODULES.DashboardViewFeedbackFunc.code,
              MODULES.DashboardCaseTaggingFunc.code,
              MODULES.DashboardArchiveFunc.code,
            ])
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.DashboardPage.code)
                    ?.description || 'View Dashboard Page (DB Missing Data)'
                }
                checked={permission.includes(MODULES.DashboardPage.code)}
                onChecked={(e) => handleSelect([MODULES.DashboardPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find(
                    (item) => item.code === MODULES.DashboardViewFeedbackFunc.code
                  )?.description || 'View Feedback Table (DB Missing Data)'
                }
                checked={permission.includes(MODULES.DashboardViewFeedbackFunc.code)}
                onChecked={(e) => handleSelect([MODULES.DashboardViewFeedbackFunc.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find(
                    (item) => item.code === MODULES.DashboardCaseTaggingFunc.code
                  )?.description || 'Tag a case as simple or complex (DB Missing Data)'
                }
                checked={permission.includes(MODULES.DashboardCaseTaggingFunc.code)}
                onChecked={(e) => handleSelect([MODULES.DashboardCaseTaggingFunc.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find(
                    (item) => item.code === MODULES.DashboardArchiveFunc.code
                  )?.description || 'Archive Feedback (DB Missing Data)'
                }
                checked={permission.includes(MODULES.DashboardArchiveFunc.code)}
                onChecked={(e) => handleSelect([MODULES.DashboardArchiveFunc.code])}
              />
            </Grid>
          </Grid>
        </MainMenu>

        {/* Feedback */}
        <MainMenu
          title={
            permissionDataTable.find((item) => item.code === MODULES.FeedbackOverviewPage.code)
              ?.module || 'Feedback'
          }
          imgSrc='/assets/setup-roles/feedback.png'
          checked={[
            MODULES.FeedbackOverviewPage.code,
            MODULES.FeedbackOverviewArchiveFunc.code,
            MODULES.FeedbackOverviewCaseTaggingFunc.code,
            MODULES.FeedbackOverviewEditFeedbackFunc.code,
            MODULES.FeedbackArchivePage.code,
            MODULES.FeedbackInboxPage.code,
            MODULES.FeedbackInboxSendReplyEmailFunc.code,
          ].some((item) => permission.includes(item))}
          onChecked={(e) =>
            handleSelectAll([
              MODULES.FeedbackOverviewPage.code,
              MODULES.FeedbackOverviewArchiveFunc.code,
              MODULES.FeedbackOverviewCaseTaggingFunc.code,
              MODULES.FeedbackOverviewEditFeedbackFunc.code,
              MODULES.FeedbackArchivePage.code,
              MODULES.FeedbackInboxPage.code,
              MODULES.FeedbackInboxSendReplyEmailFunc.code,
            ])
          }
        >
          {/* Feedback overview */}
          <SubMenu
            title={
              permissionDataTable.find((item) => item.code === MODULES.FeedbackOverviewPage.code)
                ?.name || 'Overview (DB Missing Data)'
            }
            checked={[
              MODULES.FeedbackOverviewPage.code,
              MODULES.FeedbackOverviewArchiveFunc.code,
              MODULES.FeedbackOverviewCaseTaggingFunc.code,
              MODULES.FeedbackOverviewEditFeedbackFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.FeedbackOverviewPage.code,
                MODULES.FeedbackOverviewArchiveFunc.code,
                MODULES.FeedbackOverviewCaseTaggingFunc.code,
                MODULES.FeedbackOverviewEditFeedbackFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackOverviewPage.code
                    )?.description || 'View Feedback overview page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackOverviewPage.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackOverviewPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackOverviewEditFeedbackFunc.code
                    )?.description || 'Add or Edit feedback (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackOverviewEditFeedbackFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackOverviewEditFeedbackFunc.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackOverviewCaseTaggingFunc.code
                    )?.description || 'Tag a case as simple or complex (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackOverviewCaseTaggingFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackOverviewCaseTaggingFunc.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackOverviewArchiveFunc.code
                    )?.description || 'Archive Feedback (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackOverviewArchiveFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackOverviewArchiveFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>
          {/* Feedback Archive */}
          <SubMenu
            title='Archive'
            checked={permission.includes(MODULES.FeedbackArchivePage.code)}
            onChecked={(e) => handleSelect([MODULES.FeedbackArchivePage.code])}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackArchivePage.code
                    )?.description || 'View Archived feedback page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackArchivePage.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackArchivePage.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>
          {/* Feedback Inbox */}
          <SubMenu
            title={
              permissionDataTable.find((item) => item.code === MODULES.FeedbackInboxPage.code)
                ?.name || 'Inbox (DB Missing Data)'
            }
            checked={[
              MODULES.FeedbackInboxPage.code,
              MODULES.FeedbackInboxSendReplyEmailFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.FeedbackInboxPage.code,
                MODULES.FeedbackInboxSendReplyEmailFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find((item) => item.code === MODULES.FeedbackInboxPage.code)
                      ?.description || 'View Inbox page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackInboxPage.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackInboxPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.FeedbackInboxSendReplyEmailFunc.code
                    )?.description || 'Send or Reply emails (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.FeedbackInboxSendReplyEmailFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.FeedbackInboxSendReplyEmailFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>
        </MainMenu>

        {/* forms */}
        <MainMenu
          title={
            permissionDataTable.find((item) => item.code === MODULES.FormsPage.code)?.module ||
            'Forms'
          }
          imgSrc='/assets/setup-roles/forms.png'
          checked={[
            MODULES.FormsPage.code,
            MODULES.FormsEditFunc.code,
            MODULES.FormsDeleteFunc.code,
          ].some((item) => permission.includes(item))}
          onChecked={(e) =>
            handleSelectAll([
              MODULES.FormsPage.code,
              MODULES.FormsEditFunc.code,
              MODULES.FormsDeleteFunc.code,
            ])
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.FormsPage.code)
                    ?.description || 'View Forms Page (DB Missing Data)'
                }
                checked={permission.includes(MODULES.FormsPage.code)}
                onChecked={(e) => handleSelect([MODULES.FormsPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.FormsEditFunc.code)
                    ?.description || 'Add or Edit forms (DB Missing Data)'
                }
                checked={permission.includes(MODULES.FormsEditFunc.code)}
                onChecked={(e) => handleSelect([MODULES.FormsEditFunc.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.FormsDeleteFunc.code)
                    ?.description || 'Delete Forms (DB Missing Data)'
                }
                checked={permission.includes(MODULES.FormsDeleteFunc.code)}
                onChecked={(e) => handleSelect([MODULES.FormsDeleteFunc.code])}
              />
            </Grid>
          </Grid>
        </MainMenu>

        {/* Setup */}
        <MainMenu
          title={
            permissionDataTable.find((item) => item.code === MODULES.SetupUsersPage.code)?.module ||
            'Setup (DB Missing)'
          }
          imgSrc='/assets/setup-roles/setup.png'
          checked={[
            MODULES.SetupUsersPage.code,
            MODULES.SetupUsersEditFunc.code,
            MODULES.SetupUsersDeleteFunc.code,

            MODULES.SetupRolesAndModulesPage.code,
            MODULES.SetupRolesAndModulesEditFunc.code,

            MODULES.SetupLocationPage.code,
            MODULES.SetupLocationEditFunc.code,
            MODULES.SetupLocationDeleteFunc.code,

            MODULES.SetupCategoriesPage.code,
            MODULES.SetupCategoriesEditFunc.code,
            MODULES.SetupCategoriesDeleteFunc.code,
          ].some((item) => permission.includes(item))}
          onChecked={(e) =>
            handleSelectAll([
              MODULES.SetupUsersPage.code,
              MODULES.SetupUsersEditFunc.code,
              MODULES.SetupUsersDeleteFunc.code,

              MODULES.SetupRolesAndModulesPage.code,
              MODULES.SetupRolesAndModulesEditFunc.code,

              MODULES.SetupLocationPage.code,
              MODULES.SetupLocationEditFunc.code,
              MODULES.SetupLocationDeleteFunc.code,

              MODULES.SetupCategoriesPage.code,
              MODULES.SetupCategoriesEditFunc.code,
              MODULES.SetupCategoriesDeleteFunc.code,
            ])
          }
        >
          {/* Setup users */}
          <SubMenu
            title={
              permissionDataTable.find((item) => item.code === MODULES.SetupUsersPage.code)?.name ||
              'Users (DB Missing Data)'
            }
            checked={[
              MODULES.SetupUsersPage.code,
              MODULES.SetupUsersEditFunc.code,
              MODULES.SetupUsersDeleteFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.SetupUsersPage.code,
                MODULES.SetupUsersEditFunc.code,
                MODULES.SetupUsersDeleteFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find((item) => item.code === MODULES.SetupUsersPage.code)
                      ?.description || 'View users page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupUsersPage.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupUsersPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupUsersEditFunc.code
                    )?.description || 'Add or Edit users (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupUsersEditFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupUsersEditFunc.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupUsersDeleteFunc.code
                    )?.description || 'Delete users (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupUsersDeleteFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupUsersDeleteFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>

          {/* Setup roles and modules */}
          <SubMenu
            title={
              permissionDataTable.find(
                (item) => item.code === MODULES.SetupRolesAndModulesPage.code
              )?.name || 'Roles and Modules (DB Missing Data)'
            }
            checked={[
              MODULES.SetupRolesAndModulesPage.code,
              MODULES.SetupRolesAndModulesEditFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.SetupRolesAndModulesPage.code,
                MODULES.SetupRolesAndModulesEditFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupRolesAndModulesPage.code
                    )?.description || 'View roles and modules page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupRolesAndModulesPage.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupRolesAndModulesPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupRolesAndModulesEditFunc.code
                    )?.description || 'Add or Edit roles and modules (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupRolesAndModulesEditFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupRolesAndModulesEditFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>

          {/* Setup location data */}
          <SubMenu
            title={
              permissionDataTable.find((item) => item.code === MODULES.SetupLocationPage.code)
                ?.name || 'Location data (DB Missing Data)'
            }
            checked={[
              MODULES.SetupLocationPage.code,
              MODULES.SetupLocationEditFunc.code,
              MODULES.SetupLocationDeleteFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.SetupLocationPage.code,
                MODULES.SetupLocationEditFunc.code,
                MODULES.SetupLocationDeleteFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find((item) => item.code === MODULES.SetupLocationPage.code)
                      ?.description || 'View  locations, areas and departments (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupLocationPage.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupLocationPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupLocationEditFunc.code
                    )?.description ||
                    'Add or Edit locations, areas and departments (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupLocationEditFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupLocationEditFunc.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupLocationDeleteFunc.code
                    )?.description || 'Delete location data (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupLocationDeleteFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupLocationDeleteFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>

          {/* Setup categories */}
          <SubMenu
            title={
              permissionDataTable.find((item) => item.code === MODULES.SetupCategoriesPage.code)
                ?.name || 'Categories (DB Missing Data)'
            }
            checked={[
              MODULES.SetupCategoriesPage.code,
              MODULES.SetupCategoriesEditFunc.code,
              MODULES.SetupCategoriesDeleteFunc.code,
            ].some((item) => permission.includes(item))}
            onChecked={(e) =>
              handleSelectAll([
                MODULES.SetupCategoriesPage.code,
                MODULES.SetupCategoriesEditFunc.code,
                MODULES.SetupCategoriesDeleteFunc.code,
              ])
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupCategoriesPage.code
                    )?.description || 'View categories page (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupCategoriesPage.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupCategoriesPage.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupCategoriesEditFunc.code
                    )?.description || 'Add or Edit categories (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupCategoriesEditFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupCategoriesEditFunc.code])}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PermissionCard
                  title={
                    permissionDataTable.find(
                      (item) => item.code === MODULES.SetupCategoriesDeleteFunc.code
                    )?.description || 'Delete categories (DB Missing Data)'
                  }
                  checked={permission.includes(MODULES.SetupCategoriesDeleteFunc.code)}
                  onChecked={(e) => handleSelect([MODULES.SetupCategoriesDeleteFunc.code])}
                />
              </Grid>
            </Grid>
          </SubMenu>
        </MainMenu>

        {/* Reports */}
        <MainMenu
          title={
            permissionDataTable.find((item) => item.code === MODULES.ReportsOverviewPage.code)
              ?.module || 'Reports (DB Missing Data)'
          }
          imgSrc='/assets/setup-roles/reports.png'
          checked={[
            MODULES.ReportsOverviewPage.code,
            MODULES.ReportsTatPage.code,
            MODULES.ReportsSummaryPage.code,
            MODULES.ReportsFeedbackLogPage.code,
            MODULES.ReportsDataUsagePage.code,
          ].some((item) => permission.includes(item))}
          onChecked={(e) =>
            handleSelectAll([
              MODULES.ReportsOverviewPage.code,
              MODULES.ReportsTatPage.code,
              MODULES.ReportsSummaryPage.code,
              MODULES.ReportsFeedbackLogPage.code,
              MODULES.ReportsDataUsagePage.code,
            ])
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.ReportsOverviewPage.code)
                    ?.description || 'View and download reports overview (DB Missing Data)'
                }
                checked={permission.includes(MODULES.ReportsOverviewPage.code)}
                onChecked={(e) => handleSelect([MODULES.ReportsOverviewPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.ReportsTatPage.code)
                    ?.description || 'Download Turn around Time (TAT) report (DB Missing Data)'
                }
                checked={permission.includes(MODULES.ReportsTatPage.code)}
                onChecked={(e) => handleSelect([MODULES.ReportsTatPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === MODULES.ReportsSummaryPage.code)
                    ?.description || 'Download Feedback Summary report (DB Missing Data)'
                }
                checked={permission.includes(MODULES.ReportsSummaryPage.code)}
                onChecked={(e) => handleSelect([MODULES.ReportsSummaryPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find(
                    (item) => item.code === MODULES.ReportsFeedbackLogPage.code
                  )?.description || 'Download Feedback Log (DB Missing Data)'
                }
                checked={permission.includes(MODULES.ReportsFeedbackLogPage.code)}
                onChecked={(e) => handleSelect([MODULES.ReportsFeedbackLogPage.code])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PermissionCard
                title={
                  permissionDataTable.find(
                    (item) => item.code === MODULES.ReportsDataUsagePage.code
                  )?.description || 'View data usage (DB Missing Data)'
                }
                checked={permission.includes(MODULES.ReportsDataUsagePage.code)}
                onChecked={(e) => handleSelect([MODULES.ReportsDataUsagePage.code])}
              />
            </Grid>
          </Grid>
        </MainMenu>
      </div>
    </>
  )
}

export default PermissionTable
