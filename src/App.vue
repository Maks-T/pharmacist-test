<template>
  <div class="app" :class="{ 'dark-mode': darkMode }">
    <header>
      <h1>Тестирование фармацевта</h1>
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
          v-else-if="!testFinished"
          :question="currentQuestion"
          :shuffled-answers="shuffledAnswers"
          :selected-answers="selectedAnswers"
          :show-result="showAnswerResult"
          @update-answers="selectedAnswers = $event"
          @answer="answerQuestion"
          @next="nextQuestion"
          @show-image="showImage"
      />

      <Results
          v-else
          :results="results"
          :questions="shuffledQuestions"
          @restart="handleRestart"
          @finish="finishTest"
      />
    </main>

    <!-- Модальное окно статистики -->
    <StatsModal
        v-if="showStats"
        :stats="stats"
        :questions="questions"
        @close="closeStatsModal"
    />

    <!-- Модальное окно изображения -->
    <Modal
        v-if="modalImage"
        :image="modalImage"
        @close="closeModal"
    />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import ModeSelection from './components/ModeSelection.vue'
import Question from './components/Question.vue'
import Results from './components/Results.vue'
import Modal from './components/Modal.vue'
import StatsModal from './components/StatsModal.vue'
import { store } from './store'

export default {
  name: 'App',
  components: {
    ModeSelection,
    Question,
    Results,
    Modal,
    StatsModal
  },

  setup() {
    const {
      // Состояние
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

      // Методы
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

      // Вычисляемые свойства
      currentQuestion,
      shuffledAnswers
    } = store()

    const hasStatistics = computed(() => {
      return Object.keys(stats.value).length > 0
    })

    const handleRestart = () => {
      restartTest()
      startTest(currentMode.value)
    }

    onMounted(() => {
      restoreProgress()
    })

    return {
      // Состояние
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

      // Методы
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

      // Вычисляемые свойства
      currentQuestion,
      shuffledAnswers,
      hasStatistics
    }
  }
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f0f0f0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  flex-grow: 1;
  text-align: center;
}

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

button:active {
  transform: translateY(0);
}

.theme-toggle {
  background-color: transparent;
  border: 1px solid currentColor;
  padding: 8px 12px;
}

.finish-btn {
  background-color: #f44336;
  color: white;
  min-width: 120px;
  justify-content: center;
}

.stats-btn {
  background-color: #2196F3;
  color: white;
  min-width: 120px;
  justify-content: center;
}

.dark-mode .finish-btn {
  background-color: #c62828;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.dark-mode .stats-btn {
  background-color: #1565C0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.dark-mode .theme-toggle {
  border-color: #f0f0f0;
}

@media (max-width: 600px) {
  .app {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    order: -1;
    width: 100%;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  button {
    padding: 8px 10px;
    font-size: 0.85rem;
    flex-grow: 1;
    min-width: unset;
  }

  .theme-toggle {
    flex-grow: 0;
    padding: 6px 8px;
  }
}

@media (max-width: 400px) {
  .header-controls {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>