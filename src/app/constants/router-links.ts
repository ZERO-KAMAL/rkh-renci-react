const NAVIGATE_LINKS = {
  AUTH: {
    ROOT_PATH: '/*',
    LOGIN: '/login',
    FORGET_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    LOGOUT: '/logout',
  },
  DASHBOARD: {
    ROOT_PATH: '/dashboard',
    NOTIFICATIONS: '/notifications',
  },
  FEEDBACK: {
    ROOT_PATH: '/feedback/*',
    OVERVIEW: '/feedback/overview',
    INBOX: '/feedback/inbox',
    INBOX_EMAIL: '/feedback/inbox/email',
    INBOX_EMAIL_LABEL: '/feedback/inbox/label/:labelId',
    INBOX_EMAIL_DETAIL: '/feedback/inbox/emaildetail/:emailId/:feedbackId',
    STARRED_EMAIL: '/feedback/inbox/starred',
    SENT_EMAIL: '/feedback/inbox/sent',
    LABEL_SETTING: '/feedback/inbox/labelsetting',
    ARCHIVE: '/feedback/archive',
    FORM_VIEW: '/feedback/formview/:feedbackFormCode',
    DETAIL: '/feedback/detail/:feedbackId',
    DRAFT: '/feedback/inbox/draft',
    JUNK: '/feedback/inbox/junk',
    ARCHIVE_EMAIL: '/feedback/inbox/archive'
  },
  FORMS: {
    ROOT_PATH: '/forms/*',
    OVERVIEW: '/forms/overview',
    CREATE: '/forms/create',
    EDIT: '/forms/edit/:formId',
  },
  SETUP: {
    ROOT_PATH: '/setup/*',
    ROLES_AND_MODULES: '/setup/roles',
    LOCATION: '/setup/location',
    LOCATION_LOC: '/setup/location/loc',
    LOCATION_AREA: '/setup/location/area',
    LOCATION_DEPT: '/setup/location/dept',
    USERS: '/setup/users',
    FEEDBACK_CATEGORIES: '/setup/feedback-categories',
  },
  UserDetails: {
    ROOT_PATH: '/user-profile/*',
  },
  REPORTS: {
    ROOT_PATH: '/reports/*',
    OVERVIEW: '/reports/overview',
    TAT: '/reports/tat',
    SUMMARY: '/reports/summary',
    LOGS: '/reports/logs',
    DATA_USAGE: '/reports/usage',
  },
  ERRORS: {
    ROOT_PATH: '/error/*',
    ERROR403: '/error/403',
    ERROR404: '/error/404',
    ERROR500: '/error/500',
  },
}

export default NAVIGATE_LINKS
