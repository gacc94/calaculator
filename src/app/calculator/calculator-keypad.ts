import { Component, output } from '@angular/core';
import { View } from '@ng-native/components';
import { CalculatorButton } from './calculator-button';

@Component({
	selector: 'app-calculator-keypad',
	imports: [CalculatorButton, View],
	host: {
		class: 'gap-3 px-5 pb-8',
	},
	template: `
		<!-- Row 1 -->
		<view class="flex-row gap-3">
			<app-calculator-button label="C" variant="fn" (press)="clear.emit()" />
			<app-calculator-button label="+/-" variant="fn" (press)="toggleSign.emit()" />
			<app-calculator-button label="%" variant="fn" (press)="percentage.emit()" />
			<app-calculator-button label="÷" variant="op" (press)="setOperator.emit('÷')" />
		</view>

		<!-- Row 2 -->
		<view class="flex-row gap-3">
			<app-calculator-button label="7" variant="num" (press)="inputDigit.emit('7')" />
			<app-calculator-button label="8" variant="num" (press)="inputDigit.emit('8')" />
			<app-calculator-button label="9" variant="num" (press)="inputDigit.emit('9')" />
			<app-calculator-button label="×" variant="op" (press)="setOperator.emit('×')" />
		</view>

		<!-- Row 3 -->
		<view class="flex-row gap-3">
			<app-calculator-button label="4" variant="num" (press)="inputDigit.emit('4')" />
			<app-calculator-button label="5" variant="num" (press)="inputDigit.emit('5')" />
			<app-calculator-button label="6" variant="num" (press)="inputDigit.emit('6')" />
			<app-calculator-button label="-" variant="op" (press)="setOperator.emit('-')" />
		</view>

		<!-- Row 4 -->
		<view class="flex-row gap-3">
			<app-calculator-button label="1" variant="num" (press)="inputDigit.emit('1')" />
			<app-calculator-button label="2" variant="num" (press)="inputDigit.emit('2')" />
			<app-calculator-button label="3" variant="num" (press)="inputDigit.emit('3')" />
			<app-calculator-button label="+" variant="op" (press)="setOperator.emit('+')" />
		</view>

		<!-- Row 5 -->
		<view class="flex-row gap-3">
			<app-calculator-button label="0" variant="num" [isWide]="true" (press)="inputDigit.emit('0')" />
			<app-calculator-button label="." variant="num" (press)="inputDecimal.emit()" />
			<app-calculator-button label="=" variant="op" (press)="calculate.emit()" />
		</view>
	`,
})
export class CalculatorKeypad {
	readonly inputDigit = output<string>();
	readonly inputDecimal = output<void>();
	readonly setOperator = output<string>();
	readonly calculate = output<void>();
	readonly clear = output<void>();
	readonly toggleSign = output<void>();
	readonly percentage = output<void>();
}
