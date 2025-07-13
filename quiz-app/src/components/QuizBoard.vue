<style scoped>
@import "../stylesheet/QuizBoard.css";
</style>

<template>
  <div class="quiz-board-container">
    <div v-if="questions.length > 0" class="quiz-active-content">
      <div class="quiz-board-header">
        <span class="question-counter">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
        <div class="quiz-progress-bar-container">
          <div class="quiz-progress-bar" :style="{ width: progressBarWidth }"></div>
        </div>
        <button @click="handleExitQuiz" class="exit-button">
          &larr; 퀴즈 종료
        </button>
      </div>

      <QuizCard
          v-if="currentQuestion"
          :question="currentQuestion"
          :current-question-index="currentQuestionIndex"
          :total-questions="questions.length"
          :quiz-category="category ? category.name : 'Unknown Category'"
          :time-remaining-seconds="timeRemaining"
          :correct-answers="correctAnswers"
          :wrong-answers="wrongAnswers"
          :current-score="calculatedScore"
          @previous-question="goToPreviousQuestion"
          @skip-question="goToNextQuestion"
      />
    </div>

    <div v-else-if="questions.length === 0 && category" class="initial-quiz-message">
      <p>Please configure your quiz to begin.</p>
    </div>

    <div v-if="questions.length > 0 && !currentQuestion" class="quiz-completion-message">
      <h2>Quiz Completed!</h2>
      <p>You answered {{ correctAnswers }} out of {{ questions.length }} questions correctly.</p>
      <p>Your final score: {{ calculatedScore }}%</p>
      <button class="btn btn-primary" @click="handleExitQuiz">Go back to Categories</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits, onUnmounted } from 'vue';
import QuizCard from './QuizCard.vue';

const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
  category: {
    type: Object, // Expecting the Category object
    required: true,
  },
});

const emit = defineEmits(['quiz-exited']);

const currentQuestionIndex = ref(0);
const correctAnswers = ref(0);
const wrongAnswers = ref(0);
const userAnswers = ref([]);
const timeRemaining = ref(600); // Example: 10 minutes (600 seconds)
let timer:any = null;

const currentQuestion = computed(() => {
  return props.questions[currentQuestionIndex.value];
});

const calculatedScore = computed(() => {
  if (props.questions.length === 0) return 0;
  return Math.round((correctAnswers.value / props.questions.length) * 100);
});

const progressBarWidth = computed(() => {
  if (props.questions.length === 0) return '0%';
  return `${((currentQuestionIndex.value + 1) / props.questions.length) * 100}%`;
});


watch(() => props.questions, (newQuestions) => {
  if (newQuestions.length > 0) {
    // Reset quiz state when new questions are loaded
    currentQuestionIndex.value = 0;
    correctAnswers.value = 0;
    wrongAnswers.value = 0;
    userAnswers.value = [];
    timeRemaining.value = 600; // Reset timer
    if (timer) clearInterval(timer); // Clear any existing timer
    startTimer(); // Start new timer
  }
}, { immediate: true });


const startTimer = () => {
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timer);
      alert("Time's up! Quiz ended.");
      handleExitQuiz();
    }
  }, 1000);
};

// const handleSubmitAnswer = (payload) => {
//   const { questionId, answer } = payload;
//   const question = props.questions.find(q => q.id === questionId);
//
//   let isCorrect = false;
//   if (question && question.correctAnswer) {
//     const submittedAnswer = String(answer).toLowerCase().trim();
//     const actualCorrectAnswer = String(question.correctAnswer).toLowerCase().trim();
//     isCorrect = submittedAnswer === actualCorrectAnswer;
//   }
//
//   if (isCorrect) {
//     correctAnswers.value++;
//   } else {
//     wrongAnswers.value++;
//   }
//   //
//   // userAnswers.value.push({
//   //   questionId: questionId,
//   //   userAnswer: answer,
//   //   isCorrect: isCorrect,
//   //   correctAnswer: question ? question.correctAnswer : 'N/A'
//   // });
//
//   goToNextQuestion();
// };

const goToNextQuestion = () => {
  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++;
  } else {
    clearInterval(timer);
    timer = null;
    console.log("Quiz completed!");
  }
};

const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const handleExitQuiz = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  emit('quiz-exited');
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>