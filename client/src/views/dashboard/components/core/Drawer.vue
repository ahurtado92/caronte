<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          color="white"
          contain
        >
          <v-img
            src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
            max-height="30"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="text-h4"
            v-text="profile.title"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <v-divider class="mb-1" />

    <v-list>
      <v-list-item
        v-if="estaActivo"
        text
        @click="cerrarSesion()"
      >
        <v-list-item-icon>
          <v-icon>mdi-lock</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            class="text-h4"
          >
            Logout
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-else
        text
        :to="'/login'"
      >
        <v-list-item-icon>
          <v-icon>mdi-lock-open-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            class="text-h4"
          >
            Login
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!--<template v-slot:append>
      <base-item
        :item="{
          title: $t('upgrade'),
          icon: 'mdi-package-up',
          to: '/upgrade',
        }"
      />
    </template>-->
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
    mapActions,
    mapGetters,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'dashboard',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'profiles',
          to: 'profiles/profiles',
        },
        {
          icon: 'mdi-food-off',
          title: 'diets',
          to: '##',
        },
        {
          icon: 'mdi-food-variant',
          title: 'recipes',
          to: '###',
        },
        {
          icon: 'mdi-food-apple',
          title: 'foods',
          to: '####',
        },
        {
          icon: 'mdi-altimeter',
          title: 'measures',
          to: '#####',
        },
        {
          title: 'rtables',
          icon: 'mdi-clipboard-outline',
          to: '/tables/regular-tables',
        },
        {
          title: 'typography',
          icon: 'mdi-format-font',
          to: '/components/typography',
        },
        {
          title: 'icons',
          icon: 'mdi-chart-bubble',
          to: '/components/icons',
        },
        {
          title: 'google',
          icon: 'mdi-map-marker',
          to: '/maps/google-maps',
        },
        {
          title: 'notifications',
          icon: 'mdi-bell',
          to: '/components/notifications',
        },
        {
          icon: 'mdi-account-settings',
          title: 'settings',
          to: '######',
        },
      ],
    }),

    computed: {
      ...mapState(['barColor', 'barImage']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        return {
          avatar: true,
          title: this.$t('avatar'),
        }
      },
      ...mapGetters(['estaActivo', 'isAdmin', 'isTeacher']),
      noConditionItems: function () {
        return this.createdMenuItems.filter(function (i) {
          return i.conditions === ''
        })
      },
      activeItems: function () {
        return this.createdMenuItems.filter(function (i) {
          return i.conditions === 'estaActivo'
        })
      },
      notActiveItems: function () {
        return this.createdMenuItems.filter(function (i) {
          return i.conditions === '!estaActivo'
        })
      },
      adminItems: function () {
        return this.createdMenuItems.filter(function (i) {
          return i.conditions === 'estaActivo && isAdmin'
        })
      },
    },

    watch: {
      uname: function () {
        this.setUnm()
      },
    },

    created () {
      this.leerToken()
      this.uname = this.getUsername()
      this.setUname()
      this.createdMenuItems = this.items
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
      ...mapActions(['cerrarSesion', 'leerToken']),
      ...mapGetters(['getUsername']),
      setUname: function () {
        this.uname = this.getUsername()
      },
      setUnm: function () {
        this.unm = this.uname
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
