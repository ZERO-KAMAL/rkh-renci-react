import { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  name: string
  toUrl: string
  onClick?: () => void
}

// TODO: Role module logic
const NavLink: FC<Props> = (props: Props) => {
  return (
    <Link
      to={props.toUrl}
      className='hover:text-primary pt-4 pb-2 md:px-1 lg:px-2 xl:px-4'
      onClick={props.onClick}
    >
      {props.name}
    </Link>
  )
}

export default NavLink
