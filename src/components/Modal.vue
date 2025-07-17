<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <img :src="image" :alt="'Изображение вопроса'" class="modal-image" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: String
  },

  emits: ['close']
}
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  font-size: 30px;
  color: white;
  cursor: pointer;
  padding: 5px 15px;
}

.dark-mode .close-button {
  color: #f0f0f0;
}
</style>