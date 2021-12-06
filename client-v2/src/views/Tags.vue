<template>
    <div class="container">
        <v-form
            v-if="agregar"
            @submit.prevent="agregarTag(tag)"
            id="form-nuevo-tag"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nuevo tag</h3>
            <v-text-field
                v-model="tag.tagId"
                label="Tag ID"
                required
            ></v-text-field>

            <v-text-field
                v-model="tag.active"
                label="Activo"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-nuevo-tag"
            >Añadir</v-btn>

            <v-btn
                class="mr-4"
                color="danger"
                @click.stop="agregar = false"
            >Cancelar</v-btn>

        </v-form>

        <v-form
            v-if="modificar"
            @submit.prevent="editarTag(tagEditar)"
            id="form-editar-tag"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Modificar tag</h3>
            <v-text-field
                v-model="tagEditar.tagId"
                label="Tag ID"
                required
            ></v-text-field>

            <v-text-field
                v-model="tagEditar.active"
                label="Activo"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-tag"
            >Actualizar</v-btn>

            <v-btn
                class="mr-4"
                color="danger"
                @click.stop="modificar = false"
            >Cancelar</v-btn>

        </v-form>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Activo</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tags" :key="index">
                    <th scope="row">{{item.tagId}}</th>
                    <td>{{item.active}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicionTag(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarTag(item._id)"
                        >Eliminar</v-btn>
                    </td>
                    </tr>
                </tbody>
                <v-btn
                    v-if="!agregar"
                    class="mx-2"
                    fab
                    dark
                    small
                    color="success"
                    @click.stop="agregar = true"
                >
                <v-icon dark>
                    mdi-plus
                </v-icon>
                </v-btn>
            </template>
        </v-simple-table>

    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            tags: [],
            tag: {},
            agregar: false,
            modificar: false,
            tagEditar: {},
        };
    },
    created(){
        setTimeout(() => {
            this.listarTags();
        }, 300)
        
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarTags(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('tags', config)
            .then((response) => {
                this.tags = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        agregarTag(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-tag', this.tag, config)
            .then(res => {
            this.listarTags();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.tags = {}
        },
        eliminarTag(id){
            this.axios.delete(`tag/${id}`)
            .then(res => {
                let index = this.tags.findIndex( item => item._id === res.data._id )
                this.tags.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        activarEdicionTag(id){
            this.agregar = false;
            this.modificar = true;
            this.axios.get(`tag/${id}`)
            .then(res => {
                this.tagEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarTag(item){
            this.axios.put(`tag/${item._id}`, item)
            .then(res => {
                this.tagEditar = {}
                this.listarTags();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>