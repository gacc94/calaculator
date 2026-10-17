import { Component, computed, input, output } from '@angular/core';
import { Pressable, Text } from '@ng-native/components';

export type CalculatorButtonVariant = 'num' | 'fn' | 'op';

@Component({
	selector: 'app-calculator-button',
	imports: [Pressable, Text],
	host: {
		'[class]': 'isWide() ? "calc-btn-wide" : "flex-1"',
	},
	template: `
		<pressable
			accessibilityRole="button"
			[accessibilityLabel]="accessibilityLabel() || label()"
			[class]="buttonClass()"
			(press)="press.emit()"
		>
			<text [class]="textClass()">{{ label() }}</text>
		</pressable>
	`,
})
export class CalculatorButton {
	readonly label = input.required<string>();
	readonly variant = input<CalculatorButtonVariant>('num');
	readonly isWide = input<boolean>(false);
	readonly accessibilityLabel = input<string>('');

	readonly press = output<void>();

	protected readonly buttonClass = computed(() => {
		const base = 'h-[72px] w-full items-center justify-center rounded-[24px]';
		switch (this.variant()) {
			case 'op':
				return `${base} calc-btn-op`;
			case 'fn':
				return `${base} calc-btn-fn`;
			case 'num':
			default:
				return `${base} calc-btn-num`;
		}
	});

	protected readonly textClass = computed(() => {
		switch (this.variant()) {
			case 'op':
				return 'calc-btn-op-text';
			case 'fn':
				return 'calc-btn-fn-text';
			case 'num':
			default:
				return 'calc-btn-num-text';
		}
	});
}
