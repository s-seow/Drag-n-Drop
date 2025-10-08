import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Column } from '../../models/column.model';
import { TaskCard } from '../../models/taskcard.model';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent implements OnInit{

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  boardId!: string;
  column!: Column;
  username!: string;
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getColumn(this.boardId, params['columnId']).subscribe(next => {
          this.column = next as Column;
          this.taskService.getTaskCards(this.column._id).subscribe(next => {
            this.column.taskcards = next as TaskCard[];
          })
        })
      }
    )
    this.authService.getUsername().subscribe(next => {
      this.username = (next as User).username
    })
  }

  createTask() {
    const titleInput: HTMLInputElement = document.getElementById('taskTitleInput') as HTMLInputElement;
    const dateInput: HTMLInputElement = document.getElementById('taskDateInput') as HTMLInputElement;
    const descInput: HTMLInputElement = document.getElementById('taskDescriptionInput') as HTMLInputElement;
    const date: Date = new Date(dateInput.value)
    if (titleInput.value == '') {
      const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
      titleDialog.show();
    } 
    else if (this.inputLengthCheck(titleInput.value, 50)) {
      const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
      inputLength50Dialog.show();
    }
    else if (this.inputLengthCheck(descInput.value, 250)) {
      const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength250Error') as HTMLDialogElement;
      inputLength250Dialog.show();
    }
    else if (isNaN(date.getTime())) {
      const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
      dateDialog.show();
    }
    else if (this.dateBoundaryCheck(date)) {
      const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
      dateDialog.show();
    }
    else {
      this.taskService.createTaskCard(this.column._id, titleInput.value, descInput.value, new Number(this.column.taskcards.length), date).subscribe(() => {});
    this.router.navigate(['/kanban-view', this.boardId]);
    }
  }

  dateBoundaryCheck(date: Date) {
    let dateObj = new Date(date.toDateString());
    let today = new Date(new Date().toDateString())
    let before = dateObj < today;
    today.setFullYear(today.getFullYear() + 2);
    let after = dateObj > today;
    return before || after
  }

  cancel() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }

  close() {
    const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
    const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength250Error') as HTMLDialogElement;
    const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
    const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
    titleDialog.close();
    inputLength250Dialog.close();
    inputLength50Dialog.close();
    dateDialog.close()
  }
  
  inputLengthCheck(input: string, length: number) {
    if (input.length > length) {
      return true;
    } else return false;
  }

  logout() {
    this.authService.logout()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const navDropdown: HTMLDivElement = document.getElementById("navbarDropdown") as HTMLDivElement;
    if (navDropdown) {
      if(event.target == document.getElementById("navbarButton")) {
        if (navDropdown.classList.contains('is-active')){
          navDropdown.classList.remove('is-active')
        } else {
          navDropdown.classList.add('is-active')
        }
      } else {
        if (navDropdown.classList.contains('is-active')) {
          navDropdown.classList.remove('is-active')
        }
      }
    }
    
  }
}
