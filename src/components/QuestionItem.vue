<template>
  <div class="question-item">
    <div class="question-header" @click="toggleExpand">
      <h3>
        <span>{{ question.number }}</span>
        <button
            v-if="question.id"
            @click.stop="$emit('show-image', question.id)"
            class="image-button"
            title="Показать изображение"
        >
          ?
        </button>
      </h3>
      <p>{{ question.question }}</p>
      <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
    </div>
    <div v-if="isExpanded" class="question-content">
      <div class="answers">
        <button
            class="toggle-correct-button"
            @click="toggleCorrectAnswers"
        >
          {{ showCorrectAnswers ? 'Скрыть правильные ответы' : 'Показать правильные ответы' }}
        </button>
        <p><strong>Варианты ответа:</strong></p>
        <ul>
          <li
              v-for="(answer, index) in question.answers"
              :key="index"
              :class="{
              correct: showCorrectAnswers && question.correct_answers.includes(answer),
              incorrect: showCorrectAnswers && !question.correct_answers.includes(answer)
            }"
          >
            {{ answer }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  emits: ['show-image'],
  setup(props, { emit }) {
    const isExpanded = ref(false)
    const showCorrectAnswers = ref(false)

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
      if (!isExpanded.value) {
        showCorrectAnswers.value = false
      }
    }

    const toggleCorrectAnswers = () => {
      showCorrectAnswers.value = !showCorrectAnswers.value
    }

    const showImage = () => {
      emit('show-image', props.question.id) // Эмитим событие
    }

    return {
      isExpanded,
      showCorrectAnswers,
      toggleExpand,
      toggleCorrectAnswers,
      showImage
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';

.question-item {
  margin-bottom: rem(15);
  border: 1px solid var(--border-color, #eee);
  border-radius: rem(8);
  padding: rem(15);
  background-color: var(--question-bg, #f9f9f9);
  box-shadow: 0 rem(2) rem(4) rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  width: 100%;

  .dark-mode & {
    --question-bg: #3a3a3a;
    --border-color: #555;
    --answers-bg: #4a4a4a;
  }

  &:hover {
    box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.15);
  }
}

.question-header {
  cursor: pointer;
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  gap: rem(10);
  position: relative;
  padding-right: rem(30);

  @include respond(sm) {
      gap: rem(5);
  }
}

.question-header h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;

  margin: 0;
  font-size: rem(18);
  flex-shrink: 0;
  color: var(--text-primary, #333);

  .dark-mode & {
    --text-primary: #f0f0f0;
  }
}

.question-header p {
  margin: 0;
  font-size: rem(16);
  flex-grow: 1;
  color: var(--text-secondary, #555);

  .dark-mode & {
    --text-secondary: #ccc;
  }
}

.toggle-icon {
  position: absolute;
  right: rem(10);
  top: 50%;
  transform: translateY(-50%);
  font-size: rem(20);
  font-weight: bold;
  color: var(--text-primary, #333);
  transition: transform 0.3s ease;

  .dark-mode & {
    --text-primary: #f0f0f0;
  }

  .is-expanded & {
    transform: translateY(-50%) rotate(180deg);
  }
}

.question-content {
  margin-top: rem(15);
  padding-top: rem(15);
  border-top: 1px solid var(--border-color, #ddd);
  max-height: 60vh;
  overflow-y: auto;

  @include respond(sm) {
    max-height: 50vh;
  }
}

.answers {
  margin: rem(10) 0;
  padding: rem(15);
  background-color: var(--answers-bg, #f0f0f0);
  border-radius: rem(6);
}

ul {
  list-style-type: none;
  padding: 0;
  margin: rem(10) 0 0;
}

li {
  padding: rem(8) rem(12);
  margin: rem(5) 0;
  border-radius: rem(4);
  background-color: var(--answer-bg, #fff);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  .dark-mode & {
    --answer-bg: #4a4a4a;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: rem(4);
    height: 100%;
    background-color: var(--answer-border, transparent);
    transition: background-color 0.3s ease;
  }

  &:hover {
    transform: translateX(rem(5));
  }
}

li.correct {
  --answer-bg: #e8f5e9;
  --answer-border: #4caf50;

  .dark-mode & {
    --answer-bg: #2d4e2d;
    --answer-border: #81c784;
  }
}

li.incorrect {
  text-decoration: line-through;
  color: var(--incorrect-text, #666);
  --answer-bg: #f5f5f5;

  .dark-mode & {
    --incorrect-text: #aaa;
    --answer-bg: #3a3a3a;
  }
}

p {
  margin: rem(5) 0;
  font-weight: 500;
}

.toggle-correct-button {
  background-color: var(--button-bg, #2196F3);
  color: white;
  border: none;
  border-radius: rem(4);
  padding: rem(8) rem(12);
  cursor: pointer;
  font-size: rem(14);
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: rem(10);
  display: inline-block;

  &:hover {
    background-color: var(--button-hover, #1976D2);
    transform: translateY(rem(-1));
  }

  .dark-mode & {
    --button-bg: #1565C0;
    --button-hover: #104B9E;
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
  background-color: var(--image-button-bg, #2196F3);
  border: none;
  outline: none;
  color: white;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: rem(10);

  &:hover {
    background-color: var(--image-button-hover, #1976D2);
    transform: scale(1.1);
  }

  .dark-mode & {
    --image-button-bg: #1565C0;
    --image-button-hover: #104B9E;
  }
}

@media (max-width: 600px) {
  .question-item {
    padding: rem(10);
  }

  .question-header h3 {
    font-size: rem(16);
  }

  .question-header p {
    font-size: rem(14);
  }

  .toggle-correct-button {
    font-size: rem(13);
    padding: rem(6) rem(10);
  }

  li {
    padding: rem(6) rem(10);
    font-size: rem(14);
  }
}
</style>