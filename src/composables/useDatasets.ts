import { useToast } from 'vue-toastification'
import { Dataset } from '~/models'
import { getDatasets, getDatasetsInBackground } from '~/services/private-requests'

const noMoreTranslationsMsg1: string = 'i a pas cap de frasa de traduire'
const noMoreTranslationsMsg2: string = 'Il ne vous reste plus que 2 phrases à traduire !'

export function useDatasets(fullDialect: string) {
  const toast = useToast()
  const router = useRouter()

  const datasets = reactive({ sentences: [] as Dataset[] })
  const currentDataset = ref<Dataset>({ id: '', sentence: '' })

  const redirect = (delayMS: number) => setTimeout(() => router.push('/menut-principau'), delayMS)

  onMounted(async() => {
    const result = await getDatasets(fullDialect)
    result.map((data) => {
      datasets.sentences = data
      currentDataset.value = datasets.sentences[0]
    }).mapErr(err => {
      if (err.status === 404) {
        toast.warning(err.msg)
      } else {
        toast.error(err.msg)
      }
      redirect(1100)
    })
  })

  watch(datasets, async (_, __) => {
    if (datasets.sentences.length === 0) {
      toast.warning(noMoreTranslationsMsg1)
      redirect(3500)
    }

    if (datasets.sentences.length === 2) {
      const result = await getDatasetsInBackground(fullDialect)
      result
      .map(newDatasets => datasets.sentences.push(...newDatasets))
      .mapErr(err => {
        if (err.status === 404) {
          toast.warning(noMoreTranslationsMsg2)
        } else {
          toast.error(err.msg)
        }
      })
    }
  })

  function skipDataset(): void {
    datasets.sentences.shift()
    currentDataset.value = datasets.sentences[0]
  }

  return {
    currentDataset,
    skipDataset,
  }
}
