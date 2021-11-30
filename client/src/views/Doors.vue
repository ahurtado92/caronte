<template>
    <div class="container">
        <v-form
            v-if="agregar"
            @submit.prevent="agregarPuertas(puerta)"
            id="form-nueva-puerta"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva puerta</h3>
            <v-text-field
                v-model="puerta.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="puerta.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                block
                class="mr-4"
                type="submit"
                color="success"
                form="form-nueva-puerta"
            >Añadir</v-btn>

        </v-form>

        <v-form
            v-else
            @submit.prevent="editarPuerta(puertaEditar)"
            id="form-editar-puerta"
            ref="form"
            lazy-validation
        >
            <h3 class="text-center">Agregar nueva puerta</h3>
            <v-text-field
                v-model="puertaEditar.name"
                label="Nombre"
                required
            ></v-text-field>

            <v-text-field
                v-model="puertaEditar.description"
                label="Descripción"
                required
            ></v-text-field>

            <v-btn
                class="mr-4"
                type="submit"
                color="success"
                form="form-editar-puerta"
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
                    <tr v-for="(item, index) in puertas" :key="index">
                    <th scope="row">{{item.name}}</th>
                    <td>{{item.description}}</td>
                    <td>
                        <v-btn
                            color="primary"
                            class="mx-2"
                            @click.stop="activarEdicionPuerta(item._id)"
                        >Editar</v-btn>
                        <v-btn
                            color="error"
                            class="mx-2"
                            @click.stop="eliminarPuerta(item._id)"
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
            puertas: [],
            puerta: {},
            agregar: true,
            puertaEditar: {},
        };
    },
    created(){
        setTimeout(() => {
            this.listarPuertas();
        }, 300)
        
    },
    computed: {
        ...mapState(['token'])
    },
    methods:{
        listarPuertas(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('doors', config)
            .then((response) => {
                this.puertas = response.data;
            })
            .catch((e)=>{
                console.log('error' + e);
            })
        },

        agregarPuertas(item){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('new-door', this.puerta, config)
            .then(res => {
            this.listarPuertas();
            })
            .catch( e => {
            
            console.log(e.response);
            })
        this.puertas = {}
        },
        eliminarPuerta(id){
            this.axios.delete(`door/${id}`)
            .then(res => {
                let index = this.puertas.findIndex( item => item._id === res.data._id )
                this.puertas.splice(index, 1);
            })
            .catch( e => {
                console.log(e.response);
            })
        },
        activarEdicionPuerta(id){
            this.agregar = false;
            this.axios.get(`door/${id}`)
            .then(res => {
                this.puertaEditar = res.data;
            })
            .catch(e => {
                console.log(e.response);
            })
        },
        editarPuerta(item){
            this.axios.put(`door/${item._id}`, item)
            .then(res => {
                this.puertaEditar = {}
                this.listarPuertas();
            })
            .catch(e => {
                console.log(e);
            })
            this.agregar = true;
        },
    }
};
</script>