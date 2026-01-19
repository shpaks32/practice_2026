export const login = {
  data: function () {
    return {
      img: 1,
      hs: 0,
      parent: ''
    }
  },
  mounted: function () {
    this.img = this.randomIntFromInterval(1, 7)
    this.parent = this.$root
  },
  methods: {
    randomIntFromInterval (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  },
  template: `
        <div class="flex">
            LOGIN
        </div>
    `
}
