<template>
  <div class="results" v-if="results.length > 0">
    <h2>Результаты тестирования</h2>

    <div class="summary">
      <p>Правильных ответов: {{ correctCount }} из {{ results.length }}</p>
      <p>Процент правильных ответов: {{ percentage }}%</p>
    </div>

    <div
        v-for="(result, index) in results"
        :key="index"
        class="result-item"
    >
      <template v-if="getQuestion(result.questionId)">
        <h3>{{ getQuestion(result.questionId).number }}</h3>
        <p>{{ getQuestion(result.questionId).question }}</p>

        <div class="user-answer">
          <p>Ваш ответ:</p>
          <ul>
            <li
                v-for="(answer, i) in result.selected"
                :key="i"
                :class="{
                correct: isAnswerCorrect(result.questionId, answer),
                incorrect: !isAnswerCorrect(result.questionId, answer)
              }"
            >
              {{ answer }}
            </li>
          </ul>
        </div>

        <div class="correct-answer">
          <p>Правильный ответ:</p>
          <ul>
            <li
                v-for="(answer, i) in getQuestion(result.questionId).correct_answers"
                :key="i"
                class="correct"
            >
              {{ answer }}
            </li>
          </ul>
        </div>
      </template>
      <div v-else class="question-not-found">
        Вопрос #{{ index + 1 }} (ID: {{ result.questionId }}) больше не доступен
      </div>
    </div>

    <div class="result-actions">
      <button @click="$emit('restart')" class="restart-btn">Начать заново</button>
      <button @click="$emit('finish')" class="finish-btn">Выбрать другой режим</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    results: Array,
    allQuestions: Array
  },

  emits: ['restart', 'finish'],

  computed: {
    correctCount() {
      return this.results.filter(r => r.isCorrect).length
    },

    percentage() {
      return this.results.length > 0
          ? Math.round((this.correctCount / this.results.length) * 100)
          : 0
    }
  },

  methods: {
    getQuestion(id) {
      return this.allQuestions?.find(q => q.id === id) || null
    },
    isAnswerCorrect(questionId, answer) {
      const question = this.getQuestion(questionId)
      return question?.correct_answers?.includes(answer) || false
    },

  }
}
</script>

<style scoped>
.results {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.summary {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.result-item {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.user-answer, .correct-answer {
  margin-top: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
}

.correct {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.incorrect {
  background-color: #ffebee;
  color: #c62828;
  text-decoration: line-through;
}

.question-not-found {
  color: #f44336;
  font-style: italic;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.restart-btn {
  background-color: #2196f3;
  color: white;
}

.finish-btn {
  background-color: #4caf50;
  color: white;
}

.dark-mode .results {
  background-color: #2d2d2d;
  color: #f0f0f0;
}

.dark-mode .result-item {
  background-color: #3a3a3a;
  border-color: #444;
}

.dark-mode .summary {
  background-color: #3a3a3a;
}

.dark-mode .correct {
  background-color: #1b5e20;
  color: #81c784;
}

.dark-mode .incorrect {
  background-color: #4d2f2f;
  color: #ef9a9a;
}
</style>