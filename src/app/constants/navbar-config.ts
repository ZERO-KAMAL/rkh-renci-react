import { MODULES } from './module-permission'
import NAVIGATE_LINKS from './router-links'

export const NO_RESTRICTIONS = 'NO_RESTRICTIONS'

export const LINKS = [
  {
    name: 'Dashboard',
    link: NAVIGATE_LINKS.DASHBOARD.ROOT_PATH,
    submenu: false,
    sublink: [],
    code: [MODULES.DashboardPage.code],
  },
  {
    name: 'Feedback',
    link: '/',
    submenu: true,
    code: [
      MODULES.FeedbackOverviewPage.code,
      MODULES.FeedbackInboxPage.code,
      MODULES.FeedbackArchivePage.code,
    ],
    sublink: [
      {
        name: 'Overview',
        code: [MODULES.FeedbackOverviewPage.code],
        link: NAVIGATE_LINKS.FEEDBACK.OVERVIEW,
        altLinks: [NAVIGATE_LINKS.FEEDBACK.DETAIL],
      },
      {
        name: 'Inbox',
        code: [MODULES.FeedbackInboxPage.code],
        link: NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL,
        altLinks: [NAVIGATE_LINKS.FEEDBACK.SENT_EMAIL],
      },
      {
        name: 'Archive',
        code: [MODULES.FeedbackArchivePage.code],
        link: NAVIGATE_LINKS.FEEDBACK.ARCHIVE,
      },
    ],
  },
  {
    name: 'Forms',
    link: '/',
    submenu: false,
    code: [MODULES.FormsPage.code],
    sublink: [
      { name: 'Overview', code: [MODULES.FormsPage.code], link: NAVIGATE_LINKS.FORMS.OVERVIEW },
      { name: 'Create', code: [MODULES.FormsEditFunc.code], link: NAVIGATE_LINKS.FORMS.CREATE },
      // { name: 'Edit', code: [MODULES.FormsEditFunc.code], link: NAVIGATE_LINKS.FORMS.EDIT },
    ],
  },
  {
    name: 'Setup',
    link: '/',
    submenu: true,
    code: [
      MODULES.SetupUsersPage.code,
      MODULES.SetupRolesAndModulesPage.code,
      MODULES.SetupLocationPage.code,
      MODULES.SetupCategoriesPage.code,
    ],
    sublink: [
      {
        name: 'Users',
        code: [MODULES.SetupUsersPage.code],
        link: NAVIGATE_LINKS.SETUP.USERS,
      },
      {
        name: 'Roles and Modules',
        code: [MODULES.SetupRolesAndModulesPage.code],
        link: NAVIGATE_LINKS.SETUP.ROLES_AND_MODULES,
      },
      {
        name: 'Location Data',
        code: [MODULES.SetupLocationPage.code],
        link: NAVIGATE_LINKS.SETUP.LOCATION,
      },
      {
        name: 'Categories',
        code: [MODULES.SetupCategoriesPage.code],
        link: NAVIGATE_LINKS.SETUP.FEEDBACK_CATEGORIES,
      },
    ],
  },
  {
    name: 'Reports',
    link: '/',
    submenu: true,
    code: [
      MODULES.ReportsOverviewPage.code,
      MODULES.ReportsTatPage.code,
      MODULES.ReportsSummaryPage.code,
      MODULES.ReportsFeedbackLogPage.code,
      MODULES.ReportsDataUsagePage.code,
    ],
    sublink: [
      {
        name: 'Overview',
        code: [MODULES.ReportsOverviewPage.code],
        link: NAVIGATE_LINKS.REPORTS.OVERVIEW,
      },
      {
        name: 'Turn around Time (TAT)',
        code: [MODULES.ReportsTatPage.code],
        link: NAVIGATE_LINKS.REPORTS.TAT,
      },
      {
        name: 'Feedback Summary',
        code: [MODULES.ReportsSummaryPage.code],
        link: NAVIGATE_LINKS.REPORTS.SUMMARY,
      },
      {
        name: 'Feedback Logs',
        code: [MODULES.ReportsFeedbackLogPage.code],
        link: NAVIGATE_LINKS.REPORTS.LOGS,
      },
      {
        name: 'Data Usage',
        code: [MODULES.ReportsDataUsagePage.code],
        link: NAVIGATE_LINKS.REPORTS.DATA_USAGE,
      },
    ],
  },
]
