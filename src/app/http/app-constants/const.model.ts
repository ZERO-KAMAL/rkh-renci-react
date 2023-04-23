export interface ConstantsRes {
  feedbackSources: string[]
  defaultSource: string
  saluations: string[]
  feedbackStatus: string[]
  feedbackCaseTypes: string[]
  TATFilter: Tatfilter[]
  emailTypes: string[]
}

export interface Tatfilter {
  fromDays: number
  toDays?: number
}
