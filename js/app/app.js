import { router } from './router.js'
import { header } from './widgets/header.js'
import { popup } from './widgets/popup.js'
import { msg } from './widgets/msg.js'

document.addEventListener('DOMContentLoaded', function () {
  const main = {
    data () {
      return {
        url: 'https://affiliate.yanbasok.com',
        user: { name: '', phone: '', email: '', date: '', auth: '' },
        formData: {},
        title: '',
        date: '',
        time: ''
      }
    },
    watch: {
      $route: function () {
        this.init()
      }
    },
    mounted: function () {
      this.init()
    },
    methods: {
      init () {
        const localUser = window.localStorage.getItem('user')
        if (localUser) {
          this.user = JSON.parse(localUser)
        }

        router.isReady().then(() => {
          const commonPages = ['/campaigns', '/campaign', '/users', '/user']
          const adminPages = ['/statistics', '/payments', '/sites']
          const currentPath = this.$route.path

          if (this.user && this.user.auth) {
            if (currentPath == '/' && this.user.type === 'admin') {
              this.page('/campaigns')
            } else if (
              commonPages.includes(currentPath) &&
              this.user.type !== 'admin'
            ) {
              this.page('/statistics')
            } else if (
              adminPages.includes(currentPath) &&
              this.user.type === 'admin'
            ) {
              this.page('/campaigns')
            }
          } else {
            const allProtected = [...commonPages, ...adminPages]
            if (allProtected.includes(currentPath)) {
              this.page('/')
            }
          }
        })
      },
      logout () {
        this.user = { name: '', phone: '', email: '', date: '', auth: '' }
        window.localStorage.setItem('user', '')
        this.page('/')
      },
      scrollTop () {
        setTimeout(function () {
          window.scroll({ top: 0, behavior: 'smooth' })
        }, 50)
      },
      scrollBottom () {
        setTimeout(function () {
          window.scroll({ top: 1000, behavior: 'smooth' })
        }, 50)
      },
      page (path = '') {
        if (path) {
          this.$router.replace(path)
        }
        this.$nextTick(() => {
          if (this.$route.name) {
            this.title = this.$route.name
            document.title = this.$route.name
          }
        })
      },
      toFormData (obj) {
        const fd = new FormData()
        for (let x in obj) {
          if (
            typeof obj[x] === 'object' &&
            obj[x] !== null &&
            x !== 'img' &&
            x !== 'copy'
          ) {
            for (let y in obj[x]) {
              if (typeof obj[x][y] === 'object' && obj[x][y] !== null) {
                for (let z in obj[x][y]) {
                  fd.append(`${x}[${y}][${z}]`, obj[x][y][z])
                }
              } else {
                fd.append(`${x}[${y}]`, obj[x][y])
              }
            }
          } else if (x !== 'copy') {
            fd.append(x, obj[x])
          }
        }
        return fd
      }
    }
  }

  const app = Vue.createApp(main)
    .component('Header', header)
    .component('popup', popup)
    .component('msg', msg)
    .use(router)

  app.mount('#content')
})
