import type { Session } from '$lib/types/Session';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
		}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
