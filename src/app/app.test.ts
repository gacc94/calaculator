import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';

test('renders initial calculator display and history', async () => {
	await render(App);

	expect(screen.getByTestId('calc-display-value')).toBeTruthy();
	expect(screen.getByText('520')).toBeTruthy();
	expect(screen.getByText('50+20')).toBeTruthy();
	expect(screen.getByText('100-70')).toBeTruthy();
});

test('performs arithmetic calculations correctly', async () => {
	await render(App);
	const user = userEvent.setup();

	// Clear display
	await user.press(screen.getByRole('button', { name: 'C' }));
	expect(screen.getByTestId('calc-display-value')).toBeTruthy();
	expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);

	// Calculate 50 + 20 = 70
	await user.press(screen.getByRole('button', { name: '5' }));
	await user.press(screen.getByRole('button', { name: '0' }));
	await user.press(screen.getByRole('button', { name: '+' }));
	await user.press(screen.getByRole('button', { name: '2' }));
	await user.press(screen.getByRole('button', { name: '0' }));
	await user.press(screen.getByRole('button', { name: '=' }));

	expect(screen.getByText('70')).toBeTruthy();
	expect(screen.getByText('50 + 20')).toBeTruthy();
});

test('handles sign toggle and decimal point', async () => {
	await render(App);
	const user = userEvent.setup();

	await user.press(screen.getByRole('button', { name: 'C' }));
	await user.press(screen.getByRole('button', { name: '7' }));
	await user.press(screen.getByRole('button', { name: '+/-' }));
	expect(screen.getByText('-7')).toBeTruthy();

	await user.press(screen.getByRole('button', { name: '.' }));
	await user.press(screen.getByRole('button', { name: '5' }));
	expect(screen.getByText('-7.5')).toBeTruthy();
});

test('toggles theme between dark and light mode', async () => {
	await render(App);
	const user = userEvent.setup();

	const themeBtn = screen.getByRole('button', { name: 'Toggle Dark and Light mode' });
	expect(themeBtn).toBeTruthy();

	await user.press(themeBtn);
	expect(themeBtn).toBeTruthy();
});

test('opens drawer and switches to scientific mode', async () => {
	await render(App);
	const user = userEvent.setup();

	// Open drawer
	const menuBtn = screen.getByRole('button', { name: 'Open menu drawer' });
	await user.press(menuBtn);

	// Verify drawer is open and shows modes
	expect(screen.getByRole('button', { name: 'Scientific' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'Standard' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'History' })).toBeTruthy();

	// Select Scientific mode
	await user.press(screen.getByRole('button', { name: 'Scientific' }));

	// Verify scientific keys appear
	expect(screen.getByRole('button', { name: 'sin' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'cos' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'tan' })).toBeTruthy();
	expect(screen.getByRole('button', { name: '√' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'π' })).toBeTruthy();

	// Test scientific operation: π
	await user.press(screen.getByRole('button', { name: 'π' }));
	expect(screen.getByText('3.141593')).toBeTruthy();
});

test('switches to history mode and returns to calculator', async () => {
	await render(App);
	const user = userEvent.setup();

	// Open drawer
	await user.press(screen.getByRole('button', { name: 'Open menu drawer' }));

	// Select History mode
	await user.press(screen.getByRole('button', { name: 'History' }));

	// Verify History screen is showing
	expect(screen.getByText('Calculation Log')).toBeTruthy();
	expect(screen.getByRole('button', { name: 'Return to calculator' })).toBeTruthy();

	// Return back to standard calculator
	await user.press(screen.getByRole('button', { name: 'Return to calculator' }));
	expect(screen.getByRole('button', { name: 'Open menu drawer' })).toBeTruthy();
	expect(screen.getByRole('button', { name: '=' })).toBeTruthy();
});
