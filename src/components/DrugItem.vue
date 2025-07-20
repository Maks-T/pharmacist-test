<template>
  <div class="drug-item">
    <div class="drug-header" @click="toggleExpand">
      <h3>
        <span>{{ drug.name }}</span>
      </h3>
      <p>{{ drug.brief }}</p>
      <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
    </div>
    <div v-if="isExpanded" class="drug-content">
      <div class="questions">
        <p><strong>Связанные вопросы:</strong></p>
        <ul v-if="relatedQuestions.length > 0">
          <li
              v-for="question in relatedQuestions"
              :key="question.id"
          >
            {{ question.number }}. {{ question.question }}
          </li>
        </ul>
        <p v-else>Вопросы для этого препарата отсутствуют</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: {
    drug: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['show-image'],
  setup(props) {
    const isExpanded = ref(false)

    const relatedQuestions = computed(() => {
      return props.drug.questions
          .map(qId => props.questions.find(q => q.number === `Вопрос №${qId}`))
          .filter(q => q !== undefined)
    })

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return {
      isExpanded,
      relatedQuestions,
      toggleExpand
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';

.drug-item {
  margin-bottom: rem(15);
  border: 1px solid var(--border-color, #eee);
  border-radius: rem(8);
  padding: rem(15);
  background-color: var(--drug-bg, #f9f9f9);
  box-shadow: 0 rem(2) rem(4) rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;

  .dark-mode & {
    --drug-bg: #3a3a3a;
    --border-color: #555;
    --questions-bg: #4a4a4a;
  }

  &:hover {
    box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.15);
  }
}

.drug-header {
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

.drug-header h3 {
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

.drug-header p {
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

.drug-content {
  margin-top: rem(15);
  padding-top: rem(15);
  border-top: 1px solid var(--border-color, #ddd);
  max-height: 60vh;
  overflow-y: auto;

  @include respond(sm) {
    max-height: 50vh;
  }
}

.questions {
  margin: rem(10) 0;
  padding: rem(15);
  background-color: var(--questions-bg, #f0f0f0);
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

p {
  margin: rem(5) 0;
  font-weight: 500;
}

@media (max-width: 600px) {
  .drug-item {
    padding: rem(10);
  }

  .drug-header h3 {
    font-size: rem(16);
  }

  .drug-header p {
    font-size: rem(14);
  }

  li {
    padding: rem(6) rem(10);
    font-size: rem(14);
  }
}
</style>