<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { request } from '#lib/api/client.js';
	import './login.css';
	let username = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let code = $state('');
	let formError = $state('');
	let codeError = $state('');
	let authenticatorDialog: HTMLDialogElement;
	let codeInput: HTMLInputElement;
	const queryClient = useQueryClient();
	const login = createMutation(() => ({
		mutationFn: (body: { username: string; password: string }) =>
			request('/api/auth/login', 'POST', body)
	}));
	const verify = createMutation(() => ({
		mutationFn: (code: string) => request('/api/auth/two-factor', 'POST', { code })
	}));
	async function continueToAuthenticator(event: SubmitEvent) {
		event.preventDefault();
		if (login.isPending) return;
		formError = '';
		if (!username.trim() || !password) {
			formError = 'Enter your username and password to continue.';
			return;
		}
		try {
			await login.mutateAsync({ username: username.trim(), password });
			login.reset();
			password = '';
			showPassword = false;
			code = '';
			codeError = '';
			authenticatorDialog.showModal();
			codeInput.focus();
		} catch (error) {
			login.reset();
			formError = (error as Error).message;
		}
	}
	function handleCodeInput(event: Event) {
		code = (event.currentTarget as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6);
		(event.currentTarget as HTMLInputElement).value = code;
		codeError = '';
	}
	async function finishPreview(event: SubmitEvent) {
		event.preventDefault();
		if (verify.isPending) return;
		codeError = '';
		try {
			await verify.mutateAsync(code);
			queryClient.clear();
			await goto(resolve('/'));
		} catch (error) {
			verify.reset();
			codeError = (error as Error).message;
		}
	}
</script>

<svelte:head>
	<title>Log in · Invenit Back Office</title>
	<meta name="description" content="Log in to the Invenit Back Office." />
</svelte:head>

<main class="login-page">
	<div class="login-wrap">
		<div class="login-brand"><strong>INvenit</strong><span>Back Office</span></div>
		<section class="login-card" aria-labelledby="login-title">
			<h1 id="login-title">Log in</h1>
			<p class="login-description">Enter your account details to continue.</p>
			<form class="login-form" onsubmit={continueToAuthenticator} novalidate>
				<div class="login-field">
					<label for="username">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						spellcheck="false"
						bind:value={username}
					/>
				</div>
				<div class="login-field">
					<label for="password">Password</label>
					<div class="password-control">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							spellcheck="false"
							bind:value={password}
						/>
						<button
							type="button"
							class="password-toggle"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							aria-pressed={showPassword}
							onclick={() => (showPassword = !showPassword)}
							>{showPassword ? 'Hide' : 'Show'}</button
						>
					</div>
				</div>
				{#if formError}<p class="login-error" role="alert">{formError}</p>{/if}
				<button class="primary login-submit" type="submit" disabled={login.isPending}
					>Continue</button
				>
			</form>
		</section>
	</div>
</main>

<dialog
	bind:this={authenticatorDialog}
	class="auth-dialog"
	aria-labelledby="auth-title"
	onclose={() => {
		code = '';
		codeError = '';
	}}
>
	<h2 id="auth-title">Authenticator code</h2>
	<p class="dialog-description">Enter the 6-digit code from Google Authenticator.</p>
	<form onsubmit={finishPreview} novalidate>
		<label for="auth-code">6-digit code</label>
		<input
			bind:this={codeInput}
			id="auth-code"
			name="auth-code"
			type="text"
			inputmode="numeric"
			autocomplete="one-time-code"
			maxlength="6"
			value={code}
			oninput={handleCodeInput}
			aria-invalid={!!codeError}
			aria-describedby={codeError ? 'auth-error' : undefined}
		/>
		{#if codeError}<p id="auth-error" class="login-error" role="alert">{codeError}</p>{/if}
		<div class="dialog-actions">
			<button type="button" onclick={() => authenticatorDialog.close()}>Back</button>
			<button type="submit" class="primary" disabled={verify.isPending}>Continue</button>
		</div>
	</form>
</dialog>
