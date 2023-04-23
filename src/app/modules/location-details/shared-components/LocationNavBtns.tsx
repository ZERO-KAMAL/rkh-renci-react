import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { AiOutlineSetting } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const LocationNavBtns = () => {
  const navigate = useNavigate()
  return [
    <ReactIconBtn
      key={0}
      name='View Location'
      icon={<AiOutlineSetting size={20} />}
      bgColor={ColorsEnum.green}
      onClick={() => {
        navigate(NAVIGATE_LINKS.SETUP.LOCATION_LOC)
      }}
    ></ReactIconBtn>,
    <ReactIconBtn
      key={0}
      name='View Area'
      icon={<AiOutlineSetting size={20} />}
      bgColor={ColorsEnum.green}
      onClick={() => {
        navigate(NAVIGATE_LINKS.SETUP.LOCATION_AREA)
      }}
    ></ReactIconBtn>,
    <ReactIconBtn
      key={0}
      name='View Department'
      icon={<AiOutlineSetting size={20} />}
      bgColor={ColorsEnum.green}
      onClick={() => {
        navigate(NAVIGATE_LINKS.SETUP.LOCATION_DEPT)
      }}
    ></ReactIconBtn>,
  ]
}

export default LocationNavBtns
