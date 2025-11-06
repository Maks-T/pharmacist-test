<template>
  <Modal @close="$emit('close')">
    <div class="stats-modal-content">
      <h2>Статистика</h2>

      <table class="stats-table">
        <thead>
        <tr>
          <th @click="sortBy('number')" class="sortable">
            №
            <span v-if="sortKey === 'number'" class="sort-arrow">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
          </th>
          <th>Вопрос</th>
          <th @click="sortBy('total')" class="sortable">
            Попытки
            <span v-if="sortKey === 'total'" class="sort-arrow">
                {{ sortOrder === 'asc' ? '↑' : '↓'}}
              </span>
          </th>
          <th @click="sortBy('errors')" class="sortable">
            Ошибки
            <span v-if="sortKey === 'errors'" class="sort-arrow">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(stat, questionId) in sortedStats" :key="questionId">
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

      <!-- Встроенный модальный просмотр вопроса -->
      <Modal v-if="selectedQuestion" @close="closeQuestionModal">
        <QuestionItem
            :question="selectedQuestion"
            @show-image="showImage"
        />
      </Modal>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
import QuestionItem from './QuestionItem.vue'

export default {
  components: { Modal, QuestionItem },

  props: {
    stats: { type: Object, required: true },
    questions: { type: Array, default: () => [] }
  },

  emits: ['close', 'show-image'],

  data() {
    return {
      selectedQuestionId: null,
      sortKey: 'number',      // по умолчанию сортируем по номеру
      sortOrder: 'asc'        // asc / desc
    }
  },

  computed: {
    // ---------- Сортированный массив ----------
    sortedStats() {
      const entries = Object.entries(this.stats)

      // Если нет данных – возвращаем пустой массив
      if (!entries.length) return {}

      // Сортируем
      const sorted = entries.sort(([idA, a], [idB, b]) => {
        let aVal, bVal

        switch (this.sortKey) {
          case 'number':
            aVal = this.getQuestionNumber(idA)
            bVal = this.getQuestionNumber(idB)
            break
          case 'total':
            aVal = a.total
            bVal = b.total
            break
          case 'errors':
            aVal = a.total - a.correct
            bVal = b.total - b.correct
            break
          default:
            aVal = 0
            bVal = 0
        }

        // Приведение к числу (на случай, если getQuestionNumber вернёт строку)
        const diff = Number(aVal) - Number(bVal)
        return this.sortOrder === 'asc' ? diff : -diff
      })

      // Превращаем обратно в объект { id: stat }
      return Object.fromEntries(sorted)
    },

    // ---------- Вспомогательные ----------
    selectedQuestion() {
      return this.questions.find(q => q.id === this.selectedQuestionId) || null
    }
  },

  methods: {
    // ---------- Сортировка ----------
    sortBy(key) {
      if (this.sortKey === key) {
        // Клик по той же колонке → меняем направление
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        // Новая колонка → по возрастанию
        this.sortKey = key
        this.sortOrder = 'asc'
      }
    },

    // ---------- Вспомогательные ----------
    getQuestionText(id) {
      const q = this.questions.find(q => q.id === id)
      return q ? q.question : 'Вопрос не найден'
    },

    getQuestionNumber(id) {
      const q = this.questions.find(q => q.id === id)
      // Ожидаем формат "Вопрос №12" → берём цифру
      return q ? q.number.replace(/[^\d]/g, '') : '-'
    },

    showQuestionModal(id) {
      this.selectedQuestionId = id
    },

    closeQuestionModal() {
      this.selectedQuestionId = null
    },

    showImage(id) {
      this.$emit('show-image', id)
    }
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

// ---- Сортируемые заголовки ----
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: rem(20) !important; // место под стрелку
}

.sort-arrow {
  margin-left: 4px;
  font-weight: bold;
  font-size: rem(14);
}
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
  max-height: 80vh; // Ограничиваем высоту
  overflow-y: auto; // Добавляем скролл при необходимости
  display: flex;
  flex-direction: column;

  @include respond(sm) {
    padding: rem(8);
    max-height: 70vh; // Меньшая высота на мобильных
    width: 95vw;
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