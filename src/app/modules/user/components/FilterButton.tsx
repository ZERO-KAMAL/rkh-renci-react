import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography } from '@mui/material'
import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { Role } from 'app/http/roles-modules/roleModule.model'
import { defParamsRole, fetchRoles } from 'app/http/roles-modules/roleModuleSlice'
import { userTableSlice } from 'app/http/users/userTableSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { IoReturnDownForwardSharp } from 'react-icons/io5'
import { MdExpandMore } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'

const RoleFilter: FC = () => {
  const dispatch = useAppDispatch()

  // Showing dropdown
  const [dropDownOn, setDropDownOn] = useState<boolean>(false)
  const dropDownRef = useRef(null)

  // Showing dropdown
  useEffect(() => {
    const handleClick = (e: any) => {
      const ref: any = dropDownRef.current
      if (!ref?.contains(e.target)) {
        setDropDownOn(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Expanding Accordion
  const [expanded, setExpanded] = useState<string | false>('panel1')
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  // ----------------------- Panel 1: Roles accodion --------------------------
  const { dataTable: roleTbl, loadingRole } = useAppSelector((state) => state.roleModule)
  const [selectedRole, setSelectedRole] = useState<any[]>([])

  useEffect(() => {
    if (!roleTbl) return
    const roles = roleTbl?.map((role) => ({ ...role, selected: true })) || []
    setSelectedRole(roles)
  }, [roleTbl])

  const onRoleChange = (e: any, role: Role) => {
    dispatch(userTableSlice.actions.setTable({ page: 1 }))
    const newRoleArr = selectedRole.map((obj) => {
      if (obj.id === role.id) {
        return { ...obj, selected: e.target.checked }
      }
      return obj
    })
    setSelectedRole(newRoleArr)
  }

  useEffect(() => {
    const roleIds: number[] = selectedRole.filter((role) => role.selected).map((role) => role.id)
    dispatch(userTableSlice.actions.tblSetSelectMulti({ ids: [], toggleAllSelected: false }))
    dispatch(userTableSlice.actions.setFilterByRoleIds(roleIds.toString()))
    if (!roleIds.length) {
      dispatch(
        userTableSlice.actions.setTable({
          hideTableData: true,
        })
      )
    } else {
      dispatch(
        userTableSlice.actions.setTable({
          hideTableData: false,
        })
      )
    }
  }, [selectedRole])

  return (
    <div className='relative' ref={dropDownRef}>
      <ReactIconBtn
        name=' Filter'
        icon={<RiAddFill size={20} />}
        bgColor={ColorsEnum.green}
        onClick={() => setDropDownOn((prevState) => !prevState)}
      ></ReactIconBtn>

      {dropDownOn && (
        <div
          className='absolute right-0 w-auto h-auto
        bg-white border rounded-lg z-10 mt-1'
        >
          <div className='max-h-96 max-w-96 h-64 w-64 m-6 overflow-auto'>
            <div className='relative'>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                  sx={{
                    backgroundColor: '#F5F8FA',
                    borderRadius: '8px',
                  }}
                  expandIcon={<MdExpandMore />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography>Roles</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: '#F5F8FA',
                    borderRadius: '8px',
                    marginTop: '6px',
                    content: {
                      justifyContent: 'center',
                    },
                  }}
                >
                  {!loadingRole && roleTbl && (
                    <table className='table-auto w-full '>
                      <tbody>
                        {roleTbl.map((item, idx) => (
                          <tr key={idx} className='mx-6'>
                            <td>{item.name}</td>
                            <td className='text-right'>
                              <Checkbox
                                checked={selectedRole.find((role) => role.id === item.id)?.selected}
                                onClick={(e) => onRoleChange(e, item)}
                                style={{
                                  color: 'green',
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleFilter
