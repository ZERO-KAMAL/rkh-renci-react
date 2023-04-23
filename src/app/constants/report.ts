export const ReportData = [
  {
    text: 'All available data',
  },
  {
    text: 'Number and percentage of cases based on case status',
    subText: 'number and percentage breakdown of pending, active, unresolved and closed cases',
  },
  {
    text: 'Number and percentage of cases based on feedback type',
    subText: 'number and percentage breakdown of complaints, compliments, suggestions and appeals',
  },
  {
    text: 'Time taken to close a case',
    subText: 'Time taken for a case to go from pending response to closed',
  },
]

export const ReportTypes = [
  'Appeals/MP letters',
  // 'Appreciations',
  'Complaints',
  'Compliments',
  'Suggestions',
]

export const ReportTatTypes = [
  {
    reportType: 'Appeals/MP letters',
    category: [
      {
        frontendLabel: 'Display Turn Around Time (TAT)',
        frontendSubLabel: 'Less Than / Equal 7 Days and More Than / Equal 7 Days',
        backendCode: 'Appeals/MP letters'
      }
    ]
  },
  {
    reportType: 'Complaints',
    category: [
      {
        frontendLabel: 'Overall Complaints',
        frontendSubLabel: 'Complex (28 Days) vs Simple (7 Days)',
        backendCode: 'Overall Complaints'
      },
      {
        frontendLabel: 'Complex Complaints by Category',
        frontendSubLabel: '',
        backendCode: 'Complex Complaints by Category'
      },
      {
        frontendLabel: 'Simple Complaints by Category',
        frontendSubLabel: '',
        backendCode: 'Simple Complaints By Category'
      }
    ]
  }
]

export const ReportTypesColor: any = {
  'Appeals/MP letters': '#8950FC',
  'Appreciations': '#3699FF',
  'Complaints': '#F64E60',
  'Compliments': '#0BB783',
  'Suggestions': '#FFA621',
}

// backend values
export const DAILY = 'daily'
export const WEEKLY = 'weekly'
export const MONTHLY = 'monthly'
export const YEARLY = 'yearly'

export const TimeFrames = [DAILY, WEEKLY, MONTHLY, YEARLY]
// export const ReportFormat = ['pdf', 'excel']
export const ReportFormat = ['excel']
