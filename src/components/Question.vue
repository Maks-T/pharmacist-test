<template>
  <div class="question">
    <div class="question-header">
      <h2>{{ question.number }}</h2>
      <button
          v-if="question.id"
          @click="$emit('show-image', question.id)"
          class="image-button"
          title="Показать изображение"
      >
        ?
      </button>
    </div>

    <p>{{ question.question }}</p>

    <div class="answers">
      <div
          v-for="(answer, index) in shuffledAnswers"
          :key="index"
          class="answer"
          :class="{
          correct: showResult && question.correct_answers.includes(answer),
          incorrect: showResult && selectedAnswers.includes(answer) &&
                    !question.correct_answers.includes(answer)
        }"
      >
        <label>
          <input
              :type="question.answer_type === 'single' ? 'radio' : 'checkbox'"
              :name="'question-' + question.id"
              :value="answer"
              :checked="selectedAnswers.includes(answer)"
              @change="handleAnswerChange(answer, $event)"
              :disabled="showResult"
          />
          {{ answer }}
        </label>
      </div>
    </div>

    <div v-if="showResult" class="result-feedback">
      <p v-if="isCorrect" class="correct">Правильно!</p>
      <p v-else class="incorrect">Неправильно</p>

      <p>Правильный ответ:</p>
      <ul>
        <li
            v-for="(answer, i) in question.correct_answers"
            :key="i"
            class="correct"
        >
          {{ answer }}
        </li>
      </ul>
    </div>

    <div class="actions">
      <button
          v-if="!showResult"
          @click="$emit('answer')"
          :disabled="selectedAnswers.length === 0"
          class="answer-btn"
      >
        Ответить
      </button>

      <button
          v-if="showResult"
          @click="$emit('next')"
          class="next-btn"
      >
        Далее
      </button>

      <button
          @click="$emit('finish')"
          class="finish-btn"
      >
        Закончить
      </button>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    question: Object,
    shuffledAnswers: Array,
    selectedAnswers: Array,
    showResult: Boolean
  },

  emits: ['update-answers', 'answer', 'next', 'show-image'],

  computed: {
    isCorrect() {
      if (this.question.answer_type === 'single') {
        return this.selectedAnswers.length === 1 &&
            this.question.correct_answers.includes(this.selectedAnswers[0])
      } else {
        return this.selectedAnswers.length === this.question.correct_answers.length &&
            this.selectedAnswers.every(ans => this.question.correct_answers.includes(ans))
      }
    }
  },

  methods: {
    handleAnswerChange(answer, event) {
      let newAnswers

      if (this.question.answer_type === 'single') {
        newAnswers = event.target.checked ? [answer] : []
      } else {
        if (event.target.checked) {
          newAnswers = [...this.selectedAnswers, answer]
        } else {
          newAnswers = this.selectedAnswers.filter(a => a !== answer)
        }
      }

      this.$emit('update-answers', newAnswers)
    }
  }
}
</script>

<style>
.question {
  background-color: var(--question-bg, #f9f9f9);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dark-mode .question {
  --question-bg: #2d2d2d;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: #2196F3;
}

.answers {
  margin: 20px 0;
}

.answer {
  margin: 10px 0;
  padding: 10px;
  background-color: var(--answer-bg, #fff);
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dark-mode .answer {
  --answer-bg: #3d3d3d;
}

label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="radio"],
input[type="checkbox"] {
  margin-right: 10px;
}

.result-feedback {
  margin: 20px 0;
  padding: 15px;
  border-radius: 4px;
  background-color: var(--result-bg, #f0f0f0);
}

.dark-mode .result-feedback {
  --result-bg: #333333;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 4px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.actions button {
  flex: 1;
  min-width: 120px;
}

.finish-btn {
  background-color: #f44336;
}

.dark-mode .finish-btn {
  background-color: #c62828;
}

/* Мобильные стили */
@media (max-width: 600px) {
  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
</style>