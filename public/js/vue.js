const app = Vue.createApp({
    data() {
        return {
            test: true,
            test_name: "Abacus Level 1 - Free",
            test_time: "5 mins",
            total_questions: "4",
            total_time: 180,
            total_min: 0,
            total_sec: 30,
            min_left: 0,
            sec_left: 30,
            time_up: false,
            questions: [
                {id:1,question:'020000\n+30000\n+50000\n+20000\n+00300\n+50000','a':10,'b':11,'c':12,'d':13},
                {id:2,question:'04\n+5\n+7','a':10,'b':16,'c':12,'d':13},
                {id:3,question:'06\n+7\n+8\n+9','a':10,'b':11,'c':12,'d':30},
                {id:4,question:'07\n+8\n+9','a':24,'b':11,'c':12,'d':13}],
            answers: [null,null,null,null],
            buttons1: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
            
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
        changeQuestion(questionNumber){
            console.log(questionNumber);
            this.current_question = questionNumber-1;
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