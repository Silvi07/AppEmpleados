//import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit{
  empleados:any[]=[];  
  constructor(private _empleadoService:EmpleadoService,
    private toastr:ToastrService){

  }

  ngOnInit():void{
    this.getEmpleados();
  }
// Método para obtener empleados
  getEmpleados(){
    this._empleadoService.getEmpleados().subscribe(data=>{
      this.empleados=[];
      data.forEach((element:any) => {
        this.empleados.push({
          id : element.payload.doc.id, 
          ...element.payload.doc.data()
        });
      });
      console.log(this.empleados);
  });
}

eliminarEmpleado(id:string){
  this._empleadoService.eliminarEmpleado(id).then(()=>{
    console.log("Se ha eliminado el registro");
    this.toastr.error('El empleado fue eliminado con exito','Registro eliminado!');
  }).catch((error)=>{
    alert(error);
})
  }
}