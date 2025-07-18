<template>
  <Modal @close="$emit('close')">
    <div class="stats-modal-content">
      <h2>Статистика</h2>
      <table class="stats-table">
        <thead>
        <tr>
          <th>№</th>
          <th>Вопрос</th>
          <th>Попытки</th>
          <th>Ошибки</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(stat, questionId) in stats" :key="questionId">
          <td>{{ getQuestionNumber(questionId) }}</td>
          <td>
              <span
                  class="question-link"
                  @click="showQuestionModal(questionId)"
              >
                {{ getQuestionText(questionId) }}
              </span>
          </td>
          <td>{{ stat.total }}</td>
          <td>{{ stat.total - stat.correct }}</td>
        </tr>
        </tbody>
      </table>
      <Modal v-if="selectedQuestion" @close="closeQuestionModal">
        <div class="question-modal-content">
          <QuestionItem :question="selectedQuestion" />
        </div>
      </Modal>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
import QuestionItem from './QuestionItem.vue'

export default {
  props: {
    stats: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  data() {
    return {
      selectedQuestionId: null
    }
  },
  computed: {
    selectedQuestion() {
      return this.questions.find(q => q.id === this.selectedQuestionId) || null
    }
  },
  methods: {
    getQuestionText(questionId) {
      const question = this.questions.find(q => q.id === questionId)
      return question ? question.question : 'Вопрос не найден'
    },
    getQuestionNumber(questionId) {
      const question = this.questions.find(q => q.id === questionId)
      return question ? question.number.replace('Вопрос №', '') : '-'
    },
    showQuestionModal(questionId) {
      this.selectedQuestionId = questionId
    },
    closeQuestionModal() {
      this.selectedQuestionId = null
    }
  },
  components: {
    Modal,
    QuestionItem
  }
}
</script>

<style lang="scss" scoped>
@import './../index';

// Variables
$modal-padding: rem(10);
$table-cell-padding: rem(6) rem(8);
$mobile-table-cell-padding: rem(4) rem(6);
$question-line-height: 1.4;
$question-max-lines: 5;
$mobile-question-max-lines: 3;

// Modal content
.stats-modal-content {
  max-height: calc(80vh - #{rem(20)});
  overflow-y: auto;
  padding: $modal-padding;
  box-sizing: border-box;

  @include respond(sm) {
    max-height: calc(80vh - #{rem(16)});
    padding: rem(8);
  }
}

// Table styles
.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: rem(10);

  thead {
    position: sticky;
    top: 0;
    z-index: 5;
    background-color: var(--table-header-bg, #f5f5f5);

    .dark-mode & {
      --table-header-bg: #3a3a3a;
    }
  }

  th, td {
    padding: $table-cell-padding;
    border: 1px solid var(--table-border, #ddd);
    text-align: left;
    font-size: rem(14);

    .dark-mode & {
      --table-border: #444;
    }

    @include respond(sm) {
      padding: $mobile-table-cell-padding;
      font-size: rem(12);
    }
  }

  th {
    font-weight: 600;
    white-space: nowrap;
  }

  th:first-child,
  td:first-child {
    width: rem(50);
    text-align: center;

    @include respond(sm) {
      width: rem(40);
    }
  }
}

// Question link styles
.question-link {
  color: var(--link-color, #2196F3);
  cursor: pointer;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: $question-max-lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(#{rem(14)} * #{$question-line-height} * #{$question-max-lines});
  line-height: $question-line-height;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    color: var(--link-hover, #0d8aee);
  }

  &.expanded {
    -webkit-line-clamp: unset;
    max-height: none;
  }

  .dark-mode & {
    --link-color: #64B5F6;
    --link-hover: #42a5f5;
  }

  @include respond(sm) {
    -webkit-line-clamp: $mobile-question-max-lines;
    max-height: calc(#{rem(12)} * #{$question-line-height} * #{$mobile-question-max-lines});
  }
}

// Question modal content
.question-modal-content {
  padding: $modal-padding;
  max-width: rem(800);

  @include respond(sm) {
    padding: rem(8);

  }
}

// Header styles
h2 {
  margin: 0 0 rem(10) 0;
  font-size: rem(20);
  text-align: center;
  position: sticky;
  top: 0;
  background-color: inherit;
  z-index: 5;
  padding: rem(5) 0;

  @include respond(sm) {
    font-size: rem(16);
    margin-bottom: rem(8);
  }
}
</style>