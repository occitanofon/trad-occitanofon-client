<script setup lang="ts">
import type { PropType } from '@vue/runtime-core'
import { Occitan } from '~/models'
import { capitalize } from '~/logic'
import { isYourDialects } from '~/helpers'

defineProps({ dialect: { type: Object as PropType<Occitan>, required: true } })

</script>

<template>
  <div class="dialect-box">
    <div class="dialect-nom-box">
      <h3>{{ dialect.dialect }}</h3>
    </div>
    <div class="subdialects-box">
      <div v-for="(sub, idx) in dialect.subdialects" :key="sub.name">
      <div class="subdialect-box">
        <router-link :to="`/espaci-traduccion/${dialect.dialect}_${sub.name}`">
          <h4>{{ capitalize(sub.name) }}</h4>
          <p class="text">Total de las frasas tradusidas <span>{{ sub.totalTranslated }}</span></p>
          <div v-if="isYourDialects(dialect.dialect, sub.name)" class="by-you">
           <jam:write width="20" height="20" color="#507d82"></jam:write>
           <p class="text total-translated">Dont <span>{{ sub.totalTranslatedByTranslator }}</span> per tieu</p>
          </div>
        </router-link>
      </div>
      <hr v-if="idx < dialect.subdialects.length - 1" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialect-box {
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.dialect-nom-box {
  border-radius: 8px 8px 0 0;
  padding: 10px 0 10px 0;
  background: linear-gradient(to right, #ea4d29 20%, #ed8d83 95%);
  box-shadow: 0 10px 10px -12px #404040;
}

.dialect-nom-box > h3 {
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
}

.subdialects-box {
  border-radius: 0 0 8px 8px;
  border-left: 1.5px solid rgba(152, 152, 152, 0.3);
  border-right: 1.5px solid rgba(152, 152, 152, 0.3);
  border-bottom: 1.5px solid rgba(152, 152, 152, 0.3);
}

.subdialect-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.subdialect-box > a > h4 {
  color: #404040;
  text-align: center;
  padding: 10px 0 4px 0;
}

.subdialect-box > a > p,
.text {
  color: #989898;
  font-size: 0.98rem;
}

.subdialect-box:hover {
  background-color: rgba(152, 152, 152, 0.15);
}

a {
  text-decoration: none;
}

a:visited {
  color: inherit;
}

hr {
  display: flex;
  width: 90%;
  border-radius: 10px 10px 10px 10px;
  opacity: 0.3;
  height: 1.5px;
  border: 0;
  background-color: #989898;
  margin-top: 0px;
  margin-bottom: 0px;
}

.by-you {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 0.4rem;
}

span {
  color: #ea4d29;
  font-weight: bold;
}

.total-translated {
  font-size: 0.85rem !important;
}
</style>
