import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  public form: FormGroup;
  public user: AbstractControl;
  public sub = false;
  public users: any[] = [];
  public selectedId = '';

  constructor(
    public formBuilder: FormBuilder,
    public config: ConfigService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      user: ['', Validators.required],
    });
    this.user = this.form.controls['user'];
  }

  ngOnInit(): void {
    this.list()
  }

  get f() {
    return this.form.controls;
  }

  validacion() {
    console.log(this.form.value);
    this.sub = true;
    if (this.form.invalid) return;
    this.add();
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  getConfigFC() {
    return this.config;
  }

  add() {
    //console.log(this.selectedId)
    if (this.selectedId) {
      //console.log(1)
      this.commitEdit();
    } else {
      //console.log(this.form.controls['user'].value)
      //console.log(2)
      this.users.push({
        id: this.create_UUID(),
        user: this.form.controls['user'].value,
        status: false,
      });
      //console.log(this.users)
      this.userService.create(this.form.value).subscribe({
        next: (res: any) => {
          if (res.status) {
            console.log('Usuario Creado 1');
          }
        },
        complete: () => {
          console.log('usuario creado 2');
        }, // completeHandler
        error: () => {
          console.log('Error creating user');
        }, // errorHandler
      });
    }
    this.reset();
    this.sub = false;
  }

  reset() {
    this.form.reset();
  }

  edit(item: any) {
    console.log(item);
    this.form.get('user')?.setValue(item.user);
    this.selectedId = item.id;
  }

  commitEdit() {
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].id == this.selectedId) {
        //this.users[index].user = this.form.get('user')?.value;
        //console.log(this.form.get('user')?.value)
        this.userService.update({
          id:this.selectedId,
          user:this.form.get('user')?.value
        }).subscribe({
          next: (res:any) => {
            if(res.status){
              console.log('Usuario editado 1')
            }
          },
          complete: () => { console.log('usuario editado 2')}, // completeHandler
          error: () => { console.log('Error editando user') }  // errorHandler
      })
      }
    }
    this.selectedId = '';
    //console.log(this.users)
  }

  delete(id: string) {
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].id == id) {
        this.userService.delete(id).subscribe({
          next: (res:any) => {
            if(res.status){
              this.users.splice(index, 1);
              console.log('Usuario eliminado 1')
            }
          },
          complete: () => { console.log('usuario eliminado 2')}, // completeHandler
          error: () => { console.log('Error eliminando user') }  // errorHandler
        })
      }
    }
    console.log(this.users);
  }

  disEnable(item: any) {
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].id == item.id) {
        this.users[index].status = !this.users[index].status;
      }
    }
  }

  list(){
    this.userService.list().subscribe({
      next: (res:any) => {
        if(res.length > 0){
          this.users = res
        }
      },
      complete: () => { console.log('usuario listados 2')}, // completeHandler
      error: () => { console.log('Error listing users') }  // errorHandler
    })
  }
}
