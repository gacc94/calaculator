import { Component, computed, input, output } from '@angular/core';
import { Pressable, Text } from '@ng-native/components';

export type CalculatorButtonVariant = 'num' | 'fn' | 'op';

@Component({
	selector: 'app-calculator-button',
	imports: [Pressable, Text],
	host: {
		'[class]': 'isWide() ? "flex-[2]" : "flex-1"',
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
				return `${base} bg-[#E87A38] active:bg-[#CF6526]`;
			case 'fn':
				return `${base} bg-[#B8C2D3] active:bg-[#A6B1C4] dark:bg-[#2D334A] dark:active:bg-[#23283B]`;
			case 'num':
			default:
				return `${base} bg-[#CBD3E2] active:bg-[#B9C2D3] dark:bg-[#1E2335] dark:active:bg-[#161A28]`;
		}
	});

	protected readonly textClass = computed(() => {
		switch (this.variant()) {
			case 'op':
				return 'text-[30px] font-medium text-white';
			case 'fn':
				return 'text-[26px] font-medium text-[#1A1F2C] dark:text-[#C8D2E4]';
			case 'num':
			default:
				return 'text-[28px] font-medium text-[#1A1F2C] dark:text-[#E2E8F0]';
		}
	});
}
