import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function sanitizeProfileId(id: string): string {
	return id.replace(/[\W_]+/g, '');
}

// GET: Load a specific profile
export const GET: RequestHandler = async ({ locals, platform, params }) => {
	if (!locals.session?.user?.id) {
		return error(401, 'Not authenticated');
	}
	const r2 = platform?.env?.R2;
	if (!r2) return error(500, 'Storage not available');

	const profileId = sanitizeProfileId(params.profileId);
	if (!profileId) return error(400, 'Invalid profile ID');

	const userId = locals.session.user.id;
	const obj = await r2.get(`profiles/${userId}/${profileId}.json`);

	if (!obj) return json(null);
	return json(await obj.json());
};

// PUT: Save/update a profile
export const PUT: RequestHandler = async ({ locals, platform, params, request }) => {
	if (!locals.session?.user?.id) {
		return error(401, 'Not authenticated');
	}
	const r2 = platform?.env?.R2;
	if (!r2) return error(500, 'Storage not available');

	const profileId = sanitizeProfileId(params.profileId);
	if (!profileId) return error(400, 'Invalid profile ID');

	const userId = locals.session.user.id;
	const data = await request.json();

	await r2.put(`profiles/${userId}/${profileId}.json`, JSON.stringify(data), {
		httpMetadata: { contentType: 'application/json' }
	});

	return json({ ok: true });
};

// DELETE: Delete a profile
export const DELETE: RequestHandler = async ({ locals, platform, params }) => {
	if (!locals.session?.user?.id) {
		return error(401, 'Not authenticated');
	}
	const r2 = platform?.env?.R2;
	if (!r2) return error(500, 'Storage not available');

	const profileId = sanitizeProfileId(params.profileId);
	if (!profileId) return error(400, 'Invalid profile ID');

	const userId = locals.session.user.id;
	await r2.delete(`profiles/${userId}/${profileId}.json`);

	return json({ ok: true });
};
