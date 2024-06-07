import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalTagInfoService } from '../../service/global/global-tag-info.service';
import { GlobalRessourceInfoService } from '../../service/global/global-ressource-info.service';

type HtmlTag = 'p' | 'img'| 'div'

@Component({
  selector: 'app-text-with-image',
  standalone: true,
  imports: [],
  templateUrl: './text-with-image.component.html',
  styleUrl: './text-with-image.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TextWithImageComponent {
  @Input() rawText!: string;
  textWithImages!: string;

  constructor(private tagImageService: GlobalTagInfoService, private ressourceImageService: GlobalRessourceInfoService) {}

  ngOnInit() {
    this.textWithImages = this.replaceImageTags(this.rawText);
  }

  replaceImageTags(text: string): string {
    var splittedText = text.split("$")
    splittedText.forEach((value, index) => {
      if(value.split("-")[0]==="tag"){
        //splittedText[index] = `<img class="text-tag" src="${value.replace(value, this.tagImageService.getTagUrlFromTextTagName('$' + value + '$'))}" alt="${value}">`
        splittedText[index] = this.htmlTag('img', { inputValue:value.replace(value, this.tagImageService.getTagUrlFromTextTagName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
      }else if(value.split("-")[0]==="ressource"){
        let splittedValue = value.split("-")
        if (splittedValue[1] != 'megacreditvoid') {
          //splittedText[index] = `<img class="text-tag" src="${value.replace(value, this.ressourceImageService.getRessourceUrlFromTextRessourceName('$' + value + '$'))}" alt="${value}">`
          splittedText[index] = this.htmlTag('img', {inputValue:value.replace(value, this.ressourceImageService.getRessourceUrlFromTextRessourceName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
        } else {
          value = 'ressource-megacreditvoid'
          //splittedText[index] = `<div class="wrapper-meagacredit"><img class="text-tag" src="${value.replace(value, this.ressourceImageService.getRessourceUrlFromTextRessourceName('$' + value + '$'))}" alt="${value}"><p>${splittedValue[2]}</p></div>`
          var theImage = this.htmlTag('img',{inputValue:value.replace(value, this.ressourceImageService.getRessourceUrlFromTextRessourceName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
          var theText = this.htmlTag('p', {inputValue:splittedValue[2], inputClass:"megacredit-text"})
          splittedText[index] = this.htmlTag('div',{inputClass:"wrapper-meagacredit",inputValue: theImage + theText})
        }
      }else if(value.split("-")[0]==="other"){

      }else{
        splittedText[index] = `<p>${value}</p>`
      }
    }); 
    return splittedText.join("")
  }
  htmlTag(tag:HtmlTag,  options:{inputValue?:string, imgAlt?:string, inputClass?:string}): string {
    //wraps input in an html tag
    var resultClass: string =''
    if(options.inputClass){
      resultClass = ` class="${options.inputClass}" `
    }
    
    if(tag === 'img'){
      return `<${tag} ${resultClass} src=${options.inputValue} alt=${options.imgAlt}>`
    }
    return `<${tag} ${resultClass}>` + options.inputValue + `</${tag}>`
  }
}
