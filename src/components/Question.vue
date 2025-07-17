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
.actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  justify-content: center;
}

.answer-btn, .next-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
}

.answer-btn {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 3px 6px rgba(76, 175, 80, 0.2);
}

.answer-btn:hover {
  background-color: #43A047;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(76, 175, 80, 0.3);
}

.answer-btn:active {
  transform: translateY(0);
}

.answer-btn:disabled {
  background-color: #A5D6A7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.next-btn {
  background-color: #2196F3;
  color: white;
  box-shadow: 0 3px 6px rgba(33, 150, 243, 0.2);
}

.next-btn:hover {
  background-color: #1E88E5;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(33, 150, 243, 0.3);
}

.next-btn:active {
  transform: translateY(0);
}

/* Темная тема */
.dark-mode .answer-btn {
  background-color: #2E7D32;
}

.dark-mode .answer-btn:hover {
  background-color: #1B5E20;
}

.dark-mode .next-btn {
  background-color: #1565C0;
}

.dark-mode .next-btn:hover {
  background-color: #0D47A1;
}

/* Адаптация для мобильных */
@media (max-width: 600px) {
  .actions {
    flex-direction: column;
    gap: 10px;
  }

  .answer-btn, .next-btn {
    width: 100%;
    padding: 14px;
    font-size: 1.05rem;
  }
}

/* Анимация при нажатии */
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.answer-btn:active, .next-btn:active {
  animation: buttonPress 0.3s ease;
}
.answer.correct {
  background-color: #C8E6C9; /* Светло-зеленый для правильных */
  border-left: 4px solid #4CAF50;
  animation: fadeIn 0.5s ease;
}

.answer.incorrect {
  background-color: #FFCDD2; /* Светло-красный для неправильных */
  border-left: 4px solid #F44336;
  animation: fadeIn 0.5s ease;
}

.dark-mode .answer.correct {
  background-color: #1B5E20; /* Темно-зеленый для темной темы */
  border-left-color: #81C784;
}

.dark-mode .answer.incorrect {
  background-color: #B71C1C; /* Темно-красный для темной темы */
  border-left-color: #E57373;
}

/* Стили для текста в ответах */
.answer.correct label,
.answer.incorrect label {
  color: #000;
}

.dark-mode .answer.correct label,
.dark-mode .answer.incorrect label {
  color: #fff;
}

/* Анимация появления */
@keyframes fadeIn {
  from { opacity: 0.5; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Стили для правильных ответов в блоке результата */
.result-feedback .correct {
  background-color: #E8F5E9;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 5px 0;
}

.dark-mode .result-feedback .correct {
  background-color: #1B5E20;
  color: #fff;
}

/* Стили для текста результата */
.result-feedback p.correct {
  color: #2E7D32;
  font-weight: bold;
  font-size: 1.1rem;
}

.result-feedback p.incorrect {
  color: #C62828;
  font-weight: bold;
  font-size: 1.1rem;
}

.dark-mode .result-feedback p.correct {
  color: #81C784;
}

.dark-mode .result-feedback p.incorrect {
  color: #EF9A9A;
}

/* Улучшенные стили для списка правильных ответов */
.result-feedback ul {
  margin-top: 10px;
}

.result-feedback li {
  margin: 8px 0;
  padding: 10px;
  background-color: #E8F5E9;
  border-radius: 4px;
}

.dark-mode .result-feedback li {
  background-color: #2E7D32;
  color: #fff;
}

/* Стили для инпутов в режиме результата */
.answer input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.answer.correct input:disabled,
.answer.incorrect input:disabled {
  opacity: 1;
}

/* Стили для зачеркивания неправильных ответов */
.answer.incorrect label {
  position: relative;
}

.answer.incorrect label::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  background-color: #f44336;
  transform: translateY(-50%) scaleX(0);
  transform-origin: left;
  animation: strikeThrough 0.5s ease forwards;
}

@keyframes strikeThrough {
  to {
    transform: translateY(-50%) scaleX(1);
  }
}

.dark-mode .answer.incorrect label::after {
  background-color: #ef9a9a;
}

/* Улучшенные стили для неправильных ответов */
.answer.incorrect {
  background-color: #ffebee; /* Светло-красный фон */
  border-left: 4px solid #f44336;
  position: relative;
  overflow: hidden;
}

.answer.incorrect::before {
  content: "✖";
  position: absolute;
  right: 10px;
  color: #f44336;
  font-size: 1.2rem;
}

.dark-mode .answer.incorrect {
  background-color: #4d2f2f; /* Темный красный фон */
  border-left-color: #ef9a9a;
}

.dark-mode .answer.incorrect::before {
  color: #ef9a9a;
}

/* Стили для правильных ответов */
.answer.correct {
  background-color: #e8f5e9; /* Светло-зеленый фон */
  border-left: 4px solid #4caf50;
  position: relative;
}

.answer.correct::before {
  content: "✓";
  position: absolute;
  right: 10px;
  color: #4caf50;
  font-size: 1.2rem;
}

.dark-mode .answer.correct {
  background-color: #2d3e2d; /* Темный зеленый фон */
  border-left-color: #81c784;
}

.dark-mode .answer.correct::before {
  color: #81c784;
}

/* Анимации */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.answer.correct,
.answer.incorrect {
  animation: fadeIn 0.4s ease forwards;
}

/* Улучшенные стили для текста */
.answer label {
  padding-right: 25px; /* Место для иконки */
  transition: all 0.3s ease;
}

/* Стили для блоков результата */
.result-feedback {
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  animation: fadeIn 0.5s ease;
}

.result-feedback p.correct {
  color: #2e7d32;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.result-feedback p.incorrect {
  color: #c62828;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.dark-mode .result-feedback p.correct {
  color: #81c784;
}

.dark-mode .result-feedback p.incorrect {
  color: #ef9a9a;
}
</style>