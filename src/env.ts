import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	ADMIN_API_BASE_URL: { schema: (value) => value, description: 'Private Admin API origin' },
	SESSION_SECRET: {
		schema: (value) => value,
		description: 'Private cookie encryption secret, at least 32 characters'
	}
});
