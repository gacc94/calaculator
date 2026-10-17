import { Component, computed, inject, signal } from '@angular/core';
import { Pressable, SafeAreaProvider, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { ColorScheme, StatusBar } from '@ng-native/device';
import { Haptics } from '@ng-native/expo/haptics';
import { NgIcon } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { CalculatorDisplay } from './calculator/calculator-display';
import { CalculatorDrawer, CalculatorMode } from './calculator/calculator-drawer';
import { CalculatorKeypad } from './calculator/calculator-keypad';
import { CalculatorService } from './calculator/calculator.service';

@Component({
	selector: 'app-root',
	imports: [
		CalculatorDisplay,
		CalculatorDrawer,
		CalculatorKeypad,
		NgIcon,
		Pressable,
		SafeAreaProvider,
		SafeAreaView,
		ScrollView,
		Text,
		View,
	],
	providers: [provideIcons({ lucideMenu, lucideMoon, lucideSun })],
	host: {
		class: 'flex-1',
	},
	template: `
		<safe-area-provider>
			<safe-area-view class="flex-1 bg-screen-bg">
				<!-- Header Actions -->
				<view class="flex-row items-center justify-between px-6 pt-2 pb-4">
					<!-- Drawer Menu Toggle -->
					<pressable
						class="h-13 w-13 items-center justify-center rounded-[20px] bg-btn-header active:opacity-75"
						accessibilityRole="button"
						accessibilityLabel="Open menu drawer"
						(press)="openDrawer()"
					>
						<ng-icon name="lucideMenu" [size]="24" [color]="headerIconColor()" />
					</pressable>

					<!-- Current Mode Badge -->
					<view class="flex-row items-center rounded-full bg-btn-header px-4 py-1.5">
						<text class="text-xs font-bold tracking-wider text-text-main uppercase">{{ mode() }}</text>
					</view>

					<!-- Theme Toggle -->
					<pressable
						class="h-13 w-13 items-center justify-center rounded-[20px] bg-btn-header active:opacity-75"
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

				<!-- History Mode View -->
				@if (mode() === 'history') {
					<view class="flex-1 justify-between px-6 py-4">
						<view class="flex-row items-center justify-between border-b border-border-subtle pb-3">
							<text class="text-lg font-bold text-text-main">Calculation Log</text>
							@if (calc.history().length > 0) {
								<pressable
									class="rounded-xl bg-btn-header px-3 py-1.5 active:opacity-75"
									accessibilityRole="button"
									accessibilityLabel="Clear all history"
									(press)="calc.clearHistory()"
								>
									<text class="text-xs font-semibold text-text-muted">Clear All</text>
								</pressable>
							}
						</view>

						<scroll-view class="flex-1 py-3">
							@if (calc.history().length === 0) {
								<view class="items-center justify-center py-16">
									<text class="text-sm font-medium text-text-muted"
										>No calculations recorded yet</text
									>
								</view>
							} @else {
								@for (entry of calc.history(); track $index) {
									<view class="border-b border-border-subtle/50 py-3">
										<text class="text-right font-mono text-base text-text-history">{{
											entry
										}}</text>
									</view>
								}
							}
						</scroll-view>

						<pressable
							class="mt-2 h-14 items-center justify-center rounded-2xl bg-btn-op active:opacity-85"
							accessibilityRole="button"
							accessibilityLabel="Return to calculator"
							(press)="onModeChange('standard')"
						>
							<text class="text-base font-semibold text-white">Back to Calculator</text>
						</pressable>
					</view>
				} @else {
					<!-- Display Area -->
					<view class="flex-1 justify-end">
						<app-calculator-display [history]="calc.history()" [currentValue]="calc.currentValue()" />
					</view>

					<!-- Keypad Grid (Standard / Scientific) -->
					<app-calculator-keypad
						[mode]="mode()"
						(inputDigit)="calc.inputDigit($event)"
						(inputDecimal)="calc.inputDecimal()"
						(setOperator)="calc.setOperator($event)"
						(scientificOp)="calc.scientificOperation($event)"
						(calculate)="calc.calculate()"
						(clear)="calc.clear()"
						(toggleSign)="calc.toggleSign()"
						(percentage)="calc.percentage()"
					/>
				}

				<!-- Navigation Drawer -->
				<app-calculator-drawer
					[isOpen]="isDrawerOpen()"
					[currentMode]="mode()"
					(modeChange)="onModeChange($event)"
					(close)="closeDrawer()"
				/>
			</safe-area-view>
		</safe-area-provider>
	`,
})
export class App {
	protected readonly calc = inject(CalculatorService);
	private readonly colorScheme = inject(ColorScheme);
	private readonly statusBar = inject(StatusBar);
	private readonly haptics = inject(Haptics);

	readonly isDark = signal(true);
	readonly isDrawerOpen = signal(false);
	readonly mode = signal<CalculatorMode>('standard');

	protected readonly headerIconColor = computed(() => (this.isDark() ? '#8E99AC' : '#555E6D'));

	constructor() {
		this.applyTheme(true);
	}

	openDrawer(): void {
		this.haptics.impact('light');
		this.isDrawerOpen.set(true);
	}

	closeDrawer(): void {
		this.isDrawerOpen.set(false);
	}

	onModeChange(newMode: CalculatorMode): void {
		this.mode.set(newMode);
	}

	toggleTheme(): void {
		this.haptics.impact('light');
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
