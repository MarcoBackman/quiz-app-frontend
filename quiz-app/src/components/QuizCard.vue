<style scoped>
  @import "../stylesheet/QuizCard.css";
</style>

<script setup>
  import { ref, watch, computed, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
    currentQuestionIndex: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    quizCategory: { // This is a String, which is correct for direct mapping
      type: String,
      required: true
    },
    timeRemainingSeconds: {
      type: Number,
      default: 0 // In seconds
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    },
    currentScore: {
      type: Number,
      default: 0
    },
    quizId: {
      type: String,
      default: 'QZ-2025-001'
    },
    quizStartTime: {
      type: String,
      default: 'Jan 15, 2025'
    }
  });

  console.log(props);

  const categoryTitleMapper = {
    "DB_ARCHITECTURE": "DB 아키텍처",
    "DESIGN_PATTERN": "디자인 패턴",
    "SOFTWARE_DIAGRAM": "다이어그램",
    "INTEGRATION_TEST": "통합 테스트",
    "MODULE_COUPLING_COHESION": "모듈 응집도/결합도",
    "SOFTWARE_DEVELOPMENT_MODEL": "소프트웨어 개발 모델",
    "TESTING_TYPES": "테스트 유형"
  };

  const title = computed(() => {
    const mappedTitle = categoryTitleMapper[props.quizCategory];
    return mappedTitle || props.quizCategory;
  });

  const emit = defineEmits(['submit-answer', 'previous-question', 'skip-question']);

  const selectedOption = ref(null);
  const textAnswer = ref('');
  const showCorrectAnswer = ref(false);

  // Watch for question changes to reset selected options and text answer
  watch(() => props.question.id, () => {
    selectedOption.value = null;
    textAnswer.value = '';
    showCorrectAnswer.value = false;
  });

  // Computed property for progress bar width
  const progressBarWidth = computed(() => {
    if (props.totalQuestions === 0) return '0%';
    return `${((props.currentQuestionIndex + 1) / props.totalQuestions) * 100}%`;
  });

  // Computed property for time remaining in minutes
  const timeRemainingMinutes = computed(() => {
    return Math.floor(props.timeRemainingSeconds / 60);
  });

  // Handle radio option change
  const handleOptionChange = () => {
    // Clear text answer if an option is selected
    if (selectedOption.value !== null) {
      textAnswer.value = '';
    }
  };

  // Handle text answer input
  const handleTextAnswerInput = () => {
    // Clear selected option if text is being typed
    if (textAnswer.value.trim() !== '') {
      selectedOption.value = null;
    }
  };

  // Submit Answer
  const submitAnswer = () => {
    let answer = null;
    if (textAnswer.value.trim() !== '') {
      answer = textAnswer.value.trim();
    } else if (selectedOption.value !== null) {
      answer = selectedOption.value;
    }

    if (answer) {
      emit('submit-answer', {
        questionId: props.question.id,
        answer: answer
      });
    } else {
      // Optionally, show a message to the user that an answer is required
      console.warn("제출 전에 모든 선택 문항을 선택 해 주세요");
    }
  };

  const showAnswer = () => {
    showCorrectAnswer.value = true;
  };
</script>

<template>
  <div class="quiz-card-container">
    <!-- Main Quiz Area -->
    <main class="quiz-main">
      <div class="quiz-content-card">
        <div class="quiz-info-bar">
          <span class="category-tag">{{ title }}</span>
          <span class="time-remaining">{{ timeRemainingMinutes }} 분 남음</span>
        </div>

        <h2 class="question-text">{{ question.text }}</h2>
        <p class="instruction-text">{{ question.instruction }}</p>

        <!-- Multiple Choice Options -->
        <div class="options-group" v-if="question.type === 'multiple-choice'">
          <label
              v-for="option in question.options"
              :key="option.id"
              :class="['option-label', { selected: selectedOption === option.id }]"
          >
            <input
                type="radio"
                :name="'question-' + question.id"
                :value="option.id"
                v-model="selectedOption"
                @change="handleOptionChange"
                class="radio-input"
                :disabled="showCorrectAnswer"
            />
            {{ option.text }}
          </label>
        </div>

        <!-- Text Input for Answer -->
        <div class="text-answer-group">
          <label for="text-answer" class="text-answer-label">답을 작성하세요:</label>
          <input
              type="text"
              id="text-answer"
              placeholder="Enter your answer here..."
              v-model="textAnswer"
              @input="handleTextAnswerInput"
              class="text-input"
              :disabled="showCorrectAnswer"
          />
          <p class="override-note">입력 내용은 이전 내용에 덮어 씌우기가 됩니다.</p>
        </div>

        <div v-if="showCorrectAnswer" class="correct-answer-display">
          <p class="answer-label">정답:</p>
          <p>{{ question.correctAnswer || 'N/A' }}</p>
          <p v-if="question.explanation" class="answer-explanation">{{ question.explanation }}</p>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button
              class="btn btn-secondary"
              @click="emit('previous-question')"
              :disabled="currentQuestionIndex === 0"
          >
            &larr; 이전 문제
          </button>
          <button class="btn btn-secondary" @click="emit('skip-question')">
            문제 건너뛰기
          </button>
          <button
              class="btn btn-secondary"
              @click="showAnswer"
              :disabled="showCorrectAnswer" >
            정답 보기
          </button>
          <button
              class="btn btn-primary"
              @click="submitAnswer"
              :disabled="!selectedOption && !textAnswer"
          >
            문제 제출
          </button>
        </div>
      </div>

      <!-- Quiz Statistics -->
      <div class="quiz-stats-summary">
        <div class="stat-item">
          <span class="stat-icon correct">✓</span>
          <span class="stat-value">{{ correctAnswers }}</span>
          <span class="stat-label">정답</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon wrong">✕</span>
          <span class="stat-value">{{ wrongAnswers }}</span>
          <span class="stat-label">오답</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ currentScore }}%</span>
          <span class="stat-label">현재 점수</span>
        </div>
      </div>
    </main>

    <!-- Footer: Quiz ID and Help/Exit Buttons -->
    <footer class="quiz-footer">
      <div class="footer-left">
        퀴즈 ID: {{ quizId }} 시작시간: {{ quizStartTime }}
      </div>
      <div class="footer-right">
        <button class="footer-btn">도움</button>
        <button class="footer-btn">퀴즈 종료</button>
      </div>
    </footer>
  </div>
</template>
