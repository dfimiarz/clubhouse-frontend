<template>
  <div>
    <div class="text-body-2">Captcha</div>
    <div>
      <div v-if="error" class="my-2 red--text">{{ error }}</div>
      <div v-else class="white mr-1 d-inline-block" style="border: 1px solid">
        <v-img
          :src="`data:image/svg+xml;charset=UTF-8,${imgdata}`"
        ></v-img>
      </div>
      <div>
        <v-btn x-small outlined @click="$emit('reload:captcha')">Reload</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "KnickCaptcha",
  props: ["imgdata", "error", "loading"],
  data: function () {
    return {};
  },
  methods: {},
};
</script>
