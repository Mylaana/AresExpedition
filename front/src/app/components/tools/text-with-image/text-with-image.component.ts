import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalInfo } from '../../../services/global/global-info.service';
import { CommonModule } from '@angular/common';

type HtmlTag = 'p' | 'img' | 'div';
type Context = 'default' | 'cardEffectSummary' | 'cardTextAndIcon' | 'cardVpText'

@Component({
  selector: 'app-text-with-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-with-image.component.html',
  styleUrls: ['./text-with-image.component.scss'],
})
export class TextWithImageComponent implements OnInit, OnChanges {
  @Input() rawText!: string;
  @Input() context: Context = 'default'
  textWithImages: string = '';

  ngOnInit() {
    this.processText();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawText']?.currentValue) {
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
			inputClass: `block-flex ${this.context}`,
		});
    });

    return processedBlocks.join('');
  }

  private transformSegment(segment: string): string {
    if (!segment) return '';

    const [type, ...rest] = segment.split('_');

    switch (type) {
      case 'tag':
      case 'ressource':
      case 'other': {
			if (type === 'ressource' && rest[0] === 'megacreditvoid') {
			const img = this.createHtmlTag('img', {
				inputValue: GlobalInfo.getUrlFromName(`$ressource_megacreditvoid$`),
				imgAlt: segment,
			});

			const value = rest[1];
			const isNegative = Number(value) < 0;
			const paddedValue = isNegative ? value + ' ' : value;

			const text = this.createHtmlTag('p', {
				inputValue: paddedValue,
				inputClass: 'megacredit-text',
			});

			return this.createHtmlTag('div', {
				inputValue: img + text,
				inputClass: 'wrapper-megacredit',
			});
			}

			return this.createHtmlTag('img', {
			inputValue: GlobalInfo.getUrlFromName(`$${segment}$`),
			imgAlt: segment,
			//inputClass: 'text-tag',
			});
		}

		default:
			return this.createHtmlTag('p', { inputValue: segment });
		}
	}

	private createHtmlTag(
		tag: HtmlTag,
		options: { inputValue?: string; imgAlt?: string; inputClass?: string }
	): string {
		const classAttr = options.inputClass ? ` class="${options.inputClass}"` : '';

		if (tag === 'img') {
		return `<img${classAttr} src="${options.inputValue}" alt="${options.imgAlt}">`;
		}

		return `<${tag}${classAttr}>${options.inputValue ?? ''}</${tag}>`;
	}
}
