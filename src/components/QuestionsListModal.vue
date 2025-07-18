<template>
  <Modal @close="$emit('close')">
    <div class="questions-list-content">
      <h2 v-if="questions">Все вопросы ({{ questions.length }})</h2>
      <p v-else>Вопросы не загружены</p>
      <div v-if="questions" class="questions-list">
        <QuestionItem
            v-for="question in questions"
            :key="question.id"
            :question="question"
            @show-image="$emit('show-image', question.id)"
        />
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
import QuestionItem from './QuestionItem.vue'

export default {
  props: {
    questions: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Modal,
    QuestionItem
  },
  emits: ['close', 'show-image'] // Оставляем только объявление emits

}
</script>

<style scoped>
.questions-list-content {
  max-height: calc(80vh - 20px); /* Account for modal padding */
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.questions-list {
  margin-top: 5px;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  text-align: center;
  position: sticky;
  top: 0;
  background-color: inherit;
  z-index: 5;
}

p {
  text-align: center;
  color: #666;
  margin: 10px 0;
}

.dark-mode p {
  color: #aaa;
}

.dark-mode h2 {
  background-color: #2d2d2d;
}

@media (max-width: 600px) {
  .questions-list-content {
    max-height: calc(80vh - 16px); /* Account for smaller modal padding */
    padding: 8px;
  }

  h2 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>