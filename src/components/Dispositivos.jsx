import React, { Component } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { Autocomplete } from '@mui/material'
import { FormControl } from '@mui/material'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';


import { DataGrid, GridRowsProp, GridColDef, selectedIdsLookupSelector } from '@mui/x-data-grid';



const Dispositivo = () => {

    //Hooks para almacenar la opción seleccionada actualmente de bodega, marca y modelo 
    const [bodega_Actual, setBodegaActual] = useState(0);
    const [marca_Actual, setMarcaActual] = useState(0);
    const [modelo_Actual, setModeloActual] = useState(0);


    //disposutuvi_Agregar almacena el dispositivo que se agregará a la BD, hace uso de bodega_Actual, marca_Actual y modelo_Actual 
    const [dispositivo_Agregar, setDispositivoAgregar] = useState("")

    //Los siguientes hooks se utilizarán para obtener los datos de la BD
    const [bodega, setBodega] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [marca, setMarca] = useState([]);
    const [dispositivo, setDispositivo] = useState([]);


    //Hooks para setear los valores de la opción seleccionada en la comboBox
    const [bodegaLabel, setBodegaLabel] = useState("Bodega");
    const [marcaLabel, setMarcaLabel] = useState("Marca");
    const [modeloLabel, setModeloLabel] = useState("Modelo");


    const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nombre_dispositivo', headerName: 'Dispositivo', width: 300 },
    { field: 'nombre_marca', headerName: 'Marca', width: 300 },
    { field: 'nombre_modelo', headerName: 'Modelo', width: 300 },
    { field: 'nombre_bodega', headerName: 'Bodega', width: 300 },
   
    ];


    //Método para obtener todas las bodegas existentes en la BD, no recibe nigún parámetro. (Se debe cargar cuando cargue el componente)
    const obtenerBodegas = async () =>{
        const ans = await axios
         .get("http://127.0.0.1:8000/api/bodegas/")
         .then((response)=>{
            return response.data                             
         })
         .catch((error)=>{
            console.log(error)
         })
         let opciones_bodegas = [];
         opciones_bodegas = ans.map((elemento)=>{
          let opciones = {
            id: elemento.id,
            nombre_bodega: elemento.nombre_bodega        
          }
          return opciones;
        })
        return opciones_bodegas;
     }
     useEffect(()=>{
         obtenerBodegas().then((datos)=>{
            setBodega(datos)})             
     },[])


     //Método que carga todas las marcas disponibles de la base de datos. Como en el modelo, las marcas no dependen de la bodega, estás se cargarán todas las existentes de la base de datos. 
     const obtenerMarcas = async () =>{
        const ans = await axios
         .get("http://127.0.0.1:8000/api/marcas/")
         .then((response)=>{ 
            return response.data                             
         })
         .catch((error)=>{
            console.log(error)
         })
         let opciones_marcas = [];
         opciones_marcas = ans.map((elemento)=>{
          let opciones = {
            id: elemento.id,
            nombre_marca: elemento.nombre_marca        
          }
          return opciones;
        })
        return opciones_marcas;
     }
     useEffect(()=>{
         obtenerMarcas().then((datos)=>{
            setMarca(datos)})             
     },[])


     //Obtener todos los modelos disponibles en la base de datos, el método no se utiloizará ya que marca depende de modelo, sólo se deja acá por motivos de pruebas.  
     
     
    //  const obtenerTodosModelos = async () =>{
    //     const ans = await axios
    //      .get("http://127.0.0.1:8000/api/modelos/")
    //      .then((response)=>{
    //         return response.data                             
    //      })
    //      .catch((error)=>{
    //         console.log(error)
    //      })
    //      let opciones_modelos = [];
    //      opciones_modelos = ans.map((elemento)=>{
    //       let opciones = {
    //         id: elemento.id,
    //         nombre_modelo: elemento.nombre_modelo       
    //       }
    //       return opciones;
    //     })
    //     return opciones_modelos;
        
    //  }

    //  useEffect(()=>{
    //     obtenerTodosModelos().then((datos)=>{
    //        setModelo(datos)})             
    // },[])
     
     

     //Obtener modelos por marca, el parámetro id hace referencia al id de la marca seleccionada 
     const obtenerModelos = async (id) =>{
        const ans = await axios
         .get("http://127.0.0.1:8000/api/modelos/"+id)
         .then((response)=>{
            setModelo(response.data)
            return response.data                             
         })
         .catch((error)=>{
            console.log(error)
         })
         let opciones_modelos = [];
         opciones_modelos = ans.map((elemento)=>{
          let opciones = {
            id: elemento.id,
            nombre_modelo: elemento.nombre_modelo       
          }
          return opciones;
        })
        return opciones_modelos;
        
     }

      useEffect(()=>{
        setModeloLabel("Modeloss")
        obtenerModelos(marca_Actual)
     },[marca_Actual])
     
 
     
    //Método para obtener los dispositivos existentes en una bodega
    const obtenerDispositivosBodega = async (id_bodega ) =>{
        const ans = await axios
         //.get("http://127.0.0.1:8000/api/dispositivos/"+bodega_Actual)
         .get("http://127.0.0.1:8000/api/dispositivos/"+id_bodega)
         .then((response)=>{
            setDispositivo(response.data)
            console.log("La respuesta de response.data es ",response.data)
            console.log("La respuesta de dispositivo es ", dispositivo)
            return dispositivo                             
         })
         .catch((error)=>{
            console.log(error)
         })    
            
     }


     //Método para obtener los dispositivos existentes de una marca seleccionada
     const obtenerDispositivosMarca = async (id_marca) =>{
        const ans = await axios
         .get("http://127.0.0.1:8000/api/dispositivosmarca/"+bodega_Actual+"/"+id_marca)
         .then((response)=>{
            setDispositivo(response.data)
           

            return dispositivo                             
         })
         .catch((error)=>{
            console.log(error)
         })      
     }


     
     //Método para obtener los dispositivos por bodega Actual y Marca Actual 
     const obtenerDispositivosModelo = async (marca) =>{
        const ans = await axios
         .get("http://127.0.0.1:8000/api/dispositivosmodelo/"+bodega_Actual+"/"+marca)
         .then((response)=>{
            setDispositivo(response.data)
            console.log(response.data)
            return dispositivo                             
         })
         .catch((error)=>{
            console.log(error)
         })     
     }


     //Método para agregar un dispositivo nuevo 

     const agregarDispositivo = async () => { 
        const ans = await axios 

        .post("http://127.0.0.1:8000/api/agregar-dispositivo" ,{
            nombre_dispositivo: dispositivo_Agregar,
            modelo_id : modelo_Actual,
            bodega_id : bodega_Actual,
        })
        .then((response)=>{
            if (response.status == 200){
              window.location.reload()       
            }
        })
        .catch(error=>{
            console.log(error)
        })  
      }
     

     const cambiar = async (cambio) =>{
        setMarcaActual(cambio)
     }
     

     
 


    return ( 


        <div>
            <FormControl id="formControlaBodega"fullWidth sx={{marginTop:3, ml:2  }}>
              <Autocomplete              
                fullWidth              
                onChange={(e, value) => {                    
                    
                    //let a = parseInt(value.id)
                    setBodegaActual(value.id)
                    console.log("valor actual de id bodega value.id es: " + value.id + " y bodega actual hook es "+ bodega_Actual)
                    obtenerDispositivosBodega( value.id)    
                    //  console.log(dispositivo)
                                                                
                }}                                             
                id="form_bodega"
                options={bodega}
                getOptionLabel={(bodega)=> bodega.nombre_bodega}
                sx={{ width: 400 }}
                renderInput={(params1) => 
                  <TextField {...params1} label={bodegaLabel} 
                   
                   required/>
                }
              />
          </FormControl>

            <FormControl id="formControlaMarcas"fullWidth sx={{marginTop:1, ml:2  }}>
            <Autocomplete              
            fullWidth              
            onChange={(e, value) => {                    
                    
                setMarcaActual(value.id)
                cambiar(value.id)
                obtenerModelos(value.id)
                obtenerDispositivosMarca( value.id)
                setModeloLabel("Modelossss")
                console.log("valor actual de id marca es: " + value.id + " y marca actual hook es "+ marca_Actual)
                                                            
            }}                                                
                                                       
            id="form_marca"
            options={marca}
            getOptionLabel={(marca)=> marca.nombre_marca}
            sx={{ width: 400 }}
            renderInput={(params1) => 
                <TextField {...params1} label={marcaLabel} 
                
                required/>
            }
            />
            </FormControl>


            <FormControl id="formControlaModelos"fullWidth sx={{marginTop:1, ml:2  }}>
            <Autocomplete              
            fullWidth              
            onChange={(e, value) => {                    
                    
                setModeloActual(value.id)
                obtenerDispositivosModelo(value.id)
                console.log(modeloLabel)

                                                            
            }}                                      
                                                       
            id="form_modelo"
            options={modelo}
            getOptionLabel={(modelo)=> modelo.nombre_modelo}
            sx={{ width: 400 }}
            renderInput={(params1) => 
                <TextField {...params1} label={modeloLabel} value={modeloLabel} required/>}/>
            </FormControl>


            <FormControl id="formIngresar"fullWidth sx={{marginTop:-1, ml:2  }}>
            <TextField
              fullWidth   
              sx={{ width: 400}}
              margin="normal"
              required              
              id="dispositivo"
              label="Nombre Dispositivo"
              //name="cluis"
              //autoComplete="cluis"
              //autoFocus
              value={dispositivo_Agregar}
              onChange={ (e) => {
                setDispositivoAgregar(e.target.value)
                console.log(dispositivo_Agregar)
                }}
            />
            </FormControl>

            <Button variant="contained" sx={{  width: 300, marginTop:1, ml:-75}} onClick={ () => agregarDispositivo() } > Agregar Dispositivo</Button>

            
         

            <div style={{ height: 700, width: '90%' }}>
            <DataGrid rows={dispositivo} columns={columns} />
            </div>

        </div>

       



    );
}
 
export default Dispositivo ;






