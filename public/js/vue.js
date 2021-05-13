const app = Vue.createApp({
    data() {
        return {
            total_time: 180,
            total_min: 1,
            total_sec: 60,
            min_left: 1,
            sec_left: 60,
            time_up: false,
        }
    },
    methods: {
        updateTime(){
            this.sec_left--;
            if(this.sec_left == 0){
                if(this.min_left > 0){
                    this.min_left--;
                    this.sec_left = 60;
                }
                else{
                    this.time_up = true;
                }
            }
        },
        clock(){
            this.updateTime();
            setInterval(function () {
                this.updateTime();
              }.bind(this), 1000); 
        }
    },
    created () {
        this.clock();
    }
});

app.mount('#test');