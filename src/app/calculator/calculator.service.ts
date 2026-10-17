import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CalculatorService {
	readonly currentValue = signal<string>('520');
	readonly history = signal<string[]>(['100-70', '10+56(45 - 72)', '154870 x 547863', '50+20']);

	private readonly previousValue = signal<string | null>(null);
	private readonly operator = signal<string | null>(null);
	private readonly waitingForOperand = signal<boolean>(false);

	inputDigit(digit: string): void {
		if (this.waitingForOperand()) {
			this.currentValue.set(digit);
			this.waitingForOperand.set(false);
			return;
		}

		const current = this.currentValue();
		if (current === '0' || current === 'Error') {
			this.currentValue.set(digit);
		} else if (current.replace('-', '').length < 12) {
			this.currentValue.set(current + digit);
		}
	}

	inputDecimal(): void {
		if (this.waitingForOperand()) {
			this.currentValue.set('0.');
			this.waitingForOperand.set(false);
			return;
		}

		const current = this.currentValue();
		if (!current.includes('.')) {
			this.currentValue.set(current + '.');
		}
	}

	setOperator(nextOperator: string): void {
		const inputValue = parseFloat(this.currentValue());

		if (this.operator() && this.waitingForOperand()) {
			this.operator.set(nextOperator);
			return;
		}

		if (this.previousValue() === null) {
			this.previousValue.set(this.currentValue());
		} else if (this.operator()) {
			const prev = parseFloat(this.previousValue() ?? '0');
			const result = this.performCalculation(prev, inputValue, this.operator()!);

			if (result === 'Error') {
				this.currentValue.set('Error');
				this.previousValue.set(null);
				this.operator.set(null);
				this.waitingForOperand.set(false);
				return;
			}

			this.currentValue.set(result);
			this.previousValue.set(result);
		}

		this.waitingForOperand.set(true);
		this.operator.set(nextOperator);
	}

	calculate(): void {
		const prevStr = this.previousValue();
		const op = this.operator();
		const currentStr = this.currentValue();

		if (prevStr === null || op === null || this.waitingForOperand()) {
			return;
		}

		const prev = parseFloat(prevStr);
		const current = parseFloat(currentStr);
		const result = this.performCalculation(prev, current, op);

		const expression = `${prevStr} ${this.formatOpSymbol(op)} ${currentStr}`;
		this.pushHistory(expression);

		this.currentValue.set(result);
		this.previousValue.set(null);
		this.operator.set(null);
		this.waitingForOperand.set(true);
	}

	clear(): void {
		this.currentValue.set('0');
		this.previousValue.set(null);
		this.operator.set(null);
		this.waitingForOperand.set(false);
	}

	toggleSign(): void {
		const current = this.currentValue();
		if (current === '0' || current === 'Error') {
			return;
		}
		if (current.startsWith('-')) {
			this.currentValue.set(current.slice(1));
		} else {
			this.currentValue.set('-' + current);
		}
	}

	percentage(): void {
		const current = parseFloat(this.currentValue());
		if (isNaN(current)) {
			return;
		}
		const result = (current / 100).toString();
		this.currentValue.set(result);
	}

	private performCalculation(prev: number, next: number, op: string): string {
		let res = 0;
		switch (op) {
			case '+':
				res = prev + next;
				break;
			case '-':
				res = prev - next;
				break;
			case '×':
			case '*':
				res = prev * next;
				break;
			case '÷':
			case '/':
				if (next === 0) {
					return 'Error';
				}
				res = prev / next;
				break;
			default:
				return next.toString();
		}

		// Avoid precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
		const clean = parseFloat(res.toFixed(10));
		return clean.toString();
	}

	private formatOpSymbol(op: string): string {
		switch (op) {
			case '*':
				return '×';
			case '/':
				return '÷';
			default:
				return op;
		}
	}

	private pushHistory(entry: string): void {
		const list = [...this.history(), entry];
		if (list.length > 4) {
			list.splice(0, list.length - 4);
		}
		this.history.set(list);
	}
}
