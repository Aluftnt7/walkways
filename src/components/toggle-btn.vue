

 <template>
    <label class="switch">
                <input type="checkbox" 
                    @click="toggle" :checked="isOn" 
                /> 
                <div></div>
            </label>
</template>
<script>

export default {
  name: 'toggle-btn',
 props: {
   value: Boolean
  },
  data(){
            return { isOn: this.value }
        },
        methods: {
            toggle() {
                this.isOn = !this.isOn;
                this.$emit('input', this.isOn)
            }
        },
 
    
 
}
</script>


<style scoped>


.switch input {
  position: absolute;
  opacity: 0;
}

.switch {
  display: inline-block;
  font-size: 20px; /* 1 */
  height: 1em;
  width: 2em;
  background: #BDB9A6;
  border-radius: 1em;
}

.switch div {
  height: 1em;
  width: 1em;
  border-radius: 1em;
  background: #FFF;
  box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.3);
  transition: all 300ms;
}

.switch input:checked + div {
    transform: translate3d(100%, 0, 0);
    background: greenyellow;
}

</style>
