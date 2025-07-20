<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
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
  position: relative;
  max-width: 90%;
  max-height: 80vh;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .modal-content {
  background-color: #2d2d2d;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: -12px;
  right: 8px;

  transform: translateY(-100%);
  background-color: white;
  border: none;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: #222;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  z-index: 10;
}

.dark-mode .close-button {
  background-color: #2196F3;
  color: white;
}

.close-button:hover {
  opacity: 0.85;
}

.dark-mode .close-button:hover {
  background-color: #64B5F6;
  color: white;
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 95%;
    padding: 8px;
  }

  .close-button {
    font-size: 24px;
    width: 36px;
    height: 36px;
    padding: 6px;
  }
}
</style>