/* eslint-disable import/named */
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '~/composables'
import { isYourDialects } from '~/helpers'
import { capitalize } from '~/logic'

const { isAuth } = useAuth()
const toast = useToast()

const pathNameAuthOnly: string[] = [
  'menut-principau',
  'espaci-traduccion-dialect',
]

export async function loggedInGuard(to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) {
  const currentPath: string = to.name as string;
  
  if (!pathNameAuthOnly.includes(currentPath)) {
    return next()
  }
  
  const jwt = localStorage.getItem('accessToken') ?? ''
  
  if (!!!jwt || !isAuth.value) {
    return next('/connexion')
  }

  if (currentPath === 'espaci-traduccion-dialect') {
    const param: string = to.params.dialect as string;
    const fullDialect: string[] = param.split('_')

    if (isYourDialects(fullDialect[0], fullDialect[1])) {
      return next()
    }

    toast.warning(`Ès pas autorizat a far las traduccions en ${capitalize(fullDialect[0])} ${capitalize(fullDialect[1])}`)
    return next('/menut-principau')
  }

  return next()
}
