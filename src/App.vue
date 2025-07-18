<template>
  <div class="app" :class="{ 'dark-mode': darkMode }">
    <header>
      <h1>
       Тестирование фармацевта
      </h1>
      <span class="total-questions">(всего вопросов: {{ totalQuestionsCount }})</span>
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

<!--      <div v-if="testStarted" class="questions-counter">
        Вопрос {{ currentQuestionIndex + 1 }} из {{ shuffledQuestions.length }}
      </div>-->
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

    <footer class="app-footer">
      <div class="footer-content">
        <span style="color: #036cdb;">Разработано Максим Цацура</span>
        <div class="footer-links">
          <a href="https://t.me/maxim_tsatsura" target="_blank" rel="noopener" title="Telegram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.03-.08.05-.17-.05-.25s-.34-.04-.48-.03c-.2.03-3.39 2.14-4.82 3.06-.5.33-.95.5-1.36.49-.45-.01-1.33-.26-1.98-.47-.8-.26-1.44-.4-1.38-.84.03-.22.32-.45.9-.68 3.47-1.49 5.78-2.51 8.56-3.86.63-.3 1.25-.45 1.88-.46.2 0 .63.03.73.36.1.33.07 1.02.07 1.02z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/maksim-tsatsura-17676a238/" target="_blank" rel="noopener" title="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>

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
      shuffledAnswers,

      totalQuestionsCount
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
      hasStatistics,
      totalQuestionsCount
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
  gap: 5px;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
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
    padding: 5px;
  }

  h1 {
    font-size: 1.2rem;
    margin-bottom: 5px;
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
/*
@media (max-width: 400px) {
  .header-controls {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}*/

.questions-counter {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  width: 100%;
  margin-top: 5px;
}

.dark-mode .questions-counter {
  color: #aaa;
}
.app-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  text-align: center;
}

.dark-mode .app-footer {
  border-top-color: #444;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-mode .footer-links a {
  color: #aaa;
}

.footer-links a:hover {
  color: #2196F3;
}

.dark-mode .footer-links a:hover {
  color: #64B5F6;
}

.total-questions {
  color: #aaa;
  font-size: 0.6rem;
}

@media (max-width: 600px) {
  .app-footer {
    font-size: 0.8rem;
  }

  .footer-links {
    gap: 15px;
  }
}
</style>