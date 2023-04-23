import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import FeedbackInbox from 'app/modules/feedback/FeedbackInbox'
import FeedbackEmailDetail from 'app/modules/feedback/form/FeedbackEmailDetail'
import FeedbackDraft from 'app/modules/feedback/table/FeedbackDraft'
import FeedbackEmailArchive from 'app/modules/feedback/table/FeedbackEmailArchive'
import FeedbackEmailLabelSetting from 'app/modules/feedback/table/FeedbackEmailLabelSetting'
import FeedbackInboxEmail from 'app/modules/feedback/table/FeedbackInboxEmail'
import FeedbackInboxEmailLabel from 'app/modules/feedback/table/FeedbackInboxEmailLabel'
import FeedbackJunk from 'app/modules/feedback/table/FeedbackJunk'
import FeedbackSent from 'app/modules/feedback/table/FeedbackSent'
import FeedbackStarred from 'app/modules/feedback/table/FeedbackStarred'
import {
  ArchiveWrapper,
  CreateFormWrapper,
  DashboardWrapper,
  EditFormWrapper,
  FormWrapper,
  InboxWrapper,
  LocationAreaWrapper,
  LocationDeptWrapper,
  LocationLocWrapper,
  LocationWrapper,
  LogoutWrapper,
  NotificationWrapper,
  OverviewWrapper,
  RoleWrapper,
  UserDetailsWrapper,
  UserWrapper,
} from 'app/pages'
import ErrorLayout from 'app/pages/errors/ErrorLayout'
import Error403 from 'app/pages/errors/components/Error403'
import Error404 from 'app/pages/errors/components/Error404'
import Error500 from 'app/pages/errors/components/Error500'
import DetailWrapper from 'app/pages/feedback/DetailWrapper'
import ReportDataUsageWrapper from 'app/pages/reports/ReportDataUsageWrapper'
import ReportLogsWrapper from 'app/pages/reports/ReportLogsWrapper'
import ReportOverviewWrapper from 'app/pages/reports/ReportOverviewWrapper'
import ReportSummaryWrapper from 'app/pages/reports/ReportSummaryWrapper'
import ReportTATWrapper from 'app/pages/reports/ReportTATWrapper'
import FeedbackWrapper from 'app/pages/setup/FeedbackWrapper'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import DashboardMasterLayout from '../layout/DashboardMasterLayout'
import RequireAuth from './RequireAuth'

const PrivateRoute: FC = () => {
  const defaultRoute = useAppSelector((state) => state.app.defaultRoute)
  const location = useLocation()
  const { state: locationState } = useLocation()
  const publicUrls = Object.values(NAVIGATE_LINKS.AUTH)
    .concat(Object.values(NAVIGATE_LINKS.ERRORS))
    .concat(NAVIGATE_LINKS.FEEDBACK.FORM_VIEW.split(':')[0])

  return (
    <>
      <Routes>
        <Route element={<DashboardMasterLayout />}>
          {/* default route: If unspecified, navigate to dashboard */}
          <Route index element={<Navigate to={defaultRoute} replace={true} />} />

          {/* default route: If you came from login page auth */}
          {locationState?.from?.pathname &&
          !publicUrls.some((substr) => locationState?.from?.pathname.startsWith(substr)) ? (
            // navigate to previous URL
            <Route
              path={NAVIGATE_LINKS.AUTH.ROOT_PATH}
              element={
                <Navigate
                  to={`${locationState.from.pathname}${locationState.from.search}`}
                  replace={true}
                />
              }
            />
          ) : (
            // navigate to dashboard
            <Route
              path={NAVIGATE_LINKS.AUTH.ROOT_PATH}
              element={<Navigate to={defaultRoute} replace={true} />}
            />
          )}

          {/* Register all private urls with Role Guards below */}
          {/* Dashboard Module */}
          <Route
            path={NAVIGATE_LINKS.DASHBOARD.ROOT_PATH}
            element={
              <RequireAuth
                allowedModules={[MODULES.DashboardPage]}
                component={<DashboardWrapper />}
              />
            }
          />
          {/* FeedbackArchive Module */}
          <Route
            path={NAVIGATE_LINKS.FEEDBACK.ARCHIVE}
            element={
              <RequireAuth
                allowedModules={[MODULES.FeedbackArchivePage]}
                component={<ArchiveWrapper />}
              />
            }
          />
          {/* FeedbackInbox Module */}
          <Route
            path={NAVIGATE_LINKS.FEEDBACK.INBOX}
            element={
              <RequireAuth
                allowedModules={[MODULES.FeedbackInboxPage]}
                component={<InboxWrapper />}
              />
            }
          />
          <Route
            element={
              <RequireAuth
                allowedModules={[MODULES.FeedbackInboxPage]}
                component={<FeedbackInbox />}
              />
            }
          >
            <Route path={NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL} element={<FeedbackInboxEmail />} />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL_DETAIL}
              element={<FeedbackEmailDetail />}
            />

            <Route path={NAVIGATE_LINKS.FEEDBACK.STARRED_EMAIL} element={<FeedbackStarred />} />
            <Route path={NAVIGATE_LINKS.FEEDBACK.SENT_EMAIL} element={<FeedbackSent />} />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.ARCHIVE_EMAIL}
              element={<FeedbackEmailArchive />}
            />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.LABEL_SETTING}
              element={<FeedbackEmailLabelSetting />}
            />
          </Route>
          {/* Feedback Overview Module */}
          <Route
            path={NAVIGATE_LINKS.FEEDBACK.OVERVIEW}
            element={
              <RequireAuth
                allowedModules={[MODULES.FeedbackOverviewPage]}
                component={<OverviewWrapper />}
              />
            }
          />
          {/* Forms Module */}
          <Route
            path={NAVIGATE_LINKS.FORMS.OVERVIEW}
            element={
              <RequireAuth allowedModules={[MODULES.FormsPage]} component={<FormWrapper />} />
            }
          />
          <Route
            path={NAVIGATE_LINKS.FORMS.CREATE}
            element={
              <RequireAuth
                allowedModules={[MODULES.FormsEditFunc]}
                component={<CreateFormWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.FORMS.EDIT}
            element={
              <RequireAuth
                allowedModules={[MODULES.FormsEditFunc]}
                component={<EditFormWrapper />}
              />
            }
          />
          {/* Setup - users module */}
          <Route
            path={NAVIGATE_LINKS.SETUP.USERS}
            element={
              <RequireAuth allowedModules={[MODULES.SetupUsersPage]} component={<UserWrapper />} />
            }
          />
          {/* Setup - locations module */}
          <Route
            path={NAVIGATE_LINKS.SETUP.LOCATION}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupLocationPage]}
                component={<LocationWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.SETUP.LOCATION_LOC}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupLocationPage]}
                component={<LocationLocWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.SETUP.LOCATION_DEPT}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupLocationPage]}
                component={<LocationDeptWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.SETUP.LOCATION_AREA}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupLocationPage]}
                component={<LocationAreaWrapper />}
              />
            }
          />
          {/* Setup - roles module */}
          <Route
            path={NAVIGATE_LINKS.SETUP.ROLES_AND_MODULES}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupRolesAndModulesPage]}
                component={<RoleWrapper />}
              />
            }
          />
          {/* Setup - Feedback module */}
          <Route
            path={NAVIGATE_LINKS.SETUP.FEEDBACK_CATEGORIES}
            element={
              <RequireAuth
                allowedModules={[MODULES.SetupCategoriesPage]}
                component={<FeedbackWrapper />}
              />
            }
          />
          {/* Report module */}
          <Route
            path={NAVIGATE_LINKS.REPORTS.OVERVIEW}
            element={
              <RequireAuth
                allowedModules={[MODULES.ReportsOverviewPage]}
                component={<ReportOverviewWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.REPORTS.DATA_USAGE}
            element={
              <RequireAuth
                allowedModules={[MODULES.ReportsDataUsagePage]}
                component={<ReportDataUsageWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.REPORTS.TAT}
            element={
              <RequireAuth
                allowedModules={[MODULES.ReportsTatPage]}
                component={<ReportTATWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.REPORTS.SUMMARY}
            element={
              <RequireAuth
                allowedModules={[MODULES.ReportsSummaryPage]}
                component={<ReportSummaryWrapper />}
              />
            }
          />
          <Route
            path={NAVIGATE_LINKS.REPORTS.LOGS}
            element={
              <RequireAuth
                allowedModules={[MODULES.ReportsFeedbackLogPage]}
                component={<ReportLogsWrapper />}
              />
            }
          />
          {/* Register all private urls below without role restrictions */}
          <Route path={NAVIGATE_LINKS.DASHBOARD.NOTIFICATIONS} element={<NotificationWrapper />} />
          <Route path={NAVIGATE_LINKS.UserDetails.ROOT_PATH} element={<UserDetailsWrapper />} />
          <Route path={NAVIGATE_LINKS.AUTH.LOGOUT} element={<LogoutWrapper />} />

          <Route element={<ErrorLayout />}>
            <Route path={NAVIGATE_LINKS.ERRORS.ERROR403} element={<Error403 />} />
            <Route path={NAVIGATE_LINKS.ERRORS.ERROR404} element={<Error404 />} />
            <Route path={NAVIGATE_LINKS.ERRORS.ERROR500} element={<Error500 />} />
          </Route>
          <Route path={NAVIGATE_LINKS.FEEDBACK.ARCHIVE} element={<ArchiveWrapper />} />
          <Route path={NAVIGATE_LINKS.FEEDBACK.INBOX} element={<InboxWrapper />} />
          <Route element={<FeedbackInbox />}>
            <Route path={NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL} element={<FeedbackInboxEmail />} />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL_LABEL}
              element={<FeedbackInboxEmailLabel />}
            />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL_DETAIL}
              element={<FeedbackEmailDetail />}
            />
            <Route path={NAVIGATE_LINKS.FEEDBACK.STARRED_EMAIL} element={<FeedbackStarred />} />
            <Route path={NAVIGATE_LINKS.FEEDBACK.SENT_EMAIL} element={<FeedbackSent />} />
            <Route path={NAVIGATE_LINKS.FEEDBACK.DRAFT} element={<FeedbackDraft />} />
            <Route path={NAVIGATE_LINKS.FEEDBACK.JUNK} element={<FeedbackJunk />} />
            <Route
              path={NAVIGATE_LINKS.FEEDBACK.LABEL_SETTING}
              element={<FeedbackEmailLabelSetting />}
            />
          </Route>
          <Route path={NAVIGATE_LINKS.FEEDBACK.OVERVIEW} element={<OverviewWrapper />} />
          <Route path={NAVIGATE_LINKS.FORMS.OVERVIEW} element={<FormWrapper />} />
          <Route path={NAVIGATE_LINKS.FORMS.CREATE} element={<CreateFormWrapper />} />
          <Route path={NAVIGATE_LINKS.FORMS.EDIT} element={<EditFormWrapper />} />
          <Route path={NAVIGATE_LINKS.SETUP.USERS} element={<UserWrapper />} />
          <Route path={NAVIGATE_LINKS.SETUP.LOCATION} element={<LocationWrapper />} />
          <Route path={NAVIGATE_LINKS.SETUP.ROLES_AND_MODULES} element={<RoleWrapper />} />
          <Route path={NAVIGATE_LINKS.AUTH.LOGOUT} element={<LogoutWrapper />} />

          <Route path={NAVIGATE_LINKS.FEEDBACK.DETAIL} element={<DetailWrapper />} />

          {/* 404 not found */}
          <Route
            path='*'
            element={
              <Navigate
                to={NAVIGATE_LINKS.ERRORS.ERROR404}
                replace={true}
                state={{ from: location }}
              />
            }
          />
        </Route>
      </Routes>
    </>
  )
}

export { PrivateRoute }
