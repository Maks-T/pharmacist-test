<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <h2>Тест модального окна</h2>
      <p>Если вы это видите, значит модальное окно работает</p>
      <pre>{{ stats }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: ['stats', 'questions'],
  emits: ['close']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.dark-mode .modal-content {
  background-color: #2d2d2d;
  color: white;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>