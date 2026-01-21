export const msg = {
  data: function () {
    return {
      alert: '',
      success: '',
      t1: null,
      t2: null,
      confirmTitle: 'Please confirm next action',
      confirm: '',
      code: 0,
      interval: null
    }
  },
  watch: {},
  mounted () {
    this.parent = this.$root
  },
  methods: {
    fadeIn (el, timeout, display) {
      el.style.opacity = 0
      el.style.display = display || 'block'
      el.style.transition = `opacity ${timeout}ms`
      setTimeout(() => {
        el.style.opacity = 1
      }, 10)
    },
    fadeOut (el, timeout) {
      el.style.opacity = 1
      el.style.transition = `opacity ${timeout}ms`
      el.style.opacity = 0
      setTimeout(() => {
        el.style.display = 'none'
      }, timeout)
    },
    successFun (msg) {
      this.success = msg
      var self = this

      if (self.t1) clearTimeout(self.t1)
      if (self.t2) clearTimeout(self.t2)

      self.t1 = setTimeout(function () {
        const block = document.querySelector('.successMsg')
        if (block) {
          self.fadeIn(block, 1000, 'flex')
          self.t2 = setTimeout(function () {
            self.fadeOut(block, 1000)
            setTimeout(() => {
              self.success = ''
            }, 1000)
          }, 3000)
        }
      }, 100)
    },
    alertFun (msg) {
      this.alert = msg
      var self = this

      if (self.t1) clearTimeout(self.t1)
      if (self.t2) clearTimeout(self.t2)

      self.t1 = setTimeout(function () {
        const block = document.querySelector('.alertMsg')
        if (block) {
          self.fadeIn(block, 1000, 'flex')
          self.t2 = setTimeout(function () {
            self.fadeOut(block, 1000)
            setTimeout(() => {
              self.alert = ''
            }, 1000)
          }, 3000)
        }
      }, 100)
    }
  },
  template: `
        <div class="alertMsg" v-if="alert" style="display: none;">
            <div class="wrapper al">
                <i class="fas fa-times-circle"></i> {{ alert }}
            </div>
        </div>

        <div class="successMsg" v-if="success" style="display: none;">
            <div class="wrapper al">
                <i class="fas fa-check-circle"></i> {{ success }}
            </div>
        </div>
    `
}
