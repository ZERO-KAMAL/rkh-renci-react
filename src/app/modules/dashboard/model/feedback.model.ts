import { DropdownOptions } from 'app/common/MultipleSelect3'
import { SortingType } from 'app/http/locations/location.model'

export interface FeedbackModel {
  name: string
  value: number
  color: string
  label: string
}

export interface SimpleAreaChart {
  data: SimpleAreaChartData[]
  count: number
  previousCount: number
}

export interface SimpleAreaChartData {
  submitDateTime: string
  status: string
  count: number
}

export type MultipleArea = MultipleAreaData[]

export interface MultipleAreaData {
  status: string
  submittedDate: string
  'Complaints': string
  'Compliments': string
  'Suggestions': string
  'Appeals/MP letters': string
  'Appreciations': string
}

export const multipleAreaChartDummyData = [
  {
    status: 'New Case',
    submittedDate: '2022-10-22T16:00:00.000Z',
    complaints: '2',
    compliments: '10',
    suggestions: '3',
    appeals: '4',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-23T16:00:00.000Z',
    complaints: '2',
    compliments: '10',
    suggestions: '3',
    appeals: '4',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-24T16:00:00.000Z',
    complaints: '1',
    compliments: '6',
    suggestions: '11',
    appeals: '24',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-25T16:00:00.000Z',
    complaints: '7',
    compliments: '4',
    suggestions: '6',
    appeals: '0',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-26T16:00:00.000Z',
    complaints: '9',
    compliments: '6',
    suggestions: '3',
    appeals: '14',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-27T16:00:00.000Z',
    complaints: '3',
    compliments: '15',
    suggestions: '7',
    appeals: '9',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-28T16:00:00.000Z',
    complaints: '8',
    compliments: '8',
    suggestions: '7',
    appeals: '9',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-29T16:00:00.000Z',
    complaints: '5',
    compliments: '6',
    suggestions: '10',
    appeals: '10',
  },
  {
    status: 'New Case',
    submittedDate: '2022-10-30T16:00:00.000Z',
    complaints: '3',
    compliments: '6',
    suggestions: '12',
    appeals: '2',
  },
]
 
export interface ILocation {
  locationId: number,
  locationName: string,
  area: IArea[]
}

export interface IArea {
  areaId: number,
  areaName: string,
  department: IDepartment[]
}

export interface IDepartment {
  departmentId: number,
  departmentName: string,
}

const LocationData: DropdownOptions[] = [
  {
    id: 15,
    label: 'Ren Ci @ Ang Mo Kio',
  },
  {
    id: 16,
    label: 'Ren Ci @ Bukit Batok',
  },
  {
    id: 17,
    label: 'Ren Ci @ Novena',
  },
]

const AreaData: DropdownOptions[] = [
  {
    id: 31,
    label: 'HH10A',
  },
  {
    id: 32,
    label: 'HH10B',
  },
  {
    id: 33,
    label: 'HH10C',
  },
]

const DeptData: DropdownOptions[] = [
  {
    id: 41,
    label: 'Chief Nurse Office',
  },
  {
    id: 52,
    label: 'Clinical Operations',
  },
  {
    id: 63,
    label: 'Business Office',
  },
]

export const defLocationDetailsApi = {
  page: 1,
  limit: 999999,
  locationId: null,
  text: '',
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  } as SortingType,
}
