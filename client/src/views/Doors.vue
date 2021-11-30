<template>
    <div class="container">
        <v-form
            v-if="agregar"
            @submit.prevent="agregarGrupo(grupo)"
            id="form-nuevo-grupo"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Grupo</h3>
            <v-text-field
                v-model="grupo.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="grupo.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-grupo"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="editarGrupo(grupoEditar)"
            id="form-editar-grupo"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo Grupo</h3>
            <v-text-field
                v-model="grupoEditar.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="grupoEditar.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-grupo"
            >Actualizar</v-btn>

            <v-btn
                class="mr-4"
                color="danger"
                @click.stop="agregar = true"
            >Cancelar</v-btn>

        </v-form>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in grupos" :key="index">
                    <th scope="row">{{item.name}}</th>
                    <td>{{item.description}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicionGrupo(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarGrupo(item._id)"
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
export default {
    data() {
        return {
            grupos: [],
            grupo: {},
            agregar: true,
            grupoEditar: {},
        };
    },
    created(){
        setTimeout(() => {
            this.listarGrupos();
        }, 300)
        
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarGrupos(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('groups', config)
            .then((response) => {
                this.grupos = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        agregarGrupo(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-group', this.grupo, config)
            .then(res => {
            this.listarGrupos();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.grupos = {}
        },
        eliminarGrupo(id){
            this.axios.delete(`group/${id}`)
            .then(res => {
                let index = this.grupos.findIndex( item => item._id === res.data._id )
                this.grupos.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        activarEdicionGrupo(id){
            this.agregar = false;
            this.axios.get(`group/${id}`)
            .then(res => {
                this.grupoEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarGrupo(item){
            this.axios.put(`group/${item._id}`, item)
            .then(res => {
                this.grupoEditar = {}
                this.listarGrupos();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>