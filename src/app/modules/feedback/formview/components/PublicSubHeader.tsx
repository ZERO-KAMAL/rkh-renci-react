import { FC } from 'react'

interface IValue {
  text: string
}
interface Props {
  id?: number
  type?: string
  data: IValue
}

const PublicSubHeader: FC<Props> = ({ data }) => {
  return <p className='text-lg font-medium mb-2'>{data.text}</p>
}

export default PublicSubHeader
