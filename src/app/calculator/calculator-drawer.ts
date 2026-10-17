import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Modal, Pressable, SafeAreaProvider, SafeAreaView, Text, type TouchEvent, View } from '@ng-native/components';
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
		<modal [visible]="isRendered()" [transparent]="true" animationType="none" (requestClose)="closeWithAnimation()">
			<safe-area-provider [reportInsets]="false" class="flex-1">
				<safe-area-view class="flex-1" [edges]="['top', 'bottom']">
					<view class="relative flex-1">
						<!-- Backdrop with smooth fade -->
						<pressable
							class="absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out"
							[class.opacity-100]="isSlidIn()"
							[class.opacity-0]="!isSlidIn()"
							accessibilityRole="button"
							accessibilityLabel="Close navigation drawer"
							(press)="closeWithAnimation()"
						/>

						<!-- Drawer Slide Panel with touch gesture & slide animation -->
						<view
							class="absolute top-0 bottom-0 w-72 justify-between border-border-subtle bg-screen-bg p-6"
							[class.border-r]="!direction.rtl()"
							[class.border-l]="direction.rtl()"
							[class.transition-transform]="!isDragging()"
							[class.duration-300]="!isDragging()"
							[class.ease-out]="!isDragging()"
							[class.-translate-x-full]="!direction.rtl() && !isSlidIn() && !isDragging()"
							[class.translate-x-full]="direction.rtl() && !isSlidIn() && !isDragging()"
							[class.translate-x-0]="isSlidIn() && !isDragging()"
							[style.left]="direction.rtl() ? null : 0"
							[style.right]="direction.rtl() ? 0 : null"
							[style.transform]="panelTransform()"
							(touchStart)="onTouchStart($event)"
							(touchMove)="onTouchMove($event)"
							(touchEnd)="onTouchEnd()"
							(touchCancel)="onTouchEnd()"
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
										(press)="closeWithAnimation()"
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

	readonly isRendered = signal(false);
	readonly isSlidIn = signal(false);
	readonly isDragging = signal(false);
	readonly dragOffset = signal(0);

	private startX = 0;
	private closeTimer: ReturnType<typeof setTimeout> | null = null;

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

	protected readonly panelTransform = computed(() => {
		if (this.isDragging() && this.dragOffset() !== 0) {
			return [{ translateX: this.dragOffset() }];
		}
		return null;
	});

	constructor() {
		effect(() => {
			const open = this.isOpen();
			if (open) {
				if (this.closeTimer) {
					clearTimeout(this.closeTimer);
					this.closeTimer = null;
				}
				this.isRendered.set(true);
				this.isDragging.set(false);
				this.dragOffset.set(0);
				// Delay slide-in slightly so the initial off-screen style is painted first
				setTimeout(() => {
					this.isSlidIn.set(true);
				}, 25);
			} else if (this.isRendered()) {
				this.isSlidIn.set(false);
				this.closeTimer = setTimeout(() => {
					this.isRendered.set(false);
					this.dragOffset.set(0);
				}, 300);
			}
		});
	}

	selectMode(mode: CalculatorMode): void {
		this.haptics.impact('light');
		this.modeChange.emit(mode);
		this.closeWithAnimation();
	}

	closeWithAnimation(): void {
		if (!this.isRendered()) {
			return;
		}
		this.isSlidIn.set(false);
		this.isDragging.set(false);
		this.closeTimer = setTimeout(() => {
			this.isRendered.set(false);
			this.dragOffset.set(0);
			this.close.emit();
		}, 300);
	}

	protected onTouchStart(event: TouchEvent): void {
		const touch = event.nativeEvent.touches?.[0] ?? event.nativeEvent;
		this.startX = touch.pageX ?? touch.locationX ?? 0;
		this.isDragging.set(true);
		this.dragOffset.set(0);
	}

	protected onTouchMove(event: TouchEvent): void {
		if (!this.isDragging()) {
			return;
		}
		const touch = event.nativeEvent.touches?.[0] ?? event.nativeEvent;
		const currentX = touch.pageX ?? touch.locationX ?? 0;
		const deltaX = currentX - this.startX;

		if (!this.direction.rtl()) {
			// LTR: drawer is on left, swiping left (negative deltaX) moves panel toward edge
			if (deltaX <= 0) {
				this.dragOffset.set(deltaX);
			}
		} else {
			// RTL: drawer is on right, swiping right (positive deltaX) moves panel toward edge
			if (deltaX >= 0) {
				this.dragOffset.set(deltaX);
			}
		}
	}

	protected onTouchEnd(): void {
		if (!this.isDragging()) {
			return;
		}
		this.isDragging.set(false);
		const offset = this.dragOffset();
		const threshold = 50;

		if (!this.direction.rtl()) {
			if (offset < -threshold) {
				this.closeWithAnimation();
			} else {
				this.dragOffset.set(0);
			}
		} else {
			if (offset > threshold) {
				this.closeWithAnimation();
			} else {
				this.dragOffset.set(0);
			}
		}
	}
}
