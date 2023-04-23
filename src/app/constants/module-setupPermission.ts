import { MODULES } from './module-permission'

// This file is used for UI map iteration in Setup - Roles and moudules
// The objective is to be able to control the order of the items 
// in case we need to decide which items come first in UI

export type Permissions = Permission[]

export interface Permission {
  module: string
  items: any[]
  subModule: SubModule[]
}

export interface SubModule {
  name: string
  items: any[]
}

export const PERMISSIONS: Permissions = [
  {
    module: 'Dashboard',
    items: [
      MODULES.DashboardPage.code,
      MODULES.DashboardViewFeedbackFunc.code,
      MODULES.DashboardCaseTaggingFunc.code,
      MODULES.DashboardArchiveFunc.code,
    ],
    subModule: [],
  },
  {
    module: 'Feedback',
    items: [],
    subModule: [
      {
        name: 'Overview',
        items: [
          MODULES.FeedbackOverviewPage.code,
          MODULES.FeedbackOverviewCaseTaggingFunc.code,
          MODULES.FeedbackOverviewArchiveFunc.code,
          MODULES.FeedbackOverviewEditFeedbackFunc.code,
        ],
      },
      {
        name: 'Archive',
        items: [MODULES.FeedbackArchivePage.code],
      },
      {
        name: 'Inbox',
        items: [MODULES.FeedbackInboxPage.code, MODULES.FeedbackInboxSendReplyEmailFunc.code],
      },
    ],
  },
  {
    module: 'Forms',
    items: [MODULES.FormsPage.code, MODULES.FormsEditFunc.code, MODULES.FormsDeleteFunc.code],
    subModule: [],
  },
  {
    module: 'Setup',
    items: [],
    subModule: [
      {
        name: 'Users',
        items: [
          MODULES.SetupUsersPage.code,
          MODULES.SetupUsersEditFunc.code,
          MODULES.SetupUsersDeleteFunc.code,
        ],
      },
      {
        name: 'Roles and Modules',
        items: [MODULES.SetupRolesAndModulesPage.code, MODULES.SetupRolesAndModulesEditFunc.code],
      },
      {
        name: 'Location Data',
        items: [
          MODULES.SetupLocationPage.code,
          MODULES.SetupLocationEditFunc.code,
          MODULES.SetupLocationDeleteFunc.code,
        ],
      },
      {
        name: 'Categories',
        items: [
          MODULES.SetupCategoriesPage.code,
          MODULES.SetupCategoriesEditFunc.code,
          MODULES.SetupCategoriesDeleteFunc.code,
        ],
      },
    ],
  },
  {
    module: 'Reports',
    items: [
      MODULES.ReportsOverviewPage.code,
      MODULES.ReportsTatPage.code,
      MODULES.ReportsSummaryPage.code,
      MODULES.ReportsFeedbackLogPage.code,
      MODULES.ReportsDataUsagePage.code,
    ],
    subModule: [],
  },
]
