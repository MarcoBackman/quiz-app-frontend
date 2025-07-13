<style>
@import "../stylesheet/QuizCategoryCard.css";
</style>

<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  const props = defineProps<{
    category: Category;
    icon: string;
  }>();

  const categoryTitleMapper = {
    "DB_ARCHITECTURE": "DB 아키텍처",
    "DESIGN_PATTERN": "디자인 패턴",
    "SOFTWARE_DIAGRAM": "다이어그램",
    "INTEGRATION_TEST": "통합 테스트",
    "MODULE_COUPLING_COHESION": "모듈 응집도/결합도",
    "SOFTWARE_DEVELOPMENT_MODEL": "소프트웨어 개발 모델",
    "TESTING_TYPES": "테스트 유형"
  } as const;

  const categoryDescriptionMapper = {
    "DB_ARCHITECTURE": "DB 아키텍처에 대한 문제",
    "DESIGN_PATTERN": "디자인 패턴에 대한 문제",
    "SOFTWARE_DIAGRAM": "UML 다이어그램 종류",
    "INTEGRATION_TEST": "통합 테스트의 세부 문제",
    "MODULE_COUPLING_COHESION": "모듈 응집도/결합도의 이해 테스트",
    "SOFTWARE_DEVELOPMENT_MODEL": "소프트웨어 개발 모델 문제",
    "TESTING_TYPES": "소프트웨어 테스트 유형 문제"
  } as const;

  const emit = defineEmits(['category-selected']);

  const title = computed(() => {
    const mappedTitle = categoryTitleMapper[props.category.name as keyof typeof categoryTitleMapper];
    return mappedTitle || props.category.name;
  });

  const description = computed(() => {
    const mappedTitle = categoryDescriptionMapper[props.category.name as keyof typeof categoryDescriptionMapper];
    return mappedTitle || props.category.name;
  });

  const selectCategory = () => {
    emit('category-selected', props.category.id);
  };
</script>

<template>
  <div class="category-card" @click="selectCategory">
    <div class="icon-container">
      <img :src="icon" :alt="category.name + ' icon'" class="category-icon" />
    </div>
    <h3>{{ title }}</h3>
    <p class="description">{{ description }}</p>
    <div class="details">
      <span :class="['difficulty', category.difficulty.toLowerCase()]">{{ category.difficulty }}</span>
    </div>
  </div>
</template>