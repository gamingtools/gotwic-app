import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = !dev ? event.cookies.get('gt_session') : null;
	if (session_id) {
		event.locals.session = await getSession(fetch, session_id);
	}

	return await resolve(event);
};
