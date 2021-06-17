// const { default: axios } = require("axios");

const app = Vue.createApp({
    data() {
        return {
            test: true,
            test_name: 'Loading',
            test_time: 'Loading',
            total_questions: 'Loading',
            attempted: '',
            correct_answers: '',
            wrong_answers: '',
            score: '',
            total_score: '',
            min_left: 'Loading',
            sec_left: 'Loading',
            time_up: false,
            questions: [
                {id:1,question:'020000\n+30000\n+50000\n+20000\n+00300\n+50000','a':10,'b':11,'c':12,'d':13},
                {id:2,question:'04\n+5\n+7','a':10,'b':16,'c':12,'d':13},
                {id:3,question:'06\n+7\n+8\n+9','a':10,'b':11,'c':12,'d':30},
                {id:4,question:'07\n+8\n+9','a':24,'b':11,'c':12,'d':13}],
            answers: [null,null,null,null],
            correct_answers: [],
            buttons: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
            event_id: '0001',
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
            this.sec_left = Number(this.sec_left);
            this.sec_left--;
            if(this.sec_left < 0){
                if(this.min_left > 0){
                    this.min_left--;
                    this.sec_left = 59;
                }
                else{
                    this.time_up = true;
                }
            }
            this.sec_left = this.sec_left.toString();
            if(this.sec_left.length<2){
                this.sec_left = `0${this.sec_left}`;
            }
        },
        clock(){
            this.updateTime();
            setInterval(function () {
                this.updateTime();
              }.bind(this), 1000); 
        },
        setAnswers(data){
            let correct_answers = [];
            for(let i of data){
                correct_answers.push(i['answer']);
            }
            return correct_answers;
        },
        secondsToTime(sec){
            sec = Number(sec);
            let minutes = Math.floor(sec/60);
            let seconds = sec%60;
            this.min_left = minutes;
            this.sec_left = seconds;
            this.sec_left = this.sec_left.toString();
            if(this.sec_left.length<2){
                this.sec_left = `0${this.sec_left}`;
            }
            return `${minutes} mins ${seconds} secs`;
        },
        getButtons(total_questions){
            total_questions = Number(total_questions);
            let buttons = [];
            for(let i=1;i<=total_questions;i++){
                buttons.push(i);
            }
            return buttons;
        },
        calculateScore(){
            this.attempted = 0;
            this.score = 0;
            this.wrong_answers = 0;
            for(let i=0;i<this.answers.length;i++){
                if(this.answers[i] != null){
                    this.attempted++;
                }
                if(this.answers[i] == this.correct_answers[i]){
                    this.score++;
                }
                else if(this.answers[i] != null){
                    this.wrong_answers++;
                }
            }
            this.correct_answers = this.score;
        }
    },
    async created () {
        // await this.getQuestionPaper();
        try{
            const response = await axios.get(`http://localhost:3000/questions/${this.event_id}`);
            this.questions = response.data;
            this.correct_answers = this.setAnswers(response.data);
            const response1 = await axios.get(`http://localhost:3000/event/${this.event_id}`);
            this.test_name = response1.data.event_name;
            this.test_time = this.secondsToTime(response1.data.time_in_sec);
            this.buttons = this.getButtons(response1.data.total_questions);
            this.total_questions = response1.data.total_questions;
        }
        catch (e){
            console.log(e);
        }
    },
    watch: {
        time_up: {
            handler: function (val) {
                if(val == true){
                    this.calculateScore();
                }
            }
        }
    }
    
});

app.mount('#test');