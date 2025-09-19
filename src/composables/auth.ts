import { ref } from 'vue'
import Cookies from "js-cookie"

const isLoggedIn = ref<boolean>(false)
const currentUser = ref<string>('')
const userEmail = ref<string>('')

const authorization = () => {
  const checkAuthorization = () => {
    const token = Cookies.get('token')
    if (token) {
      isLoggedIn.value = true
      // Get user info from localStorage or decode token
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        currentUser.value = parsed.name || parsed.username || 'User'
        userEmail.value = parsed.email || ''
      }
    } else {
      isLoggedIn.value = false
      currentUser.value = ''
      userEmail.value = ''
    }
  }

  // Check on initialization
  checkAuthorization()

  return { isLoggedIn, checkAuthorization, currentUser, userEmail }
}

export default authorization