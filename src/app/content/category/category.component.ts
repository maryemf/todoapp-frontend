import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Category } from 'src/app/models';
import { CategoryService } from './../../services';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: [
  ]
})
export class CategoryComponent implements OnInit {
  categories!: Array<Category>;
  category: Category = {name: ''};
  idx!: number;
  dataStatus: any = {'add': 'Añadir', 'edit': 'Actualizar'};
  action: string = 'add';
  showForm: boolean = false;
  showInfo: boolean = false;

  constructor(private categoryService: CategoryService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.data;
    })
  }

  onSubmit(f: NgForm): void {
    const data: Category = f.value;
    if (this.action === 'add'){
      this.categoryService.addCategory(data).subscribe((res: any) => {
        this.toastr.success('Categoría añadida exitosamente');
        if (res && res.data){
          this.categories.push(res.data);
          this.showForm = false;
        }
      });
    } else {
      if (!this.category.id){
        return;
      }
      this.categoryService.updateCategory(data, this.category.id).subscribe((res: any) => {
        this.toastr.success('Categoría actualizada exitosamente');
        f.resetForm();
        this.categories[this.idx] = res.data;
        this.idx = -1;
        this.action = 'add';
        this.showForm = false;
      });

    }

  }

  onEdit(item: Category, idx: number): void {
    this.category = Object.assign({}, item);
    this.idx = idx;
    this.action = 'edit';
    this.showForm = true;
  }

  onDelete(id: number | undefined, idx: number): void {
    if (!id){
      return;
    }
    Swal.fire({
      title: '¿Esta seguro de eliminar esta categoría?',
      text: "Esta accion no puede ser deshecha",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe((res: any) => {
          if (res){
            this.categories.splice(idx, 1);
            this.toastr.success('Categoría eliminada exitosamente');
          }
        })

      }
    })

  }

}
