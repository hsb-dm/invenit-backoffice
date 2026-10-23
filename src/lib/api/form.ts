export type Schema = {
	type?: string;
	properties?: Record<string, Schema>;
	items?: Schema;
	required?: readonly string[];
	minLength?: number;
	minimum?: number;
	maximum?: number;
	pattern?: string;
	enum?: readonly unknown[];
	format?: string;
};
