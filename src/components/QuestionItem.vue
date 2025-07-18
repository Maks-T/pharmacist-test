<template>
  <div class="question-item">
    <div class="question-header" @click="toggleExpand">
      <h3>{{ question.number }}</h3>
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
  setup() {
    const isExpanded = ref(false)
    const showCorrectAnswers = ref(false)

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
      if (!isExpanded.value) {
        showCorrectAnswers.value = false // Reset correct answers visibility when collapsing
      }
    }

    const toggleCorrectAnswers = () => {
      showCorrectAnswers.value = !showCorrectAnswers.value
    }

    return {
      isExpanded,
      showCorrectAnswers,
      toggleExpand,
      toggleCorrectAnswers
    }
  }
}
</script>

<style scoped>
.question-item {
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: var(--question-bg, #f9f9f9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-mode .question-item {
  --question-bg: #2d2d2d;
  border-color: #444;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.question-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-right: 30px;
}

@media (max-width: 600px) {
  .question-header {
    flex-direction: column;
    align-items: flex-start;
  }
}


.question-header h3 {
  margin: 0;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.question-header p {
  margin: 0;
  font-size: 1rem;
  flex-grow: 1;
}

.toggle-icon {
  position: absolute;
  right: 10px;
  font-size: 1.5rem;
  font-weight: bold;
}

.question-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.dark-mode .question-content {
  border-top-color: #555;
}

.answers {
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.3s;
}

.dark-mode li {
  background-color: #333;
}

li.correct {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  font-weight: 500;
}

.dark-mode li.correct {
  background-color: #2d4e2d;
  border-left-color: #81c784;
}

li.incorrect {
  text-decoration: line-through;
  color: #666;
  background-color: #f5f5f5;
}

.dark-mode li.incorrect {
  color: #aaa;
  background-color: #3a3a3a;
}

p {
  margin: 5px 0;
  font-weight: 500;
}

.toggle-correct-button {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s;
  margin-bottom: 10px;
  display: inline-block;
}

.dark-mode .toggle-correct-button {
  background-color: #1565C0;
}

.toggle-correct-button:hover {
  background-color: #1976D2;
}

.dark-mode .toggle-correct-button:hover {
  background-color: #104B9E;
}

@media (max-width: 600px) {
  .question-item {
    padding: 10px;
  }

  .question-header h3 {
    font-size: 1rem;
  }

  .question-header p {
    font-size: 0.9rem;
  }

  .toggle-correct-button {
    font-size: 0.85rem;
    padding: 6px 10px;
  }

  li {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}
</style>