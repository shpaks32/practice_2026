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
