// This constants file must match API from
// {{ApiUrl}}permissions/:page/:limit/:sortBy/:sortDir?text=
// module-permission.json contains the data loaded to DB

export const SUPERADMIN_ID = 1

export const MODULES = {
  DashboardPage: {
    code: 'dashboard - view dashboard page',
  },
  DashboardViewFeedbackFunc: {
    code: 'dashboard - view feedback table',
  },
  DashboardCaseTaggingFunc: {
    code: 'dashboard - case tagging',
  },
  DashboardArchiveFunc: {
    code: 'dashboard - archive feedback',
  },
  FeedbackOverviewPage: {
    code: 'feedback (overview) - view',
  },
  FeedbackOverviewCaseTaggingFunc: {
    code: 'feedback (overview) - case tagging',
  },
  FeedbackOverviewArchiveFunc: {
    code: 'feedback (overview) - archive feedback',
  },
  FeedbackOverviewEditFeedbackFunc: {
    code: 'feedback (overview) - edit',
  },
  FeedbackArchivePage: {
    code: 'feedback (archive) - view',
  },
  FeedbackInboxPage: {
    code: 'feedback (inbox) - view',
  },
  FeedbackInboxSendReplyEmailFunc: {
    code: 'feedback (inbox) - edit',
  },
  FormsPage: {
    code: 'forms - view',
  },
  FormsEditFunc: {
    code: 'forms - edit',
  },
  FormsDeleteFunc: {
    code: 'forms - delete',
  },
  ReportsOverviewPage: {
    code: 'reports (overview)',
  },
  ReportsTatPage: {
    code: 'reports (turn around time)',
  },
  ReportsSummaryPage: {
    code: 'reports (feedback summary)',
  },
  ReportsFeedbackLogPage: {
    code: 'reports (feedback log)',
  },
  ReportsDataUsagePage: {
    code: 'reports (data usage)',
  },
  SetupCategoriesPage: {
    code: 'setup (categories) - view',
  },
  SetupCategoriesEditFunc: {
    code: 'setup (categories) - edit',
  },
  SetupCategoriesDeleteFunc: {
    code: 'setup (categories) - delete',
  },
  SetupLocationPage: {
    code: 'setup (location data) - view',
  },
  SetupLocationEditFunc: {
    code: 'setup (location data) - edit',
  },
  SetupLocationDeleteFunc: {
    code: 'setup (location data) - delete',
  },
  SetupRolesAndModulesPage: {
    code: 'setup (roles and modules) - view',
  },
  SetupRolesAndModulesEditFunc: {
    code: 'setup (roles and modules) - edit',
  },
  SetupUsersPage: {
    code: 'setup (users) - view',
  },
  SetupUsersEditFunc: {
    code: 'setup (users) - edit',
  },
  SetupUsersDeleteFunc: {
    code: 'setup (users) - delete',
  },
}
