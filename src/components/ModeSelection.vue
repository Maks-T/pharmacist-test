<template>
  <div class="mode-selection">
    <h2>Выберите режим тестирования</h2>

    <div class="modes">
      <button @click="$emit('start-test', 'order')">
        По порядку
      </button>

      <button @click="$emit('start-test', 'random')">
        Любых 20 вопросов
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['start-test']
}
</script>

<style>
.mode-selection {
  text-align: center;
}

.modes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.modes button {
  padding: 15px 30px;
  font-size: 16px;
}
</style>