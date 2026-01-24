export const popup = {
  props: ['title', 'fullscreen'],
  data () {
    return {
      active: 0
    }
  },
  watch: {
    active (val) {
      if (val === 1) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  template: `
    <div v-if="active==1">
      <div class="popup-back" @click="active=0"></div>
      
      <div class="popup" :class="{ 'is-fullscreen': fullscreen }" ref="popup">
        
        <div class="head-popup">
          <div class="head-title">{{ title }}</div>
          <a href="#" class="close-btn" @click.prevent="active=0">
            <i class="fas fa-window-close"></i>
          </a>
        </div>
        
        <div class="popup-inner">
          <slot /> 
        </div>

      </div>
    </div>
  `
}
