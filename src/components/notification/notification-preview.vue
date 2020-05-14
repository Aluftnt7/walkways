<template>
    <section class="notification-preview">
        <div class="notification-header">
          <p>{{notification.from.fullName}}: {{notification.txt || 'I heard about your project and I really like it, can I sign up for it?'}}</p>
          <img
            src="https://image.flaticon.com/icons/svg/39/39220.svg"
            alt
            @click.prevent="deleteNotification"
          />
        </div>
        <div class="notification-details">
          <p>About the project: {{notification.proj.title}}</p>
          <p
            v-if="notification.proj.createdById === userId"
          >Members intrested:{{notification.memebersApllied}}</p>
          <section v-if="notification.proj.createdById === userId">
            <button @click="onApprove">Approve!</button>
            <button @click="onDecline">Decline</button>
          </section>
        </div>
    </section>
</template>

<script>
import {eventBus} from '../../services/eventbus-service.js'
export default {
    props: {
        notification: Object,
        userId: String
    },
    methods: {
        deleteNotification(){
            eventBus.$emit('deleteNotification', this.notification)
        },
        onApprove(){
            eventBus.$emit('onApprove', this.notification)
        },
        onDecline(){
            eventBus.$emit('onDecline', this.notification)
        }
    },
}
</script>