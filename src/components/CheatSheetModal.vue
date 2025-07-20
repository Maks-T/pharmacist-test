<template>
  <Modal @close="$emit('close')">
    <div class="cheat-sheet-content">
      <h2 v-if="drugs">Шпаргалка ({{ drugs.length }} препаратов)</h2>
      <p v-else>Препараты не загружены</p>
      <div v-if="drugs" class="drugs-list">
        <DrugItem
            v-for="drug in drugs"
            :key="drug.id"
            :drug="drug"
            :questions="questions"
            @show-image="$emit('show-image', drug.id)"
        />
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
import DrugItem from './DrugItem.vue'

export default {
  props: {
    drugs: {
      type: Array,
      default: () => []
    },
    questions: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Modal,
    DrugItem
  },
  emits: ['close', 'show-image']
}
</script>

<style scoped>
.cheat-sheet-content {
  max-height: calc(80vh - 20px);
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.drugs-list {
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
  .cheat-sheet-content {
    max-height: calc(80vh - 16px);
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