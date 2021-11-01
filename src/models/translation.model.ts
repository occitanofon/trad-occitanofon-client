export class Translations {
  occitan: {
    content: string
    placeholder: string
  }

  french: {
    content: string
    placeholder: string
  }

  english: {
    content: string
    placeholder: string
  }

  constructor() {
    this.occitan = {
      content: '',
      placeholder: '',
    }
    this.french = {
      content: '',
      placeholder: '',
    }
    this.english = {
      content: '',
      placeholder: '',
    }
  }
}

class TranslationsInputs {
  original: Translations
  feminine: Translations

  constructor() {
    this.original = {
      occitan: {
        content: '',
        placeholder: 'Aicí, tradutz la frasa çai-sus dins ton dialècte.',
      },
      french: {
        content: '',
        placeholder: 'Aicí, tradutz la frasa çai-sus en francés',
      },
      english: {
        content: '',
        placeholder: 'Aicí, tradutz la frasa çai-sus en francés.',
      },
    }
    this.feminine = {
      occitan: {
        content: '',
        placeholder: 'Aicí, feminiza la frasa en occitan qu\'as traducha a esquèrra.',
      },
      french: {
        content: '',
        placeholder: 'Aicí, feminiza la frasa en francés qu\'as traducha a esquèrra.',
      },
      english: {
        content: '',
        placeholder: 'Aicí, feminiza la frasa en anglés qu\'as traducha a esquèrra.',
      },
    }
  }
}

interface TranslationBoxEmitter {
  id: string;
  status: boolean;
}

interface Translation {
  oc: string
  fr: string
  en?: string
  datasetID: string
  occitan: string
}

interface Subdialect {
  name: string
  files: {
    fr: string
    en: string
  }
}

interface TranslationFile {
  dialect: string
  subdialects: Subdialect[]
}

export { TranslationsInputs, TranslationBoxEmitter, Translation, Subdialect, TranslationFile }
