<template>
  <div class="results">
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
    questions: Array
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
      return this.questions?.find(q => q.id === id) || null
    },
    isAnswerCorrect(questionId, answer) {
      const question = this.getQuestion(questionId)
      return question?.correct_answers?.includes(answer) || false
    }
  }
}
</script>