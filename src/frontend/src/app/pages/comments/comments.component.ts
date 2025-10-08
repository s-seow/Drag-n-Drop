import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { TaskCard } from '../../models/taskcard.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model'
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{
  username!: string;
  boardId!: string;
  taskcard!: TaskCard;
  comments!: Comment[];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getTaskCard(params['columnId'], params['taskcardId']).subscribe(next => {
          this.taskcard = next as TaskCard;
          console.log(this.taskcard.title)
          this.taskService.getComments(this.taskcard._id).subscribe(next => {
            let temp = next as Comment[];
            temp.reverse();
            this.comments = temp;
          })
        })
        
      }
    )
    this.authService.getUsername().subscribe(next => {
      this.username = (next as User).username
    })
  }

  backToBoard() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }

  
  logout() {
    this.authService.logout()
  }

  comment(message: string) {
    if (message.length === 0) {
      const commentInput: HTMLInputElement = document.getElementById('commentInput') as HTMLInputElement;
      commentInput.value = '';
    } else {
      this.taskService.createComment(this.taskcard._id, this.username, message, new Date()).subscribe(next => {
        let newComment = next as Comment;
        this.comments.unshift(newComment);
        const commentInput: HTMLInputElement = document.getElementById('commentInput') as HTMLInputElement;
      commentInput.value = '';
      })
    }
    
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
