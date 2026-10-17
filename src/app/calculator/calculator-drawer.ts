import { Component, inject, input, output } from '@angular/core';
import { Modal, Pressable, SafeAreaProvider, SafeAreaView, Text, View } from '@ng-native/components';
import { Direction } from '@ng-native/device';
import { Haptics } from '@ng-native/expo/haptics';
import { NgIcon } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { lucideCalculator, lucideCheck, lucideFlaskConical, lucideHistory, lucideX } from '@ng-icons/lucide';

export type CalculatorMode = 'standard' | 'scientific' | 'history';

export interface DrawerModeItem {
	id: CalculatorMode;
	label: string;
	description: string;
	icon: string;
}

@Component({
	selector: 'app-calculator-drawer',
	imports: [Modal, NgIcon, Pressable, SafeAreaProvider, SafeAreaView, Text, View],
	providers: [provideIcons({ lucideCalculator, lucideCheck, lucideFlaskConical, lucideHistory, lucideX })],
	template: `
		<modal [visible]="isOpen()" [transparent]="true" animationType="fade" (requestClose)="onClose()">
			<safe-area-provider [reportInsets]="false" class="flex-1">
				<safe-area-view class="flex-1" [edges]="['top', 'bottom']">
					<view class="relative flex-1">
						<!-- Backdrop -->
						<pressable
							class="absolute inset-0 bg-black/60"
							accessibilityRole="button"
							accessibilityLabel="Close navigation drawer"
							(press)="onClose()"
						/>

						<!-- Drawer Slide Panel -->
						<view
							class="absolute top-0 bottom-0 w-72 justify-between border-border-subtle bg-screen-bg p-6"
							[class.border-r]="!direction.rtl()"
							[class.border-l]="direction.rtl()"
							[style.left]="direction.rtl() ? null : 0"
							[style.right]="direction.rtl() ? 0 : null"
						>
							<!-- Header & Options -->
							<view>
								<!-- Top Bar inside drawer -->
								<view class="flex-row items-center justify-between border-b border-border-subtle pb-5">
									<text class="text-xl font-bold text-text-main">Modes</text>
									<pressable
										class="h-10 w-10 items-center justify-center rounded-xl bg-btn-header active:opacity-75"
										accessibilityRole="button"
										accessibilityLabel="Close drawer"
										(press)="onClose()"
									>
										<ng-icon name="lucideX" [size]="20" color="#8E99AC" />
									</pressable>
								</view>

								<!-- Mode Items List -->
								<view class="gap-2.5 pt-5">
									@for (item of modeItems; track item.id) {
										<pressable
											class="flex-row items-center justify-between rounded-2xl p-3.5 active:opacity-80"
											[class.bg-btn-header]="currentMode() === item.id"
											[class.bg-transparent]="currentMode() !== item.id"
											accessibilityRole="button"
											[accessibilityLabel]="item.label"
											(press)="selectMode(item.id)"
										>
											<view class="flex-row items-center gap-3">
												<view
													class="h-10 w-10 items-center justify-center rounded-xl"
													[class.bg-btn-op]="currentMode() === item.id"
													[class.bg-btn-num]="currentMode() !== item.id"
												>
													<ng-icon
														[name]="item.icon"
														[size]="20"
														[color]="currentMode() === item.id ? '#FFFFFF' : '#8E99AC'"
													/>
												</view>
												<view>
													<text
														class="text-base font-semibold"
														[class.text-text-main]="currentMode() === item.id"
														[class.text-text-muted]="currentMode() !== item.id"
													>
														{{ item.label }}
													</text>
													<text class="text-xs text-text-muted">
														{{ item.description }}
													</text>
												</view>
											</view>

											@if (currentMode() === item.id) {
												<ng-icon name="lucideCheck" [size]="18" color="#3B82F6" />
											}
										</pressable>
									}
								</view>
							</view>

							<!-- Footer Info -->
							<view class="border-t border-border-subtle pt-4">
								<text class="text-center text-xs font-medium text-text-muted">
									Angular Native Calculator
								</text>
							</view>
						</view>
					</view>
				</safe-area-view>
			</safe-area-provider>
		</modal>
	`,
})
export class CalculatorDrawer {
	readonly isOpen = input.required<boolean>();
	readonly currentMode = input<CalculatorMode>('standard');

	readonly modeChange = output<CalculatorMode>();
	readonly close = output<void>();

	protected readonly direction = inject(Direction);
	private readonly haptics = inject(Haptics);

	protected readonly modeItems: DrawerModeItem[] = [
		{
			id: 'standard',
			label: 'Standard',
			description: 'Basic arithmetic & percentages',
			icon: 'lucideCalculator',
		},
		{
			id: 'scientific',
			label: 'Scientific',
			description: 'Trigonometry, roots & powers',
			icon: 'lucideFlaskConical',
		},
		{
			id: 'history',
			label: 'History',
			description: 'Recent calculations log',
			icon: 'lucideHistory',
		},
	];

	selectMode(mode: CalculatorMode): void {
		this.haptics.impact('light');
		this.modeChange.emit(mode);
		this.close.emit();
	}

	onClose(): void {
		this.haptics.impact('light');
		this.close.emit();
	}
}
