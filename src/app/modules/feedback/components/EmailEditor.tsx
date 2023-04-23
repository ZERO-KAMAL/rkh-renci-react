import { LoadingButton } from '@mui/lab'
import { FeedbackReplySendForward } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForward.model'
import { DeleteFeedbackEmail } from 'app/http/feedback-email/feedBackEmailSlice'
import { UserList } from 'app/http/users/users.model'
import UserService from 'app/http/users/usersService'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import axios from 'axios'
import { ContentState, EditorState, convertFromHTML } from 'draft-js'
import { useCallback, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ReactTags from 'react-tag-autocomplete'
import { TagsInput } from 'react-tag-input-component'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_APP_API_URL
interface ValidateEmailProps {
  id: number
  name: string
}
const validateEmail = (input: ValidateEmailProps) => {
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (input.name.match(validRegex)) {
    return true
  } else {
    Swal.fire({
      title: 'Email is not valid!',
      icon: 'error',
    })
    return false
  }
}
const EmailEditor = (props: any) => {
  const { editData = {}, handleTrashClick, onSend, containerClass } = props
  const [editorState, setEditorState]: any = useState(
    editData.content
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(editData.content) as any)
        )
      : ''
  )

  const { loading } = useAppSelector(
    (state) => state.feedbackSendAndReply
  )

  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [data, setData]: any = useState({
    subject: editData.subject || '',
    emailTo: editData?.emailTo?.filter((item: any)=> ( item !== editData?.emailOwner)) || [],
    emailCc: editData.emailCc || [],
    emailBc: editData.emailBc || [],
    feedbackId: editData.feedbackId || null,
    parentId: editData.id || null,
  })

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState)
  }

  const handleSetValue = (name: string, value: string | string[]) => {
    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const [suggestions, setSuggestions] = useState([])

  const onInput = async (query: string, type: string) => {
    const res = await axios.get<UserList>(`${API_URL}/users/1/10/id/desc`, {
      params: { email: query },
    })
    const suggs = res.data.rows.filter((i) => !(data[type] || []).some((obj: any) => obj === i.email))
    .map((obj) => ({ id: obj.id, name: obj.email })) as any
    if((query.includes('@republicpower.net') || query.includes('@renci.org.sg')) && suggs.length === 0) {
      setSuggestions([{id: 0, name: query}] as any)
    }
    else 
      setSuggestions(suggs)
  }
  const handleTagAdd = (newTag: ValidateEmailProps, type: string) => {
    handleSetValue(type, [...(data[type] || []), newTag.name])
  }
  const handleTagDelete = (tagIndex: number, type: string) => {
    handleSetValue(
      type,
      (data[type] || []).filter((_: any, i: any) => i !== tagIndex)
    )
  }
  const getEmailTags = (type: string) => {
    return (data[type] || []).map((email: string, index: number) => ({
      id: index,
      name: email,
    }))
  }

  return (
    <div className={'p-5 max-sm:p-2 z-1 ' + containerClass}>
      <div className='emailEditorBg'>
        {/* To */}
        <div className='h-full min-h-[59px] border-b-[1px] border-gray-100 text-[#A1A5B7] text-[13px] pl-6 max-md:pl-2 flex max-sm:flex-col items-center max-sm:items-start justify-between z-1 bg-white'>
          <div className='flex justify-center items-center w-full'>
            <span>To:</span>
            {/* <TagsInput
              value={data?.emailTo || []}
              onChange={(value) => handleSetValue('emailTo', value)}
              name='toEmails'
              beforeAddValidate={(tag) => validateEmail(tag)}
              placeHolder=''
            /> */}
            <ReactTags
              tags={getEmailTags('emailTo')}
              suggestions={suggestions}
              onDelete={(tagIndex: number) => handleTagDelete(tagIndex, 'emailTo')}
              onAddition={(newTag: any) => handleTagAdd(newTag, 'emailTo')}
              placeholderText=''
              onInput={(q: string) => onInput(q, 'emailTo')}
              onValidate={(tag: any) => validateEmail(tag)}
            />
          </div>
          <div className='pr-5'>
            <span
              className='pr-2 hover:cursor-pointer font-semibold'
              onClick={() => setShowCc((prev) => !prev)}
            >
              Cc
            </span>
            <span
              className='hover:cursor-pointer font-semibold'
              onClick={() => setShowBcc((prev) => !prev)}
            >
              Bcc
            </span>
          </div>
        </div>
        {/* CC */}
        {showCc ? (
          <div className='h-full min-h-[59px] border-b-[1px] border-gray-100 text-[#A1A5B7] text-[13px] pl-6 max-md:pl-2 flex items-center justify-between bg-white'>
            <div className='flex justify-center items-center w-full'>
              <span>cc:</span>
              <ReactTags
                tags={getEmailTags('emailCc')}
                suggestions={suggestions}
                onDelete={(tagIndex: number) => handleTagDelete(tagIndex, 'emailCc')}
                onAddition={(newTag: any) => handleTagAdd(newTag, 'emailCc')}
                placeholderText=''
                onInput={(q: string) => onInput(q, 'emailCc')}
                onValidate={(tag: any) => validateEmail(tag)}
              />
            </div>
          </div>
        ) : null}
        {/* BCC */}
        {showBcc ? (
          <div className='h-full min-h-[59px] border-b-[1px] border-gray-100 text-[#A1A5B7] text-[13px] pl-6 max-md:pl-2 flex items-center justify-between flex-1 bg-white'>
            <div className='flex justify-center items-center w-full'>
              <span>bcc:</span>
              <ReactTags
                tags={getEmailTags('emailBc')}
                suggestions={suggestions}
                onDelete={(tagIndex: number) => handleTagDelete(tagIndex, 'emailBc')}
                onAddition={(newTag: any) => handleTagAdd(newTag, 'emailBc')}
                placeholderText=''
                onInput={(q: string) => onInput(q, 'emailBc')}
                onValidate={(tag: any) => validateEmail(tag)}
              />
            </div>
          </div>
        ) : null}
        {/* Subject */}
        <div className='w-full border-b-[1px] border-gray-100 p-6 max-md:p-2 bg-white '>
          {/* <input
            type={'text'}
            className='h-full w-full text-[#A1A5B7] text-[13px] focus:outline-none focus:text-black'
            placeholder='Subject'
            disabled
            value={`${data?.subject}`}
            onChange={(e) => handleSetValue('subject', e.target.value)}
          /> */}
          <div className='h-full w-full text-[13px] focus:outline-none focus:text-black'>
            {data?.subject}
          </div>
        </div>
        {/* Editor */}
        <Editor
          editorState={editorState}
          toolbarClassName='toolbarClassName'
          wrapperClassName='wrapperClassName'
          editorClassName='editorClassName'
          onEditorStateChange={onEditorStateChange}
          placeholder='Type message..'
          editorStyle={{ height: '150px', paddingLeft: '25px', background: 'white' }}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'link'],
            inline: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['bold', 'italic', 'underline', 'monospace'],
            },
            blockType: {
              inDropdown: true,
            },
            fontSize: {
              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
            },
          }}
        />
        <div className='w-full py-4 border-t border-gray-100 items-center justify-between flex px-6'>
          <div className='items-center flex'>
            <LoadingButton
              variant='contained'
              className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
              onClick={async () => {
                if (onSend) {
                  const emailData: FeedbackReplySendForward = {
                    ...data,
                    content: editorState?.getCurrentContent().getPlainText(),
                  }
                  // if (feedbackId) await dispatch(DeleteFeedbackEmail([feedbackId]))
                  onSend(emailData)
                }
              }}
              loading={loading}
              loadingPosition='center'
            >
              Send
            </LoadingButton>
            {/* <img src='/assets/svgs/attachment.svg' /> */}
          </div>
          <p className='font-semibold cursor-pointer font-roboto'
            onClick={() => {
              const emailData: FeedbackReplySendForward = {
                ...data,
                content:
                  editorState?.getCurrentContent && editorState?.getCurrentContent().getPlainText(),
              }
              handleTrashClick(emailData)
            }}
          >
            Cancel
          </p>
          {/* <img
            src='/assets/svgs/trash.svg'
            className='cursor-pointer'
            onClick={() => {
              const emailData: FeedbackReplySendForward = {
                ...data,
                content:
                  editorState?.getCurrentContent && editorState?.getCurrentContent().getPlainText(),
              }
              handleTrashClick(emailData)
            }}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default EmailEditor
