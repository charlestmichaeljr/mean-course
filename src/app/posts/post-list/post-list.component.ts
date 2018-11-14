import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  private authSub: Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [2, 4, 6, 8, 10];
  currentPage = 1;


  constructor(public postsService: PostsService, private authService: AuthService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts( this.postsPerPage , this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false; // always turns off the spinner after return from service.
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
    });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts( this.postsPerPage , this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

}
