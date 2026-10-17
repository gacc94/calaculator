import { Component, computed, inject, signal } from '@angular/core';
import { Pressable, SafeAreaProvider, SafeAreaView, View } from '@ng-native/components';
import { ColorScheme, StatusBar } from '@ng-native/device';
import { NgIcon } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { lucideMic, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { CalculatorDisplay } from './calculator/calculator-display';
import { CalculatorKeypad } from './calculator/calculator-keypad';
import { CalculatorService } from './calculator/calculator.service';

@Component({
	selector: 'app-root',
	imports: [CalculatorDisplay, CalculatorKeypad, NgIcon, Pressable, SafeAreaProvider, SafeAreaView, View],
	providers: [provideIcons({ lucideMic, lucideMoon, lucideSun })],
	host: {
		class: 'flex-1',
	},
	template: `
		<safe-area-provider>
			<safe-area-view class="calc-screen">
				<!-- Header Actions -->
				<view class="flex-row items-center justify-between px-6 pt-2 pb-4">
					<pressable class="calc-header-btn" accessibilityRole="button" accessibilityLabel="Voice input">
						<ng-icon name="lucideMic" [size]="24" [color]="headerIconColor()" />
					</pressable>

					<pressable
						class="calc-header-btn"
						accessibilityRole="button"
						accessibilityLabel="Toggle Dark and Light mode"
						(press)="toggleTheme()"
					>
						<ng-icon
							[name]="isDark() ? 'lucideSun' : 'lucideMoon'"
							[size]="24"
							[color]="headerIconColor()"
						/>
					</pressable>
				</view>

				<!-- Display Area -->
				<view class="flex-1 justify-end">
					<app-calculator-display [history]="calc.history()" [currentValue]="calc.currentValue()" />
				</view>

				<!-- Keypad Grid -->
				<app-calculator-keypad
					(inputDigit)="calc.inputDigit($event)"
					(inputDecimal)="calc.inputDecimal()"
					(setOperator)="calc.setOperator($event)"
					(calculate)="calc.calculate()"
					(clear)="calc.clear()"
					(toggleSign)="calc.toggleSign()"
					(percentage)="calc.percentage()"
				/>
			</safe-area-view>
		</safe-area-provider>
	`,
})
export class App {
	protected readonly calc = inject(CalculatorService);
	private readonly colorScheme = inject(ColorScheme);
	private readonly statusBar = inject(StatusBar);

	readonly isDark = signal(true);

	protected readonly headerIconColor = computed(() => (this.isDark() ? '#8E99AC' : '#555E6D'));

	constructor() {
		this.applyTheme(true);
	}

	toggleTheme(): void {
		const nextDark = !this.isDark();
		this.isDark.set(nextDark);
		this.applyTheme(nextDark);
	}

	private applyTheme(dark: boolean): void {
		this.colorScheme.set(dark ? 'dark' : 'light');
		this.statusBar.set({
			style: dark ? 'light' : 'dark',
			hidden: false,
			animated: true,
		});
	}
}
