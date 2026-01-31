export const user = {
  data: function () {
    return {
      parent: '',
      data: {},
      user: [],
      tab: 0,
      tabs: ['Statistic', 'Sites', 'Payments'],
      date: '',
      date2: '',
      iChart: -1,
      loader: 1,
      myChartInstance: null,
      mySiteChart: null
    }
  },
  mounted: function () {
    this.parent = this.$parent.$parent

    if (!this.parent.user) {
      this.parent.logout()
    }

    if (!this.parent.$route.params.id) {
      this.parent.page('/users')
    }

    this.GetFirstAndLastDate()
    this.get()
  },
  methods: {
    GetFirstAndLastDate: function () {
      var year = new Date().getFullYear()
      var month = new Date().getMonth()
      var firstDayOfMonth = new Date(year, month, 2)
      var lastDayOfMonth = new Date(year, month + 1, 1)
      this.date = firstDayOfMonth.toISOString().substring(0, 10)
      this.date2 = lastDayOfMonth.toISOString().substring(0, 10)
    },
    get: function () {
      var self = this
      var data = self.parent.toFormData(self.parent.formData)
      data.append('id', this.parent.$route.params.id)
      data.append('uid', this.parent.$route.params.id)
      if (this.date != '') data.append('date', this.date)
      if (this.date2 != '') data.append('date2', this.date2)

      self.loader = 1

      axios
        .post(
          this.parent.url + '/site/getUser?auth=' + this.parent.user.auth,
          data
        )
        .then(function (response) {
          self.loader = 0
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error)
            return false
          }
          self.data = response.data
          if (self.data.info) self.user = self.data.info
          if (self.data.info && self.data.info.user)
            document.title = self.data.info.user
        })
        .catch(function (error) {
          self.parent.logout()
        })
    },
    action: function () {
      var self = this
      var data = self.parent.toFormData(self.parent.formData)

      axios
        .post(
          this.parent.url + '/site/actionUser?auth=' + this.parent.user.auth,
          data
        )
        .then(function (response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error)
            return false
          } else {
            self.$refs.new.active = 0
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun(
                'Successfully updated user!'
              )
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully added new user!'
              )
            }
            self.get()
          }
        })
        .catch(function (error) {
          console.log('errors', error)
        })
    },
    del: async function () {
      if (
        await this.$refs.header.$refs.msg.confirmFun(
          'Please confirm next action',
          'Do you want to delete this user?'
        )
      ) {
        var self = this
        var data = self.parent.toFormData(self.parent.formData)

        axios
          .post(
            this.parent.url + '/site/deleteUser?auth=' + this.parent.user.auth,
            data
          )
          .then(function (response) {
            if (response.data.error) {
              self.$refs.header.$refs.msg.alertFun(response.data.error)
              return false
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully deleted user!'
              )
              self.parent.page('/users')
            }
          })
          .catch(function (error) {
            console.log('errors', error)
          })
      }
    },
    actionStatistic: function () {
      var self = this
      var data = self.parent.toFormData(self.parent.formData)
      data.append('uid', this.parent.$route.params.id)

      axios
        .post(
          this.parent.url +
            '/site/actionStatistic?auth=' +
            this.parent.user.auth,
          data
        )
        .then(function (response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error)
            return false
          } else {
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun(
                'Successfully updated banner!'
              )
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully added new banner!'
              )
            }
            self.get()
          }
        })
        .catch(function (error) {
          console.log('errors: ', error)
        })
    },
    actionPayment: function () {
      var self = this
      var data = self.parent.toFormData(self.parent.formData)
      data.append('uid', this.parent.$route.params.id)

      axios
        .post(
          this.parent.url + '/site/actionPayment?auth=' + this.parent.user.auth,
          data
        )
        .then(function (response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error)
            return false
          } else {
            self.$refs.payment.active = 0
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun(
                'Successfully updated payment!'
              )
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully added new payment!'
              )
            }
            self.get()
          }
        })
        .catch(function (error) {
          console.log('errors: ', error)
        })
    },
    delPayment: async function () {
      if (
        await this.$refs.header.$refs.msg.confirmFun(
          'Please confirm next action',
          'Do you want to delete this payment?'
        )
      ) {
        var self = this
        var data = self.parent.toFormData(self.parent.formData)

        axios
          .post(
            this.parent.url +
              '/site/deletePayment?auth=' +
              this.parent.user.auth,
            data
          )
          .then(function (response) {
            if (response.data.error) {
              self.$refs.header.$refs.msg.alertFun(response.data.error)
              return false
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully deleted payment!'
              )
              self.get()
            }
          })
          .catch(function (error) {
            console.log('errors', error)
          })
      }
    },
    actionSite: function () {
      var self = this
      var data = self.parent.toFormData(self.parent.formData)

      axios
        .post(
          this.parent.url + '/site/actionSite?auth=' + this.parent.user.auth,
          data
        )
        .then(function (response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error)
            return false
          } else {
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun(
                'Successfully updated site!'
              )
            } else {
              self.$refs.header.$refs.msg.successFun(
                'Successfully added new site!'
              )
            }
            self.get()
          }
        })
        .catch(function (error) {
          console.log('errors', error)
        })
    },

    // ----------------------------------------------------
    // ЛОГИКА ДЛЯ ГРАФИКА БАННЕРОВ (Statistic Tab)
    // ----------------------------------------------------
    getStatisticChart () {
      if (this.iChart === -1 || !this.data.statistics[this.iChart]) return

      let item = this.data.statistics[this.iChart]

      this.parent.formData = item
      const data = this.parent.toFormData(this.parent.formData)

      if (this.date) data.append('date', this.date)
      if (this.date2) data.append('date2', this.date2)

      axios
        .post(
          this.parent.url +
            '/site/getCampaignBannersChart?auth=' +
            this.parent.user.auth,
          data
        )
        .then(response => {
          if (response.data.error) {
            this.$refs.header.$refs.msg.alertFun(response.data.error)
            return
          }

          let resItem = response.data.items
            ? response.data.items
            : response.data

          if (resItem) {
            if (resItem.line)
              this.data.statistics[this.iChart].line = resItem.line
            if (resItem.sites)
              this.data.statistics[this.iChart].sites = resItem.sites

            if (resItem.clicks !== undefined)
              this.data.statistics[this.iChart].clicks = resItem.clicks
            if (resItem.views !== undefined)
              this.data.statistics[this.iChart].views = resItem.views
            if (resItem.leads !== undefined)
              this.data.statistics[this.iChart].leads = resItem.leads
          }

          this.renderStatisticChart(this.data.statistics[this.iChart])
        })
        .catch(error => {
          console.log('Chart error', error)
        })
    },
    LineStatistic: function (item) {
      this.$nextTick(() => {
        const container = document.getElementById('chartOuterStats')
        if (container) {
          container.innerHTML =
            '<div style="padding:20px; text-align:center">Loading...</div>'
          this.getStatisticChart()
        }
      })
    },
    renderStatisticChart: function (item) {
      const self = this

      if (this.myChartInstance) {
        this.myChartInstance.destroy()
      }

      if (!document.getElementById('chartOuterStats')) return

      setTimeout(function () {
        const container = document.getElementById('chartOuterStats')
        if (!container) return

        let dates = []
        let clicks = []
        let views = []
        let leads = []
        let images = []

        let current = new Date(self.date)
        let end = new Date(self.date2)

        while (current <= end) {
          let year = current.getFullYear()
          let month = ('0' + (current.getMonth() + 1)).slice(-2)
          let day = ('0' + current.getDate()).slice(-2)

          let keyDateDot = `${day}.${month}.${year}`
          let keyDateDash = `${year}-${month}-${day}`

          dates.push(`${day}.${month}.${year}`)

          let stats = null
          if (item && item.line) {
            stats = item.line[keyDateDot] || item.line[keyDateDash]
          }

          if (stats) {
            clicks.push(parseInt(stats.clicks) || 0)
            views.push(parseInt(stats.views) || 0)
            leads.push(parseInt(stats.leads) || 0)
          } else {
            clicks.push(0)
            views.push(0)
            leads.push(0)
          }
          current.setDate(current.getDate() + 1)
        }

        const hintsDiv = document.getElementById('chartHintsStats')
        if (!hintsDiv) {
          container.innerHTML = `
              <div id="chartHintsStats">
                  <div class="chartHintsViews">Views</div>
                  <div class="chartHintsClicks">Clicks</div>
              </div>
              <canvas id="myChartStats"></canvas>`
        }

        const ctx = document.getElementById('myChartStats')
        if (!ctx) return

        const xScaleImage = {
          id: 'xScaleImage',
          afterDatasetsDraw (chart, args, plugins) {
            const {
              ctx,
              data,
              scales: { x }
            } = chart
            ctx.save()
            if (data.images && data.images.length > 0) {
              data.images.forEach((imageSrc, index) => {
                if (!imageSrc) return
                const label = new Image()
                label.src = imageSrc
                const width = 120
                try {
                  ctx.drawImage(
                    label,
                    x.getPixelForValue(index) - width / 2,
                    x.top,
                    width,
                    width
                  )
                } catch (e) {}
              })
            }
            ctx.restore()
          }
        }

        self.myChartInstance = new Chart(ctx, {
          type: 'line',
          plugins: [xScaleImage],
          data: {
            labels: dates,
            images: images,
            datasets: [
              {
                label: 'Clicks',
                backgroundColor: '#00599D',
                borderColor: '#00599D',
                data: clicks,
                yAxisID: 'y',
                borderWidth: 2,
                pointRadius: 3
              },
              {
                label: 'Views',
                backgroundColor: '#5000B8',
                borderColor: '#5000B8',
                data: views,
                yAxisID: 'y2',
                borderWidth: 2,
                pointRadius: 3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                bodyFont: { size: 14 },
                usePointStyle: true
              },
              legend: { display: false }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true
              },
              y2: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                grid: { color: '#e5e5e5' }
              }
            }
          }
        })
      }, 100)
    },

    // ----------------------------------------------------
    // НОВАЯ ЛОГИКА ДЛЯ ГРАФИКА САЙТОВ (Sites Tab)
    // ----------------------------------------------------
    getSiteChart () {
      if (this.iChart === -1 || !this.data.sites[this.iChart]) return

      let item = this.data.sites[this.iChart]

      this.parent.formData = item
      const data = this.parent.toFormData(this.parent.formData)

      if (this.date) data.append('date', this.date)
      if (this.date2) data.append('date2', this.date2)

      // ! ВАЖНО: Предполагаемый эндпоинт. Если он называется иначе, поменяй тут.
      axios
        .post(
          this.parent.url + '/site/getSiteChart?auth=' + this.parent.user.auth,
          data
        )
        .then(response => {
          if (response.data.error) {
            this.$refs.header.$refs.msg.alertFun(response.data.error)
            return
          }

          let resItem = response.data.items
            ? response.data.items
            : response.data

          // Обновляем данные сайта (line, clicks и т.д.)
          if (resItem) {
            if (resItem.line) this.data.sites[this.iChart].line = resItem.line

            if (resItem.clicks !== undefined)
              this.data.sites[this.iChart].clicks = resItem.clicks
            if (resItem.views !== undefined)
              this.data.sites[this.iChart].views = resItem.views
            if (resItem.leads !== undefined)
              this.data.sites[this.iChart].leads = resItem.leads
          }

          this.renderSiteChart(this.data.sites[this.iChart])
        })
        .catch(error => {
          console.log('Site Chart error', error)
        })
    },
    LineSite: function (item) {
      this.$nextTick(() => {
        const container = document.getElementById('chartOuterSites')
        if (container) {
          container.innerHTML =
            '<div style="padding:20px; text-align:center">Loading...</div>'
          // Запускаем запрос данных
          this.getSiteChart()
        }
      })
    },
    renderSiteChart: function (item) {
      const self = this

      // Уничтожаем старый график сайтов
      if (this.mySiteChart) {
        this.mySiteChart.destroy()
      }

      if (!document.getElementById('chartOuterSites')) return

      setTimeout(function () {
        const container = document.getElementById('chartOuterSites')
        if (!container) return

        let dates = []
        let clicks = []
        let views = []
        let leads = []

        let current = new Date(self.date)
        let end = new Date(self.date2)

        while (current <= end) {
          let year = current.getFullYear()
          let month = ('0' + (current.getMonth() + 1)).slice(-2)
          let day = ('0' + current.getDate()).slice(-2)

          let keyDateDot = `${day}.${month}.${year}`
          let keyDateDash = `${year}-${month}-${day}`

          dates.push(`${day}.${month}.${year}`)

          let stats = null
          if (item && item.line) {
            stats = item.line[keyDateDot] || item.line[keyDateDash]
          }

          if (stats) {
            clicks.push(parseInt(stats.clicks) || 0)
            views.push(parseInt(stats.views) || 0)
            leads.push(parseInt(stats.leads) || 0)
          } else {
            clicks.push(0)
            views.push(0)
            leads.push(0)
          }
          current.setDate(current.getDate() + 1)
        }

        const hintsDiv = document.getElementById('chartHintsSites')
        if (!hintsDiv) {
          container.innerHTML = `
              <div id="chartHintsSites">
                  <div class="chartHintsViews">Views</div>
                  <div class="chartHintsClicks">Clicks</div>
              </div>
              <canvas id="myChartSites"></canvas>`
        }

        const ctx = document.getElementById('myChartSites')
        if (!ctx) return

        self.mySiteChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Clicks',
                backgroundColor: '#00599D',
                borderColor: '#00599D',
                data: clicks,
                yAxisID: 'y',
                borderWidth: 2,
                pointRadius: 3
              },
              {
                label: 'Views',
                backgroundColor: '#5000B8',
                borderColor: '#5000B8',
                data: views,
                yAxisID: 'y2',
                borderWidth: 2,
                pointRadius: 3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                bodyFont: { size: 14 },
                usePointStyle: true
              },
              legend: { display: true }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left'
              },
              y2: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false }
              }
            }
          }
        })
      }, 100)
    }
  },
  template: `
    <div class="inside-content">
        <Header ref="header" />
        <div id='spinner' v-if="loader"></div>
        
        <div class="panelTop">
            <div class="wrapper">
                <div class="flex">
                    <div class="w30 ptb30 pb0">
                        <h1 v-if="data && data.info">{{data.info.user}}</h1>
                    </div>
                    <div class="w50"></div>
                    <div class="w20 al ptb20 pb0">
                        <a class="btnS" href="#" @click.prevent="parent.formData=user; $refs.new.active=1">
                            <i class="fas fa-edit"></i> Edit user
                        </a>
                    </div>
                </div>
                <div class="flex" v-if="data && data.info">
                    <div class="w50">
                        <p><b>Phone:</b> {{data.info.phone}}</p>
                    </div>
                    <div class="w50">
                        <p><b>Email:</b> {{data.info.email}}</p>
                    </div>
                </div>
                <div class="tabs ar">
                    <ul>
                        <li v-if="tabs" v-for="(t, i) in tabs" :class="{active: tab == i}" @click="tab = i">{{t}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="wrapper">
            <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                <div class="form inner-form">
                    <form @submit.prevent="action()" v-if="parent.formData">
                        <div class="row">
                            <label>Name</label>
                            <input type="text" v-model="parent.formData.user" required>
                        </div>
                        <div class="row">
                            <label>Phone</label>
                            <input type="text" v-model="parent.formData.phone" required>
                        </div>
                        <div class="row">
                            <label>Email</label>
                            <input type="text" v-model="parent.formData.email" required>
                        </div>
                        <div class="row">
                            <label>Password</label>
                            <input type="text" v-model="parent.formData.password">
                        </div>
                        <div class="row">
                            <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                            <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                        </div>
                    </form>
                </div>
            </popup>

            <div v-if="tab == 1">
                <div class="flex panel">
                    <div class="w20 ptb10">
                        <h2>{{tabs[tab]}}</h2>
                    </div>
                    <div class="w60 ptb20 ac">
                        <input type="date" v-model="date" @change="get()" />
                        <input type="date" v-model="date2" @change="get()" />
                    </div>
                    <div class="w20 ptb15 al"></div>
                </div>

                <popup ref="chart" fullscreen="true" title="Chart">
                    <div class="flex panel">
                        <div class="w30 ptb25">
                            <input type="date" v-model="date" @change="getSiteChart();" />
                            <input type="date" v-model="date2" @change="getSiteChart();" />
                        </div>
                        <div class="w70 al" v-if="iChart > -1 && data.sites && data.sites[iChart]">
                            <div class="flex cubes">
                                <div class="w30 clicks">
                                    <div>Clicks</div>
                                    {{data.sites[iChart].clicks}}
                                </div>
                                <div class="w30 views">
                                    <div>Views</div>
                                    {{data.sites[iChart].views}}
                                </div>
                                <div class="w30 Leads">
                                    <div>Leads</div>
                                    {{data.sites[iChart].leads}}
                                </div>
                                <div class="w30 ctr">
                                    <div>CTR</div>
                                    {{ data.sites[iChart].views > 0 ? ((data.sites[iChart].clicks * 100) / data.sites[iChart].views).toFixed(2) : 0 }}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex body">
                        <div class="w30 ar filchart"></div>
                        <div class="w70" id="chartOuterSites" style="position: relative; height: 50vh; min-height: 400px;">
                            <div id="chartHintsSites">
                                <div class="chartHintsViews">Views</div>
                                <div class="chartHintsClicks">Clicks</div>
                            </div>
                            <canvas id="myChartSites"></canvas>
                        </div>
                    </div>
                </popup>

                <div class="table" v-if="data.sites">
                    <table>
                        <thead>
                            <tr>
                                <th class="id"></th>
                                <th class="image">Site</th>
                                <th class="id">Views</th>
                                <th class="id">Clicks</th>
                                <th class="id">Leads</th>
                                <th class="id">Fraud clicks</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in data.sites" :key="item.id">
                                <td class="id">
                                    <toogle :modelValue="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionSite()"></toogle>
                                </td>
                                <td class="image">{{item.site}}</td>
                                <td class="id">{{item.views}}</td>
                                <td class="id">
                                    <template v-if="item.clicks">{{item.clicks}}</template>
                                    <template v-else>0</template>
                                </td>
                                <td class="id">
                                    <template v-if="item.leads">{{item.leads}}</template>
                                    <template v-else>0</template>
                                </td>
                                <td class="">
                                    <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                        <template v-if="item.fclicks">{{item.fclicks}}</template>
                                        <template v-else>0</template>
                                    </a>
                                </td>
                                <td class="actions">
                                    <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chart.active=1; LineSite(item)">
                                        <i class="fas fa-chart-bar"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty" v-if="!data.sites || data.sites.length === 0">
                    No items
                </div>
            </div>

            <div v-if="tab == 2">
                <div class="flex panel">
                    <div class="w30 ptb10">
                        <h2>{{tabs[tab]}}</h2>
                    </div>
                    <div class="w50"></div>
                    <div class="w20 al ptb15">
                        <a class="btnS" href="#" @click.prevent="parent.formData={}; $refs.payment.active=1">
                            <i class="fas fa-plus"></i> Add payment
                        </a>
                    </div>
                </div>

                <popup ref="payment" :title="(parent.formData && parent.formData.id) ? 'Edit payment' : 'New payment'">
                    <div class="form inner-form">
                        <form @submit.prevent="actionPayment()" v-if="parent.formData">
                            <div class="row">
                                <label>Value</label>
                                <input type="number" v-model="parent.formData.value" required>
                            </div>
                            <div class="row">
                                <label>Date</label>
                                <input type="date" v-model="parent.formData.date" required>
                            </div>
                            <div class="row">
                                <label>Description</label>
                                <input type="text" v-model="parent.formData.description">
                            </div>
                            <div class="row">
                                <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                            </div>
                        </form>
                    </div>
                </popup>

                <div class="table" v-if="data.payments">
                    <table>
                        <thead>
                            <tr>
                                <th class="id">#</th>
                                <th class="id">Value</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data.payments" :key="item.id">
                                <td class="id">{{item.id}}</td>
                                <td class="id">
                                    <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                        {{item.value}}
                                    </a>
                                </td>
                                <td>
                                    <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                        {{item.date_title}}
                                    </a>
                                </td>
                                <td>{{item.description}}</td>
                                <td class="actions">
                                    <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <a href="#" @click.prevent="parent.formData = item; delPayment();">
                                        <i class="fas fa-trash-alt"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty" v-if="!data.payments || data.payments.length === 0">
                    No items
                </div>
            </div>

            <div v-if="tab == 0">
                <div class="flex panel">
                    <div class="w20 ptb10">
                        <h2>{{tabs[tab]}}</h2>
                    </div>
                    <div class="w60 ptb20 ac">
                        <input type="date" v-model="date" @change="get()" />
                        <input type="date" v-model="date2" @change="get()" />
                    </div>
                    <div class="w20 ptb15 al"></div>
                </div>

                <popup ref="img" title="Banner">
                    <div class="ac">
                        <img :src="parent.url + parent.formData.img" v-if="parent.formData && parent.formData.img" />
                    </div>
                </popup>

                <popup ref="chartStats" fullscreen="true" title="Campaign Chart">
                    <div class="flex panel">
                        <div class="w30 ptb25">
                            <input type="date" v-model="date" @change="getStatisticChart();" />
                            <input type="date" v-model="date2" @change="getStatisticChart();" />
                        </div>
                        <div class="w70 al" v-if="iChart > -1 && data.statistics && data.statistics[iChart]">
                            <div class="flex cubes">
                                <div class="w30 clicks">
                                    <div>Clicks</div>
                                    {{data.statistics[iChart].clicks}}
                                </div>
                                <div class="w30 views">
                                    <div>Views</div>
                                    {{data.statistics[iChart].views}}
                                </div>
                                <div class="w30 Leads">
                                    <div>Leads</div>
                                    {{data.statistics[iChart].leads}}
                                </div>
                                <div class="w30 ctr">
                                    <div>CTR</div>
                                    {{ data.statistics[iChart].views > 0 ? ((data.statistics[iChart].clicks * 100) / data.statistics[iChart].views).toFixed(2) : 0 }}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex body">
                        <div class="w30 ar filchart"></div>
                        <div class="w70" id="chartOuterStats" style="position: relative; height: 50vh; min-height: 400px;">
                             <div id="chartHintsStats">
                                <div class="chartHintsViews">Views</div>
                                <div class="chartHintsClicks">Clicks</div>
                            </div>
                            <canvas id="myChartStats"></canvas>
                        </div>
                    </div>
                </popup>

                <div class="table" v-if="data.statistics">
                    <table>
                        <thead>
                            <tr>
                                <th class="id"></th>
                                <th class="image"></th>
                                <th class="image">Campaign</th>
                                <th>Size</th>
                                <th>Link</th>
                                <th class="id">Views</th>
                                <th class="id">Clicks</th>
                                <th class="id">Leads</th>
                                <th class="id">Fraud clicks</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in data.statistics" :key="item.id">
                                <td class="id">
                                    <toogle :modelValue="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionStatistic()"></toogle>
                                </td>
                                <td class="imageBanner">
                                    <a href="#" @click.prevent="parent.formData=item; $refs.img.active=1">
                                        <img :src="item.img ? (parent.url + item.img) : ''" />
                                    </a>
                                </td>
                                <td class="image">{{item.campaign_title}}</td>
                                <td class="image">{{item.size}}</td>
                                <td>{{item.link}}</td>
                                <td class="id">{{item.views}}</td>
                                <td class="id">
                                    <template v-if="item.clicks">{{item.clicks}}</template>
                                    <template v-else>0</template>
                                </td>
                                <td class="id">
                                    <template v-if="item.leads">{{item.leads}}</template>
                                    <template v-else>0</template>
                                </td>
                                <td class="id">
                                    <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                        <template v-if="item.fclicks">{{item.fclicks}}</template>
                                        <template v-else>0</template>
                                    </a>
                                </td>
                                <td class="actions">
                                    <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chartStats.active=1; LineStatistic(item)">
                                        <i class="fas fa-chart-bar"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty" v-if="!data.statistics || data.statistics.length === 0">
                    No items
                </div>
            </div>
        </div>
    </div>
    `
}
