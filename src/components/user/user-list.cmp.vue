<template>
    <li class="user-list">
        <button @click="$emit('removeUser', user._id)">Delete User</button>
        <router-link :to="'/userEdit/' + user._id">Updete User</router-link>
        <h2>{{user.fullName}}</h2>
        <img :src="user.imgUrl" :alt="user.fullName">
        <!-- <h3>Karma: {{user.karma}}</h3> -->
        <!-- <h3>Join At- date: {{user.joinAt.date}} time: {{user.joinAt.time}}</h3> -->
        
    </li>
</template>

<script>
// import {eventBus} from '../services/eventbus-service.js';
// import reviewList from '../components/review-list.cmp.vue';

export default {
    name: 'user-list',
    props: ['user'],
    components: {
        // reviewList,
    },
}
</script>
