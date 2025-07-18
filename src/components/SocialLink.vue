<template>
  <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      :title="title"
      class="social-link"
  >
    <svg
        v-if="icon === 'telegram'"
        class="social-icon"
        viewBox="0 0 32 32"
    >
      <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)"/>
      <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"/>
      <defs>
        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stop-color="#37BBFE"/>
          <stop offset="1" stop-color="#007DBB"/>
        </linearGradient>
      </defs>
    </svg>

    <svg
        v-else-if="icon === 'linkedin'"
        class="social-icon"
        viewBox="0 0 24 24"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  </a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true,
      validator: value => ['telegram', 'linkedin'].includes(value)
    }
  }
}
</script>

<style lang="scss">
@import './../index';

.social-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(24);
  height: rem(24);

  &:hover {
    color: var(--primary-color);
  }
}

.social-icon {
  width: rem(40);
  height: rem(40);
  flex-shrink: 0;
  fill: currentColor;
}
</style>