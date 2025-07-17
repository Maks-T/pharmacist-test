<template>
  <div class="app" :class="{ 'dark-mode': darkMode }">
    <header>
      <h1>Тестирование фармацевта</h1>
      <button @click="toggleDarkMode" class="theme-toggle">
        {{ darkMode ? '☀️' : '🌙' }}
      </button>
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
          @finish="finishTest"
      />

      <Results
          v-else-if="testFinished"
          :results="results"
          :questions="shuffledQuestions"
          @restart="handleRestart"
          @finish="finishTest"
      />
    </main>

    <Modal v-if="modalImage" :image="modalImage" @close="closeModal" />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import ModeSelection from './components/ModeSelection.vue'
import Question from './components/Question.vue'
import Results from './components/Results.vue'
import Modal from './components/Modal.vue'
import { store } from './store'

export default {
  name: 'App',
  components: {
    ModeSelection,
    Question,
    Results,
    Modal
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
      startTest,
      answerQuestion,
      nextQuestion,
      restartTest,
      finishTest,
      restoreProgress,
      toggleDarkMode,
      showImage,
      closeModal,
      currentQuestion,
      shuffledAnswers
    } = store()

    const handleRestart = () => {
      restartTest()
      startTest(currentMode.value)
    }

    onMounted(() => {
      restoreProgress()
    })

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
      startTest,
      answerQuestion,
      nextQuestion,
      restartTest,
      finishTest,
      toggleDarkMode,
      showImage,
      closeModal,
      currentQuestion,
      shuffledAnswers,
      handleRestart
    }
  }
}
</script>

<style>
/* Стили остаются без изменений */
:root {
  --primary-color: #4CAF50;
  --primary-dark: #2E7D32;
  --error-color: #f44336;
  --error-dark: #c62828;
  --info-color: #2196F3;
  --info-dark: #1565C0;
  --correct-color: #FFB74D;
  --correct-dark: #E65100;
  --text-light: #333;
  --text-dark: #f0f0f0;
  --bg-light: #f9f9f9;
  --bg-dark: #1a1a1a;
  --card-light: #fff;
  --card-dark: #2d2d2d;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
  background-color: var(--bg-light);
  color: var(--text-light);
}

.dark-mode {
  background-color: var(--bg-dark);
  color: var(--text-dark);
}

header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

h1 {
  font-size: 1.8rem;
  margin: 0;
}

.theme-toggle {
  padding: 8px 12px;
  font-size: 1rem;
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.theme-toggle:hover {
  opacity: 0.8;
}

button {
  padding: 12px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.3s;
  font-size: 1rem;
  font-weight: bold;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.dark-mode button:disabled {
  background-color: #666;
}

.correct {
  background-color: var(--correct-color);
  color: var(--text-light);
}

.dark-mode .correct {
  background-color: var(--correct-dark);
  color: var(--text-dark);
}

.incorrect {
  background-color: var(--error-color);
  color: white;
}

.dark-mode .incorrect {
  background-color: var(--error-dark);
}

.finish-btn {
  background-color: var(--error-color);
}

.dark-mode .finish-btn {
  background-color: var(--error-dark);
}

.restart-btn {
  background-color: var(--primary-color);
}

.dark-mode .restart-btn {
  background-color: var(--primary-dark);
}

.info-btn {
  background-color: var(--info-color);
}

.dark-mode .info-btn {
  background-color: var(--info-dark);
}

/* Мобильная адаптация */
@media (max-width: 600px) {
  .app {
    padding: 10px;
  }

  h1 {
    font-size: 1.5rem;
  }

  header {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .theme-toggle {
    align-self: flex-end;
    padding: 6px 10px;
  }

  button {
    padding: 12px;
    font-size: 1rem;
    width: 100%;
  }
}
</style>