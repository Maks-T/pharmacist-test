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

    <p class="question-text">{{ question.question }}</p>

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

<style lang="scss">
@import './../index.scss';

.question {
  background-color: var(--question-bg, #f9f9f9);
  padding: rem(20);
  border-radius: rem(8);
  margin-bottom: rem(20);

  .dark-mode & {
    --question-bg: #2d2d2d;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-text {
    margin: rem(15) 0;
    padding: rem(15);
    background-color: var(--question-text-bg, #f8f8f8);
    border-left: rem(4) solid var(--question-text-border, #2196F3);
    border-radius: 0 rem(8) rem(8) 0;
    font-size: rem(18);
    line-height: 1.5;
    position: relative;
    box-shadow: 0 rem(2) rem(5) rgba(0, 0, 0, 0.05);

    // Для темной темы
    .dark-mode & {
      --question-text-bg: #2d2d2d;
      --question-text-border: #64B5F6;
    }

    // Декоративный элемент
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(33, 150, 243, 0.1), transparent);
      border-radius: rem(4) 0 0 rem(4);
    }
  }

}

.image-button {
  width: rem(30);
  height: rem(30);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: #2196F3;
  border: none;
  outline: none;
  color: white;
  flex-shrink: 0;
  flex-grow: 0;
}

.answers {
  margin: rem(20) 0;
}

.answer {
  margin: rem(10) 0;
  padding: rem(10);
  background-color: var(--answer-bg, #fff);
  border-radius: rem(4);
  transition: background-color 0.3s;
  position: relative;
  overflow: hidden;

  .dark-mode & {
    --answer-bg: #3d3d3d;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-right: rem(25);
    transition: all 0.3s ease;
  }

  input[type="radio"],
  input[type="checkbox"] {
    margin-right: rem(10);
  }

  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;

    .correct &, .incorrect & {
      opacity: 1;
    }
  }

  &.correct {
    background-color: #C8E6C9;
    border-left: rem(4) solid #4CAF50;
    animation: fadeIn 0.5s ease;

    &::before {
      content: "✓";
      position: absolute;
      right: rem(10);
      color: #4CAF50;
      font-size: rem(18);
    }

    .dark-mode & {
      background-color: #1B5E20;
      border-left-color: #81C784;

      &::before {
        color: #81C784;
      }
    }
  }

  &.incorrect {
    background-color: #FFCDD2;
    border-left: rem(4) solid #F44336;
    animation: fadeIn 0.5s ease;

    &::before {
      content: "✖";
      position: absolute;
      right: rem(10);
      color: #F44336;
      font-size: rem(18);
    }

    label::after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: rem(2);
      background-color: #f44336;
      transform: translateY(-50%) scaleX(0);
      transform-origin: left;
      animation: strikeThrough 0.5s ease forwards;
    }

    .dark-mode & {
      background-color: #4d2f2f;
      border-left-color: #EF9A9A;

      &::before {
        color: #EF9A9A;
      }

      label::after {
        background-color: #EF9A9A;
      }
    }
  }
}

.result-feedback {
  margin: rem(10) 0;
  padding: rem(10);
  border-radius: rem(8);
  background-color: var(--result-bg, #FFF3E0); // Светло-оранжевый фон
  animation: fadeIn 0.5s ease;
  box-shadow: 0 rem(2) rem(8) rgba(0, 0, 0, 0.1);

  // Темная тема
  .dark-mode & {
    --result-bg: #332821;
    --correct-text: #FFB74D; // Светло-оранжевый
    --incorrect-text: #EF9A9A;
    --correct-bg: #4E342E; // Темно-коричневый
  }

  p {
    margin-bottom: rem(15);
    font-size: rem(18);
    font-weight: bold;
    line-height: 1.4;

    &.correct {
      color: #FF9800; // Основной оранжевый
      .dark-mode & {
        color: var(--correct-text);
      }
    }

    &.incorrect {
      color: #E53935; // Ярко-красный
      .dark-mode & {
        color: var(--incorrect-text);
      }
    }
  }

  > p:not(.correct):not(.incorrect) {
    color: #5D4037; // Темно-коричневый
    font-weight: normal;
    .dark-mode & {
      color: #D7CCC8; // Светло-бежевый
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: rem(15);
  }

  li {
    padding: rem(10) rem(15);
    margin: rem(8) 0;
    border-radius: rem(6);
    background-color: #FFE0B2; // Светло-оранжевый
    color: #BF360C; // Темно-оранжевый
    font-weight: 500;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateX(rem(5));
    }

    .dark-mode & {
      background-color: var(--correct-bg);
      color: var(--correct-text);
    }

    @include respond(sm) {
      padding: rem(8) rem(12);
    }
  }

  @include respond(sm) {
    padding: rem(15);
    margin: rem(15) 0;
  }
}

.actions {
  display: flex;
  gap: rem(12);
  margin-top: rem(25);
  justify-content: center;

  @include respond('sm') {
    flex-direction: column;
    gap: rem(10);
  }

  button {
    padding: rem(12) rem(24);
    border: none;
    border-radius: rem(8);
    font-size: rem(16);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: rem(150);

    @include respond('sm') {
      width: 100%;
      padding: rem(14);
      font-size: rem(16.8);
    }

    &:active {
      animation: buttonPress 0.3s ease;
    }
  }
}

.answer-btn {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 rem(3) rem(6) rgba(76, 175, 80, 0.2);

  &:hover {
    background-color: #43A047;
    transform: translateY(rem(-2));
    box-shadow: 0 rem(5) rem(10) rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #A5D6A7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .dark-mode & {
    background-color: #2E7D32;

    &:hover {
      background-color: #1B5E20;
    }
  }
}

.next-btn {
  background-color: #2196F3;
  color: white;
  box-shadow: 0 rem(3) rem(6) rgba(33, 150, 243, 0.2);

  &:hover {
    background-color: #1E88E5;
    transform: translateY(rem(-2));
    box-shadow: 0 rem(5) rem(10) rgba(33, 150, 243, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  .dark-mode & {
    background-color: #1565C0;

    &:hover {
      background-color: #0D47A1;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(rem(-10)); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes strikeThrough {
  to {
    transform: translateY(-50%) scaleX(1);
  }
}

@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style>