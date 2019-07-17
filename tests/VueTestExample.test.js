import { shallowMount } from '@vue/test-utils'
import Example from '../src/components/SimplePaginate.vue'
import flushPromises from 'flush-promises'
import linq from 'linq'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('test', () => {

    let wrap
    const findByValue = (selector, text) => {
        const w = wrap.findAll(selector)
        return linq.range(0, w.length)
            .where(x => w.at(x).text() === text)
            .select(x => w.at(x))
            .first()
    }

    beforeEach(() => {
        const mock = new MockAdapter(axios)

        wrap = shallowMount(Example, {
            propsData: {
                mock: mock
            }
        })
    })

    it('first view check', async () => {
        await flushPromises()

        expect(wrap.text()).toMatch('test1')

        expect(wrap.findAll('li').at(0).classes()).toContain('disabled')
        expect(wrap.findAll('li').at(1).classes()).toContain('active')
        expect(wrap.findAll('li').at(1).text()).toMatch('1')
        expect(wrap.findAll('li').at(2).text()).toMatch('2')
        expect(wrap.findAll('li').at(3).text()).toMatch('3')
        expect(wrap.findAll('li').at(4).classes()).not.toContain('disabled')
    })

    it('click paginate num button check', async () => {
        await flushPromises()
        const button = findByValue('button', '2')
        button.trigger('click')
        await flushPromises()
        expect(wrap.text()).toMatch('test4')
    })

    it('click paginate next button check', async () => {
        await flushPromises()
        const button = findByValue('button', '次へ')

        button.trigger('click')
        await flushPromises()
        expect(wrap.text()).toMatch('test4')

        button.trigger('click')
        await flushPromises()
        expect(wrap.text()).toMatch('test7')

        button.trigger('click')
        await flushPromises()
        expect(wrap.text()).toMatch('test11')

        button.trigger('click')
        await flushPromises()
        expect(wrap.text()).toMatch('test14')
        expect(wrap.findAll('li').at(4).classes()).toContain('disabled')
    })

    it('before button class check', async () => {
        await flushPromises()
        const button = findByValue('button', '次へ')
        button.trigger('click')
        await flushPromises()
        const li = wrap.findAll('li').at(0)
        expect(li.classes()).not.toContain('disabled')
    })

})
