import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalInfo } from '../../../services/global/global-info.service';
import { CommonModule } from '@angular/common';
import { SettingCardSize, TextWithImageContext } from '../../../types/global.type';

type HtmlTag = 'p' | 'img' | 'div';

@Component({
  selector: 'app-text-with-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-with-image.component.html',
  styleUrls: ['./text-with-image.component.scss'],
})
export class TextWithImageComponent implements OnInit, OnChanges {
  @Input() rawText!: string;
  @Input() context: TextWithImageContext = 'default'
  @Input() cardSize!: SettingCardSize
  textWithImages: string = '';

  ngOnInit() {
    this.processText();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawText']?.currentValue) {
      this.processText();
    }
	if (changes['cardSize']?.currentValue) {
      this.processText();
    }
  }

  private processText() {
    this.textWithImages = this.buildHtmlFromBlocks(this.rawText);
  }

  private buildHtmlFromBlocks(text: string): string {
    //Splitting the block in divs around $skipline$
    const rawBlocks = text.split('$skipline$');
    const processedBlocks = rawBlocks.map(blockText => {
		const segments = blockText.split('$');
		const htmlSegments = segments.map(segment => this.transformSegment(segment)).join('');
		return this.createHtmlTag('div', {
			inputValue: htmlSegments,
			inputClass: `block-flex ${this.context} ${this.cardSize}`,
		});
    });

    return processedBlocks.join('');
  }

  private transformSegment(segment: string): string {
    if (!segment) return '';

    const [type, ...rest] = segment.split('_');

    switch (type) {
		case('tag'):
		case('ressource'):
		case('other'): {
			if (type === 'ressource' && rest[0] === 'megacreditvoid') {
				const img = this.createHtmlTag('img', {
					inputValue: GlobalInfo.getUrlFromName(`$ressource_megacreditvoid$`),
					imgAlt: segment,
					inputClass: `${this.cardSize}`,
				})

				const value = rest[1];
				const isNegative = Number(value) < 0;
				const paddedValue = isNegative ? value + ' ' : value;

				const text = this.createHtmlTag('p', {
					inputValue: paddedValue,
					inputClass: `megacredit-text ${this.cardSize}`,
				})

				return this.createHtmlTag('div', {
					inputValue: img + text,
					inputClass: `wrapper-megacredit ${this.cardSize}`,
				})
			}

			return this.createHtmlTag('img', {
				inputValue: GlobalInfo.getUrlFromName(`$${segment}$`),
				imgAlt: segment,
				inputClass: this.cardSize,
			})
		}
		case('production'):{
			const value = rest[0];
			const isNegative = Number(value) < 0;
			const paddedValue = isNegative ? value + ' ' : value;
			const text = this.createHtmlTag('p', {
				inputValue: paddedValue,
				inputClass: `production-text ${this.cardSize}`,
			});
			const prodBar = this.createHtmlTag('div', {
				inputClass: 'production-bar background-production--red'
			})

			return this.createHtmlTag('div', {
				inputValue: text + prodBar,
				inputClass: `wrapper-production ${this.cardSize}`,
			})
		}

		default:
			return this.createHtmlTag('p', {
				inputValue: segment ,
				inputClass: this.cardSize
			})
		}
	}

	private createHtmlTag(
		tag: HtmlTag,
		options: { inputValue?: string; imgAlt?: string; inputClass?: string }
	): string {
		const classAttr = options.inputClass ? ` class="${options.inputClass}"` : ''

		if (tag === 'img') {
		return `<img${classAttr} src="${options.inputValue}" alt="${options.imgAlt}">`
		}

		return `<${tag}${classAttr}>${options.inputValue ?? ''}</${tag}>`
	}
}
