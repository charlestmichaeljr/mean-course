import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PostsService {

    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    private BACKEND_URL = environment.apiUrl +  '/posts/';

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.httpClient.get<{ message: string, posts: any, maxPosts: number }>(this.BACKEND_URL + queryParams)
            .pipe(map((postData) => {
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        };
                    }), maxPosts: postData.maxPosts
                };
            }))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
            });
    }

    getPost(id: string) {
        // subscription is in the post create component
        return this.httpClient.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
        }>(this.BACKEND_URL + id);
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.httpClient.post<{ message: string, post: Post }>(this.BACKEND_URL, postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']); // navigating to this route will re-fetch the data in ngOnInit()
            });
    }

    deletePost(postId: string) {
        return this.httpClient.delete<{ message: string }>(this.BACKEND_URL + postId);

    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            };
        }
        this.httpClient.put(this.BACKEND_URL + id, postData)
            .subscribe(response => {
                this.router.navigate(['/']); // navigating to this route will re-fetch the data in ngOnInit()
            });
    }

}
