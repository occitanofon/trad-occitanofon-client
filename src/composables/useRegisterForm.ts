import { reactive, computed, watch } from 'vue'
import { validateEmail } from '~/logic'

const EmailErr = 'Lemail est dnas un mauvais format'
const pwdLengthErr = 'Cal que lo senhal contenga mai de 8 caractèrs.'
const responseQuestionLenghErr = 'Cal que responsa contenga mai de 3 caractèrs.'
const passwordsMatched = 'Lo senhal deu èsser identic al senhal de confirmacion.'
const usernameMaxLengthErr = 'Cal que lo Pseudonim contenga mens de 25 caractèrs.'

function useRegisterForm() {
  let delayTimerPwd: NodeJS.Timeout
  let delayTimerConfirPwd: NodeJS.Timeout

  const account = reactive({
    username: {
      value: '',
      error: '',
    },
    email: {
      value: '',
      error: '',
    },
    q1: {
      value: '',
      error: '',
    },
    q2: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
    },
    confirPassword: {
      value: '',
      error: '',
    },
  })

  watch(account, (newAccount, _) => {
    // handle username field error
    if (newAccount.username.value.length > 25)
      account.username.error = usernameMaxLengthErr
    else
      account.username.error = ''

    // handle email field error
    if (newAccount.email.value.length !== 0 && !validateEmail(newAccount.email.value))
      account.email.error = EmailErr
    else
      account.email.error = ''

    // handle response field error
    if (newAccount.q1.value.length !== 0 && newAccount.q1.value.length < 3)
      account.q1.error = responseQuestionLenghErr
    else
      account.q1.error = ''

    if (newAccount.q2.value.length !== 0 && newAccount.q2.value.length < 3)
      account.q2.error = responseQuestionLenghErr
    else
      account.q2.error = ''

    // handle confirm password field
    if (
      newAccount.password.value.length !== 0
      && newAccount.password.value.length < 8
    ) {
      clearTimeout(delayTimerPwd)
      delayTimerPwd = setTimeout(() => {
        account.password.error = pwdLengthErr
      }, 500)
    }
    else {
      account.password.error = ''
      clearTimeout(delayTimerPwd)
    }

    if (newAccount.password.value !== newAccount.confirPassword.value) {
      if (newAccount.confirPassword.value.length < 3)
        return

      clearTimeout(delayTimerConfirPwd)
      delayTimerConfirPwd = setTimeout(() => {
        account.confirPassword.error = passwordsMatched
      }, 300)
    }
    else {
      account.confirPassword.error = ''
      clearTimeout(delayTimerConfirPwd)
    }
  })

  const disableForm = computed<boolean>(() => {
    if (
      account.username.value.length < 1
      || account.username.value.length > 25
      || !validateEmail(account.email.value)
      || account.q1.value.length < 3
      || account.q2.value.length < 3
      || account.password.value.length < 8
      || account.password.value !== account.confirPassword.value
    )
      return true

    return false
  })

  function resetForm(): void {
    account.username.value = ''
    account.email.value = ''
    account.q1.value = ''
    account.q2.value = ''
    account.password.value = ''
    account.confirPassword.value = ''
  }

  return {
    account,
    disableForm,
    resetForm,
  }
}

export { useRegisterForm }
