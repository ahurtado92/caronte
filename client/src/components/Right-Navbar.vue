<template v-slot:prepend>

  <!--<MenuList :items="items" :unm="unm" />-->
  <v-container>
    <v-list dense>
      <v-list-item>
          <v-list-item-avatar>
            <v-icon>account_box</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-if="unm">{{unm}}</v-list-item-title>
            <v-list-item-subtitle v-if="estaActivo">Logged In</v-list-item-subtitle>
            <v-list-item-subtitle v-else>Log In First!</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

    </v-list>
    <v-divider></v-divider>
    <MenuList :items="noConditionItems" />
    <MenuList v-if="estaActivo" :items="activeItems" />
    <MenuList v-if="!estaActivo" :items="notActiveItems" />
    <MenuList v-if="estaActivo && (isAdmin || isTeacher)" :items="adminItems" />
    <v-divider></v-divider>
    <v-list>
      <v-list-item
          text
          @click="cerrarSesion()"
          v-if="estaActivo"
        >
          <v-list-item-icon>
              <v-icon>lock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
          text
          :to="'/login'"
          v-else
        >
          <v-list-item-icon>
              <v-icon>lock_open</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
  </v-container>
      
</template>

<script>
import MenuList from '@/components/MenuList.vue';
import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'RightNavbar',
    components:{
        MenuList
    },
    data () {
      return {
        drawer: null,
        appTitle: 'Awesome App',
        items: [
          { title: 'Home', icon: 'home', path: '/', conditions: '' },
          { title: 'Usuarios', icon: 'mdi-account-group-outline', path: 'users', conditions: 'estaActivo && isAdmin'  },
          { title: 'Grupos', icon: 'group', path: 'groups', conditions: 'estaActivo && isAdmin'  },
        ],
        uname: null,
        unm: null,
      }
    },
    methods: {
        ...mapActions(['cerrarSesion', 'leerToken']),
        ...mapGetters(['getUsername']),
        setUname:  function () {
          this.uname = this.getUsername();
        },
        setUnm:  function () {
          this.unm = this.uname;
        },
    },
    watch: {
      uname: function () {
        this.setUnm();
      }
    },
    computed: {
        ...mapGetters(['estaActivo','isAdmin', 'isTeacher']),
        noConditionItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions===""
            })
        },
        activeItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="estaActivo"
            })
        },
        notActiveItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="!estaActivo"
            }) 
        },
        adminItems: function() {
            return this.createdMenuItems.filter(function(i) {
                return i.conditions==="estaActivo && isAdmin"
            }) 
        },


    },
    created(){
        this.leerToken();
        this.uname = this.getUsername();
        this.setUname();
        this.createdMenuItems = this.items;
    }
  }
</script>