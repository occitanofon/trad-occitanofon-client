<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { capitalize } from '~/logic'
import { Translation, TranslationBoxEmitter, TranslationsInputs } from '~/models'
import { useDatasets } from '~/composables'
import { addNewTranslation } from '~/services'

const toast = useToast()
const maleBoxId: string = 'male'
const femaleBoxId: string = 'female'
const props = defineProps<{ dialect: string }>()

const { currentDataset, skipDataset } = useDatasets(props.dialect)

const translationInputs = ref<TranslationsInputs>(new TranslationsInputs())
const showEnglish = ref<boolean>(false)
const showFemale = ref<boolean>(false)

function toggleCopy(event: TranslationBoxEmitter): void {
  if (event.id === maleBoxId) {
    if (event.status) {
      translationInputs.value.original.occitan.content = ''
      translationInputs.value.feminine.occitan.content = ''
    } else {
      translationInputs.value.original.occitan.content = currentDataset.value.sentence
    }
  } else {
    if (event.status) {
      translationInputs.value.feminine.occitan.content = ''
    } else {
      translationInputs.value.feminine.occitan.content = translationInputs.value.original.occitan.content
    }
  }
}
function skipSentence(e: null): void {
  translationInputs.value = new TranslationsInputs()
  skipDataset()
}
const toggleEnglish = (value: boolean) => showEnglish.value = value
const toggleFemale = (value: boolean) => showFemale.value = value

const fullDialect = computed<string>(() => {
  const occitan: string[] = props.dialect.split('_')
  return `${capitalize(occitan[0])} ${capitalize(occitan[1])}`
})
const disabled = computed<boolean>(() => {
  const origOcFrRule = translationInputs.value.original.occitan.content.length > 0 && translationInputs.value.original.french.content.length > 0
  const origEnRule = showEnglish.value && translationInputs.value.original.english.content.length > 0
  const femOcFrRule = showFemale.value && translationInputs.value.feminine.occitan.content.length > 0 && translationInputs.value.feminine.french.content.length > 0
  if ((origOcFrRule && !showEnglish.value && !showFemale.value)
  || (origOcFrRule && origEnRule && !showFemale.value)
  || (femOcFrRule && !showEnglish.value)
  || (femOcFrRule && showEnglish.value && translationInputs.value.feminine.english.content.length > 0)
  )
    return false
  return true
})

async function newTranslation(): Promise<void> {
  let translations: Translation[] = []

  let origTransl: Translation = {
    oc: translationInputs.value.original.occitan.content.trim(),
    fr: translationInputs.value.original.french.content.trim(),
    datasetID: currentDataset.value.id,
    occitan: props.dialect.trim(),
  }

  if (showEnglish.value && translationInputs.value.original.english.content.length > 0)
    origTransl.en = translationInputs.value.original.english.content.trim()

  translations.push(origTransl)

  if (
    showFemale.value &&
    translationInputs.value.feminine.occitan.content.length > 0 &&
    translationInputs.value.feminine.french.content.length > 0
  ) {
    let femTransl: Translation = {
      oc: translationInputs.value.feminine.occitan.content.trim(),
      fr: translationInputs.value.feminine.french.content.trim(),
      datasetID: currentDataset.value.id,
      occitan: props.dialect.trim(),
    }
    
    if (showEnglish.value && translationInputs.value.feminine.english.content.length > 0)
      femTransl.en = translationInputs.value.feminine.english.content.trim()

    translations.push(femTransl)
  }

  const result = await addNewTranslation(translations)
  result.map((_) => {
    translationInputs.value = new TranslationsInputs()
    skipDataset()
  }).mapErr((err) => toast.error(err.msg))
}
</script>

<template>
  <h1 class="title">
    Traduccion en {{ fullDialect }}
  </h1>
  <div v-if="currentDataset.sentence.length > 0" class="translation-space">
    <InfoBox :id="10" :msg="`Siá extrèmament rigorós quand traduses las frasas, per exemple, l'ordenador es pas pro intelligent per comprene que lo mot «frances» equival a «francés».`" />
    <InfoBox :id="11" :msg="`Las frasas provenon de sites web occitans, aquestas pòdon comportar de pècas, esites pas a las corregir s'es necessari.`" />
    <InfoBox :id="12" :msg="`Oblides pas las dònas, esites pas a femenizar la frasa quand es possible.`" />
    <textarea
      id="sentence"
      class="sentence"
      name="sentence"
      :value="currentDataset.sentence"
      disabled
    ></textarea>
    <div class="translations-box">
      <TranslationBox
        v-model:translations="translationInputs.original"
        :fulldialect="fullDialect"
        :id="maleBoxId"
        :show-english="showEnglish"
        @toggleCopy="toggleCopy($event)"
      />
      <TranslationBox
        v-if="showFemale"
        v-model:translations="translationInputs.feminine"
        :fulldialect="fullDialect"
        :id="femaleBoxId"
        :show-english="showEnglish"
        @toggle-copy="toggleCopy($event)"
      />
    </div>
    <OptionButtons
      :show-english-box="showEnglish"
      :show-female-boxes="showFemale"
      @skip-sentence="skipSentence($event)"
      @toggle-english="toggleEnglish($event)"
      @toggle-female="toggleFemale($event)"
    />
    <div class="btn-submit">
      <button
        class="submit-btn-trans"
        :disabled="disabled"
        @click.prevent="newTranslation"
      >
        Confirmar las traduccions
      </button>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  font-size: 1.7rem;
}
.translation-space {
  display: flex;
  flex-direction: column;
  gap: 1rem 0;
  margin: 0 5rem 0 5rem;
}
.sentence {
  resize: none;
  outline: none;
  width: 100%;
  padding: 5px 6px 5px 6px;
  border: 1px solid #e6e6e6;
  border-radius: 8px 8px 8px 8px;
  background-color: #efefef;
  color: #507d82;
  font-size: 0.94rem;
  margin-top: 0.4rem;
}
.translations-box {
  display: flex;
  gap: 1rem 2rem;
  margin-top: 1.6rem;
}
.no-more-translation {
  display: flex;
  justify-content: center;
}
.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-submit > button {
  color: #ffffff;
  background-color: #ea4d29;
  border-radius: 6px 6px 6px 6px;
  border: none;
  padding: 0.5rem 1.3rem 0.5rem 1.3rem;
  font-size: 1.3rem;
  margin-right: 0.6rem;
}

.btn-submit > button:disabled {
  background-color: rgba(234, 77, 41, 0.5);
}

@media only screen and (max-width: 850px) {
  .title {
    font-size: 1.4rem;
  }
  .translations-box {
    flex-wrap: wrap;
  }
}
@media only screen and (max-width: 675px) {
  .title {
    font-size: 1.25rem;
  }
  .sentence {
    height: 5rem;
  }
  .translation-space {
    margin: 0 2rem 0 2rem;
  }
}
@media only screen and (max-width: 450px) {
  .sentence {
    height: 7rem;
  }
  .translation-space {
    margin: 0 1rem 0 1rem;
  }
}
</style>
