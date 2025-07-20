<template>
  <div class="app" :class="{ 'dark-mode': darkMode }">
    <header>
      <h1>Тестирование фармацевта</h1>
      <span class="total-questions" @click="showQuestionsListModal">Все вопросы: {{ totalQuestionsCount }}</span>
      <div class="header-controls">
        <button
            v-if="testStarted && !testFinished"
            @click="finishTest"
            class="finish-btn"
        >
          Закончить тест
        </button>
        <button
            v-if="hasStatistics"
            @click="showStatsModal"
            class="stats-btn"
        >
          📊 Статистика ({{ Object.keys(stats).length }})
        </button>
        <button @click="toggleDarkMode" class="theme-toggle">
          {{ darkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main>
      <ModeSelection
          v-if="!testStarted && !testFinished"
          @start-test="startTest"
      />
      <Question
          v-if="!testFinished && testStarted"
          :question="currentQuestion"
          :shuffled-answers="shuffledAnswers"
          :selected-answers="selectedAnswers"
          :show-result="showAnswerResult"
          @update-answers="selectedAnswers = $event"
          @answer="answerQuestion"
          @next="nextQuestion"
          @show-image="showImage"
          @answers-restored="handleAnswersRestored"
      />
      <Results
          v-if="testFinished"
          :results="results"
          :all-questions="questions"
          @restart="handleRestart"
          @finish="finishTest"
      />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <span class="developer-name">Разработано: <span>Максим Цацура</span></span>
        <div class="footer-links">
          <SocialLink
              url="https://t.me/maxim_tsatsura"
              title="Telegram"
              icon="telegram"
          />
          <SocialLink
              url="https://www.linkedin.com/in/maksim-tsatsura-17676a238/"
              title="LinkedIn"
              icon="linkedin"
          />
        </div>
      </div>
    </footer>

    <!-- Модальное окно статистики -->
    <StatsModal
        v-if="showStats"
        :stats="stats"
        :questions="questions"
        @close="closeStatsModal"
        @show-image="showImage"
    />

    <!-- Модальное окно изображения -->
    <ImageModal
        v-if="modalImage"
        :image="modalImage"
        @close="closeModal"
    />

    <!-- Модальное окно списка вопросов -->
    <QuestionsListModal
        v-if="showQuestionsList"
        :questions="questions"
        @close="closeQuestionsListModal"
        @show-image="showImage"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import ModeSelection from './components/ModeSelection.vue'
import Question from './components/Question.vue'
import Results from './components/Results.vue'
import ImageModal from './components/ImageModal.vue'
import StatsModal from './components/StatsModal.vue'
import QuestionsListModal from './components/QuestionsListModal.vue'
import { store } from './store'
import SocialLink from "@/components/SocialLink.vue";

export default {
  name: 'App',
  components: {
    SocialLink,
    ModeSelection,
    Question,
    Results,
    ImageModal,
    StatsModal,
    QuestionsListModal
  },

  setup() {
    const {
      currentMode,
      currentQuestionIndex,
      selectedAnswers,
      testStarted,
      testFinished,
      results,
      shuffledQuestions,
      showAnswerResult,
      darkMode,
      modalImage,
      showStats,
      stats,
      questions,
      startTest,
      answerQuestion,
      nextQuestion,
      restartTest,
      finishTest,
      toggleDarkMode,
      showImage,
      closeModal,
      showStatsModal,
      closeStatsModal,
      restoreProgress,
      currentQuestion,
      shuffledAnswers,
      totalQuestionsCount,
      allQuestions
    } = store()

    const hasStatistics = computed(() => {
      return Object.keys(stats.value).length > 0
    })

    const showQuestionsList = ref(false)

    const showQuestionsListModal = () => {
      if (questions.value && questions.value.length > 0) {
        showQuestionsList.value = true
      }
    }

    const closeQuestionsListModal = () => {
      showQuestionsList.value = false
    }

    const handleRestart = () => {
      restartTest()
      startTest(currentMode.value)
    }

    onMounted(() => {
      restoreProgress()
    })

    const handleAnswersRestored = (answers) => {
      selectedAnswers.value = answers
      // Не устанавливаем showAnswerResult автоматически
    }
    return {
      currentMode,
      currentQuestionIndex,
      selectedAnswers,
      testStarted,
      testFinished,
      results,
      shuffledQuestions,
      showAnswerResult,
      darkMode,
      modalImage,
      showStats,
      stats,
      questions,
      showQuestionsList,
      startTest,
      answerQuestion,
      nextQuestion,
      handleRestart,
      finishTest,
      toggleDarkMode,
      showImage,
      closeModal,
      showStatsModal,
      closeStatsModal,
      showQuestionsListModal,
      closeQuestionsListModal,
      currentQuestion,
      shuffledAnswers,
      hasStatistics,
      totalQuestionsCount,
      allQuestions
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';

// Переменные
$primary-color: #036cdb;
$primary-dark: #0252a8;
$error-color: #f44336;
$error-dark: #c62828;
$info-color: #2196F3;
$info-dark: #1565C0;
$text-light: #333;
$text-dark: #f0f0f0;
$text-secondary-light: #666;
$text-secondary-dark: #aaa;
$bg-light: #fff;
$bg-dark: #1a1a1a;
$border-light: #eee;
$border-dark: #444;
$shadow-light: rgba(0, 0, 0, 0.1);
$shadow-dark: rgba(0, 0, 0, 0.3);

// Миксины
@mixin transition($properties...) {
  transition: all 0.3s ease;
  @each $prop in $properties {
    transition-property: $prop;
  }
}

@mixin hover-effect {
  &:hover {
    transform: translateY(rem(-1));
    box-shadow: 0 rem(2) rem(5) $shadow-light;

    .dark-mode & {
      box-shadow: 0 rem(2) rem(5) $shadow-dark;
    }
  }
}

// Основные стили
.app {
  max-width: rem(800);
  margin: 0 auto;
  padding: rem(20);
  min-height: 100vh;
  @include transition(background-color, color);

  &.dark-mode {
    background-color: $bg-dark;
    color: $text-dark;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: rem(16);
  flex-wrap: wrap;
  gap: rem(5);
}

h1 {
  margin: 0;
  font-size: rem(28);
  flex-grow: 1;
  text-align: center;
  font-weight: 500;

  @include respond(sm) {
    font-size: rem(20);
    margin-bottom: rem(5);
    order: -1;
    width: 100%;
  }
}

.header-controls {
  display: flex;
  gap: rem(10);
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;

  button {
    height: rem(39);
  }

  @include respond(sm) {
    width: 100%;
    justify-content: space-between;
    gap: rem(8);
  }
}

button {
  padding: rem(10) rem(15);
  border: none;
  border-radius: rem(4);
  cursor: pointer;
  font-weight: bold;
  @include transition;
  font-size: rem(15);
  display: flex;
  align-items: center;
  gap: rem(5);
  @include hover-effect;

  &:active {
    transform: translateY(0);
  }

  @include respond(sm) {
    padding: rem(8) rem(10);
    font-size: rem(14);
    flex-grow: 1;
    min-width: unset;
  }
}

.theme-toggle {
  background-color: transparent;
  border: 1px solid currentColor;
  padding: rem(8) rem(12);

  @include respond(sm) {
    flex-grow: 0;
    padding: rem(6) rem(8);
  }

  .dark-mode & {
    border-color: $text-dark;
  }
}

.finish-btn {
  background-color: $error-color;
  color: white;
  min-width: rem(120);
  justify-content: center;

  .dark-mode & {
    background-color: $error-dark;
  }
}

.stats-btn {
  background-color: $info-color;
  color: white;
  min-width: rem(120);
  justify-content: center;

  .dark-mode & {
    background-color: $info-dark;
  }
}

.total-questions {
  display: inline-flex;
  align-items: center;
  gap: rem(6);
  color: var(--text-secondary, #666);
  font-size: rem(16);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: rem(4) rem(8);
  border-radius: rem(4);
  font-weight: 600;
  margin: rem(5) auto;

  &::before {
    content: '📋';
    font-size: rem(16);
  }

  &:hover {
    color: var(--primary-color, #2196F3);
    background-color: rgba(33, 150, 243, 0.1);
  }

  .dark-mode & {
    --text-secondary: #aaa;

    &:hover {
      background-color: rgba(100, 181, 246, 0.1);
    }
  }
}

.questions-counter {
  font-size: rem(13);
  color: $text-secondary-light;
  text-align: center;
  width: 100%;
  margin-top: rem(5);

  .dark-mode & {
    color: $text-secondary-dark;
  }
}

.app-footer {
  margin-top: rem(40);
  padding-top: rem(20);
  border-top: 1px solid $border-light;
  font-size: rem(14);
  text-align: center;

  .dark-mode & {
    border-top-color: $border-dark;
  }
}

.footer-content {
  display: flex;
  gap: rem(16);
  align-items: center;
  justify-content: center;
}

.developer-name {
  span:last-child {
    color: $primary-color;
    font-weight: 500;
  }
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: rem(20);
}

// Адаптация для мобильных
@include respond(sm) {
  .app {
    padding: rem(5);
  }
}
</style>