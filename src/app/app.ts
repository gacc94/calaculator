import { Component, inject, signal } from '@angular/core';
import { Pressable, SafeAreaProvider, SafeAreaView, Text, View } from '@ng-native/components';
import { ColorScheme, StatusBar } from '@ng-native/device';
import { NgIcon } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { lucideCalculator } from '@ng-icons/lucide';

/**
 * Element names are lowercase, and that is load-bearing rather than style: an uppercase name is
 * read as an unknown Angular component and commits as a plain view with nothing in it.
 */
@Component({
	host: {
		class: 'flex-1',
	},
	imports: [NgIcon, Pressable, SafeAreaProvider, SafeAreaView, Text, View],
	providers: [provideIcons({ lucideCalculator })],
	selector: 'app-root',
	template: `
		<safe-area-provider>
			<safe-area-view class="flex-1 bg-[#f5f5f7] dark:bg-[#101014]">
				<view class="flex-1 justify-center gap-3 p-6">
					<view class="flex-row items-center gap-3">
						<ng-icon name="lucideCalculator" [size]="32" color="#3b6ef5" />
						<text class="text-[28px] font-bold text-[#101014] dark:text-white">Angular, natively</text>
					</view>
					<text class="text-[15px] text-[#5f5f6b] dark:text-[#8b8b96]">
						Real native views. React is never in the render path.
					</text>

					<pressable
						accessibilityRole="button"
						class="mt-2 items-center rounded-full bg-[#3b6ef5] p-7 active:opacity-80"
						(press)="count.set(count() + 1)"
					>
						<text class="text-base font-semibold text-white">Tapped {{ count() }} times</text>
					</pressable>
				</view>
			</safe-area-view>
		</safe-area-provider>
	`,
})
export class App {
	protected readonly count = signal(0);

	constructor() {
		inject(StatusBar).set({ style: 'light', hidden: false, animated: true });
		inject(ColorScheme).set('dark');
	}
}
