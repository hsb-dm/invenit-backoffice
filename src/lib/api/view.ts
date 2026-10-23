import type { OperationId } from './contract';
export type RecordData = Record<string, unknown>;
export type Column = { key: string; label: string };
export type Action = {
	operation: OperationId;
	label: string;
	values?: RecordData;
	choices?: Record<string, string[]>;
	optionsFrom?: { field: string; key: string };
};

export function resolveActions(actions: Action[], data: unknown): Action[] {
	const record = data && typeof data === 'object' ? (data as RecordData) : {};
	return actions.flatMap((action) => {
		if (!action.optionsFrom) return [action];
		const choices = record[action.optionsFrom.key];
		return Array.isArray(choices) && choices.length
			? [{ ...action, choices: { [action.optionsFrom.field]: choices.map(String) } }]
			: [];
	});
}
export function label(key: string) {
	if (key === 'q') return 'Search';
	return key
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (s) => s.toUpperCase())
		.replace(/\bIdr\b/g, '(IDR)')
		.replace(/\bUsd\b/g, '(USD)')
		.replace(/\bKyc\b/g, 'KYC')
		.replace(/\bId\b/g, 'ID');
}
export function valueAt(row: RecordData, key: string): unknown {
	return key
		.split('.')
		.reduce<unknown>(
			(value, part) =>
				value && typeof value === 'object' ? (value as RecordData)[part] : undefined,
			row
		);
}
export function display(value: unknown): string {
	if (value === undefined || value === null || value === '') return '—';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (Array.isArray(value))
		return value.every((v) => typeof v !== 'object') ? value.join(', ') : `${value.length} records`;
	if (typeof value === 'object') return '—';
	return String(value);
}
export function rowsFrom(value: unknown): RecordData[] {
	if (Array.isArray(value)) return value.filter((row) => row && typeof row === 'object');
	if (value && typeof value === 'object') return rowsFrom((value as RecordData).items);
	return [];
}
