export const toogle = {
  props: {
    modelValue: [String, Number, Boolean]
  },
  data () {
    return {
      value: false
    }
  },
  watch: {
    modelValue (val) {
      this.value = val === '1' || val === 1 || val === 'true' || val === true
    }
  },
  mounted () {
    this.value =
      this.modelValue === '1' ||
      this.modelValue === 1 ||
      this.modelValue === 'true' ||
      this.modelValue === true
  },
  methods: {
    change () {
      const payload = this.value ? '1' : '0'
      this.$emit('update:modelValue', payload)
    }
  },
  template: `
    <label class="switch-pretty">
      <input type="checkbox" v-model="value" @change="change()">
      
      <div class="switch-track"></div>
      
      <div class="switch-knob">
        <i class="fas fa-check icon-on"></i>
        <i class="fas fa-times icon-off"></i>
      </div>
    </label>
  `
}
