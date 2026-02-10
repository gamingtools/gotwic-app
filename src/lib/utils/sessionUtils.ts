import type { Session } from '$lib/types/Session';

export function isAdmin(session: Session | null): boolean {
	if (!session?.entitlements) return false;
	return session.entitlements.some(
		(e) => e.user_id === session.user.id && e.status === 'active' && e.tiers.includes('admin')
	);
}

export function isModerator(session: Session | null): boolean {
	if (!session?.entitlements) return false;
	return session.entitlements.some(
		(e) =>
			e.user_id === session.user.id &&
			e.status === 'active' &&
			(e.tiers.includes('moderator') || e.tiers.includes('admin'))
	);
}

export function hasTier(session: Session | null, tier: string): boolean {
	if (!session?.entitlements) return false;
	return session.entitlements.some(
		(e) => e.user_id === session.user.id && e.status === 'active' && e.tiers.includes(tier)
	);
}

export function getUserTiers(session: Session | null): string[] {
	if (!session?.entitlements) return [];
	return session.entitlements
		.filter((e) => e.user_id === session.user.id && e.status === 'active')
		.reduce((tiers: string[], e) => [...tiers, ...e.tiers], []);
}
