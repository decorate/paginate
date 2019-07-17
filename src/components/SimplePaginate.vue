<template>
    <div>
        <div class="col-md-1">
        <table class="table table-bordered table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="data in paginate.data" v-if="paginate.hasData">
                <td>{{ data.id }}</td>
                <td>{{ data.name }}</td>
            </tr>
            </tbody>
        </table>
        </div>

        <div id="paginate">
            <div class="row" v-if="paginate.currentPage">
                <div class="col-sm-12">
                    <ul class="pagination">
                        <li class="page-item"
                            :class="{disabled: paginate.prev.disabled}">
                            <button @click="fetch(paginate.prev.path)"
                               class="page-link"
                               :disabled="paginate.prev.path.disabled">
                                前へ
                            </button>
                        </li>
                        <li class="page-item"
                            :class="{active: number.active}"
                            v-for="number in paginate.linkNumbers">
                            <button class="page-link"
                                    @click="fetch(number.path)">{{ number.num }}</button>
                        </li>
                        <li class="page-item"
                            :class="{disabled: paginate.next.disabled}">
                            <button class="page-link"
                               @click="fetch(paginate.next.path)"
                               :disabled="paginate.next.path.disabled">
                                次へ
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import MockAdapter from 'axios-mock-adapter'
    import axios from 'axios'
    import Paginate from '../models/Paginate'
    import linq from 'linq'

    export default {
        name: 'simple-paginate',

        data() {
            return {
                // mock: new MockAdapter(axios),
                paginate: new Paginate(),
                url: '/list/simple',
            }
        },

        props: {
            mock: {
                type: MockAdapter,
                required: true,
            }
        },

        async created() {
            this.paginate.auto = false
            this.paginate.setModel(new SimpleModel())
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
                    data: [{}, {}, {}],
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
        }
    }

    class SimpleModel {
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