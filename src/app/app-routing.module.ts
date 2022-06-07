import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent, TaskComponent } from './content';

const routes: Routes = [
  {path: '', component: TaskComponent},
  {path: 'categorias', component: CategoryComponent},
  {path: 'tareas', component: TaskComponent},
  {path: 'tareas/:id', component: TaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
