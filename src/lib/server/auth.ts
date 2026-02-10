import { SESSION_SECRET } from '$env/static/private';
import type { Session } from '$lib/types/Session';

export async function getSession(fetch: any, session_id?: string): Promise<Session | null> {
	if (!session_id) {
		return null;
	}
	const response = await fetch('https://member.gaming.tools/auth/session', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: SESSION_SECRET,
			'User-Agent': 'gaming.tools',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ session_id })
	});
	if (!response.ok) {
		return null;
	}
	const session = await response.json();
	return session;
}
