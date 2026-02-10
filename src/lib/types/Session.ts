export interface Session {
	provider_id: string;
	user: { id: string };
	entitlements: { user_id: string; status: string; tiers: string[] }[];
}
