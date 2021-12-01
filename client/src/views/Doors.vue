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

            <v-overflow-btn
                v-model="puerta.activo"
                class="my-2"
                :items="[true, false]"
                label="Activa"
                item-value="text"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="puerta.devId"
                label="Dev ID"
                required
            ></v-text-field>

            <v-text-field
                v-model="puerta.host"
                label="Host"
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

            <v-overflow-btn
                v-model="puertaEditar.activo"
                class="my-2"
                :items="[true, false]"
                label="Activa"
                item-value="text"
                required
            ></v-overflow-btn>

            <v-text-field
                v-model="puertaEditar.devId"
                label="Dev ID"
                required
            ></v-text-field>

            <v-text-field
                v-model="puertaEditar.groups"
                label="Grupos"
                required
            ></v-text-field>

            <v-text-field
                v-model="puertaEditar.host"
                label="Host"
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
                    <th scope="col">Activo</th>
                    <th scope="col">DevId</th>
                    <th scope="col">Grupos</th>
                    <th scope="col">Host</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in puertas" :key="index">
                    <th scope="row">{{item.name}}</th>
                    <td>{{item.description}}</td>
                    <td>{{item.activo}}</td>
                    <td>{{item.devId}}</td>
                    <div>
                        <td v-for="(item, index) in item.inGroups" :key="index">
                            {{item.name}}
                        </td>
                    </div>
                    <td>{{item.groups}}</td>
                    <td>{{item.host}}</td>
                    <td>{{item.status}}</td>
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
            groups: [],
            inGroups: [],
            puerta: {},
            agregar: true,
            puertaEditar: {},
        };
    },
    created(){
        this.timer = setInterval(() => {
            this.listarPuertas();
        }, 1000)
        
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
            var r = []
            var doorStatus = null;
            this.axios.get('doors', config)
            .then((response) => {
                response.data.forEach(evt=>{
                    if(evt.locked){doorStatus='Cerrada'}else{doorStatus='Abierta'};
                    r.push({
                        _id: evt._id,
                        host: evt.host,
                        activo: evt.activo,
                        devId: evt.devId,
                        groups: evt.groups,
                        inGroups: evt.inGroups,
                        description: evt.description,
                        date: new Date(evt.date).toLocaleString(),
                        name: evt.name,
                        outdoor: evt.outdoor,
                        locked: evt.locked,
                        status: doorStatus,
                    })
                });
                this.puertas = r;
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

    },

    destroyed(){
        clearInterval(this.timer)
    }

};
</script>