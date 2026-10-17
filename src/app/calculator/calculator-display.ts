import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

@Component({
	selector: 'app-calculator-display',
	imports: [Text, View],
	host: {
		class: 'justify-end px-6 pb-6 gap-2',
	},
	template: `
		<view class="gap-1.5">
			@for (item of history(); track $index) {
				<text class="calc-history-text">{{ item }}</text>
			}
		</view>

		<view class="mt-2">
			<text class="calc-main-text" nativeID="calc-display-value" [numberOfLines]="1">
				{{ currentValue() }}
			</text>
		</view>
	`,
})
export class CalculatorDisplay {
	readonly history = input.required<string[]>();
	readonly currentValue = input.required<string>();
}
