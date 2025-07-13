
<style scoped>
  @import '../stylesheet/QuizDashBoard.css';
</style>

<script setup>
import ApiService from '../service/ApiService';
import {onMounted, ref} from 'vue';
import QuizCategoryCard from './QuizCategoryCard.vue';
import QuizBoard from "@/components/QuizBoard.vue";
import QuizConfigurationModal from "@/components/QuizConfigurationModal.vue";

const categories = ref([]);
const isLoading = ref(false);
const currentView = ref('dashboard');
const showQuizBoard = ref(false);
const showConfigModal = ref(false);
const currentQuizQuestions = ref([]);
const selectedQuizCategory = ref(null);

// Function to dynamically get icon paths.
// Ensure your icons are in the `public/icons` directory or similar.
const getIconPath = (categoryId) => {
  return new URL(`../assets/icons/${categoryId}.png`, import.meta.url).href;
};

onMounted(() => {
  fetchCategory();
});


const fetchCategory = async () => {
  try {
    isLoading.value = true; // Start loading
    // Assuming getJcgSubjectCategories no longer takes a path
    categories.value = await ApiService.getJcgSubjectCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  } finally {
    isLoading.value = false; // End loading
  }
};

const handleCategorySelect = (categoryId) => {
  selectedQuizCategory.value = categories.value.find(cat => cat.id === categoryId);
  showQuizBoard.value = true; // Show the QuizBoard container (initially empty)
  showConfigModal.value = true; // Immediately show the configuration modal on top
};

const handleConfigConfirmed = async (configData) => {
  showConfigModal.value = false; // Hide the modal
  isLoading.value = true; // Show global loading overlay while fetching quizzes
  currentQuizQuestions.value = []; // Clear previous questions

  // Map JCG_TOPIC values (which are passed as configData.categoryId) to ApiService methods
  const apiMethodMap = {
    1: ApiService.generateDbArchitectureQuiz,
    2: ApiService.generateDesignPatternQuiz,
    3: ApiService.generateSoftwareDiagramQuiz,
    4: ApiService.generateIntegrationTestQuiz,
    5: ApiService.generateModuleCouplingCohesionQuiz,
    6: ApiService.generateSoftwareDevelopmentModelQuiz,
    7: ApiService.generateTestingQuiz,
    // Add any other topics if you expand JCG_TOPIC
  };

  const selectedApiCall = apiMethodMap[configData.categoryId];

  if (!selectedApiCall) {
    console.error('Error: No specific quiz generation API found for category ID:', configData.categoryId);
    // Optionally provide user feedback
    alert(`Unsupported quiz category: ${configData.categoryId}`);
    isLoading.value = false;
    showQuizBoard.value = false; // Go back to dashboard
    selectedQuizCategory.value = null;
    return; // Exit the function to prevent further errors
  }

  try {
    // Call the dynamically selected API service method
    const fetchedQuestions = await selectedApiCall({
      numberOfQuestions: configData.numberOfQuestions,
      difficulty: configData.difficulty,
      topic: configData.categoryId,
      language: configData.language,
    });

    // Map fetched questions to QuizCard's expected format
    currentQuizQuestions.value = fetchedQuestions.map(q => ({
      id: q.id,
      text: q.questionText,
      instruction: q.description || 'Type your answer below.',
      type: 'text-input',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

  } catch (error) {
    console.error('Failed to generate quiz:', error);
    // Optionally show an error message to the user
    alert('Failed to generate quiz questions. Please try again.');
    showQuizBoard.value = false; // Go back to dashboard if generation fails
  } finally {
    isLoading.value = false; // Hide loading overlay
  }
};

const handleConfigCancelled = () => {
  showConfigModal.value = false;
  showQuizBoard.value = false; // Go back to dashboard if configuration is cancelled
  selectedQuizCategory.value = null;
};

const handleQuizExit = () => {
  currentQuizQuestions.value = []; // Clear questions
  selectedQuizCategory.value = null; // Clear selected category
  showQuizBoard.value = false; // Hide quiz board
  currentView.value = 'dashboard'; // Back to the main dashboard
};

</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <div class="quiz-master-dashboard">
    <template v-if="!showQuizBoard">
      <main class="main-content">
        <h1 class="page-title">정보처리기사 주제를 선택 해 주세요</h1>
        <p class="subtitle">당신의 합격을 기원합니다!</p>

        <div class="category-grid">
          <QuizCategoryCard
              v-for="category in categories"
              :key="category.id"
              :category="category"
              :icon="getIconPath(category.id)"
              @category-selected="handleCategorySelect"
          />
        </div>

        <div class="quiz-statistics">
          <h2>퀴즈 통계</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">127</span>
              <span class="stat-label">완료 한 퀴즈 수</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">84%</span>
              <span class="stat-label">평균 점수</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">15</span>
              <span class="stat-label">최다 연속 정답</span>
            </div>
          </div>
        </div>
      </main>

      <footer class="footer">
        MarcoBackman © 2025 QuizMaster. All rights reserved.
      </footer>
    </template>

    <template v-else>
      <QuizBoard
          :questions="currentQuizQuestions"
          :category="selectedQuizCategory"
          @quiz-exited="handleQuizExit"
      />

      <QuizConfigurationModal
          v-model:show="showConfigModal"
          :category-id="selectedQuizCategory ? selectedQuizCategory.id : ''"
          @confirm="handleConfigConfirmed"
          @cancel="handleConfigCancelled"
      />
    </template>
  </div>
</template>