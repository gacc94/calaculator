import { Component, input, output } from '@angular/core';
import { View } from '@ng-native/components';
import { CalculatorButton } from './calculator-button';
import { CalculatorMode } from './calculator-drawer';

@Component({
	selector: 'app-calculator-keypad',
	imports: [CalculatorButton, View],
	host: {
		class: 'gap-2.5 px-5 pb-8',
	},
	template: `

		<!-- Scientific Row (Only visible in scientific mode) -->
		@if (mode() === 'scientific') {
			<view class="flex-row gap-2">
				<app-calculator-button
					label="sin"
					variant="fn"
					[isCompact]="true"
					(press)="scientificOp.emit('sin')"
				/>
				<app-calculator-button
					label="cos"
					variant="fn"
					[isCompact]="true"
					(press)="scientificOp.emit('cos')"
				/>
				<app-calculator-button
					label="tan"
					variant="fn"
					[isCompact]="true"
					(press)="scientificOp.emit('tan')"
				/>
				<app-calculator-button
					label="√"
					variant="fn"
					[isCompact]="true"
					(press)="scientificOp.emit('sqrt')"
				/>
				<app-calculator-button
					label="π"
					variant="fn"
					[isCompact]="true"
					(press)="scientificOp.emit('pi')"
				/>
			</view>
		}

		<!-- Row 1 -->
		<view class="flex-row gap-3">
			<app-calculator-button
				label="C"
				variant="fn"
				[isCompact]="mode() === 'scientific'"
				(press)="clear.emit()"
			/>
			<app-calculator-button
				label="+/-"
				variant="fn"
				[isCompact]="mode() === 'scientific'"
				(press)="toggleSign.emit()"
			/>
			<app-calculator-button
				label="%"
				variant="fn"
				[isCompact]="mode() === 'scientific'"
				(press)="percentage.emit()"
			/>
			<app-calculator-button
				label="÷"
				variant="op"
				[isCompact]="mode() === 'scientific'"
				(press)="setOperator.emit('÷')"
			/>
		</view>

		<!-- Row 2 -->
		<view class="flex-row gap-3">
			<app-calculator-button
				label="7"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('7')"
			/>
			<app-calculator-button
				label="8"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('8')"
			/>
			<app-calculator-button
				label="9"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('9')"
			/>
			<app-calculator-button
				label="×"
				variant="op"
				[isCompact]="mode() === 'scientific'"
				(press)="setOperator.emit('×')"
			/>
		</view>

		<!-- Row 3 -->
		<view class="flex-row gap-3">
			<app-calculator-button
				label="4"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('4')"
			/>
			<app-calculator-button
				label="5"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('5')"
			/>
			<app-calculator-button
				label="6"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('6')"
			/>
			<app-calculator-button
				label="-"
				variant="op"
				[isCompact]="mode() === 'scientific'"
				(press)="setOperator.emit('-')"
			/>
		</view>

		<!-- Row 4 -->
		<view class="flex-row gap-3">
			<app-calculator-button
				label="1"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('1')"
			/>
			<app-calculator-button
				label="2"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('2')"
			/>
			<app-calculator-button
				label="3"
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('3')"
			/>
			<app-calculator-button
				label="+"
				variant="op"
				[isCompact]="mode() === 'scientific'"
				(press)="setOperator.emit('+')"
			/>
		</view>

		<!-- Row 5 -->
		<view class="flex-row gap-3">
			<app-calculator-button
				label="0"
				variant="num"
				[isWide]="true"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDigit.emit('0')"
			/>
			<app-calculator-button
				label="."
				variant="num"
				[isCompact]="mode() === 'scientific'"
				(press)="inputDecimal.emit()"
			/>
			<app-calculator-button
				label="="
				variant="op"
				[isCompact]="mode() === 'scientific'"
				(press)="calculate.emit()"
			/>
		</view>
	`,
})
export class CalculatorKeypad {
	readonly mode = input<CalculatorMode>('standard');

	readonly inputDigit = output<string>();
	readonly inputDecimal = output<void>();
	readonly setOperator = output<string>();
	readonly calculate = output<void>();
	readonly clear = output<void>();
	readonly toggleSign = output<void>();
	readonly percentage = output<void>();
	readonly scientificOp = output<'sin' | 'cos' | 'tan' | 'sqrt' | 'pi'>();
}
