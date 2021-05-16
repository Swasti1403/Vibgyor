const app = Vue.createApp({
    data() {
        return {
            test_name: "Abacus Level 1 - Free",
            test_time: "5 mins",
            total_questions: "4",
            total_time: 180,
            total_min: 0,
            total_sec: 30,
            min_left: 0,
            sec_left: 30,
            time_up: false,
            questions: ['2+3+5','4+5+7','6+7+8+9','7+8+9'],
            options: [{'a':10,'b':11,'c':12,'d':13},{'a':10,'b':16,'c':12,'d':13},{'a':10,'b':11,'c':12,'d':30},{'a':24,'b':11,'c':12,'d':13}],
            current_question: 0,
            test_started: false,
        }
    },
    methods: {
        nextQuestion(){
            if(this.current_question + 1 < this.questions.length){
                this.current_question++;
            }
        },
        prevQuestion(){
            if(this.current_question -1 > -1){
                this.current_question--;
            }
        },
        startTest(){
            this.test_started = true;
            this.clock();
        },
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
    }
});

app.mount('#test');