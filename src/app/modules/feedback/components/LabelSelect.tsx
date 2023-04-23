import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Box, SxProps } from '@mui/system'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { FeedbackLabelUpdate } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForward.model'
import { updateFeedbackLabel } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

interface LabelSelectProps {
  children: (i: () => void) => React.ReactNode
  checkedMails: string[]
  setCheckedMails: (param: string[]) => void
  refetchEmails: ()=> void
}

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2BA579',
    },
  },
})
const styles: SxProps = {
  position: 'absolute',
  top: 32,
  right: 0,
  left: -50,
  zIndex: 1,
  border: '0px solid',
  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
  width: '240px',
  p: 0,
  bgcolor: 'white',
  overflow: 'none',
}

const LabelSelect = ({ children, checkedMails, setCheckedMails, refetchEmails }: LabelSelectProps) => {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { dataTable } = useAppSelector((state) => state.feedbackEmailLabel)
  const [selectedLabel, setSelectedLabels]: [string[], any] = useState([])
  const [textInput, setTextInput] = useState('')
  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClickAway = () => {
    setSelectedLabels([])
    setOpen(false)
  }

  const getSearchedLabels = (data: object[]) => {
    return data.filter((labelData: any) =>
      labelData.name.toLowerCase().includes(textInput.toLowerCase())
    )
  }

  const handleAddLabels = async () => {
    const data: FeedbackLabelUpdate = {
      labels: selectedLabel,
      ids: checkedMails,
    }
    await dispatch(updateFeedbackLabel(data)).then(()=> {
      refetchEmails()
    })
    handleClickAway()
    setCheckedMails([])
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: 'relative' }}>
          {children(handleClick)}
          {open ? (
            <Box sx={styles}>
              <div className='p-2'>
                <div className='font-normal text-sm text-black'>
                  <p>Label as:</p>
                </div>
                <FormControl sx={{ width: '100%' }} variant='standard'>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    id='standard-adornment-password'
                    endAdornment={<RiSearchLine />}
                  />
                </FormControl>
                <div className='mx-2'>
                  {getSearchedLabels(dataTable).map((label: any) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: '#A1A5B7',
                          }}
                          onChange={(e) =>
                            setSelectedLabels((prev: string[]) =>
                              e.target.checked
                                ? [...prev, label.id]
                                : prev.filter((obj) => obj !== label.id)
                            )
                          }
                        />
                      }
                      label={label.name}
                      key={label.id}
                      className='font-normal text-xs text-black'
                    />
                  ))}
                </div>
              </div>
              <hr />
              {selectedLabel.length ? (
                <MenuItem className='font-normal text-normal text-white bg-[#2BA579] hover:bg-[#2BA579] m-3 rounded justify-center' onClick={handleAddLabels}>
                  Apply
                </MenuItem>
              ) : (
                <Link to={NAVIGATE_LINKS.FEEDBACK.LABEL_SETTING}>
                  <MenuItem className='font-normal text-normal text-white bg-[#2BA579] hover:bg-[#2BA579] m-3 rounded justify-center'>
                    Manage Labels
                  </MenuItem>
                </Link>
              )}
            </Box>
          ) : null}
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  )
}

export default LabelSelect
