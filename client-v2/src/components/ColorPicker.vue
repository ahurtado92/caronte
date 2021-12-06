<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >

    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="color"
        :label="label"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>

    <v-color-picker
      class="ma-2"
      hide-inputs
      v-model="color"
      @update:color="save"
    ></v-color-picker>

  </v-menu>
</template>
<script>
export default {
    name: 'ColorPicker',
    props: ['label'],
    data(){
        return {
            color: null,
            menu: false,
        }
    },
    methods: {
      save (color) {
        this.$emit('color', this.color)
      },
    },
}
</script>