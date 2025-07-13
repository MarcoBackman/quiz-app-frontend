<style scoped>
@import "../stylesheet/QuizConfigurationModal.css";
</style>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { // This prop will control modal visibility
    type: Boolean,
    default: false,
  },
  categoryId: { // Pass categoryId to the modal
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(['update:show', 'confirm', 'cancel']);

const isVisible = ref(props.show);
const quizOptions = ref({
  numberOfQuestions: 5, // Default value
  difficulty: '',
});

// Watch for changes in the 'show' prop to update internal visibility
watch(() => props.show, (newVal) => {
  isVisible.value = newVal;
  // Reset options when modal opens to ensure fresh state for new category
  if (newVal) {
    quizOptions.value.numberOfQuestions = 5;
    quizOptions.value.difficulty = '';
  }
});

const confirmConfig = () => {
  // Emit the configuration data to the parent
  emit('confirm', {
    categoryId: props.categoryId,
    numberOfQuestions: parseInt(quizOptions.value.numberOfQuestions),
    difficulty: quizOptions.value.difficulty || undefined,
    language: ['Korean'], // As specified in your DTO
  });
  emit('update:show', false); // Close the modal
};

const cancelConfig = () => {
  emit('cancel'); // Notify parent of cancellation
  emit('update:show', false); // Close the modal
};
</script>

<template>
  <div v-if="isVisible" class="quiz-modal-backdrop">
    <div class="quiz-modal-content">
      <h2>Configure Your Quiz</h2>

      <div class="form-group">
        <label for="numberOfQuestions">Number of Quizzes (1-15):</label>
        <select id="numberOfQuestions" v-model="quizOptions.numberOfQuestions">
          <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="difficulty">Intensity:</label>
        <select id="difficulty" v-model="quizOptions.difficulty">
          <option value="">기본</option>
          <option value="easy">초급</option>
          <option value="medium">중급</option>
          <option value="hard">어려움</option>
        </select>
      </div>

      <div class="modal-actions">
        <button @click="confirmConfig" class="btn btn-primary">
          퀴즈 시작
        </button>
        <button @click="cancelConfig" class="btn btn-secondary">
          취소
        </button>
      </div>
    </div>
  </div>
</template>
