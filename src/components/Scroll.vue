<template>
    <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="200">

            <div class="col-12"
                 style="flex-direction: column; justify-content: center; overflow-y: auto;">
                <div class="border"
                     v-for="data in paginate.data"
                     v-if="paginate.hasData">
                    <h3>{{ data.name }}</h3>
                </div>

                <div v-if="busy" class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Paginate from '../models/Paginate'
    import linq from 'linq'
    import MockAdapter from 'axios-mock-adapter'

    export default {
        name: 'scroll',

        data() {
            return {
                // mock: new MockAdapter(axios),
                paginate: new Paginate(),
                url: '/list/scroll',
                busy: false,
            }
        },

        props: {
          mock: {
              type: MockAdapter,
              required: true,
          }
        },

        async created() {
            this.paginate.setModel(ScrollModel)
            this.paginate.setLimit(3)
            this.setup()
            await this.fetch()
        },

        methods: {

            setup() {
                const firstPageUrl = this.url + '?page=1'

                const lastPage = 5
                const perPage = 3
                let count = 1

                const baseRes = {
                    data: [{}, {}, {}, {}, {}, {}],
                    current_page: 1,
                    first_page_url: firstPageUrl,
                    last_page: lastPage,
                    last_page_url: this.url + '?page=' + lastPage,
                    next_page_url: this.url + '?page=2',
                    path: this.url,
                    per_page: perPage,
                    prev_page_url: firstPageUrl,
                    to: 30,
                    total: 31,
                }

                linq.range(1, lastPage)
                    .forEach(x => {
                        const res = Object.assign({}, baseRes)
                        const list = []

                        linq.from(baseRes.data)
                            .forEach(x => {
                                list.push({id: count, name: 'test' + count})
                                count++
                            })

                        res.data = list
                        res.current_page = x
                        res.total = lastPage * res.data.count

                        if (x === lastPage) {
                            res.next_page_url = null
                        } else {
                            res.next_page_url = this.url + '?page=' + (x + 1)
                        }

                        if (x === 1) {
                            res.prev_page_url = null
                        } else {
                            res.prev_page_url = this.url + '?page=' + (x - 1)
                        }

                        res.to = count - 1

                        this.mock.onGet(this.url + '?page=' + x).reply(200, res)

                    })
            },

            async fetch(path) {
                if (!path) {
                    path = this.url + '?page=1'
                }

                const {data} = await axios.get(path)
                this.paginate.create(data)
            },

            async loadMore() {
                if (this.busy || !this.paginate.hasNext) {
                    return
                }

                this.busy = !this.busy
                await this.paginate.nextUpdate()
                this.busy = !this.busy
            },
        }
    }

    class ScrollModel {
        constructor(data) {
            this.id = 0
            this.name = ''

            if (data) {
                this.create(data)
            }
        }

        create(data) {
            this.id = data.id
            this.name = data.name
        }
    }
</script>