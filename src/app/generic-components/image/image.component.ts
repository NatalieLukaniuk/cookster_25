import { Component, computed, input, OnInit } from '@angular/core';

export enum ImageType {
  RecipyMain,
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent {
  imageType = input<ImageType>(ImageType.RecipyMain);
  imagePath = input.required<string>();
  isPrint = input(false);

  url = computed(() => this.recipiesBasePath + this.imagePath() + this.mediaStuff)

  recipiesBasePath =
    'https://firebasestorage.googleapis.com/v0/b/cookster-12ac8.appspot.com/o/recipies%2F';
  mediaStuff = '?alt=media';



}
