import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo='Agregar empleado';

  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute:ActivatedRoute){
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    })

    this.id=this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit():void{
    this.esEditar();
  }

  agregarEditarEmpleado(){
    this.submitted = true;
    if(this.createEmpleado.invalid){
        return;
    }
  if(this.id===null){
    this.agregarEmpleado();
  }else{
    this.editarEmpleado(this.id);
  }

  }

  agregarEmpleado(){
    const empleado: any ={
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion:new Date()
    }
    this.loading=true;
   this._empleadoService.agregarEmpleado(empleado).then(()=>{
    //console.log('empleado registrado con exito}');
    this.toastr.success("Registro de Empleado Exitoso", "Exito", {positionClass:'toast-top-right'});
    this.loading=false;
    this.router.navigate(['/listar-empleados']);
  }).catch(error => {
    console.log('Error al insertar el registro:', error);
    this.loading=false;
    });
  }

  editarEmpleado(id:string){
    const empleado: any ={
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion:new Date()
    }
    this.loading=true;
    this._empleadoService.actualizarEmpleado(id,empleado).then(()=>{
      this.loading=false;
      this.toastr.info("Se ha actualizado el Registro del Empleado","Empleadomodificado");
    })
    this.router.navigate(['/listar-empleados']);
  }

  esEditar(){
    this.titulo='Editar empleado';
    if(this.id !== null)
      this.loading=true;
      this._empleadoService.getEmpleado(this.id as string ).subscribe(data=>{
      this.loading=false;   
        console.log(data.payload.data()['nombre']);
          //console.log(data.payload.data()['apellido']);
          this.createEmpleado.setValue({
            nombre : data.payload.data()['nombre'],
            apellido : data.payload.data()['apellido'],
            documento : data.payload.data()['documento'],
            salario : data.payload.data()['salario']
          })
      })
  }

}