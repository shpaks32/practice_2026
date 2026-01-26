export const header = {
  data () {
    return {
      user: {},
      parent: '',
      active: 0,
      menu: 0
    }
  },
  mounted () {
    this.parent = this.$parent.$parent.$parent
  },
  methods: {
    toogleActive () {
      this.active = this.active === 1 ? 0 : 1
    }
  },
  template: `
    <header class="header">
      <msg ref="msg"/>
      
      <div class="wrapper">
        <div class="flex-container">
          
          <div class="user-section" v-if="parent.user && parent.user.user">
            <div id="user-circle" @click="toogleActive()">
              {{ parent.user.user[0] }}
            </div>
            
            <i @click="toogleActive()" class="fas fa-caret-down"></i>

            <div id="user-info" :class="{active: active==1}">
              <a href="#" @click.prevent="parent.logout()">
                <i class="fas fa-sign-out-alt"></i> {{ parent.user.user }} Log out
              </a>
            </div>
          </div>

          <nav class="nav-section">
          <div class = 'mobile-menu-btn'>
          </div>
            <ul :class="{active: menu==1}" v-if="parent.user && parent.user.type == 'admin'">
              <li v-if="menu==1" class="close-li"><i class="fas fa-times" @click="menu=0"></i></li>
              <li>
                <router-link to="/users" :class="{'router-link-active': $route.path.indexOf('user') !== -1}">
                  <i class="fas fa-users"></i> Users
                </router-link>
              </li>
              <li>
                <router-link to="/campaigns" :class="{'router-link-active': $route.path.indexOf('campaign') !== -1}">
                  <i class="fas fa-bullhorn"></i> Campaigns
                </router-link>
              </li>
            </ul>
            

            <ul :class="{active: menu==1}" v-if="parent.user && parent.user.type != 'admin'">
              <li v-if="menu==1" class="close-li"><i class="fas fa-times" @click="menu=0"></i></li>
              <li><router-link to="/statistics"><i class="fas fa-chart-area"></i> Statistics</router-link></li>
              <li><router-link to="/ads"><i class="fas fa-image"></i> Ads</router-link></li>
              <li><router-link to="/sites"><i class="fab fa-chrome"></i> Sites</router-link></li>
              <li><router-link to="/payments"><i class="fas fa-credit-card"></i> Payments</router-link></li>
            </ul>
          </nav>

          <div class="logo-section">
             <img :src="parent.url + '/app/views/images/logo.svg'" v-if="parent.url" />
          </div>

        </div>
      </div>
    </header>
  `
}
