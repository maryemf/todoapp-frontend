import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { TaskService, CategoryService } from './../../services';
import { Category, Task } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styles: [
  ]
})
export class TaskComponent implements OnInit {
  model_start!: NgbDateStruct;
  model_end!: NgbDateStruct;
  date!: {year: number, month: number};

  lCategories!: Array<Category>;
  catId: number = -1;

  tasks!: Array<Task>;
  task: Task = {name: ''};
  categoriesId: any = [];
  idx!: number;
  dataStatus: any = {'add': 'Añadir', 'edit': 'Actualizar'};
  action: string = 'add';
  showForm: boolean = false;

  constructor(private calendar: NgbCalendar, private taskService: TaskService,
              private categoryService: CategoryService, private toastr: ToastrService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      console.log(p);
      if (p.id){
        this.catId = p.id;
        this.getAll(p.id);
      } else {
        this.getAll();
        this.model_start = this.calendar.getToday();
      }
      this.getCategories();
    });

  }

  getAll(id: number = -1): void {
    const call = id > 0 ? this.taskService.getTaskByCategory(id)  : this.taskService.getTasks();
    call.subscribe((res: any) => {
      this.tasks = res.data;
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.lCategories = res.data;
    });
  }

  onSubmit(f: NgForm): void {
    console.log(f.value);
    const data = Object.assign({}, f.value);
    // process dates
    if (data.start_date){
      data.start_date = moment([this.model_start.year, (this.model_start.month - 1), this.model_start.day]).format('YYYY-MM-DD HH:mm:ss');
    }
    if (data.end_date){
      data.end_date = moment([this.model_end.year, (this.model_end.month - 1), this.model_end.day]).format('YYYY-MM-DD HH:mm:ss');
    }

    if (this.action === 'add'){
      this.taskService.addTask(data).subscribe((res: any) => {
        this.toastr.success('Tarea añadida exitosamente');
        if (res && res.data){
          this.tasks.push(res.data);
          this.showForm = false;
        }
      });
    } else {
      this.updateTask(data, f);
    }

  }

  updateTask(data: Task, f: NgForm | null): void {
    if (!this.task.id){
      return;
    }
    this.taskService.updateTask(data, this.task.id).subscribe((res: any) => {
      this.toastr.success('Tarea actualizada exitosamente');
      this.tasks[this.idx] = res.data;
      this.idx = -1;
      this.action = 'add';
      this.showForm = false;
      if (f){
        f.resetForm();
      }
    });
  }

  setTaskData(item: Task, completed = false): void {
    this.task = Object.assign({}, item);
    // proccess categories
    const values = [];
    if (item.categories){
      for (const cat of item.categories) {
        values.push(cat.id);
      }
      this.task.categories = values;
    }

    // proccess dates
    if (item.start_date){
      const sDate = moment(item.start_date);
      this.model_start = {year: Number.parseInt(sDate.format('YYYY')), month: Number.parseInt(sDate.format('MM')), day: Number.parseInt(sDate.format('DD'))}
    }

    if (item.end_date){
      const eDate = moment(item.end_date);
      this.model_end = {year: Number.parseInt(eDate.format('YYYY')), month: Number.parseInt(eDate.format('MM')), day: Number.parseInt(eDate.format('DD'))}
    }

    this.task.is_complete = completed;

  }

  onEdit(item: Task, idx: number): void {
    // console.log(item);
    this.setTaskData(item, item.is_complete);
    console.log(this.task) ;
    this.idx = idx;
    this.action = 'edit';
    this.showForm = true;
  }

  onDelete(id: number | undefined, idx: number): void {
    if (!id){
      return;
    }
    Swal.fire({
      title: '¿Esta seguro de eliminar esta tarea?',
      text: "Esta accion no puede ser deshecha",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe((res: any) => {
          if (res){
            this.tasks.splice(idx, 1);
            this.toastr.success('Tarea eliminada exitosamente');
          }
        })
      }
    })
  }


  onCompleted(item: Task, idx: number, completed: boolean): void {
    this.idx = idx;
    this.setTaskData(item, completed);
    this.updateTask(this.task, null);
  }

  processChecks(): void {
    const values = [];
    const inputElements = document.getElementsByClassName('form-check-input');
    for (let i = 0; inputElements[i]; ++i) {
      const check = inputElements[i] as HTMLInputElement ;
      if (check.checked) {
        values.push(check.value);
      }
    }
    this.task.categories = values;
  }
}
