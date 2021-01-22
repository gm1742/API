import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

new Vue({
   el: '#app',
   data () {
      return {
         form: {
            name: '',
            value: ''
         },
         contacts: []
      }
   },
   computed: {
      canCreate (){
         return this.form.value.trim() && this.form.name.trim()
      }
   },
   methods: {
      async createContact () {
         const {...contact} = this.form

         const responce = await request('/api/contacts', 'POST', contact)

         this.contacts.push(contact)

      },
      async markContact (id) {
         const contact = this.contacts.find(c => c.id === id)
         const updated = await request(`/api/contacts/${id}`, 'PUT', {
            ...contact,
            marked: true
         })
         contact.marked = updated.marked
      },
      async deleteContact (id) {
         await request(`/api/contacts/${id}`, 'DELETE')
         this.contacts = this.contacts.filter(c => c.id !== id)
      }
   },
   async mounted() {
      this.contacts = await request('/api/contacts')

   }
})


async function request(url, method = 'GET', data = null) {
   try {
      const headers = {}
      let body
      if (data) {
         headers['Content-Type'] = 'application/json'
         body = JSON.stringify(data)
      }

      const response = await fetch(url,{
         method,
         headers,
         body
      })
      return await response.json()

   } catch (e) {
      console.warn('Error', e.message)
   }
}
