<template>
    <div class="container">
        <v-form
            v-if="add"
            @submit="addUser(user)"
            id="new-user-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Usuario</h3>

            <v-overflow-btn
                v-model="user.role"
                class="my-2"
                :items="dropdown_edit"
                label="Role"
                item-value="text"
                required
            ></v-overflow-btn>

            <v-overflow-btn
                v-if="user.role == 'USER'"
                v-model="user.group"
                class="my-2"
                :items="groups"
                label="Group"
                item-value="value"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="user.nombre"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="user.apellidos"
                label="Apellidos"
                required
            ></v-text-field>

            <v-text-field
                v-model="user.phone"
                label="Teléfono"
                required
            ></v-text-field>

            <DatePicker label="Nacimiento" v-on:date="updateBirthDate($event, user)" />

            <v-text-field
                v-model="user.email"
                label="Correo electrónico"
                required
            ></v-text-field>

            <v-text-field
                v-model="user.uname"
                label="Nombre de usuario"
                required
            ></v-text-field>

            <v-text-field
                v-model="user.pass"
                type="password"
                label="Contraseña"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="new-user-form"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="modifyUser(userToEdit)"
            id="edit-user-form"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Modify user</h3>

            
            <v-overflow-btn
                v-model="userToEdit.role"
                class="my-2"
                :items="dropdown_edit"
                label="Role"
                item-value="text"
                required
            ></v-overflow-btn>

            <v-overflow-btn
                v-if="userToEdit.role == 'USER'"
                v-model="userToEdit.group"
                class="my-2"
                :items="groups"
                label="Grupo"
                item-value="value"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="userToEdit.nombre"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="userToEdit.apellidos"
                label="Apellidos"
                required
            ></v-text-field>

            <v-text-field
                v-model="userToEdit.phone"
                label="Teléfono"
                required
            ></v-text-field>

            <DatePicker label="Nacimiento" v-on:date="updateBirthDate($event, userToEdit)" />
            

            <v-text-field
                v-model="userToEdit.email"
                label="Correo electrónico"
                required
            ></v-text-field>

            <v-text-field
                v-model="userToEdit.uname"
                label="Nombre de usuario"
                required
            ></v-text-field>

            <v-text-field
                v-model="userToEdit.pass"
                type="password"
                label="Contraseña"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="edit-user-form"
            >Actualizar</v-btn>

            <v-btn
                class="mr-4"
                color="danger"
                @click.stop="add = true"
            >Cancelar</v-btn>

        </v-form>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Role</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Birth</th>
                    <th scope="col">Email</th>
                    <th scope="col">Group</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in users" :key="index">
                    <th scope="row">{{item.uname}}</th>
                    <td>{{item.role}}</td>
                    <td>{{item.nombre}}</td>
                    <td>{{item.apellidos}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.birth}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.group}}</td>
                    <td>
                        <v-btn
                            v-if="item.uname != 'admin'"
                            color="primary"
                            class="mx-2"
                            @click.stop="editUser(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            v-if="item.uname != 'admin'"
                            color="error"
                            class="mx-2"
                            @click.stop="deleteUser(item._id)"
                        >Eliminar</v-btn>
                    </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import DatePicker from '@/components/DatePicker.vue';
export default {
    data() {
        return {
            users: [],
            groups: [],
            user: {},
            add: true,
            userToEdit: {},
            dropdown_edit: [
                { text: 'ADMIN' },
                { text: 'USER' },
                { text: 'TEACHER' },
            ],
        };
    },
    components: {
      DatePicker,
    },
    created(){
        this.listGroups();
        setTimeout(() => {
            this.listUsers();
        }, 300)
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listUsers(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            var r = []
            this.axios.get('usuarios', config)
            .then((response) => {
                response.data.forEach(evt=>{
                    const g = this.groups.find( (item) => item.value == evt.group )
                    let gId = [];
                    if(g !== undefined){
                        gId = g
                    }
                    r.push({
                        _id: evt._id,
                        role: evt.role,
                        activo: evt.activo,
                        nombre: evt.nombre,
                        apellidos: evt.apellidos,
                        phone: evt.phone,
                        birth: new Date(evt.birth).toLocaleString(),
                        email: evt.email,
                        uname: evt.uname,
                        pass: evt.pass,
                        group: gId.text,
                        avatar: evt.avatar,
                        date: new Date(evt.date).toLocaleString(),
                    })
                });
                this.users = r;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        addUser(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('nuevo-usuario', this.user, config)
            .then(res => {
            this.listUsers();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.users = {}
        },
        deleteUser(id){
            this.axios.delete(`usuario/${id}`)
            .then(res => {
                let index = this.users.findIndex( item => item._id === res.data._id )
                this.users.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        editUser(id){
            this.add = false;
            this.axios.get(`usuario/${id}`)
            .then(res => {
                this.userToEdit = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        modifyUser(item){
            this.axios.put(`usuario/${item._id}`, item)
            .then(res => {
                this.userToEdit = {}
                this.listUsers();
            })
            .catch(e => {
                console.log(e);
            })
            this.add = true;
        },
        updateBirthDate(v,d){
            d.birth = v;
        },

        listGroups(){
            let groupL = []
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('groups', config)
            .then((response) => {
                groupL = response.data;
                groupL.forEach(evt=>{
                    this.groups.push({
                        text: evt.name,
                        value: evt._id,
                    })
                });
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },
    }
};
</script>