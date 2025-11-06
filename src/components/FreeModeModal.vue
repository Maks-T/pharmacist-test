<template>
  <Modal @close="$emit('close')">
    <div class="free-mode-modal">
      <h2>Свободный режим</h2>
      <p>Выберите диапазон вопросов (от 1 до {{ total }})</p>

      <div class="range-inputs">
        <div class="input-group">
          <label>С вопроса:</label>
          <input
              type="number"
              v-model.number="rawStart"
              :min="1"
              :max="total"
              @blur="applyStart"
              @input="debouncedValidate"

          />
        </div>

        <div class="input-group">
          <label>По вопрос:</label>
          <input
              type="number"
              v-model.number="rawEnd"
              :min="1"
              :max="total"
              @blur="applyEnd"
              @input="debouncedValidate"

          />
        </div>
      </div>

      <div class="range-slider">
        <input
            type="range"
            v-model.number="start"
            :min="1"
            :max="total"
            class="slider"
            @input="syncSliders"
        />
        <input
            type="range"
            v-model.number="end"
            :min="1"
            :max="total"
            class="slider"
            @input="syncSliders"
        />
      </div>

      <div class="range-info">
        <span>Выбрано: {{ selectedCount }} вопрос(ов)</span>
      </div>

      <div class="actions">
        <button @click="$emit('close')" class="cancel-btn">Отмена</button>
        <button
            @click="startTest"
            :disabled="selectedCount === 0"
            class="start-btn"
        >
          Начать тест
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  components: { Modal },
  props: {
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['start', 'close'],
  data() {
    return {
      start: 1,
      end: 10,
      rawStart: 1,
      rawEnd: 10,
      debounceTimeout: null
    }
  },
  computed: {
    selectedCount() {
      return Math.max(0, this.end - this.start + 1)
    }
  },
  watch: {
    total(newVal) {
      const max = Math.max(1, newVal)
      this.end = Math.min(this.end, max)
      this.start = Math.min(this.start, max)
      this.rawEnd = this.end
      this.rawStart = this.start
    }
  },
  methods: {
    // Дебонс валидация
    debouncedValidate() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(() => {
        this.applyStart()
        this.applyEnd()
      }, 2000)
    },

    // Применяем значение для "start"
    applyStart() {
      let val = parseInt(this.rawStart) || 1
      val = Math.max(1, Math.min(val, this.end, this.total))
      this.start = val
      this.rawStart = val
    },

    // Применяем значение для "end"
    applyEnd() {
      let val = parseInt(this.rawEnd) || this.total
      val = Math.max(this.start, Math.min(val, this.total))
      this.end = val
      this.rawEnd = val
    },

    // Синхронизация ползунков с полями
    syncSliders() {
      this.rawStart = this.start
      this.rawEnd = this.end
    },

    startTest() {
      if (this.selectedCount > 0) {
        this.$emit('start', { start: this.start, end: this.end })
      }
    }
  },
  mounted() {
    // Инициализация raw значений
    this.rawStart = this.start
    this.rawEnd = this.end
  }
}
</script>

<style scoped>
.free-mode-modal {
  padding: 20px;
  max-width: 400px;
}

h2 {
  margin: 0 0 10px;
  text-align: center;
  font-size: 1.4rem;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.dark-mode p { color: #aaa; }

.range-inputs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.dark-mode .input-group input {
  background: #333;
  border-color: #555;
  color: #fff;
}

.range-slider {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 15px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #ddd;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
}

.dark-mode .slider {
  background: #444;
}

.dark-mode .slider::-webkit-slider-thumb {
  background: #64B5F6;
}

.range-info {
  text-align: center;
  font-weight: 600;
  color: #2196F3;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #eee;
  color: #333;
}

.cancel-btn:hover {
  background: #ddd;
}

.start-btn {
  background: #4CAF50;
  color: white;
}

.start-btn:hover {
  background: #43A047;
}

.start-btn:disabled {
  background: #A5D6A7;
  cursor: not-allowed;
}

.dark-mode .cancel-btn {
  background: #444;
  color: #eee;
}

.dark-mode .start-btn {
  background: #2E7D32;
}
</style>