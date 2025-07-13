<script setup>
import './stylesheet/main.css'
import QuizDashboard from './components/QuizDashBoard.vue';
</script>

<template>
  <header class="header">
    <div class="logo">
              <img src="../src/assets/brain.png" alt="QuizMaster Logo" class="logo-icon" />
      QuizMaster
    </div>
    <div class="user-profile">
      <!--        <img src="/avatars/user-avatar.png" alt="User Avatar" class="avatar" />-->
    </div>
  </header>
  <main>
    <QuizDashboard />
  </main>
</template>


