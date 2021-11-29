<template>
    <v-layout justify-center>
        <v-flex  xs5>
            <v-toolbar color="orange">
                <v-toolbar-title class="white--text">
                    Sign In using credentials
                </v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-title>Login Form</v-card-title>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="login()" id="login-form">
                        <v-text-field 
                            label="Email"
                            v-model="usuario.email"
                            type="email"
                            :rules="emailRules"
                            required
                        ></v-text-field>
                        <v-text-field 
                            label="Password"
                            v-model="usuario.pass"
                            type="password"
                            :rules="[v => !!v || 'Password is required']"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn block color="primary" type="submit" form="login-form"  >Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapActions} from 'vuex';
export default {
    name: 'LoginForm',
    data() {
        return {
            usuario: {email: '', pass: ''},
            mensaje: '',
            valid: false,
            emailRules: [ 
                v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ]
        }
    },
    methods: {
        ...mapActions(['guardarUsuario']),
        login(){
            this.axios.post('/login', this.usuario)
            .then(res => {
                console.log(res.data);
                const token = res.data.token;
                this.guardarUsuario(token);
            })
            .catch(e=>{
                console.log(e.response);
            })
        },
    }
}
</script>