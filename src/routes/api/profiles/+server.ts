import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET: List all profile IDs for the authenticated user
export const GET: RequestHandler = async ({ locals, platform }) => {
	if (!locals.session?.user?.id) {
		return error(401, 'Not authenticated');
	}
	const r2 = platform?.env?.R2;
	if (!r2) return error(500, 'Storage not available');

	const userId = locals.session.user.id;
	const listed = await r2.list({ prefix: `profiles/${userId}/` });

	const profiles = listed.objects
		.map((obj) => {
			const filename = obj.key.split('/').pop() || '';
			return filename.replace('.json', '');
		})
		.filter(Boolean);

	return json(profiles);
};

// POST: Migrate localStorage profiles to R2 (first sign-in)
export const POST: RequestHandler = async ({ locals, platform, request }) => {
	if (!locals.session?.user?.id) {
		return error(401, 'Not authenticated');
	}
	const r2 = platform?.env?.R2;
	if (!r2) return error(500, 'Storage not available');

	const userId = locals.session.user.id;
	const body = (await request.json()) as { profiles?: Record<string, unknown> };
	const profiles = body.profiles;

	if (!profiles || typeof profiles !== 'object') {
		return error(400, 'Invalid migration data');
	}

	for (const [profileId, profileData] of Object.entries(profiles)) {
		const sanitized = profileId.replace(/[\W_]+/g, '');
		if (!sanitized) continue;
		await r2.put(`profiles/${userId}/${sanitized}.json`, JSON.stringify(profileData), {
			httpMetadata: { contentType: 'application/json' }
		});
	}

	return json({ ok: true });
};
