<script setup lang="ts">
import type { PropType } from '@vue/runtime-core'
import { Translations } from '~/models'

const props = defineProps({
  fulldialect: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  translations: {
    type: Object as PropType<Translations>,
    required: true,
  },
  showEnglish: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:translations', 'toggleCopy'])

function emitOccitan(e: Event) {
  props.translations.occitan.content = (e.target as HTMLTextAreaElement).value
  emit('update:translations', props.translations)
}

function emitFrench(e: Event) {
  props.translations.french.content = (e.target as HTMLTextAreaElement).value
  emit('update:translations', props.translations)
}

function emitEnglish(e: Event) {
  props.translations.english.content = (e.target as HTMLTextAreaElement).value
  emit('update:translations', props.translations)
}

const emitCopy = (status: boolean) => emit('toggleCopy', { id: props.id, status: status })
</script>

<template>
  <div class="translation-box">
    <div class="fulldialect-box">
      <p>{{ fulldialect }}</p>
      <span @click.prevent="emitCopy(true)" v-if="props.id && translations.occitan.content.length">
        <clarity:remove-line width="20" height="20" color="#f69f35"></clarity:remove-line>
      </span>
      <span @click.prevent="emitCopy(false)" v-else>
        <heroicons-outline:clipboard-copy width="20" height="20" color="#0fa11c"></heroicons-outline:clipboard-copy>
      </span>
    </div>
    <textarea
      :value="translations.occitan.content"
      name="occitan"
      :placeholder="translations.occitan.placeholder"
      @input="emitOccitan($event)"
    ></textarea>
    <p>Francés</p>
    <textarea
      :value="translations.french.content"
      name="french"
      :placeholder="translations.french.placeholder"
      @input="emitFrench($event)"
    ></textarea>
    <p v-if="showEnglish">Anglés</p>
    <textarea
      v-if="showEnglish"
      :value="translations.english.content"
      name="english"
      :placeholder="translations.english.placeholder"
      @input="emitEnglish($event)"
    ></textarea>
  </div>
</template>

<style scoped>
.translation-box {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-width: 300px;
}

.fulldialect-box {
  display: flex;
  gap: 0 0.4rem;
}

textarea {
  outline: none;
  resize: none;
  min-height: 100px;
  padding: 5px 6px 0px 6px;
  border: 1px solid #e6e6e6;
  border-radius: 8px 8px 8px 8px;
  background-color: #efefef;
  font-size: 0.94rem;
  margin-bottom: 1.3rem;
}
p {
  color: #ea4d29;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.3rem 0.2rem;
}
</style>
