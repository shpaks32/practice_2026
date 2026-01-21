export const login = {
  data: function () {
    return {
      img: 1,
      parent: null
    }
  },
  mounted: function () {
    this.img = this.randomIntFromInterval(1, 7)
    this.parent = this.$root
  },
  methods: {
    randomIntFromInterval: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    login: function () {
      var self = this
      if (!self.parent.formData) {
        console.error('formData not found in parent')
        return
      }

      var data = self.parent.toFormData(self.parent.formData)

      axios
        .post(self.parent.url + '/site/login', data)
        .then(function (response) {
          if (response.data.error) {
            if (self.$refs.msg) {
              self.$refs.msg.alertFun(response.data.error)
            } else {
              alert(response.data.error)
            }
          } else if (response.data.user) {
            self.parent.user = response.data.user
            window.localStorage.setItem(
              'user',
              JSON.stringify(self.parent.user)
            )
            self.parent.page('/campaigns')
          }
        })
        .catch(function (error) {
          console.log('Error:', error)
        })
    }
  },
  template: `
    <div class="login-container">
        <msg ref="msg"></msg>

        <div id="left-area" class="image-side">
            <img 
                v-if="parent && parent.url"
                :src="parent.url+'/app/views/images/Cover_'+img+'.jpg'" 
                class="bg-cover"
            />
        </div>

        <div id="right-area" class="form-side">
            <div class="login-header">
                <div class="title-logo-wrapper">
                    <div class="title">
                        <h1>Affiliate Sign in</h1>
                    </div>
                    <div class="logo">
                        <img :src="parent.url+'/app/views/images/logo.svg'" alt="Logo" v-if="parent && parent.url" />
                    </div>
                </div>
            </div>

            <div class="form-wrapper">
                <form @submit.prevent="login()" v-if="parent && parent.formData">
                    <div class="row">
                        <label>Email</label>
                        <input type="email" v-model="parent.formData.email" required placeholder="">
                    </div>
                    <div class="row">
                        <label>Password</label>
                        <input type="password" v-model="parent.formData.password" required autocomplete="on" placeholder="">
                    </div>
                    <div class="row btn-row">
                        <button class="btn-success">SIGN IN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
}
