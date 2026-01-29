export const img = {
  props: {
    modelValue: String
  },
  data: function () {
    return {
      value: ''
    }
  },
  mounted () {
    this.parent = this.$parent.$parent.$parent.$parent
    if (this.modelValue !== undefined) {
      this.value = this.parent.url + '/' + this.modelValue
    }
  },
  methods: {
    change (event) {
      var self = this
      var file = event.target.files[0]
      if (file) {
        var reader = new FileReader()
        reader.onload = function (e) {
          self.value = e.target.result
        }
        reader.readAsDataURL(file)
        this.$emit('update:modelValue', file)
      }
    }
  },
  template: `
    <div>
        <div class="image-preview-area">
            <a href="#" class="select_img" @click.prevent="$refs.input.click()">
                <span v-if="value">
                    <img :src="value" class="im">
                </span>
                <span v-if="!value">
                    <img src="/images/placeholder.png" >
                </span>
            </a>
        </div>
        <input type="file" style="display:none" data-name="image" ref="input" accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml" @change="change($event)">
    </div>
    `
}
