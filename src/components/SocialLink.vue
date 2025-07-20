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
        viewBox="0 0 382 382"
    >
      <path xmlns="http://www.w3.org/2000/svg" style="fill:#0077B7;" d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889  C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056  H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806  c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1  s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73  c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079  c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426  c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472  L341.91,330.654L341.91,330.654z"/> </svg>
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
  width: rem(30);
  height: rem(30);
  flex-shrink: 0;
  fill: currentColor;
}
</style>