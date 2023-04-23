import NAVIGATE_LINKS from 'app/constants/router-links'
import { useHistory } from 'app/routing/AppRoutes'

const Button = () => {
  const onClick = () => {
    useHistory.replace(NAVIGATE_LINKS.AUTH.LOGOUT)
  }

  return (
    <button className='bg-blue-400 text-white  px-6 py-2 rounded-full' onClick={onClick}>
      Log out
    </button>
  )
}

export default Button
