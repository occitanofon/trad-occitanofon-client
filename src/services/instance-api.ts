import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuth } from '~/composables'
import { refreshToken } from '~/services'
import { isAccessTokenRefreshing } from '~/stores'
const { VITE_BACKEND_API_URL } = import.meta.env


const { AuthSignedIn, AuthSignedOut } = useAuth()
const toast = useToast()

const publicAPI = axios.create({
  baseURL: VITE_BACKEND_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

const privateAPI = axios.create({
  baseURL: `${VITE_BACKEND_API_URL as string}/p`,
  headers: {
    'Content-Type': 'application/json',
  },
})

privateAPI.interceptors.request.use((config) => {
  const newConfig = config
  const jwt = localStorage.getItem('accessToken')
  newConfig.headers.Authorization = `Bearer ${jwt}`
  return newConfig
})

privateAPI.interceptors.response.use(
  response => response,
  (err) => {
    if (err.response.status === 401) {
      if (err.response.data.error === 'TOKEN_EXPIRED') {
        return new Promise((resolve, reject) => {
          if (isAccessTokenRefreshing.value) {
            const intervalId = setInterval(() => {
              if (!isAccessTokenRefreshing.value) {
                clearInterval(intervalId)

                const originalReq = err.config

                const jwt = localStorage.getItem('accessToken')
                originalReq.headers.Authorization = `Bearer ${jwt}`

                axios(originalReq)
                  .then(data => resolve(data))
                  .catch(err => reject(err))
              }
            }, 100)
          }
          else {
            refreshToken().then((result) => {
              result
                .map((accessToken) => {
                  useLocalStorage('accessToken', accessToken)
                  AuthSignedIn()

                  const originalReq = err.config
                  originalReq.headers.Authorization = `Bearer ${accessToken}`

                  axios(originalReq)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
                })
                .mapErr((err: any) => {
                  AuthSignedOut()
                  toast.error(err.msg)
                })
            })
          }
        })
      }
      else {
        AuthSignedOut()
        return Promise.reject(err)
      }
    }

    return Promise.reject(err)
  },
)

export { publicAPI, privateAPI }
