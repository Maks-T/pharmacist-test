<template>
  <Modal @close="$emit('close')">
    <img :src="image" :alt="'Изображение вопроса'" class="modal-image" />
  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  props: {
    image: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  components: {
    Modal
  }
}
</script>

<style scoped>
.modal-image {
  max-width: 100%;
  max-height: 70vh;
  display: block;
  margin: 0 auto;
  border-radius: 4px;
}
</style>