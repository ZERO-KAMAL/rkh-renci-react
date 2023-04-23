import { ASYNC_STORAGE_KEYS } from 'app/constants'
import { LoginRes } from 'app/http/users/users.model'
import secureLocalStorage from 'react-secure-storage'

const getUser = (): LoginRes | undefined => {
  const user = secureLocalStorage.getItem(ASYNC_STORAGE_KEYS.USER) as string
  if (!user) {
    return
  }

  try {
    const auth: LoginRes = JSON.parse(user) as LoginRes
    if (auth) {
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}
const setUser = (user: LoginRes) => {
  const token = JSON.stringify(user)
  secureLocalStorage.setItem(ASYNC_STORAGE_KEYS.USER, token)
}

const removeUser = () => {
  secureLocalStorage.removeItem(ASYNC_STORAGE_KEYS.USER)
}

const getIsRefresh = (): boolean => {
  const token = secureLocalStorage.getItem(ASYNC_STORAGE_KEYS.IS_REFRESH) as boolean
  return token
}
const setIsRefresh = (state: boolean) => {
  secureLocalStorage.setItem(ASYNC_STORAGE_KEYS.IS_REFRESH, state)
}

const removeIsRefresh = () => {
  secureLocalStorage.removeItem(ASYNC_STORAGE_KEYS.IS_REFRESH)
}

const useLocalStorage = {
  getUser,
  setUser,
  removeUser,
  getIsRefresh,
  setIsRefresh,
  removeIsRefresh,
}

export default useLocalStorage

/* Supported methods
  
  setItem(key, value)
  - To set values to secure storage
  - Supports 'String - Object - Number - Boolean' as value

  getItem(key)
  - To get values which is saved on secure local storage
  - Return null if the key does not exits

  removeItem(key)
  - To remove specified key from secure local storage

  clear()
  -	Removed all data from secure local storage

*/
