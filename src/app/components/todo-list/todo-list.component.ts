import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ToDoService } from '../../services/todo.service';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class ToDoListComponent implements OnInit {
  todos;
  completed = false;
  date;
  important = false;
  description = '';
  public = false;
  toggleImp = false;
  toggleComplete = false;
  userId;
  filteredTodos = [];

  private _filter;

  get filter() {
    return this._filter;
  }

  set filter(value) {
    this._filter = value;
    this.performFilter(this.filter);
  }

  get usersToDos() {
    return this.toDoService.usersTodos;
  }
  constructor(private toDoService: ToDoService) {
    this.userId = localStorage.getItem('userID');
    console.log(this.userId);
  }

  ngOnInit() {
    this.toDoService.getToDos(this.userId).subscribe((todos) => {
      console.log(todos);
      //this.todos = todos;
      //this.usersToDos = todos.filter((todo) => todo.userID === this.userId);
      console.log(this.usersToDos);
      this.performFilter();
    });
  }

  selectChangeHandler(event) {
    console.log(event.target.value);
    if (event.target.value === 'name') {
      this.sortByName(this.filteredTodos);
    }
    if (event.target.value === 'newest') {
      this.sortNewest(this.filteredTodos);
      console.log('this happened');
    }
    if (event.target.value === 'oldest') {
      this.sortOldest(this.filteredTodos);
    }
  }

  toggleImportant() {
    this.toggleImp = !this.toggleImp;

    if (this.toggleImp === true) {
      this.filteredTodos = this.filteredTodos.filter((todo) => todo.isImportant === true);
    } else {
      this.filteredTodos = this.usersToDos;
    }
  }

  toggleDone() {
    this.toggleComplete = !this.toggleComplete;

    if (this.toggleComplete === true) {
      this.filteredTodos = this.filteredTodos.filter((todo) => todo.isCompleted === true);
    } else {
      this.filteredTodos = this.usersToDos;
    }
  }

  addToDo(todo) {
    console.log(todo);
    this.toDoService
      .addToDo({
        id: null,
        title: todo,
        description: this.description,
        isImportant: this.important,
        isCompleted: this.completed,
        isPublic: this.public,
        createdAt: Date.now(),
        userID: this.userId,
      })
      .subscribe((response) => {
        console.log(response);
        this.toDoService.usersTodos.push({
          title: todo,
          description: this.description,
          isImportant: this.important,
          isCompleted: this.completed,
          id: response.name,
          createdAt: Date.now(),
          userID: this.userId,
        });
        console.log(this.todos);
      });

    //console.log(this.todos);
    console.log(this.filteredTodos);
    //console.log(this.toDoService.todos);
  }

  onDelete(todo) {
    console.log(todo);
    console.log('delete');
    this.filteredTodos = this.filteredTodos.filter((item) => item.title !== todo.title);
    this.toDoService.deleteToDo(todo.id).subscribe();
    this.toDoService.usersTodos = this.filteredTodos;
    console.log(this.todos);
  }

  onItemChecked(todo) {
    this.toDoService.updateToDo(todo).subscribe();
  }

  performFilter(filterBy?) {
    if (filterBy) {
      this.filteredTodos = this.usersToDos.filter(
        (todo) => todo.title.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !== -1
      );
    } else {
      this.filteredTodos = this.usersToDos;
      console.log('else happened');
    }
  }

  sortByName(arr) {
    arr.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  sortNewest(arr) {
    arr.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }

  sortOldest(arr) {
    arr.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
  }
}
