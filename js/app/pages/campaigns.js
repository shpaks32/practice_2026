export const campaigns = {
  data () {
    return {
      parent: '',
      data: {},
      details: {},
      date: '',
      date2: '',
      q: '',
      sort: '',
      loader: 1,
      iChart: -1,
      id: 0,
      type: 0,
      all: true
    }
  },
  mounted () {
    this.parent = this.$parent.$parent

    if (!this.parent.user) {
      this.parent.logout()
    }

    // this.GetFirstAndLastDate()
    this.get()
  },
  methods: {
    GetFirstAndLastDate () {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()
      const firstDayOfMonth = new Date(year, month, 2)
      const lastDayOfMonth = new Date(year, month + 1, 1)

      this.date = firstDayOfMonth.toISOString().substring(0, 10)
      this.date2 = lastDayOfMonth.toISOString().substring(0, 10)
    },
    get () {
      const data = new FormData()

      if (this.date) data.append('date', this.date)
      if (this.date2) data.append('date2', this.date2)

      if (this.q) data.append('q', this.q)
      if (this.sort) data.append('sort', this.sort)

      this.loader = 1

      axios
        .post(
          this.parent.url + '/site/getCampaigns?auth=' + this.parent.user.auth,
          data
        )
        .then(response => {
          this.data = response.data
          this.loader = 0
        })
        .catch(error => {
          this.parent.logout()
        })
    },
    getChart () {
      if (this.iChart === -1 || !this.data.items[this.iChart]) return

      let item = this.data.items[this.iChart]

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
          let resItem = response.data.items
            ? response.data.items
            : response.data

          if (resItem) {
            if (resItem.line) this.data.items[this.iChart].line = resItem.line
            if (resItem.sites)
              this.data.items[this.iChart].sites = resItem.sites

            if (resItem.clicks !== undefined)
              this.data.items[this.iChart].clicks = resItem.clicks
            if (resItem.views !== undefined)
              this.data.items[this.iChart].views = resItem.views
            if (resItem.leads !== undefined)
              this.data.items[this.iChart].leads = resItem.leads
          }

          this.renderChart(this.data.items[this.iChart])
        })
        .catch(error => {
          console.log('Chart error', error)
        })
    },
    action () {
      this.parent.formData.copy = ''
      const data = this.parent.toFormData(this.parent.formData)

      axios
        .post(
          this.parent.url +
            '/site/actionCampaign?auth=' +
            this.parent.user.auth,
          data
        )
        .then(response => {
          if (this.$refs.new) this.$refs.new.active = 0

          if (this.parent.formData.id) {
            this.$refs.header.$refs.msg.successFun(
              'Successfully updated campaign!'
            )
          } else {
            this.$refs.header.$refs.msg.successFun(
              'Successfully added new campaign!'
            )
          }
          this.get()
        })
        .catch(error => {
          console.log('errors', error)
        })
    },
    async del () {
      if (
        await this.$refs.header.$refs.msg.confirmFun(
          'Please confirm next action',
          'Do you want to delete this campaign?'
        )
      ) {
        const data = this.parent.toFormData(this.parent.formData)

        axios
          .post(
            this.parent.url +
              '/site/deleteCampaign?auth=' +
              this.parent.user.auth,
            data
          )
          .then(response => {
            if (response.data.error) {
              this.$refs.header.$refs.msg.alertFun(response.data.error)
            } else {
              this.$refs.header.$refs.msg.successFun(
                'Successfully deleted campaign!'
              )
              this.get()
            }
          })
          .catch(error => {
            console.log('errors', error)
          })
      }
    },
    getDetails (id, type) {
      console.log('Get details for:', id, 'Type:', type)
    },
    line: function (item) {
      this.$nextTick(() => {
        const container = document.getElementById('chartOuter')
        if (container) {
          container.innerHTML =
            '<div style="padding:20px; text-align:center">Loading...</div>'
          this.getChart()
        } else {
          console.error('Element #chartOuter not found via getElementById')
        }
      })
    },
    renderChart: function (item) {
      const self = this

      if (window.myLineChart) {
        window.myLineChart.destroy()
      }

      if (!document.getElementById('chartOuter')) return

      setTimeout(function () {
        const container = document.getElementById('chartOuter')
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

        const hintsDiv = document.getElementById('chartHints')
        if (!hintsDiv) {
          container.innerHTML = `
            <div id="chartHints">
                <div class="chartHintsViews">Views</div>
                <div class="chartHintsClicks">Clicks</div>
            </div>
            <canvas id="myChart"></canvas>`
        }

        const ctx = document.getElementById('myChart')
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
                ctx.drawImage(
                  label,
                  x.getPixelForValue(index) - width / 2,
                  x.top,
                  width,
                  width
                )
              })
            }
            ctx.restore()
          }
        }

        window.myLineChart = new Chart(ctx, {
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
                pointRadius: 3,
                pointHoverRadius: 5
              },
              {
                label: 'Views',
                backgroundColor: '#5000B8',
                borderColor: '#5000B8',
                data: views,
                yAxisID: 'y2',
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                bodyFont: { size: 14 },
                usePointStyle: true,
                callbacks: {
                  title: context => context[0].dataset.label
                }
              },
              legend: { display: false }
            },
            layout: {
              padding: { bottom: 10, left: 10, right: 10 }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                grid: {
                  drawOnChartArea: false
                }
              },
              y2: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                grid: {
                  color: '#e5e5e5'
                }
              },
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  font: {
                    size: 10
                  }
                },
                afterFit: scale => {
                  scale.height = 60
                }
              }
            }
          }
        })
      }, 100)
    },
    checkAll: function (prop) {
      const currentItem = this.data.items[this.iChart]
      if (currentItem && currentItem.sites) {
        Object.values(currentItem.sites).forEach(site => {
          site.include = prop
        })
      }
      if (this.parent) {
        this.parent.formData = currentItem
      }
      this.getChart()
    }
  },

  template: `
  <div class="inside-content">
    <Header ref="header" />
    
    <div id="spinner" v-if="loader">
       <img src="images/loader.gif" alt="Loading..." />
    </div>
    
    <div class="wrapper">
      <div class="flex panel">
      <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=1"><i class="fas fa-plus"></i> New</a>
        <div class="w20"></div>

        <div class="w60 ptb20 ac">
          <input type="date" v-model="date" @change="get()" /> 
          <span style="margin: 0 5px; color: #888;">-</span>
          <input type="date" v-model="date2" @change="get()" />
        </div>

        <popup ref="chart" fullscreen="true" title="Chart">
          <div class="flex panel">
            <div class="w30 ptb25">
              <input type="date" v-model="date" @change="getChart()" />
              <input type="date" v-model="date2" @change="getChart()" />
            </div>

            <div class="w70-al">
              <div class="flex cubes">
                <div class="w30 clicks">
                  <div>Clicks</div>
                  {{ data.items[iChart] ? data.items[iChart].clicks : 0 }}
                </div>
                <div class="w38 views">
                  <div>Views</div>
                  {{ data.items[iChart] ? data.items[iChart].views : 0 }}
                </div>
                <div class="w30 leads">
                  <div>Leads</div>
                  {{ data.items[iChart] ? data.items[iChart].leads : 0 }}
                </div>
                <div class="w38-ctr">
                  <div>CTR</div>
                  {{ (data.items[iChart] && data.items[iChart].views > 0) 
                      ? (data.items[iChart].clicks * 100 / data.items[iChart].views).toFixed(2) 
                      : '0.00' }}%
                </div>
              </div>
            </div>
          </div>

          <div class="flex body">
            <div class="w30 ar filchart">
              <div class="itemchart ptb10" v-if="data.items[iChart] && data.items[iChart].sites">
                <toogle 
                  v-model="all" 
                  @update:modelValue="all = $event; checkAll($event)" 
                />
                ALL
              </div>

              <div 
                class="itemchart ptb10" 
                v-if="data.items[iChart]"
                v-for="(s, index) in data.items[iChart].sites" 
                :key="s.site || index"
              >
                <toogle 
                  v-model="s.include" 
                  @update:modelValue="parent.formData = data.items[iChart]; getChart()" 
                />
                {{ s.site }}
              </div>
            </div>

            <div class="w70" id="chartOuter">
              <div id="chartHints">
                <div class="chartHintsViews">Views</div>
                <div class="chartHintsClicks">Clicks</div>
              </div>
              <canvas id="myChart"></canvas>
            </div>
          </div>
        </popup>

        <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
          <div class="form inner-form">
            <form @submit.prevent="action()" v-if="parent.formData">
              
              <div class="row">
                <label>Name</label>
                <input type="text" v-model="parent.formData.title" required placeholder="Enter campaign name...">
              </div>

              <div class="row pt20 ac">
                <button class="btnS" v-if="parent.formData && parent.formData.id">Save Changes</button>
                <button class="btnS" v-if="parent.formData && !parent.formData.id">Add Campaign</button>
              </div>

            </form>
          </div>
        </popup>
          <h1>Campaigns</h1>

      </div>

      <div class="table" v-if="data.items != ''">
        <table>
          <thead>
            <tr>
              <th class="id">#</th>
              <th class="id"></th>
              <th>Title</th>
              <th class="id">Views</th>
              <th class="id">Clicks</th>
              <th class="id">Leads</th>
              <th class="id">Fraud clicks</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in data.items" :key="item.id || i">
              <td class="id">{{ item.id }}</td>
              <td class="id">
                 <toogle v-model="item.published" @update:modelValue="parent.formData = item;action();" />
              </td>
              <td>
                <router-link :to="'/campaign/' + item.id">{{ item.title }}</router-link>
              </td>
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">
                  {{ item.views }}
                </a>
              </td>
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">
                  <template v-if="item.clicks">{{ item.clicks }}</template>
                  <template v-else>0</template>
                </a>
              </td>
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">
                  <template v-if="item.leads">{{ item.leads }}</template>
                  <template v-else>0</template>
                </a>
              </td>
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                  <template v-if="item.fclicks">{{ item.fclicks }}</template>
                  <template v-else>0</template>
                </a>
              </td>
             <td class="actions">
                <router-link :to="'/campaign/' + item.id">
                    <i class="fas fa-edit"></i>
                </router-link>

                <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chart.active=1; line(item)">
                    <i class="fas fa-chart-bar"></i>
                </a>

                 <a href="#" @click.prevent="parent.formData = item; del();">
                  <i class="fas fa-trash-alt"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty" v-if="data.items == ''">
        No items
      </div>
    </div>
  </div>
`
}
