import React from 'react'
import { useParams } from 'react-router-dom'

import EmailTemplate from './EmailTemplate'

const FeedbackInboxEmailLabel = () => {
  const { labelId } = useParams()
  return <EmailTemplate type='Inbox' labelId={labelId} />
}

export default FeedbackInboxEmailLabel
