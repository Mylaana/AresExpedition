import { Component, Input, OnInit} from '@angular/core';
import { GlobalInfo } from '../../../services/global/global-info.service';

type HtmlTag = 'p' | 'img'| 'div'

@Component({
  selector: 'app-text-with-image',
  standalone: true,
  imports: [],
  templateUrl: './text-with-image.component.html',
  styleUrl: './text-with-image.component.scss',

})
export class TextWithImageComponent implements OnInit{
  @Input() rawText!: string;
  textWithImages!: string;

  ngOnInit() {
    this.textWithImages = this.replaceImageTags(this.rawText);
  }

  replaceImageTags(text: string): string {
    var splittedText = text.split("$")
    splittedText.forEach((value, index) => {
      if(value.split("_")[0]==="tag"){
        splittedText[index] = this.htmlTag('img', { inputValue:value.replace(value, GlobalInfo.getUrlFromName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
      }else if(value.split("_")[0]==="ressource"){
        let splittedValue = value.split("_")
        if (splittedValue[1] != 'megacreditvoid') {
          splittedText[index] = this.htmlTag('img', {inputValue:value.replace(value, GlobalInfo.getUrlFromName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
        } else {
          value = 'ressource_megacreditvoid'
          var theImage = this.htmlTag('img',{inputValue:value.replace(value, GlobalInfo.getUrlFromName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
          var theText = this.htmlTag('p', {inputValue:splittedValue[2], inputClass:"megacredit-text"})
          splittedText[index] = this.htmlTag('div',{inputClass:"wrapper-megacredit",inputValue: theImage + theText})
        }
      }else if(value.split("_")[0]==="other"){
        splittedText[index] = this.htmlTag('img', { inputValue:value.replace(value, GlobalInfo.getUrlFromName('$' + value + '$')), imgAlt:value, inputClass:"text-tag"})
      }else if(value==='skipline'){
        splittedText[index] = `<br>`
      }else if(value!=''){
        splittedText[index] = `<p>${value}</p>`
      }
    });
    for(let i=splittedText.length; i<0; i--){
      if(String(splittedText[i])===''){
        splittedText.splice(i,1)
      }
    }
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
