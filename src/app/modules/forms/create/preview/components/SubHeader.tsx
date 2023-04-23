import { FC } from 'react'

interface IValue {
  text: string
}
interface Props {
  id?: number
  type?: string
  value: IValue
}

const SubHeader: FC<Props> = ({ value }) => {
  return <p className='text-lg font-medium mb-2'>{value.text}</p>
}

export default SubHeader
