<template>
  <div class="mode-selection">
    <h2 class="mode-title">Выберите режим тестирования</h2>
    <p class="mode-description">Подготовьтесь к экзамену, выбрав подходящий вариант</p>

    <div class="modes">
      <button
          @click="$emit('start-test', 'order')"
          class="mode-btn order-mode"
      >
        <span class="mode-icon">📖</span>
        <span class="mode-name">По порядку</span>
        <span class="mode-details">Все вопросы по очереди</span>
      </button>

      <button
          @click="$emit('start-test', 'random-20')"
          class="mode-btn random-mode"
      >
        <span class="mode-icon">🎲</span>
        <span class="mode-name">Случайные 20</span>
        <span class="mode-details">Тест из 20 случайных вопросов</span>
      </button>

      <button
          @click="$emit('start-test', 'random-10')"
          class="mode-btn quick-mode"
      >
        <span class="mode-icon">⚡</span>
        <span class="mode-name">Быстрые 10</span>
        <span class="mode-details">Короткий тест из 10 вопросов</span>
      </button>

      <button
          @click="openFreeMode"
          class="mode-btn free-mode"
      >
        <span class="mode-icon">🎯</span>
        <span class="mode-name">Свободный режим</span>
        <span class="mode-details">Выберите диапазон вопросов</span>
      </button>
    </div>

    <FreeModeModal
        v-if="showFreeMode"
        :total="totalQuestions"
        @start="startFreeTest"
        @close="showFreeMode = false"
    />
  </div>
</template>


<script>
import FreeModeModal from "@/components/FreeModeModal.vue";

export default {
  emits: ['start-test'],
  props: {
    totalQuestions: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      showFreeMode: false
    }
  },
  components: {
    FreeModeModal
  },
  methods: {
    openFreeMode() {
      this.showFreeMode = true
    },
    startFreeTest({start, end}) {
      this.$emit('start-test', 'free', {start, end})
      this.showFreeMode = false
    }
  }
}
</script>

<style lang="scss">
@import './../index.scss';

.free-mode {
  border-top: rem(4) solid #9C27B0;

  &:hover {
    background-color: #E1BEE7;

    .dark-mode & {
      background-color: #4A148C;
    }
  }
}

.mode-selection {
  text-align: center;
  max-width: rem(800);
  margin: 0 auto;
  padding: rem(30);

  @include respond(sm) {
    padding: rem(10);
  }

  .dark-mode & {
    color: #f5f5f5;
  }
}

.mode-title {
  font-size: rem(22);
  margin-bottom: rem(8);
  color: #333;

  .dark-mode & {
    color: #f5f5f5;
  }

  @include respond(sm) {
    font-size: rem(24);
  }
}

.mode-description {
  font-size: rem(16);
  color: #666;
  margin-bottom: rem(30);

  .dark-mode & {
    color: #bdbdbd;
  }

  @include respond(sm) {
    font-size: rem(14);
    margin-bottom: rem(10);
  }
}

.modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(rem(200), 1fr));
  gap: rem(20);
  margin-top: rem(30);

  @include respond(sm) {
    grid-template-columns: 1fr;
    gap: rem(16);
    margin-top: rem(16);
    padding: 0 rem(20);
  }
}

.mode-btn {
  padding: rem(25);
  border-radius: rem(12);
  border: none;
  background: white;
  box-shadow: 0 rem(4) rem(12) rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: rem(120);

  &:hover {
    transform: translateY(rem(-5));
    box-shadow: 0 rem(6) rem(16) rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(rem(-2));
  }

  .dark-mode & {
    background: #424242;
    color: #f5f5f5;
    box-shadow: 0 rem(4) rem(12) rgba(0, 0, 0, 0.3);
  }

  @include respond(sm) {
    padding: rem(16);
  }
}

.mode-icon {
  font-size: rem(36);
  margin-bottom: rem(15);
}

.mode-name {
  font-size: rem(20);
  font-weight: 600;
  margin-bottom: rem(10);

  @include respond(sm) {
    font-size: rem(18);
  }
}

.mode-details {
  font-size: rem(14);
  color: #666;
  line-height: 1.5;

  .dark-mode & {
    color: #bdbdbd;
  }
}

.order-mode {
  border-top: rem(4) solid #4CAF50;

  &:hover {
    background-color: #E8F5E9;

    .dark-mode & {
      background-color: #1B5E20;
    }
  }
}

.random-mode {
  border-top: rem(4) solid #2196F3;

  &:hover {
    background-color: #E3F2FD;

    .dark-mode & {
      background-color: #0D47A1;
    }
  }
}

.quick-mode {
  border-top: rem(4) solid #FF9800;

  &:hover {
    background-color: #FFF3E0;

    .dark-mode & {
      background-color: #E65100;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(rem(20));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mode-selection {
  animation: fadeIn 0.5s ease-out;
}
</style>