import { Component, computed, inject, input, output } from '@angular/core';
import { Pressable, Text } from '@ng-native/components';
import { Haptics } from '@ng-native/expo/haptics';

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
			(press)="onPress()"
		>
			<text [class]="textClass()">{{ label() }}</text>
		</pressable>
	`,
})
export class CalculatorButton {
	private readonly haptics = inject(Haptics);

	readonly label = input.required<string>();
	readonly variant = input<CalculatorButtonVariant>('num');
	readonly isWide = input<boolean>(false);
	readonly accessibilityLabel = input<string>('');

	readonly press = output<void>();

	protected onPress(): void {
		this.haptics.impact('light');
		this.press.emit();
	}

	protected readonly buttonClass = computed(() => {
		const base = 'h-[72px] w-full items-center justify-center rounded-[24px]';
		switch (this.variant()) {
			case 'op':
				return `${base} bg-[#E87A38] active:bg-[#CF6526]`;
			case 'fn':
				return `${base} bg-btn-fn active:bg-btn-fn-active`;
			case 'num':
			default:
				return `${base} bg-btn-num active:bg-btn-num-active`;
		}
	});

	protected readonly textClass = computed(() => {
		switch (this.variant()) {
			case 'op':
				return 'text-[30px] font-medium text-white';
			case 'fn':
				return 'text-[26px] font-medium text-btn-fn-text';
			case 'num':
			default:
				return 'text-[28px] font-medium text-btn-num-text';
		}
	});
}
