import NAVIGATE_LINKS from 'app/constants/router-links'
import { Hooks } from 'app/helpers/hooks'
import { Breakpoint } from 'app/helpers/hooks/useWindowSize'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { json, matchPath, useLocation, useNavigate } from 'react-router-dom'

import { LINKS } from '../../constants/navbar-config'
import NavLink from './NavLink'

interface Props {
  setOpen?: (active: boolean) => void
}

const NavLinks: FC<Props> = (props: Props) => {
  // Heading config
  const collapsible = false
  const fixedWhiteBg = false
  const isBiChevronHidden = true
  // Heading
  const [heading, setHeading] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [subHeading, setSubHeading] = useState('')

  const windowSize = Hooks.useWindowSize()

  const navigate = useNavigate()
  const location = useLocation()

  const menuLinks = useAppSelector((state) => state.app.menuLinks)

  useEffect(() => {
    if (!menuLinks) return
    // console.log(`location pathname => ${location.pathname}`)
    // const specialCase = location.pathname.includes('/feedback/detail')
    // if (specialCase) {
    //   const item: any = menuLinks.filter((m) => m.name === 'Feedback')
    //   setHeading(item[0].name)
    //   setHighlighted(item[0].name)
    //   setSubHeading(item[0]?.sublink[0]?.name)
    //   return
    // }

    for (const item of menuLinks) {
      const headerMatched = location.pathname === item.link

      if (headerMatched) {
        setHeading(item.name)
        setHighlighted(item.name)
        setSubHeading(item?.sublink[0]?.name)
        return
      }
      for (const subItem of item.sublink) {
        const subHeaderMatched = location.pathname.includes(subItem.link)
        let subHeaderAltMatched = false
        if (subItem?.altLinks) {
          subItem.altLinks.every((altLink) => {
            const altLinkx = altLink.substring(0, altLink.indexOf(':')) || altLink;
            if (location.pathname.includes(altLinkx)) {
              subHeaderAltMatched = true
            }
          })
        }
        if (subHeaderMatched || subHeaderAltMatched) {
          setHeading(item.name)
          setHighlighted(item.name)
          setSubHeading(subItem.name)
          return
        }
      }
    }

    // nothing found, highlight none
    setHeading('')
    setHighlighted('')
    setSubHeading('')
  }, [location.pathname, menuLinks])

  return (
    <>
      {menuLinks &&
        menuLinks.map((link, index) => (
          <div key={index}>
            {/* Desktop and mobile menus main link*/}
            <div className='px-3 text-left md:cursor-pointer group '>
              <h1
                className='flex justify-between items-center group font-medium'
                onClick={() => {
                  if (collapsible) {
                    if (heading !== link.name) {
                      setHeading(link.name)
                    } else {
                      setHeading('')
                    }
                  } else {
                    setHeading(link.name)
                  }

                  setHighlighted(link.name)
                  setSubHeading(link?.sublink[0]?.name || '')
                  if (link.sublink[0]) {
                    if (windowSize.width < Breakpoint.MD && link?.sublink[0]?.name) return
                    navigate(link.sublink[0].link)
                  }
                }}
              >
                <div id='nav-link' className=' flex  items-end h-16'>
                  <div
                    className={`flex justify-center items-end 
                  h-4/5 rounded-t-xl pb-2 
                  hover:text-skin-navbar
                  ${!isBiChevronHidden && link.sublink.length ? 'md:px-1 lg:px-2 xl:px-4' : ''}
                  ${
                    highlighted === link.name
                      ? 'bg-white text-skin-navbar'
                      : 'md:text-skin-navbar-muted'
                  }`}
                  >
                    {link.sublink.length ? (
                      <div className='hover:text-primary pt-4 pb-2  md:px-1 lg:px-2 xl:px-4'>
                        {link.name}
                      </div>
                    ) : (
                      <NavLink
                        name={link.name}
                        toUrl={link.link}
                        onClick={() => props.setOpen?.(!open)}
                      />
                    )}

                    {!isBiChevronHidden && (
                      <span className='text-xl pt-4 pb-2'>
                        {link.sublink.length ? (
                          heading === link.name ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )
                        ) : (
                          <></>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </h1>
              {/* desktop menu sub link*/}
              {(link.submenu || fixedWhiteBg) && (
                <div className={`${heading === link.name ? '' : 'hidden'}`}>
                  {/* left-0 w-screen  absolute top-19 hidden md:block*/}
                  <div
                    id='nav-sublinks'
                    className='left-0 w-screen absolute top-19 hidden md:block'
                  >
                    <div className='bg-white flex justify-center gap-10 py-2'>
                      {link.sublink.map((slink, index) => (
                        <div
                          key={index}
                          className={` rounded py-2
                        hover:bg-skin-button-navbar-sublink-hover 
                        hover:text-skin-primary
                        ${
                          subHeading === slink.name
                            ? 'text-skin-primary bg-skin-button-navbar-sublink-hover'
                            : 'text-skin-muted'
                        }`}
                          onClick={() => {
                            setSubHeading(slink.name || '')
                          }}
                        >
                          <NavLink name={slink.name} toUrl={slink.link} onClick={() => {}} />
                        </div>
                      ))}
                      {!link.sublink.length && <div className='bg-slate-100 rounded py-5'></div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Mobile menus sub link*/}
            <div className={`${heading === link.name ? 'md:hidden' : 'hidden'}`}>
              {/* sublinks */}
              {link.sublink.map((slink, index) => (
                <div
                  key={index}
                  className='py-1 pl-7 flex justify-between items-center md:pr-0 pr-5'
                >
                  <NavLink
                    name={slink.name}
                    toUrl={slink.link}
                    onClick={() => props.setOpen?.(!open)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  )
}

export default NavLinks
